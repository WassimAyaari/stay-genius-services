import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId, userName, roomNumber, conversationId } = await req.json();
    
    console.log('AI Chat Request:', { message, userId, userName, roomNumber, conversationId });

    if (!message || !userId || !userName) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const response = await sendChatMessage(message, userId, userName, roomNumber, conversationId);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in AI chat function:', error);
    return new Response(JSON.stringify({ 
      error: 'Sorry, I encountered an error. Please try again.',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function sendChatMessage(message: string, userId: string, userName: string, roomNumber: string, conversationId?: string) {
  // Get hotel data for AI context
  const [restaurants, spaServices, events, hotelInfo] = await Promise.all([
    supabase.from('restaurants').select('*').eq('status', 'open'),
    supabase.from('spa_services').select('*, spa_facilities(*)').eq('status', 'available'),
    supabase.from('events').select('*').gte('date', new Date().toISOString().split('T')[0]),
    supabase.from('hotel_about').select('*').eq('status', 'active').single()
  ]);

  const systemPrompt = `You are a helpful hotel concierge AI assistant for ${hotelInfo.data?.title || 'Hotel Genius'}. 
You can help guests with:
- Information about hotel facilities, restaurants, spa services, and events
- Making reservations for restaurants, spa services, and events
- General hotel information and policies
- Providing recommendations

Current guest: ${userName} in room ${roomNumber}

Available restaurants: ${JSON.stringify(restaurants.data)}
Available spa services: ${JSON.stringify(spaServices.data)}
Upcoming events: ${JSON.stringify(events.data)}
Hotel information: ${JSON.stringify(hotelInfo.data)}

IMPORTANT BOOKING RULES:
- NEVER call a booking function unless you have ALL required information
- If a guest wants to book something but hasn't provided a date, time, or number of guests, ASK for these details first
- Always confirm booking details before proceeding
- Use today's date as reference: ${new Date().toISOString().split('T')[0]}
- For restaurants, you need: restaurant name/ID, date, time, and number of guests
- For spa services, you need: service name/ID, date, and time
- For events, you need: event name/ID, date, and number of guests

When making bookings, always confirm details with the guest and provide booking confirmation.
Be friendly, professional, and proactive in offering assistance.

If a guest says something like "I want to book a restaurant" without providing details, respond with something like:
"I'd be happy to help you book a restaurant! I can see we have several excellent options available. Could you please tell me:
- Which restaurant interests you? 
- What date would you like to dine?
- What time would you prefer?
- How many guests will be dining?"

Only call the booking function when you have all the required information.`;

  const tools = [
    {
      type: "function",
      name: "book_restaurant",
      description: "Book a table at a restaurant",
      parameters: {
        type: "object",
        properties: {
          restaurant_id: { type: "string" },
          date: { type: "string", format: "date" },
          time: { type: "string" },
          guests: { type: "number" },
          special_requests: { type: "string" }
        },
        required: ["restaurant_id", "date", "time", "guests"]
      }
    },
    {
      type: "function",
      name: "book_spa_service",
      description: "Book a spa service",
      parameters: {
        type: "object",
        properties: {
          service_id: { type: "string" },
          date: { type: "string", format: "date" },
          time: { type: "string" },
          special_requests: { type: "string" }
        },
        required: ["service_id", "date", "time"]
      }
    },
    {
      type: "function",
      name: "book_event",
      description: "Register for an event",
      parameters: {
        type: "object",
        properties: {
          event_id: { type: "string" },
          date: { type: "string", format: "date" },
          guests: { type: "number" },
          special_requests: { type: "string" }
        },
        required: ["event_id", "date", "guests"]
      }
    },
    {
      type: "function",
      name: "create_service_request",
      description: "Create a general service request",
      parameters: {
        type: "object",
        properties: {
          type: { type: "string" },
          description: { type: "string" }
        },
        required: ["type", "description"]
      }
    }
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      tools: tools,
      tool_choice: "auto",
      temperature: 0.7,
      max_tokens: 1000
    }),
  });

  const data = await response.json();
  console.log('OpenAI Response:', data);

  let aiResponse = data.choices[0].message.content;

  if (data.choices[0].message.tool_calls) {
    // Handle function calls
    const toolCall = data.choices[0].message.tool_calls[0];
    const functionName = toolCall.function.name;
    const functionArgs = JSON.parse(toolCall.function.arguments);
    
    console.log('Function call:', functionName, functionArgs);

    let bookingResult;
    
    switch (functionName) {
      case 'book_restaurant':
        bookingResult = await bookRestaurant(functionArgs, userId, userName, roomNumber);
        break;
      case 'book_spa_service':
        bookingResult = await bookSpaService(functionArgs, userId, userName, roomNumber);
        break;
      case 'book_event':
        bookingResult = await bookEvent(functionArgs, userId, userName, roomNumber);
        break;
      case 'create_service_request':
        bookingResult = await createServiceRequest(functionArgs, userId, userName, roomNumber);
        break;
      default:
        bookingResult = { success: false, message: 'Unknown function' };
    }

    // Generate follow-up response based on booking result
    const followUpResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
          { role: 'assistant', content: data.choices[0].message.content, tool_calls: data.choices[0].message.tool_calls },
          { role: 'tool', tool_call_id: toolCall.id, content: JSON.stringify(bookingResult) }
        ],
        temperature: 0.7,
        max_tokens: 500
      }),
    });

    const followUpData = await followUpResponse.json();
    aiResponse = followUpData.choices[0].message.content;
  }

  // Insert AI response to the new messages table (only if conversationId is provided)
  if (conversationId) {
    await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_type: 'ai',
        sender_name: 'AI Assistant',
        content: aiResponse,
        message_type: 'text'
      });
  }

  return { response: aiResponse };
}

async function bookRestaurant(args: any, userId: string, userName: string, roomNumber: string) {
  try {
    // Validate required parameters
    if (!args.restaurant_id || !args.date || !args.time || !args.guests) {
      throw new Error(`Missing required booking information. Need: restaurant_id, date, time, guests. Got: ${JSON.stringify(args)}`);
    }

    const { data, error } = await supabase
      .from('table_reservations')
      .insert({
        restaurant_id: args.restaurant_id,
        user_id: userId,
        date: args.date,
        time: args.time,
        guests: args.guests,
        guest_name: userName,
        room_number: roomNumber,
        special_requests: args.special_requests || null,
        status: 'confirmed'
      })
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      message: `Restaurant reservation confirmed for ${args.date} at ${args.time} for ${args.guests} guests`,
      reservation_id: data.id,
      details: {
        date: args.date,
        time: args.time,
        guests: args.guests
      }
    };
  } catch (error) {
    console.error('Error booking restaurant:', error);
    return {
      success: false,
      message: `Failed to book restaurant: ${error.message}`
    };
  }
}

async function bookSpaService(args: any, userId: string, userName: string, roomNumber: string) {
  try {
    // Validate required parameters
    if (!args.service_id || !args.date || !args.time) {
      throw new Error(`Missing required booking information. Need: service_id, date, time. Got: ${JSON.stringify(args)}`);
    }

    const { data, error } = await supabase
      .from('spa_bookings')
      .insert({
        service_id: args.service_id,
        user_id: userId,
        date: args.date,
        time: args.time,
        guest_name: userName,
        guest_email: '', // We'll need to get this from user profile
        room_number: roomNumber,
        special_requests: args.special_requests || null,
        status: 'confirmed'
      })
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      message: `Spa service booking confirmed for ${args.date} at ${args.time}`,
      booking_id: data.id,
      details: {
        date: args.date,
        time: args.time
      }
    };
  } catch (error) {
    console.error('Error booking spa service:', error);
    return {
      success: false,
      message: `Failed to book spa service: ${error.message}`
    };
  }
}

async function bookEvent(args: any, userId: string, userName: string, roomNumber: string) {
  try {
    // Validate required parameters  
    if (!args.event_id || !args.date || !args.guests) {
      throw new Error(`Missing required booking information. Need: event_id, date, guests. Got: ${JSON.stringify(args)}`);
    }

    const { data, error } = await supabase
      .from('event_reservations')
      .insert({
        event_id: args.event_id,
        user_id: userId,
        date: args.date,
        guests: args.guests,
        guest_name: userName,
        room_number: roomNumber,
        special_requests: args.special_requests || null,
        status: 'confirmed'
      })
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      message: `Event registration confirmed for ${args.date} for ${args.guests} guests`,
      reservation_id: data.id,
      details: {
        date: args.date,
        guests: args.guests
      }
    };
  } catch (error) {
    console.error('Error booking event:', error);
    return {
      success: false,
      message: `Failed to register for event: ${error.message}`
    };
  }
}

async function createServiceRequest(args: any, userId: string, userName: string, roomNumber: string) {
  try {
    const { data, error } = await supabase
      .from('service_requests')
      .insert({
        guest_id: userId,
        room_id: roomNumber,
        type: args.type,
        description: args.description,
        guest_name: userName,
        room_number: roomNumber,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      message: `Service request created`,
      request_id: data.id,
      details: {
        type: args.type,
        description: args.description
      }
    };
  } catch (error) {
    console.error('Error creating service request:', error);
    return {
      success: false,
      message: `Failed to create service request: ${error.message}`
    };
  }
}