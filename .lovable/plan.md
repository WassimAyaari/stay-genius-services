

# Add Moderator Service Type Selection to Create Staff Dialog

## Overview
When creating a staff account with the **Moderator** role, a new "Service Type" dropdown will appear letting the admin select which service the moderator manages: Housekeeping, Maintenance, Security, or IT Support. This field is hidden for Admin and Staff roles.

## What Changes

### 1. New Database Table: `moderator_services`
A new table to store which service type each moderator is assigned to:

- `id` (uuid, primary key)
- `user_id` (uuid, references auth.users, unique)
- `service_type` (text) -- values: `housekeeping`, `maintenance`, `security`, `it_support`
- `created_at` (timestamp)

RLS policies will allow admins to manage all records and moderators to read their own.

### 2. Frontend: `CreateStaffDialog.tsx`
- Add an optional `service_type` field to the Zod schema, required only when role is `moderator`
- Watch the `role` field value; when it equals `moderator`, render a new Select dropdown with options: Housekeeping, Maintenance, Security, IT Support
- Pass `service_type` in the request body to the edge function

### 3. Edge Function: `create-staff-account/index.ts`
- Accept the optional `service_type` parameter from the request body
- After creating the user and assigning the moderator role, insert a record into `moderator_services` with the chosen service type
- Validate that `service_type` is provided when role is `moderator`

### 4. Frontend: `EditRoleDialog.tsx`
- When changing a role **to** moderator, also show the service type selector
- When changing a role **from** moderator to something else, clean up the moderator_services record (handled by the edge function)

### 5. Edge Function: `update-staff-role/index.ts`
- When updating to moderator, accept and insert the service type
- When updating from moderator to another role, delete the moderator_services record

### 6. Staff Table: `StaffTable.tsx`
- Optionally display the service type badge next to moderator roles (e.g., "Moderator - Housekeeping")

## Technical Details

### Zod Schema Update (CreateStaffDialog)
```typescript
const createStaffSchema = z
  .object({
    first_name: z.string().min(2).max(50),
    last_name: z.string().min(2).max(50),
    email: z.string().email().max(255),
    role: z.enum(['staff', 'moderator', 'admin']),
    service_type: z.enum(['housekeeping', 'maintenance', 'security', 'it_support']).optional(),
    password: z.string().min(6).max(72),
    confirm_password: z.string(),
  })
  .refine(data => data.password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  })
  .refine(data => data.role !== 'moderator' || !!data.service_type, {
    message: 'Please select a service type',
    path: ['service_type'],
  });
```

### Conditional Field Rendering
```tsx
{watchedRole === 'moderator' && (
  <FormField name="service_type" ...>
    <Select>
      <SelectItem value="housekeeping">Housekeeping</SelectItem>
      <SelectItem value="maintenance">Maintenance</SelectItem>
      <SelectItem value="security">Security</SelectItem>
      <SelectItem value="it_support">IT Support</SelectItem>
    </Select>
  </FormField>
)}
```

### Database Migration
```sql
CREATE TABLE public.moderator_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  service_type text NOT NULL CHECK (service_type IN ('housekeeping', 'maintenance', 'security', 'it_support')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.moderator_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage moderator services"
  ON public.moderator_services FOR ALL
  USING (is_admin(auth.uid()));

CREATE POLICY "Moderators can view own service"
  ON public.moderator_services FOR SELECT
  USING (auth.uid() = user_id);
```

## Files to Create/Edit
- **New**: SQL migration for `moderator_services` table
- **Edit**: `src/pages/admin/staff/CreateStaffDialog.tsx` -- add conditional service_type field
- **Edit**: `src/pages/admin/staff/EditRoleDialog.tsx` -- add service_type when switching to moderator
- **Edit**: `src/pages/admin/staff/StaffTable.tsx` -- display service type for moderators
- **Edit**: `supabase/functions/create-staff-account/index.ts` -- handle service_type
- **Edit**: `supabase/functions/update-staff-role/index.ts` -- handle service_type on role change

