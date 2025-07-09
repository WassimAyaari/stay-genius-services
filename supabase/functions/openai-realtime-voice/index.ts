import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { status: 400 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  
  let openAISocket: WebSocket | null = null;
  let sessionConfigured = false;

  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    console.error("OpenAI API key not found");
    socket.close(1000, "Server configuration error");
    return response;
  }

  // Connect to OpenAI Realtime API
  const connectToOpenAI = () => {
    const openAIUrl = "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01";
    
    openAISocket = new WebSocket(openAIUrl, [], {
      headers: {
        "Authorization": `Bearer ${openAIApiKey}`,
        "OpenAI-Beta": "realtime=v1"
      }
    });

    openAISocket.onopen = () => {
      console.log("Connected to OpenAI Realtime API");
    };

    openAISocket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log("OpenAI message:", message.type);

        // Configure session after receiving session.created
        if (message.type === 'session.created' && !sessionConfigured) {
          console.log("Configuring session...");
          const sessionConfig = {
            type: "session.update",
            session: {
              modalities: ["text", "audio"],
              instructions: `You are a helpful hotel concierge AI assistant. You can help guests with:

BOOKING SERVICES:
- Restaurant reservations: "Book me a table for 2 at 7pm tonight"
- Spa appointments: "I need a massage appointment tomorrow" 
- Event tickets: "What events are happening today?"
- Room service: "I want extra pillows" or "Can you send housekeeping?"

SAMPLE REQUESTS YOU SHOULD HANDLE:
- "I want extra pillow" - Create housekeeping service request
- "Book me a table for 2 people at the Italian restaurant at 8pm" - Make restaurant reservation
- "I need a deep tissue massage tomorrow at 3pm" - Book spa service
- "What restaurants are available?" - List hotel restaurants
- "Can you help me with room service?" - Assist with room service requests
- "I have a complaint about the noise" - Handle guest complaints professionally

IMPORTANT INSTRUCTIONS:
- Always confirm booking details before creating reservations
- Ask for missing information (date, time, number of guests, etc.)
- Be conversational and friendly in your responses
- When you need to book something, use the available functions
- If you cannot help with something, offer to connect them to human staff
- Always speak in a natural, conversational tone since this is voice interaction`,
              voice: "alloy",
              input_audio_format: "pcm16",
              output_audio_format: "pcm16",
              input_audio_transcription: {
                model: "whisper-1"
              },
              turn_detection: {
                type: "server_vad",
                threshold: 0.5,
                prefix_padding_ms: 300,
                silence_duration_ms: 1000
              },
              tools: [
                {
                  type: "function",
                  name: "book_restaurant_table",
                  description: "Book a table at a hotel restaurant",
                  parameters: {
                    type: "object",
                    properties: {
                      restaurant_name: { type: "string", description: "Name of the restaurant" },
                      date: { type: "string", description: "Date for reservation (YYYY-MM-DD)" },
                      time: { type: "string", description: "Time for reservation (HH:MM)" },
                      guests: { type: "number", description: "Number of guests" },
                      guest_name: { type: "string", description: "Guest name" },
                      guest_email: { type: "string", description: "Guest email" },
                      room_number: { type: "string", description: "Room number" },
                      special_requests: { type: "string", description: "Any special requests" }
                    },
                    required: ["restaurant_name", "date", "time", "guests", "guest_name"]
                  }
                },
                {
                  type: "function", 
                  name: "book_spa_service",
                  description: "Book a spa service or treatment",
                  parameters: {
                    type: "object",
                    properties: {
                      service_name: { type: "string", description: "Name of the spa service" },
                      date: { type: "string", description: "Date for appointment (YYYY-MM-DD)" },
                      time: { type: "string", description: "Time for appointment (HH:MM)" },
                      guest_name: { type: "string", description: "Guest name" },
                      guest_email: { type: "string", description: "Guest email" },
                      room_number: { type: "string", description: "Room number" },
                      special_requests: { type: "string", description: "Any special requests" }
                    },
                    required: ["service_name", "date", "time", "guest_name"]
                  }
                },
                {
                  type: "function",
                  name: "create_service_request", 
                  description: "Create a service request for housekeeping, maintenance, or room service",
                  parameters: {
                    type: "object",
                    properties: {
                      type: { type: "string", description: "Type of service (housekeeping, maintenance, room_service)" },
                      description: { type: "string", description: "Description of the request" },
                      guest_name: { type: "string", description: "Guest name" },
                      room_number: { type: "string", description: "Room number" }
                    },
                    required: ["type", "description", "guest_name", "room_number"]
                  }
                },
                {
                  type: "function",
                  name: "escalate_to_human",
                  description: "Connect the guest to human staff for complex requests",
                  parameters: {
                    type: "object", 
                    properties: {
                      reason: { type: "string", description: "Reason for escalation" }
                    },
                    required: ["reason"]
                  }
                }
              ],
              tool_choice: "auto",
              temperature: 0.8,
              max_response_output_tokens: "inf"
            }
          };
          
          openAISocket!.send(JSON.stringify(sessionConfig));
          sessionConfigured = true;
        }

        // Forward all messages to client
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(event.data);
        }
      } catch (error) {
        console.error("Error processing OpenAI message:", error);
      }
    };

    openAISocket.onerror = (error) => {
      console.error("OpenAI WebSocket error:", error);
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          type: "error",
          message: "Connection to AI service failed"
        }));
      }
    };

    openAISocket.onclose = () => {
      console.log("OpenAI connection closed");
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  };

  // Client WebSocket event handlers
  socket.onopen = () => {
    console.log("Client connected");
    connectToOpenAI();
  };

  socket.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);
      console.log("Client message:", message.type);
      
      // Handle function calls
      if (message.type === 'response.function_call_arguments.done') {
        handleFunctionCall(message);
      }
      
      // Forward message to OpenAI
      if (openAISocket && openAISocket.readyState === WebSocket.OPEN) {
        openAISocket.send(event.data);
      }
    } catch (error) {
      console.error("Error processing client message:", error);
    }
  };

  socket.onclose = () => {
    console.log("Client disconnected");
    if (openAISocket) {
      openAISocket.close();
    }
  };

  socket.onerror = (error) => {
    console.error("Client WebSocket error:", error);
  };

  // Handle function calls
  const handleFunctionCall = async (message: any) => {
    const { call_id, arguments: args } = message;
    let result = { success: false, message: "Unknown function" };

    try {
      const parsedArgs = JSON.parse(args);
      
      switch (message.name) {
        case 'book_restaurant_table':
          result = await bookRestaurantTable(parsedArgs);
          break;
        case 'book_spa_service':
          result = await bookSpaService(parsedArgs);
          break;
        case 'create_service_request':
          result = await createServiceRequest(parsedArgs);
          break;
        case 'escalate_to_human':
          result = await escalateToHuman(parsedArgs);
          break;
      }

      // Send function result back to OpenAI
      if (openAISocket && openAISocket.readyState === WebSocket.OPEN) {
        openAISocket.send(JSON.stringify({
          type: "conversation.item.create",
          item: {
            type: "function_call_output",
            call_id: call_id,
            output: JSON.stringify(result)
          }
        }));
      }
    } catch (error) {
      console.error("Function call error:", error);
    }
  };

  // Mock function implementations (replace with actual Supabase calls)
  const bookRestaurantTable = async (args: any) => {
    console.log("Booking restaurant table:", args);
    return { success: true, message: `Table booked for ${args.guests} guests at ${args.restaurant_name} on ${args.date} at ${args.time}` };
  };

  const bookSpaService = async (args: any) => {
    console.log("Booking spa service:", args);
    return { success: true, message: `${args.service_name} appointment booked for ${args.date} at ${args.time}` };
  };

  const createServiceRequest = async (args: any) => {
    console.log("Creating service request:", args);
    return { success: true, message: `${args.type} request created: ${args.description}` };
  };

  const escalateToHuman = async (args: any) => {
    console.log("Escalating to human:", args);
    return { success: true, message: "Connecting you to a human staff member..." };
  };

  return response;
});