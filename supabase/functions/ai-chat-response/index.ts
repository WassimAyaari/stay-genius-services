import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { userMessage, userId, userName, roomNumber } = await req.json()

    // Generate AI response based on user message
    let aiResponse = generateAIResponse(userMessage)

    // Save AI response to database
    const { error } = await supabase
      .from('chat_messages')
      .insert([{
        user_id: 'concierge-ai',
        recipient_id: userId,
        user_name: 'Hotel Concierge',
        room_number: '',
        text: aiResponse,
        sender: 'staff',
        status: 'sent',
        created_at: new Date().toISOString()
      }])

    if (error) {
      console.error('Error saving AI response:', error)
      throw error
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'AI response sent',
        response: aiResponse 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in ai-chat-response:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})

function generateAIResponse(userMessage: string): string {
  const message = userMessage.toLowerCase()

  // Hotel service responses
  if (message.includes('pillow') || message.includes('extra pillow')) {
    return "Thank you for your request! I'll arrange for extra pillows to be delivered to your room within 15 minutes. Our housekeeping team will bring them right away. Is there anything else I can help you with?"
  }
  
  if (message.includes('water') || message.includes('water bottle')) {
    return "I'll arrange for complimentary water bottles to be delivered to your room right away. They should arrive within 10-15 minutes. We also have sparkling water available if you prefer!"
  }
  
  if (message.includes('towel') || message.includes('extra towel')) {
    return "We'll send fresh towels to your room immediately. Our housekeeping team will deliver them within 15 minutes. Would you like bath towels, hand towels, or both?"
  }
  
  if (message.includes('temperature') || message.includes('hot') || message.includes('cold') || message.includes('ac') || message.includes('air conditioning')) {
    return "I understand you're having issues with the room temperature. Our maintenance team will check your AC/heating system within 30 minutes. In the meantime, you can try adjusting the thermostat or let me know if you need immediate assistance."
  }
  
  if (message.includes('room service') || message.includes('food') || message.includes('hungry')) {
    return "Our room service is available 24/7! You can find the complete menu in your room directory, or I can send you a digital copy via email. Would you like me to recommend some popular items or help you place an order?"
  }
  
  if (message.includes('restaurant') || message.includes('dining') || message.includes('reservation')) {
    return "I'd be happy to help you make a restaurant reservation! We have several excellent dining options. Which restaurant interests you and what time would you prefer? I can check availability and make the reservation for you."
  }
  
  if (message.includes('spa') || message.includes('massage') || message.includes('treatment')) {
    return "Our spa offers a wide range of relaxing treatments! I can help you book a massage, facial, or other wellness services. What type of treatment are you interested in, and do you have a preferred time?"
  }
  
  if (message.includes('housekeeping') || message.includes('cleaning') || message.includes('clean')) {
    return "Our housekeeping team typically cleans rooms between 10 AM and 4 PM. Would you like to schedule a specific time, or do you need immediate cleaning service? I can arrange that for you right away."
  }
  
  if (message.includes('maintenance') || message.includes('broken') || message.includes('not working') || message.includes('repair')) {
    return "Thank you for reporting this issue. Our maintenance team has been notified and will address this within 1 hour. Could you please provide more details about the problem so we can bring the right tools?"
  }
  
  if (message.includes('wifi') || message.includes('internet') || message.includes('password')) {
    return "Our WiFi network is 'HotelGenius-Guest'. The password should be in your welcome packet, but I can provide it: 'Welcome2024!'. If you're still having connection issues, I can send our IT team to help."
  }
  
  if (message.includes('checkout') || message.includes('check out') || message.includes('leaving')) {
    return "Checkout time is 12:00 PM. If you need a late checkout, I can arrange that for you depending on availability. Would you like assistance with luggage or transportation to the airport?"
  }
  
  if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
    return "Hello! Welcome to Hotel Genius! I'm here to assist you with any requests during your stay. How may I help you today? Whether you need room service, housekeeping, reservations, or have any questions, I'm happy to help!"
  }
  
  if (message.includes('thank you') || message.includes('thanks')) {
    return "You're very welcome! Thank you for staying with us. We truly appreciate your business and hope you're enjoying your visit. Please don't hesitate to reach out if you need anything else during your stay!"
  }

  // General fallback response
  return "Thank you for contacting our concierge service! I'm here to help with any requests you may have during your stay. Whether you need room service, housekeeping, restaurant reservations, spa bookings, or any other assistance, please let me know how I can make your stay more comfortable!"
}