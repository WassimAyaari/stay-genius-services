
-- Create service_requests table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id UUID,
  room_id UUID,
  type TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  request_item_id UUID,
  category_id UUID,
  guest_name TEXT,
  room_number TEXT
);

-- Create request_categories table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.request_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  icon TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  parent_id UUID REFERENCES public.request_categories(id)
);

-- Create request_items table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.request_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES public.request_categories(id) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create chat_messages table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  recipient_id UUID,
  user_name TEXT,
  room_number TEXT,
  text TEXT NOT NULL,
  sender TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create rooms table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_number TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL,
  floor INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'available',
  price NUMERIC NOT NULL,
  capacity INTEGER NOT NULL,
  amenities TEXT[] NOT NULL DEFAULT '{}',
  images TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create companions table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.companions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  relation TEXT NOT NULL,
  birth_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add trigger for updated_at timestamps on all tables
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to the tables for updated_at
DROP TRIGGER IF EXISTS set_service_requests_timestamp ON public.service_requests;
CREATE TRIGGER set_service_requests_timestamp
BEFORE UPDATE ON public.service_requests
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

DROP TRIGGER IF EXISTS set_request_categories_timestamp ON public.request_categories;
CREATE TRIGGER set_request_categories_timestamp
BEFORE UPDATE ON public.request_categories
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

DROP TRIGGER IF EXISTS set_request_items_timestamp ON public.request_items;
CREATE TRIGGER set_request_items_timestamp
BEFORE UPDATE ON public.request_items
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

DROP TRIGGER IF EXISTS set_chat_messages_timestamp ON public.chat_messages;
CREATE TRIGGER set_chat_messages_timestamp
BEFORE UPDATE ON public.chat_messages
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

DROP TRIGGER IF EXISTS set_rooms_timestamp ON public.rooms;
CREATE TRIGGER set_rooms_timestamp
BEFORE UPDATE ON public.rooms
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

DROP TRIGGER IF EXISTS set_companions_timestamp ON public.companions;
CREATE TRIGGER set_companions_timestamp
BEFORE UPDATE ON public.companions
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Add RLS policies to tables
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.request_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.request_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companions ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users" ON public.service_requests FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all operations for authenticated users" ON public.request_categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all operations for authenticated users" ON public.request_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all operations for authenticated users" ON public.chat_messages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all operations for authenticated users" ON public.rooms FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all operations for authenticated users" ON public.companions FOR ALL USING (auth.role() = 'authenticated');

-- Also allow anon access for now to simplify development
CREATE POLICY "Allow all operations for anon users" ON public.service_requests FOR ALL USING (auth.role() = 'anon');
CREATE POLICY "Allow all operations for anon users" ON public.request_categories FOR ALL USING (auth.role() = 'anon');
CREATE POLICY "Allow all operations for anon users" ON public.request_items FOR ALL USING (auth.role() = 'anon');
CREATE POLICY "Allow all operations for anon users" ON public.chat_messages FOR ALL USING (auth.role() = 'anon');
CREATE POLICY "Allow all operations for anon users" ON public.rooms FOR ALL USING (auth.role() = 'anon');
CREATE POLICY "Allow all operations for anon users" ON public.companions FOR ALL USING (auth.role() = 'anon');
