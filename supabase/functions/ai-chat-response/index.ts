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
    
    // Generate AI response using ChatGPT and detect actions needed
    const { response: aiResponse, actions } = await generateIntelligentResponseWithActions(
      userMessage, 
      userName, 
      roomNumber, 
      conversationHistory,
      hotelContext,
      openAIApiKey
    )

    // Execute detected actions (bookings, reservations, service requests)
    const executedActions = await executeBookingActions(supabase, actions, userId, userName, roomNumber)
    
    // Add action confirmations to the response
    const finalResponse = await enhanceResponseWithActions(aiResponse, executedActions, openAIApiKey)

    // Save AI response to database
    const { error } = await supabase
      .from('chat_messages')
      .insert([{
        user_id: 'concierge-ai',
        recipient_id: userId,
        user_name: 'Hotel Concierge',
        room_number: '',
        text: finalResponse,
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

// Generate intelligent response with action detection using ChatGPT
async function generateIntelligentResponseWithActions(
  userMessage: string,
  userName: string,
  roomNumber: string,
  conversationHistory: any[],
  hotelContext: any,
  openAIApiKey: string
): Promise<{ response: string; actions: any[] }> {
  try {
    const systemPrompt = createAgentSystemPrompt(hotelContext)
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
        max_tokens: 150,
        temperature: 0.7,
        presence_penalty: 0.6,
        frequency_penalty: 0.3,
        functions: [
          {
            name: 'create_booking_action',
            description: 'Create a booking or service request based on guest request',
            parameters: {
              type: 'object',
              properties: {
                action_type: {
                  type: 'string',
                  enum: ['restaurant_reservation', 'spa_booking', 'event_reservation', 'service_request'],
                  description: 'Type of action to create'
                },
                details: {
                  type: 'object',
                  description: 'Details specific to the action type'
                }
              },
              required: ['action_type', 'details']
            }
          }
        ],
        function_call: 'auto'
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const choice = data.choices[0]
    
    let aiResponse = choice?.message?.content || getFallbackResponse()
    let actions: any[] = []

    // Check if AI wants to call a function
    if (choice?.message?.function_call) {
      try {
        const functionArgs = JSON.parse(choice.message.function_call.arguments)
        actions.push(functionArgs)
        console.log('AI detected action:', functionArgs)
      } catch (error) {
        console.error('Error parsing function call:', error)
      }
    }

    console.log('Generated AI response:', aiResponse)
    console.log('Detected actions:', actions)
    
    return { response: aiResponse, actions }

  } catch (error) {
    console.error('Error generating intelligent response:', error)
    return { response: getFallbackResponse(), actions: [] }
  }
}

// Create agent system prompt for booking actions
function createAgentSystemPrompt(hotelContext: any): string {
  const restaurantList = hotelContext.restaurants.map((r: any) => 
    `${r.name} (${r.cuisine}) - ${r.open_hours} - ${r.location}`
  ).join('\n')

  const spaServicesList = hotelContext.spaServices.map((s: any) => 
    `${s.name} (${s.duration}) - ${s.description} - $${s.price}`
  ).join('\n')

  const eventsList = hotelContext.events.map((e: any) => 
    `${e.title} - ${e.date} at ${e.time} - ${e.location}`
  ).join('\n')

  return `You are a concise AI concierge for ${hotelContext.hotel.name}. 

RESPONSE RULES:
- Keep ALL responses under 150 characters
- Be brief and direct
- Skip repeated greetings after first contact
- Get straight to the point

INTENT RECOGNITION:
1. BOOKING REQUESTS ("book a table", "reserve spa", "sign up for event")
   → Use create_booking_action function
   → Confirm with ✅ message

2. SERVICE REQUESTS ("need towels", "room service", "housekeeping", "too hot", "too cold", "temperature", "maintenance", "broken", "fix", "repair")
   → Create service_request action immediately
   → Brief acknowledgment only

3. INFORMATION REQUESTS
   → Provide essential info only
   → No unnecessary details

AVAILABLE SERVICES:
RESTAURANTS: ${restaurantList || 'Multiple dining options'}
SPA SERVICES: ${spaServicesList || 'Full wellness center'}
UPCOMING EVENTS: ${eventsList || 'Various activities'}

BREVITY IS KEY: Short, helpful responses only!`
}

// Get guest information from database
async function getGuestInfo(supabase: any, userId: string): Promise<any> {
  try {
    const { data: guest, error } = await supabase
      .from('guests')
      .select('email, phone, first_name, last_name')
      .eq('user_id', userId)
      .maybeSingle()
    
    if (error) {
      console.error('Error fetching guest info:', error)
      return null
    }
    
    return guest
  } catch (error) {
    console.error('Error in getGuestInfo:', error)
    return null
  }
}

// Execute booking actions detected by AI
async function executeBookingActions(
  supabase: any, 
  actions: any[], 
  userId: string, 
  userName: string, 
  roomNumber: string
): Promise<any[]> {
  const executedActions = []
  
  // Get guest information once for all bookings
  const guestInfo = await getGuestInfo(supabase, userId)
  
  for (const action of actions) {
    try {
      console.log('Executing action:', action)
      
      switch (action.action_type) {
        case 'restaurant_reservation':
          const reservationResult = await createRestaurantReservation(supabase, action.details, userId, userName, roomNumber, guestInfo)
          executedActions.push({ type: 'restaurant_reservation', success: true, result: reservationResult })
          break
          
        case 'spa_booking':
          const spaResult = await createSpaBooking(supabase, action.details, userId, userName, roomNumber, guestInfo)
          executedActions.push({ type: 'spa_booking', success: true, result: spaResult })
          break
          
        case 'event_reservation':
          const eventResult = await createEventReservation(supabase, action.details, userId, userName, roomNumber, guestInfo)
          executedActions.push({ type: 'event_reservation', success: true, result: eventResult })
          break
          
        case 'service_request':
          const serviceResult = await createServiceRequest(supabase, action.details, userId, userName, roomNumber)
          executedActions.push({ type: 'service_request', success: true, result: serviceResult })
          break
          
        default:
          console.log('Unknown action type:', action.action_type)
      }
    } catch (error) {
      console.error('Error executing action:', error)
      executedActions.push({ type: action.action_type, success: false, error: error.message })
    }
  }
  
  return executedActions
}

// Create restaurant reservation
async function createRestaurantReservation(supabase: any, details: any, userId: string, userName: string, roomNumber: string, guestInfo: any) {
  // Get default date/time if not provided
  const reservationDate = details.date || new Date().toISOString().split('T')[0]
  const reservationTime = details.time || '19:00:00'
  const guests = details.guests || 2
  
  // Find restaurant ID if restaurant name provided
  let restaurantId = details.restaurant_id
  if (!restaurantId && details.restaurant) {
    const { data: restaurant } = await supabase
      .from('restaurants')
      .select('id')
      .ilike('name', `%${details.restaurant}%`)
      .limit(1)
      .maybeSingle()
    
    restaurantId = restaurant?.id
  }

  const { data, error } = await supabase
    .from('table_reservations')
    .insert([{
      restaurant_id: restaurantId,
      user_id: userId,
      date: reservationDate,
      time: reservationTime,
      guests: guests,
      guest_name: userName,
      guest_email: guestInfo?.email || null,
      guest_phone: guestInfo?.phone || null,
      room_number: roomNumber,
      special_requests: details.special_requests || null,
      status: 'confirmed',
      created_at: new Date().toISOString()
    }])
    .select()
    .single()

  if (error) throw error
  
  console.log('Restaurant reservation created:', data)
  return { reservationId: data.id, date: reservationDate, time: reservationTime, guests }
}

// Create spa booking
async function createSpaBooking(supabase: any, details: any, userId: string, userName: string, roomNumber: string, guestInfo: any) {
  const bookingDate = details.date || new Date().toISOString().split('T')[0]
  const bookingTime = details.time || '14:00'
  
  // Find service ID if service name provided
  let serviceId = details.service_id
  if (!serviceId && details.service) {
    const { data: service } = await supabase
      .from('spa_services')
      .select('id')
      .ilike('name', `%${details.service}%`)
      .limit(1)
      .maybeSingle()
    
    serviceId = service?.id
  }

  // Ensure guest_email is provided (required field)
  const guestEmail = guestInfo?.email || details.guest_email || `guest${userId}@hotel.com`

  const { data, error } = await supabase
    .from('spa_bookings')
    .insert([{
      service_id: serviceId,
      user_id: userId,
      date: bookingDate,
      time: bookingTime,
      guest_name: userName,
      guest_email: guestEmail,
      guest_phone: guestInfo?.phone || details.guest_phone || null,
      room_number: roomNumber,
      special_requests: details.special_requests || null,
      status: 'confirmed',
      created_at: new Date().toISOString()
    }])
    .select()
    .single()

  if (error) throw error
  
  console.log('Spa booking created:', data)
  return { bookingId: data.id, date: bookingDate, time: bookingTime, service: details.service }
}

// Create event reservation
async function createEventReservation(supabase: any, details: any, userId: string, userName: string, roomNumber: string, guestInfo: any) {
  const guests = details.guests || 1
  
  // Find event ID if event name provided
  let eventId = details.event_id
  if (!eventId && details.event) {
    const { data: event } = await supabase
      .from('events')
      .select('id, date')
      .ilike('title', `%${details.event}%`)
      .limit(1)
      .maybeSingle()
    
    eventId = event?.id
  }

  const { data, error } = await supabase
    .from('event_reservations')
    .insert([{
      event_id: eventId,
      user_id: userId,
      date: details.date || new Date().toISOString().split('T')[0],
      guests: guests,
      guest_name: userName,
      guest_email: guestInfo?.email || null,
      guest_phone: guestInfo?.phone || null,
      room_number: roomNumber,
      special_requests: details.special_requests || null,
      status: 'confirmed',
      created_at: new Date().toISOString()
    }])
    .select()
    .single()

  if (error) throw error
  
  console.log('Event reservation created:', data)
  return { reservationId: data.id, event: details.event, guests }
}

// Create service request
async function createServiceRequest(supabase: any, details: any, userId: string, userName: string, roomNumber: string) {
  const { data, error } = await supabase
    .from('service_requests')
    .insert([{
      guest_id: userId,
      guest_name: userName,
      room_number: roomNumber,
      room_id: userId,
      type: details?.type || determineServiceType(details?.description || details?.request || 'Guest service request'),
      description: details?.description || details?.request || 'Guest service request',
      status: 'pending',
      created_at: new Date().toISOString()
    }])
    .select()
    .single()

  if (error) throw error
  
  console.log('Service request created:', data)
  return { requestId: data.id, type: details?.type, description: details?.description }
}

// Determine service request type based on description
function determineServiceType(description: string): string {
  const desc = description.toLowerCase()
  
  if (desc.includes('temperature') || desc.includes('hot') || desc.includes('cold') || desc.includes('heat') || desc.includes('air condition') || desc.includes('thermostat')) {
    return 'maintenance'
  } else if (desc.includes('clean') || desc.includes('housekeeping') || desc.includes('vacuum') || desc.includes('tidy')) {
    return 'housekeeping'
  } else if (desc.includes('food') || desc.includes('room service') || desc.includes('meal') || desc.includes('order')) {
    return 'room_service'
  } else if (desc.includes('pillow') || desc.includes('towel') || desc.includes('amenities') || desc.includes('soap') || desc.includes('shampoo')) {
    return 'amenities'
  } else if (desc.includes('broken') || desc.includes('fix') || desc.includes('repair') || desc.includes('maintenance')) {
    return 'maintenance'
  } else if (desc.includes('security') || desc.includes('safety') || desc.includes('noise') || desc.includes('disturbance')) {
    return 'security'
  } else {
    return 'general'
  }
}

// Enhance response with action confirmations
async function enhanceResponseWithActions(
  originalResponse: string, 
  executedActions: any[], 
  openAIApiKey: string
): Promise<string> {
  if (executedActions.length === 0) {
    return originalResponse
  }

  try {
    const actionSummary = executedActions.map(action => {
      if (!action.success) return `❌ ${action.type} failed: ${action.error}`
      
      switch (action.type) {
        case 'restaurant_reservation':
          return `✅ Restaurant reservation confirmed for ${action.result.date} at ${action.result.time} for ${action.result.guests} guests`
        case 'spa_booking':
          return `✅ Spa appointment booked for ${action.result.date} at ${action.result.time}${action.result.service ? ` - ${action.result.service}` : ''}`
        case 'event_reservation':
          return `✅ Event registration confirmed${action.result.event ? ` for ${action.result.event}` : ''} for ${action.result.guests} guests`
        case 'service_request':
          const serviceName = getServiceTypeDisplayName(action.result.type)
          return `✅ ${serviceName} submitted`
        default:
          return `✅ ${action.type} completed successfully`
      }
    }).join('\n')

    // Add action confirmations to the response
    return `${originalResponse}\n\n${actionSummary}`
    
  } catch (error) {
    console.error('Error enhancing response with actions:', error)
    return originalResponse
  }
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
  return "I'm here to help! What can I assist you with?"
}

// Get service type display name
function getServiceTypeDisplayName(type: string): string {
  switch (type) {
    case 'maintenance': return 'Maintenance Request';
    case 'housekeeping': return 'Housekeeping Request';
    case 'room_service': return 'Room Service Request';
    case 'amenities': return 'Amenities Request';
    case 'security': return 'Security Request';
    case 'general': return 'Service Request';
    default: return 'Service Request';
  }
}