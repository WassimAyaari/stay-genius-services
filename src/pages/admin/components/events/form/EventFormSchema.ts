
import * as z from 'zod';

// Add restaurant_id as a string or null
export const eventSchema = z.object({
  title: z.string().min(3, {
    message: 'Title is required'
  }),
  description: z.string().min(3, {
    message: 'Description is required'
  }),
  image: z.string().min(3, {
    message: 'Image URL is required'
  }),
  category: z.enum(['event', 'promo'], {
    message: 'Category is required'
  }),
  is_featured: z.boolean().default(false),
  location: z.string().optional(),
  date: z.string().min(3, {
    message: 'Date is required'
  }),
  time: z.string().optional(),
  capacity: z.number().optional().default(10),
  restaurant_id: z.string().nullable().optional() // new field
});

export type EventFormValues = z.infer<typeof eventSchema>;
