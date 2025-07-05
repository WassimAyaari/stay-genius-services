-- Create chat templates table for quick responses
CREATE TABLE public.chat_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE public.chat_templates ENABLE ROW LEVEL SECURITY;

-- Create policies for chat templates
CREATE POLICY "Admin users can manage chat templates" 
ON public.chat_templates 
FOR ALL 
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "All users can view active templates" 
ON public.chat_templates 
FOR SELECT 
USING (is_active = true);

-- Insert some common guest request templates
INSERT INTO public.chat_templates (category, title, message, sort_order) VALUES
('room_requests', 'Extra Pillow', 'Thank you for your request. We will send extra pillows to your room within 15 minutes. Is there anything else I can help you with?', 1),
('room_requests', 'Water Bottles', 'I will arrange for complimentary water bottles to be delivered to your room right away. They should arrive within 10-15 minutes.', 2),
('room_requests', 'Extra Towels', 'We will send fresh towels to your room immediately. Our housekeeping team will deliver them within 15 minutes.', 3),
('room_requests', 'Temperature Control', 'I understand you are having issues with the room temperature. Our maintenance team will check your AC/heating system within 30 minutes.', 4),
('dining', 'Room Service Menu', 'You can find our complete room service menu in your room directory or I can send you a digital copy. Would you like me to email it to you?', 1),
('dining', 'Restaurant Reservation', 'I would be happy to help you make a restaurant reservation. Which restaurant interests you and what time would you prefer?', 2),
('general', 'Welcome Message', 'Welcome to Hotel Genius! I am here to assist you with any requests during your stay. How may I help you today?', 1),
('general', 'Thank You', 'Thank you for staying with us. We truly appreciate your business and hope you are enjoying your visit.', 2),
('maintenance', 'Maintenance Request', 'Thank you for reporting this issue. Our maintenance team has been notified and will address this within 1 hour.', 1),
('housekeeping', 'Cleaning Schedule', 'Our housekeeping team typically cleans rooms between 10 AM and 4 PM. Would you like to schedule a specific time?', 1);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_chat_templates_updated_at
BEFORE UPDATE ON public.chat_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();