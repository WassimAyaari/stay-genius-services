
import * as z from 'zod';

export const facilitySchema = z.object({
  name: z.string().min(1, { message: "Le nom est requis" }),
  description: z.string().optional(),
  location: z.string().optional(),
  capacity: z.number().int().nonnegative().optional(),
  image_url: z.string().optional(),
  opening_hours: z.string().optional(),
  status: z.enum(['open', 'closed']),
});

export type FacilityFormValues = z.infer<typeof facilitySchema>;
