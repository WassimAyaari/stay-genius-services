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

    // Enhanced system prompt for booking assistance
    const systemPrompt = `You are a friendly and helpful hotel concierge AI assistant for Hotel Genius. Your personality is warm, professional, and enthusiastic about helping guests have the best experience possible.

BOOKING RULES:
- For ANY booking request (restaurant, spa, events), you MUST ask for specific date and time before proceeding
- Always confirm guest details: Name: ${userInfo?.name || 'Guest'}, Room: ${userInfo?.roomNumber || 'Unknown'}
- Be warm, friendly, professional, and genuinely helpful
- Use enthusiastic and positive language
- Ask clarifying questions if the request is unclear
- For complex requests, break them down into steps

When helping with bookings:
1. Identify the type of booking (restaurant, spa, event)  
2. Ask for preferred date and time
3. Ask for number of guests if applicable
4. Ask for any special requirements
5. Confirm all details before proceeding
6. When booking is successful, congratulate them warmly and offer additional assistance

SUCCESS MESSAGES:
- When a booking is completed successfully, respond with: "Congratulations! Your [booking type] has been confirmed! How else can I assist you today? I'm here to help make your stay absolutely wonderful!"

TONE GUIDELINES:
- Always be warm and welcoming
- Use phrases like "I'd be delighted to help", "Wonderful choice!", "Perfect!"
- Show genuine enthusiasm for helping guests
- Be conversational and friendly, not robotic

Current conversation context: ${context || 'New conversation'}

Respond naturally and conversationally with a warm, helpful tone. If the guest wants to make a booking, guide them through the process step by step with enthusiasm.`;

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
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Detect if this is a booking confirmation and try to create the booking
    const bookingKeywords = ['spa', 'restaurant', 'table', 'massage', 'treatment', 'event', 'book', 'reserve'];
    const confirmationKeywords = ['confirm', 'yes', 'proceed', 'please', 'want', 'would like'];
    
    const hasBookingKeyword = bookingKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );
    const hasConfirmation = confirmationKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );

    console.log('Message analysis:', {
      message,
      hasBookingKeyword,
      hasConfirmation,
      userInfo: userInfo?.userId ? 'present' : 'missing'
    });

    // Try to extract booking details and create actual bookings
    if (hasBookingKeyword && hasConfirmation && userInfo?.userId) {
      try {
        console.log('Booking detected for user:', userInfo.userId, 'Message:', message);
        
        // Check if this looks like a spa booking
        if (message.toLowerCase().includes('spa') || message.toLowerCase().includes('massage') || message.toLowerCase().includes('treatment')) {
          console.log('Attempting to create spa booking...');
          
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          const bookingDate = tomorrow.toISOString().split('T')[0];
          
          const { error: spaError } = await supabase
            .from('spa_bookings')
            .insert({
              guest_name: userInfo.name,
              guest_email: `${userInfo.name.toLowerCase().replace(' ', '.')}@hotel.com`,
              room_number: userInfo.roomNumber,
              date: bookingDate,
              time: '14:00',
              status: 'pending',
              special_requests: message
            });

          if (!spaError) {
            console.log('Spa booking created successfully');
          } else {
            console.error('Spa booking error:', spaError);
          }
        }
        
        // Check if this looks like a restaurant booking
        if (message.toLowerCase().includes('restaurant') || message.toLowerCase().includes('table') || message.toLowerCase().includes('dining')) {
          console.log('Attempting to create restaurant booking...');
          
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          const bookingDate = tomorrow.toISOString().split('T')[0];
          
          const { error: tableError } = await supabase
            .from('table_reservations')
            .insert({
              guest_name: userInfo.name,
              guest_email: `${userInfo.name.toLowerCase().replace(' ', '.')}@hotel.com`,
              room_number: userInfo.roomNumber,
              date: bookingDate,
              time: '19:00',
              guests: 2,
              status: 'pending',
              special_requests: message
            });

          if (!tableError) {
            console.log('Restaurant booking created successfully');
          } else {
            console.error('Restaurant booking error:', tableError);
          }
        }
      } catch (bookingError) {
        console.error('Error creating booking:', bookingError);
      }
    }

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
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in AI chat booking function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      response: "I apologize, but I'm experiencing technical difficulties. Please try again or contact our front desk for assistance."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});