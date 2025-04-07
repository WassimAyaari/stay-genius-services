
import * as z from 'zod';

export const serviceSchema = z.object({
  name: z.string().min(1, { message: "Le nom est requis" }),
  description: z.string().min(1, { message: "La description est requise" }),
  duration: z.string().min(1, { message: "La durée est requise" }),
  price: z.number().positive({ message: "Le prix doit être supérieur à 0" }),
  category: z.string().min(1, { message: "La catégorie est requise" }),
  facility_id: z.string().min(1, { message: "L'installation est requise" }),
  is_featured: z.boolean().default(false),
  image: z.string().optional(),
  status: z.enum(['available', 'unavailable']),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;
