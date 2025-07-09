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
    const systemPrompt = `You are a professional hotel concierge AI assistant for Hotel Genius. Your role is to help guests with their requests, especially bookings and reservations.

BOOKING RULES:
- For ANY booking request (restaurant, spa, events), you MUST ask for specific date and time before proceeding
- Always confirm guest details: Name: ${userInfo?.name || 'Guest'}, Room: ${userInfo?.roomNumber || 'Unknown'}
- Be friendly, professional, and helpful
- Ask clarifying questions if the request is unclear
- For complex requests, break them down into steps

When helping with bookings:
1. Identify the type of booking (restaurant, spa, event)
2. Ask for preferred date and time
3. Ask for number of guests if applicable
4. Ask for any special requirements
5. Confirm all details before proceeding

Current conversation context: ${context || 'New conversation'}

Respond naturally and conversationally. If the guest wants to make a booking, guide them through the process step by step.`;

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