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
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { userMessage, userId, userName, roomNumber } = await req.json()

    console.log('Processing message from:', userName, 'Room:', roomNumber, 'Message:', userMessage)

    // Get conversation history for context
    const conversationHistory = await getConversationHistory(supabase, userId)
    
    // Get hotel data for context
    const hotelContext = await getHotelContext(supabase)
    
    // Generate AI response using ChatGPT
    const aiResponse = await generateIntelligentResponse(
      userMessage, 
      userName, 
      roomNumber, 
      conversationHistory,
      hotelContext,
      openAIApiKey
    )

    // Process any service requests mentioned in the conversation
    await processServiceRequest(supabase, userMessage, userId, userName, roomNumber)

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

    console.log('AI response generated and saved successfully')
    
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

// Get conversation history for context
async function getConversationHistory(supabase: any, userId: string) {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('text, sender, created_at')
      .or(`user_id.eq.${userId},recipient_id.eq.${userId}`)
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      console.error('Error fetching conversation history:', error)
      return []
    }

    return data?.reverse() || []
  } catch (error) {
    console.error('Error in getConversationHistory:', error)
    return []
  }
}

// Get hotel context and data
async function getHotelContext(supabase: any) {
  try {
    // Get restaurants
    const { data: restaurants } = await supabase
      .from('restaurants')
      .select('name, description, cuisine, open_hours, location')
      .eq('status', 'open')

    // Get spa services
    const { data: spaServices } = await supabase
      .from('spa_services')
      .select('name, description, duration, price, category')
      .eq('status', 'available')
      .limit(10)

    // Get events
    const { data: events } = await supabase
      .from('events')
      .select('title, description, date, time, location')
      .gte('date', new Date().toISOString().split('T')[0])
      .order('date', { ascending: true })
      .limit(5)

    // Get hotel config
    const { data: hotelConfig } = await supabase
      .from('hotel_config')
      .select('name, contact_email, contact_phone')
      .limit(1)
      .maybeSingle()

    return {
      restaurants: restaurants || [],
      spaServices: spaServices || [],
      events: events || [],
      hotel: hotelConfig || { name: 'Hotel Genius' }
    }
  } catch (error) {
    console.error('Error getting hotel context:', error)
    return {
      restaurants: [],
      spaServices: [],
      events: [],
      hotel: { name: 'Hotel Genius' }
    }
  }
}

// Generate intelligent response using ChatGPT
async function generateIntelligentResponse(
  userMessage: string,
  userName: string,
  roomNumber: string,
  conversationHistory: any[],
  hotelContext: any,
  openAIApiKey: string
): Promise<string> {
  try {
    const systemPrompt = createSystemPrompt(hotelContext)
    const conversationContext = formatConversationHistory(conversationHistory)
    
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'assistant', content: `Hello ${userName}! Welcome to ${hotelContext.hotel.name}. I'm your personal concierge assistant. How may I help make your stay exceptional today?` },
      ...conversationContext,
      { role: 'user', content: `Guest: ${userName} in Room ${roomNumber} says: "${userMessage}"` }
    ]

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 300,
        temperature: 0.7,
        presence_penalty: 0.6,
        frequency_penalty: 0.3,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const aiResponse = data.choices[0]?.message?.content || getFallbackResponse()

    console.log('Generated AI response:', aiResponse)
    return aiResponse

  } catch (error) {
    console.error('Error generating intelligent response:', error)
    return getFallbackResponse()
  }
}

// Create comprehensive system prompt
function createSystemPrompt(hotelContext: any): string {
  const restaurantList = hotelContext.restaurants.map((r: any) => 
    `${r.name} (${r.cuisine}) - ${r.open_hours} - ${r.location}`
  ).join('\n')

  const spaServicesList = hotelContext.spaServices.map((s: any) => 
    `${s.name} (${s.duration}) - ${s.description} - $${s.price}`
  ).join('\n')

  const eventsList = hotelContext.events.map((e: any) => 
    `${e.title} - ${e.date} at ${e.time} - ${e.location}`
  ).join('\n')

  return `You are the AI concierge for ${hotelContext.hotel.name}, a luxury hotel. You are helpful, professional, warm, and proactive.

PERSONALITY:
- Friendly and welcoming, yet professional
- Proactive in suggesting relevant services
- Knowledgeable about all hotel amenities
- Empathetic to guest needs
- Quick to offer solutions

HOTEL INFORMATION:
- Hotel Name: ${hotelContext.hotel.name}
- Contact: ${hotelContext.hotel.contact_phone || 'Available at reception'}
- WiFi: "HotelGenius-Guest" (Password: "Welcome2024!")
- Check-out: 12:00 PM
- Room service: Available 24/7

RESTAURANTS:
${restaurantList || 'Multiple dining options available - please contact reception for details'}

SPA SERVICES:
${spaServicesList || 'Full spa and wellness center available - please contact spa for bookings'}

UPCOMING EVENTS:
${eventsList || 'Various events and activities - check with concierge for current schedule'}

IMPORTANT INSTRUCTIONS:
1. Always address guests by name when possible
2. Reference their room number naturally
3. Be specific about timeframes for services
4. Offer to take actions (book, arrange, order) rather than just providing information
5. Ask follow-up questions to better assist
6. If you can't help directly, always provide the next best step
7. Keep responses conversational but concise (2-3 sentences typically)
8. Always end with asking if there's anything else you can help with

COMMON SERVICES:
- Room service: Available 24/7
- Housekeeping: Available during day hours, can arrange special timing
- Maintenance: Report issues immediately, typical response within 1 hour
- Late checkout: Can arrange based on availability
- Restaurant reservations: Can check availability and book
- Spa appointments: Can check schedule and make bookings
- Local recommendations: Provide nearby attractions and services
- Transportation: Can arrange airport transfers and local transport

Remember: You're not just answering questions - you're actively helping guests have the best possible stay.`
}

// Format conversation history for context
function formatConversationHistory(history: any[]): any[] {
  return history.slice(-6).map((msg: any) => ({
    role: msg.sender === 'user' ? 'user' : 'assistant',
    content: msg.text
  }))
}

// Process potential service requests
async function processServiceRequest(
  supabase: any,
  userMessage: string,
  userId: string,
  userName: string,
  roomNumber: string
) {
  try {
    const message = userMessage.toLowerCase()
    
    // Detect service request keywords
    const serviceKeywords = [
      'need', 'want', 'can you', 'please', 'help', 'request', 'order',
      'pillow', 'towel', 'water', 'clean', 'housekeeping', 'maintenance',
      'broken', 'fix', 'repair', 'room service', 'food'
    ]

    const hasServiceRequest = serviceKeywords.some(keyword => message.includes(keyword))

    if (hasServiceRequest) {
      // Determine request type
      let requestType = 'general'
      if (message.includes('clean') || message.includes('housekeeping')) requestType = 'housekeeping'
      else if (message.includes('food') || message.includes('room service')) requestType = 'room_service'
      else if (message.includes('maintenance') || message.includes('broken') || message.includes('fix')) requestType = 'maintenance'
      else if (message.includes('pillow') || message.includes('towel') || message.includes('water')) requestType = 'amenities'

      // Create service request record
      const { error } = await supabase
        .from('service_requests')
        .insert([{
          guest_id: userId,
          guest_name: userName,
          room_number: roomNumber,
          room_id: userId, // Using userId as room_id fallback
          type: requestType,
          description: userMessage,
          status: 'pending',
          created_at: new Date().toISOString()
        }])

      if (error) {
        console.error('Error creating service request:', error)
      } else {
        console.log('Service request created:', requestType)
      }
    }
  } catch (error) {
    console.error('Error processing service request:', error)
  }
}

// Fallback response when AI fails
function getFallbackResponse(): string {
  return "Thank you for contacting our concierge service! I'm here to help with any requests you may have during your stay. Whether you need room service, housekeeping, restaurant reservations, spa bookings, or any other assistance, please let me know how I can make your stay more comfortable!"
}