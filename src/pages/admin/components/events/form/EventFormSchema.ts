
import * as z from 'zod';

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
  price: z.number().optional(),
  restaurant_id: z.string().nullable().optional(),
  spa_facility_id: z.string().nullable().optional()
});

export type EventFormValues = z.infer<typeof eventSchema>;
