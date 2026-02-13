
# Add Role Filter to Staff Management

## What Changes
Add a dropdown/select filter next to the existing search input that lets admins filter staff by role (All, Admin, Moderator, Staff).

## Implementation

In `src/pages/admin/StaffManager.tsx`:

1. Add a `roleFilter` state initialized to `'all'`
2. Place a `Select` component next to the search input with options: All Roles, Admin, Moderator, Staff
3. Update the `filtered` logic to also check `roleFilter`:

```tsx
const filtered = staff.filter((m) => {
  const q = search.toLowerCase();
  const matchesSearch =
    m.first_name.toLowerCase().includes(q) ||
    m.last_name.toLowerCase().includes(q) ||
    m.email.toLowerCase().includes(q) ||
    m.role.toLowerCase().includes(q);
  const matchesRole = roleFilter === 'all' || m.role === roleFilter;
  return matchesSearch && matchesRole;
});
```

The Select will be placed inline with the search input using a flex row, keeping the existing design pattern consistent with the admin dashboard style.

## Files to Modify
- `src/pages/admin/StaffManager.tsx` -- add state, Select component, and updated filter logic
