-- Clean up existing fragmented chat system
DROP TABLE IF EXISTS chat_messages CASCADE;

-- Create unified conversations table
CREATE TABLE public.conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_id UUID REFERENCES auth.users(id),
  guest_name TEXT NOT NULL,
  guest_email TEXT,
  room_number TEXT,
  status TEXT NOT NULL DEFAULT 'active', -- active, completed, escalated
  current_handler TEXT NOT NULL DEFAULT 'ai', -- ai, human
  assigned_staff_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create unified messages table
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL, -- guest, ai, staff
  sender_id UUID REFERENCES auth.users(id),
  sender_name TEXT NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text', -- text, booking_confirmation, system
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat routing table for AI/human handoffs
CREATE TABLE public.chat_routing (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  from_handler TEXT NOT NULL, -- ai, human
  to_handler TEXT NOT NULL, -- ai, human
  reason TEXT,
  staff_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_routing ENABLE ROW LEVEL SECURITY;

-- RLS Policies for conversations
CREATE POLICY "Guests can view their own conversations" 
ON public.conversations 
FOR SELECT 
USING (auth.uid() = guest_id);

CREATE POLICY "Guests can create their own conversations" 
ON public.conversations 
FOR INSERT 
WITH CHECK (auth.uid() = guest_id);

CREATE POLICY "Guests can update their own conversations" 
ON public.conversations 
FOR UPDATE 
USING (auth.uid() = guest_id);

CREATE POLICY "Staff can view all conversations" 
ON public.conversations 
FOR SELECT 
USING (is_admin(auth.uid()));

CREATE POLICY "Staff can update conversations" 
ON public.conversations 
FOR UPDATE 
USING (is_admin(auth.uid()));

-- RLS Policies for messages
CREATE POLICY "Users can view messages in their conversations" 
ON public.messages 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM conversations 
    WHERE conversations.id = messages.conversation_id 
    AND (conversations.guest_id = auth.uid() OR is_admin(auth.uid()))
  )
);

CREATE POLICY "Users can create messages in their conversations" 
ON public.messages 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM conversations 
    WHERE conversations.id = messages.conversation_id 
    AND (conversations.guest_id = auth.uid() OR is_admin(auth.uid()))
  )
);

CREATE POLICY "Staff can create messages in any conversation" 
ON public.messages 
FOR INSERT 
WITH CHECK (is_admin(auth.uid()));

-- RLS Policies for chat routing
CREATE POLICY "Staff can view all chat routing" 
ON public.chat_routing 
FOR SELECT 
USING (is_admin(auth.uid()));

CREATE POLICY "Staff can create chat routing entries" 
ON public.chat_routing 
FOR INSERT 
WITH CHECK (is_admin(auth.uid()));

-- Create indexes for performance
CREATE INDEX idx_conversations_guest_id ON conversations(guest_id);
CREATE INDEX idx_conversations_status ON conversations(status);
CREATE INDEX idx_conversations_current_handler ON conversations(current_handler);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_chat_routing_conversation_id ON chat_routing(conversation_id);

-- Create trigger for updating conversation timestamp
CREATE OR REPLACE FUNCTION update_conversation_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations 
  SET updated_at = now() 
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_conversation_on_message
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_updated_at();

-- Enable realtime for all tables
ALTER TABLE conversations REPLICA IDENTITY FULL;
ALTER TABLE messages REPLICA IDENTITY FULL;
ALTER TABLE chat_routing REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_routing;