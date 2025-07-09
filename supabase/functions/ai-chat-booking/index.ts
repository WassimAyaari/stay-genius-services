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
          description: 'Create a booking ONLY when you have ALL required information from the guest. Do not call this function unless you have complete details.',
          parameters: {
            type: 'object',
            properties: {
              booking_type: {
                type: 'string',
                enum: ['spa', 'restaurant', 'event'],
                description: 'Type of booking to create'
              },
              service_name: {
                type: 'string',
                description: 'Name of specific service, restaurant, or event'
              },
              date: {
                type: 'string',
                description: 'Booking date in YYYY-MM-DD format (required)'
              },
              time: {
                type: 'string', 
                description: 'Booking time in HH:MM format (required for spa and restaurant)'
              },
              guests: {
                type: 'number',
                description: 'Number of guests (required for restaurant/event bookings)'
              },
              special_requests: {
                type: 'string',
                description: 'Any special requests from the guest'
              }
            },
            required: ['booking_type', 'date']
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

// Create enhanced system prompt with comprehensive booking logic
function createEnhancedSystemPrompt(userInfo: any, hotelContext: any, context: string) {
  const restaurantList = hotelContext.restaurants.map((r: any) => 
    `• ${r.name} (${r.cuisine}) - ${r.open_hours}`
  ).join('\n');

  const spaList = hotelContext.spaServices.map((s: any) => 
    `• ${s.name} (${s.duration}) - $${s.price} - ${s.description}`
  ).join('\n');

  const eventsList = hotelContext.events.map((e: any) => 
    `• ${e.title} - ${e.date} at ${e.time || 'TBD'} (${e.location || 'Hotel venue'})`
  ).join('\n');

  return `🏨 You are the AI concierge for Hotel Genius! You're warm, enthusiastic, and genuinely excited to help guests have an amazing stay.

👤 GUEST: ${userInfo?.name || 'Guest'} in Room ${userInfo?.roomNumber || 'Unknown'}
💬 CONTEXT: ${context || 'New conversation'}

🎯 CRITICAL BOOKING RULES - FOLLOW THESE EXACTLY:

For SPA BOOKINGS, you MUST collect in this EXACT order:
1. First ask: "Which spa service would you like? Here are our available treatments:" (then list services)
2. Then ask: "What date works for you? Please use YYYY-MM-DD format (e.g., 2024-01-15)"
3. Then ask: "What time would you prefer? Please use HH:MM format (e.g., 14:30)"
4. Ask: "Any special requests for your treatment?"
5. ONLY THEN call create_booking with type="spa", date, time, service_name

For RESTAURANT BOOKINGS, you MUST collect in this EXACT order:
1. First ask: "Which restaurant would you like to book? Here are our options:" (then list restaurants)
2. Then ask: "What date works for you? Please use YYYY-MM-DD format (e.g., 2024-01-15)"
3. Then ask: "What time would you prefer? Please use HH:MM format (e.g., 19:30)"
4. Then ask: "How many guests will be dining?"
5. Ask: "Any special dietary requirements or requests?"
6. ONLY THEN call create_booking with type="restaurant", date, time, guests, service_name

For EVENT BOOKINGS, you MUST collect in this EXACT order:
1. First ask: "Which event interests you? Here are our upcoming events:" (then list events)
2. Then ask: "How many guests will be attending?"
3. Ask: "Any special requests?"
4. ONLY THEN call create_booking with type="event", date (from event), guests, service_name

🚨 VALIDATION RULES:
- Date MUST be in YYYY-MM-DD format and in the future
- Time MUST be in HH:MM format (24-hour)
- Guest count MUST be a reasonable number (1-20)
- NEVER proceed with booking if ANY required field is missing
- If user provides incomplete info, ask for the missing details specifically
- ALWAYS confirm all details before creating the booking
- NEVER make assumptions about missing data

🍽️ RESTAURANTS:
${restaurantList || 'Multiple dining options available'}

💆 SPA SERVICES:
${spaList || 'Full wellness center with various treatments'}

🎪 UPCOMING EVENTS:
${eventsList || 'Various activities and events'}

💡 CONVERSATION FLOW EXAMPLES:
Guest: "I want to book spa"
You: "Wonderful! I'd love to help you book a spa treatment! 🌟 Which service would you like? Here are our available treatments: [list services]"

Guest: "Deep tissue massage"
You: "Excellent choice! Deep tissue massage is one of our most popular treatments! 💆‍♀️ What date would you prefer? Please use YYYY-MM-DD format (e.g., 2024-01-15)"

Guest: "2024-01-15"
You: "Perfect! What time works best for you? Please use HH:MM format (e.g., 14:30)"

Guest: "2:30 PM"
You: "Great! So that's 14:30. Any special requests for your treatment?"

Guest: "No thanks"
You: "Wonderful! Let me book that deep tissue massage for you on 2024-01-15 at 14:30!" [THEN call function]

🚫 NEVER mention technical details, function calls, or database errors to the guest.
✅ ALWAYS be positive, helpful, and genuinely enthusiastic about helping!
🎯 Remember: Ask questions ONE AT A TIME, wait for answers, then proceed to the next question.`;
}

// Create actual bookings with comprehensive validation
async function createBooking(supabase: any, details: any, userInfo: any) {
  try {
    console.log('🔍 Creating booking with details:', JSON.stringify(details, null, 2));
    console.log('👤 User info:', JSON.stringify(userInfo, null, 2));

    // Validate required user information
    if (!userInfo?.name || !userInfo?.userId) {
      console.error('❌ Missing user information');
      return { success: false, message: 'User information is incomplete' };
    }

    // Validate required booking details
    if (!details?.booking_type || !details?.date) {
      console.error('❌ Missing required booking details:', details);
      return { success: false, message: 'Booking details are incomplete' };
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(details.date)) {
      console.error('❌ Invalid date format:', details.date);
      return { success: false, message: 'Invalid date format. Please use YYYY-MM-DD' };
    }

    // Validate date is in the future
    const bookingDate = new Date(details.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (bookingDate < today) {
      console.error('❌ Date is in the past:', details.date);
      return { success: false, message: 'Booking date must be in the future' };
    }

    // Validate time format for spa and restaurant bookings (HH:MM)
    if ((details.booking_type === 'spa' || details.booking_type === 'restaurant')) {
      if (!details.time) {
        console.error('❌ Missing time for', details.booking_type, 'booking');
        return { success: false, message: `Time is required for ${details.booking_type} bookings` };
      }
      
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(details.time)) {
        console.error('❌ Invalid time format:', details.time);
        return { success: false, message: 'Invalid time format. Please use HH:MM (24-hour format)' };
      }
    }

    // Validate guest count for restaurant and event bookings
    if ((details.booking_type === 'restaurant' || details.booking_type === 'event')) {
      if (!details.guests || details.guests < 1 || details.guests > 20) {
        console.error('❌ Invalid guest count:', details.guests);
        return { success: false, message: 'Guest count must be between 1 and 20' };
      }
    }

    const guestEmail = `${userInfo.name.toLowerCase().replace(/\s+/g, '.')}@hotel.com`;
    
    switch (details.booking_type) {
      case 'spa':
        console.log('📝 Creating spa booking...');
        const spaBookingData = {
          guest_name: userInfo.name,
          guest_email: guestEmail,
          room_number: userInfo.roomNumber || 'N/A',
          date: details.date,
          time: details.time,
          status: 'confirmed',
          special_requests: details.special_requests || null,
          user_id: userInfo.userId
        };
        
        console.log('📊 Spa booking data:', spaBookingData);
        const { error: spaError } = await supabase
          .from('spa_bookings')
          .insert(spaBookingData);

        if (spaError) {
          console.error('❌ Spa booking error:', spaError);
          throw spaError;
        }
        console.log('✅ Spa booking created successfully');
        return { success: true };

      case 'restaurant':
        console.log('📝 Creating restaurant booking...');
        const restBookingData = {
          guest_name: userInfo.name,
          guest_email: guestEmail,
          room_number: userInfo.roomNumber || 'N/A',
          date: details.date,
          time: details.time,
          guests: details.guests,
          status: 'confirmed',
          special_requests: details.special_requests || null,
          user_id: userInfo.userId
        };
        
        console.log('📊 Restaurant booking data:', restBookingData);
        const { error: restError } = await supabase
          .from('table_reservations')
          .insert(restBookingData);

        if (restError) {
          console.error('❌ Restaurant booking error:', restError);
          throw restError;
        }
        console.log('✅ Restaurant booking created successfully');
        return { success: true };

      case 'event':
        console.log('📝 Creating event booking...');
        // Find event by service_name if provided
        let eventId = null;
        if (details.service_name) {
          const { data: event } = await supabase
            .from('events')
            .select('id, date')
            .ilike('title', `%${details.service_name}%`)
            .limit(1)
            .maybeSingle();
          
          if (event) {
            eventId = event.id;
            // Use event's date if not provided
            if (!details.date && event.date) {
              details.date = event.date;
            }
          }
        }

        const eventBookingData = {
          event_id: eventId,
          guest_name: userInfo.name,
          guest_email: guestEmail,
          room_number: userInfo.roomNumber || 'N/A',
          date: details.date,
          guests: details.guests,
          status: 'confirmed',
          special_requests: details.special_requests || null,
          user_id: userInfo.userId
        };
        
        console.log('📊 Event booking data:', eventBookingData);
        const { error: eventError } = await supabase
          .from('event_reservations')
          .insert(eventBookingData);

        if (eventError) {
          console.error('❌ Event booking error:', eventError);
          throw eventError;
        }
        console.log('✅ Event booking created successfully');
        return { success: true };

      default:
        console.error('❌ Unknown booking type:', details.booking_type);
        return { success: false, message: 'Unknown booking type' };
    }
  } catch (error) {
    console.error('❌ Booking creation error:', error);
    console.error('❌ Error details:', error.message);
    console.error('❌ Error stack:', error.stack);
    return { 
      success: false, 
      message: `Unable to complete booking: ${error.message || 'Unknown error'}` 
    };
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