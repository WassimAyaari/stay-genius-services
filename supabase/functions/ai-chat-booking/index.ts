import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userInfo, context } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Processing message from:', userInfo?.name, 'Room:', userInfo?.roomNumber, 'Message:', message);

    // Get hotel context for better AI responses
    const hotelContext = await getHotelContext(supabase);
    
    // Enhanced system prompt with smart booking logic
    const systemPrompt = createEnhancedSystemPrompt(userInfo, hotelContext, context);

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
          { role: 'user', content: `Guest ${userInfo?.name || 'Guest'} in Room ${userInfo?.roomNumber || 'Unknown'} says: "${message}"` }
        ],
        temperature: 0.8,
        max_tokens: 300,
        functions: [{
          name: 'create_booking',
          description: 'Create a booking when the guest provides complete details (type, date, time)',
          parameters: {
            type: 'object',
            properties: {
              booking_type: {
                type: 'string',
                enum: ['spa', 'restaurant', 'event'],
                description: 'Type of booking to create'
              },
              date: {
                type: 'string',
                description: 'Booking date in YYYY-MM-DD format'
              },
              time: {
                type: 'string', 
                description: 'Booking time in HH:MM format'
              },
              guests: {
                type: 'number',
                description: 'Number of guests (for restaurant/event bookings)'
              },
              special_requests: {
                type: 'string',
                description: 'Any special requests from the guest'
              }
            },
            required: ['booking_type']
          }
        }],
        function_call: 'auto'
      }),
    });

    const data = await response.json();
    const choice = data.choices[0];
    let aiResponse = choice?.message?.content || "I'd be delighted to help you! What can I assist you with today?";
    
    // Handle function calls for actual bookings
    let bookingCreated = false;
    if (choice?.message?.function_call) {
      try {
        const functionArgs = JSON.parse(choice.message.function_call.arguments);
        console.log('AI wants to create booking:', functionArgs);
        
        const bookingResult = await createBooking(supabase, functionArgs, userInfo);
        if (bookingResult.success) {
          bookingCreated = true;
          aiResponse = `🎉 Congratulations! Your ${functionArgs.booking_type} booking has been confirmed! 

📅 Date: ${functionArgs.date || 'Soon'}
⏰ Time: ${functionArgs.time || 'To be confirmed'}
${functionArgs.guests ? `👥 Guests: ${functionArgs.guests}` : ''}

How else can I help make your stay absolutely wonderful? I'm here to assist with anything you need! ✨`;
        } else {
          aiResponse = `I'd love to help you with that ${functionArgs.booking_type} booking! ${bookingResult.message || 'Let me check our availability and get back to you shortly.'}`;
        }
      } catch (error) {
        console.error('Error processing function call:', error);
      }
    }

    // Handle service requests
    await handleServiceRequests(supabase, message, userInfo);

    // Save the AI response to chat_messages
    if (userInfo?.userId) {
      await supabase
        .from('chat_messages')
        .insert([{
          user_id: userInfo.userId,
          user_name: userInfo.name,
          room_number: userInfo.roomNumber,
          text: aiResponse,
          sender: 'staff',
          status: 'sent',
          created_at: new Date().toISOString()
        }]);
    }

    return new Response(JSON.stringify({ 
      response: aiResponse,
      bookingCreated,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in AI chat booking function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      response: "I apologize, but I'm experiencing technical difficulties. Please try again or contact our front desk for assistance. 😊"
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Get hotel context for better AI responses
async function getHotelContext(supabase: any) {
  try {
    const [restaurants, spaServices, events] = await Promise.all([
      supabase.from('restaurants').select('name, description, cuisine, open_hours').eq('status', 'open').limit(5),
      supabase.from('spa_services').select('name, description, duration, price, category').eq('status', 'available').limit(8),
      supabase.from('events').select('title, description, date, time, location').gte('date', new Date().toISOString().split('T')[0]).order('date', { ascending: true }).limit(3)
    ]);

    return {
      restaurants: restaurants.data || [],
      spaServices: spaServices.data || [],
      events: events.data || []
    };
  } catch (error) {
    console.error('Error getting hotel context:', error);
    return { restaurants: [], spaServices: [], events: [] };
  }
}

// Create enhanced system prompt
function createEnhancedSystemPrompt(userInfo: any, hotelContext: any, context: string) {
  const restaurantList = hotelContext.restaurants.map((r: any) => 
    `• ${r.name} (${r.cuisine}) - ${r.open_hours}`
  ).join('\n');

  const spaList = hotelContext.spaServices.map((s: any) => 
    `• ${s.name} (${s.duration}) - ${s.description}`
  ).join('\n');

  const eventsList = hotelContext.events.map((e: any) => 
    `• ${e.title} - ${e.date} at ${e.time}`
  ).join('\n');

  return `🏨 You are the AI concierge for Hotel Genius! You're warm, enthusiastic, and genuinely excited to help guests have an amazing stay.

👤 GUEST: ${userInfo?.name || 'Guest'} in Room ${userInfo?.roomNumber || 'Unknown'}
💬 CONTEXT: ${context || 'New conversation'}

🎯 BOOKING ASSISTANCE RULES:
1. Be ENTHUSIASTIC and WARM - use emojis and exclamation points!
2. For booking requests, ask these questions in order:
   - "What type of booking?" (if unclear)
   - "What date would you prefer? 📅"  
   - "What time works best for you? ⏰"
   - "How many guests? 👥" (for restaurants/events)
   - "Any special requests? ✨"

3. ONLY call create_booking function when you have complete details (type, date, time)
4. Be conversational - "Perfect! Let me book that for you!" before calling function
5. Always offer additional help after completing requests

🍽️ RESTAURANTS:
${restaurantList || 'Multiple dining options available'}

💆 SPA SERVICES:
${spaList || 'Full wellness center with various treatments'}

🎪 UPCOMING EVENTS:
${eventsList || 'Various activities and events'}

💡 TONE: Be like an excited friend who works at the hotel! Use phrases like:
- "I'd absolutely love to help you with that!"
- "What a wonderful choice!"
- "Perfect! Let me get that sorted for you!"
- "How exciting!"
- "I'm so happy to assist!"

🚫 NEVER mention technical details or function calls to the guest.
✅ ALWAYS be positive, helpful, and genuinely enthusiastic about helping!`;
}

// Create actual bookings
async function createBooking(supabase: any, details: any, userInfo: any) {
  try {
    const guestEmail = `${userInfo.name.toLowerCase().replace(/\s+/g, '.')}@hotel.com`;
    
    switch (details.booking_type) {
      case 'spa':
        const { error: spaError } = await supabase
          .from('spa_bookings')
          .insert({
            guest_name: userInfo.name,
            guest_email: guestEmail,
            room_number: userInfo.roomNumber,
            date: details.date,
            time: details.time,
            status: 'confirmed',
            special_requests: details.special_requests,
            user_id: userInfo.userId
          });

        if (spaError) throw spaError;
        console.log('✅ Spa booking created successfully');
        return { success: true };

      case 'restaurant':
        const { error: restError } = await supabase
          .from('table_reservations')
          .insert({
            guest_name: userInfo.name,
            guest_email: guestEmail,
            room_number: userInfo.roomNumber,
            date: details.date,
            time: details.time,
            guests: details.guests || 2,
            status: 'confirmed',
            special_requests: details.special_requests,
            user_id: userInfo.userId
          });

        if (restError) throw restError;
        console.log('✅ Restaurant booking created successfully');
        return { success: true };

      case 'event':
        // Find event by title if provided
        let eventId = null;
        if (details.event_title) {
          const { data: event } = await supabase
            .from('events')
            .select('id')
            .ilike('title', `%${details.event_title}%`)
            .limit(1)
            .maybeSingle();
          eventId = event?.id;
        }

        const { error: eventError } = await supabase
          .from('event_reservations')
          .insert({
            event_id: eventId,
            guest_name: userInfo.name,
            guest_email: guestEmail,
            room_number: userInfo.roomNumber,
            date: details.date,
            guests: details.guests || 1,
            status: 'confirmed',
            special_requests: details.special_requests,
            user_id: userInfo.userId
          });

        if (eventError) throw eventError;
        console.log('✅ Event booking created successfully');
        return { success: true };

      default:
        return { success: false, message: 'Unknown booking type' };
    }
  } catch (error) {
    console.error('❌ Booking creation error:', error);
    return { success: false, message: 'Unable to complete booking at this time' };
  }
}

// Handle service requests
async function handleServiceRequests(supabase: any, message: string, userInfo: any) {
  try {
    const lowerMessage = message.toLowerCase();
    const serviceKeywords = [
      'need', 'want', 'can you', 'please', 'help', 'request', 'service',
      'clean', 'housekeeping', 'maintenance', 'broken', 'fix', 'repair',
      'towel', 'pillow', 'room service', 'food', 'temperature', 'hot', 'cold'
    ];

    const hasServiceRequest = serviceKeywords.some(keyword => lowerMessage.includes(keyword));
    
    if (hasServiceRequest && !lowerMessage.includes('book') && !lowerMessage.includes('reserve')) {
      let requestType = 'general';
      
      if (lowerMessage.includes('clean') || lowerMessage.includes('housekeeping')) {
        requestType = 'housekeeping';
      } else if (lowerMessage.includes('food') || lowerMessage.includes('room service')) {
        requestType = 'room_service';
      } else if (lowerMessage.includes('maintenance') || lowerMessage.includes('broken') || lowerMessage.includes('fix') || lowerMessage.includes('repair')) {
        requestType = 'maintenance';
      } else if (lowerMessage.includes('temperature') || lowerMessage.includes('hot') || lowerMessage.includes('cold')) {
        requestType = 'maintenance';
      } else if (lowerMessage.includes('towel') || lowerMessage.includes('pillow') || lowerMessage.includes('amenities')) {
        requestType = 'amenities';
      }

      const { error } = await supabase
        .from('service_requests')
        .insert({
          guest_id: userInfo.userId,
          guest_name: userInfo.name,
          room_number: userInfo.roomNumber,
          room_id: userInfo.userId,
          type: requestType,
          description: message,
          status: 'pending'
        });

      if (!error) {
        console.log('✅ Service request created:', requestType);
      }
    }
  } catch (error) {
    console.error('Error handling service requests:', error);
  }
}