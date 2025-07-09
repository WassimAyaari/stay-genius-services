-- Add conversation_type column to conversations table
ALTER TABLE public.conversations 
ADD COLUMN conversation_type TEXT NOT NULL DEFAULT 'concierge' 
CHECK (conversation_type IN ('concierge', 'safety_ai'));

-- Add comment for clarity
COMMENT ON COLUMN public.conversations.conversation_type IS 'Type of conversation: concierge for general hotel services, safety_ai for emergency/safety assistance';