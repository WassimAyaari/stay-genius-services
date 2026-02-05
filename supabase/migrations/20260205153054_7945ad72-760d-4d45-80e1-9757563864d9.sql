-- Add foreign key constraint from service_requests to request_items
ALTER TABLE public.service_requests
ADD CONSTRAINT service_requests_request_item_id_fkey
FOREIGN KEY (request_item_id) 
REFERENCES public.request_items(id)
ON DELETE SET NULL;