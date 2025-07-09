
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
  recurrence_type: z.enum(['once', 'daily', 'weekly', 'monthly'], {
    message: 'Recurrence type is required'
  }).default('once'),
  date: z.string().optional(),
  time: z.string().optional(),
  capacity: z.number().optional().default(10),
  price: z.number().optional(),
  restaurant_id: z.string().nullable().optional(),
  spa_facility_id: z.string().nullable().optional()
}).refine((data) => {
  // Date is required only for 'once' events
  if (data.recurrence_type === 'once' && (!data.date || data.date.length < 3)) {
    return false;
  }
  return true;
}, {
  message: 'Date is required for one-time events',
  path: ['date']
});

export type EventFormValues = z.infer<typeof eventSchema>;
