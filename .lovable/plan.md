
# Plan: Menu Size, Remove Admin Link, and Role-Based Login Redirect

## Overview
This plan addresses three changes:
1. Change the menu to a compact sidebar (like Figure 1) instead of full-page
2. Remove "Admin Dashboard" from the main menu
3. Redirect users based on role after login: regular users → Home, admins → Admin Dashboard

---

## Change 1: Compact Menu Size

### Current State
The `SheetContent` in `MainMenu.tsx` uses `w-full sm:max-w-full`, making it span the entire screen width.

### Solution
Change the width classes to create a compact sidebar similar to the reference image.

**File:** `src/components/MainMenu.tsx`

| Line | Current | Updated |
|------|---------|---------|
| 75 | `className="p-0 w-full sm:max-w-full bg-card border-border"` | `className="p-0 w-80 sm:max-w-sm bg-card border-border"` |
| 87 | `className="flex-1 h-[calc(100vh-80px)] bg-card"` | `className="flex-1 bg-card"` |

Also update line 76 to remove the full height constraint:
- Change `className="flex flex-col h-full bg-card"` 
- To `className="flex flex-col bg-card"`

---

## Change 2: Remove Admin Dashboard from Menu

### Current State
Lines 45-52 conditionally add "Admin Dashboard" to the menu if the user is an admin.

### Solution
Remove the conditional block that adds the admin menu item.

**File:** `src/components/MainMenu.tsx`

Delete lines 45-52:
```typescript
// Add admin menu item if user is admin
if (isAdmin) {
  menuItems.push({
    icon: <Settings className="h-5 w-5" />,
    label: 'Admin Dashboard',
    path: '/admin'
  });
}
```

Also remove the unused imports:
- Remove `Settings` from lucide-react import (line 14)
- Remove `useAdminCheck` import and hook call (lines 16, 26)

---

## Change 3: Role-Based Redirect After Login

### Current State
`LoginForm.tsx` always redirects to `/` after successful login (line 46).

### Solution
After successful login, check if the user is an admin using the `is_user_admin` RPC function, then redirect accordingly.

**File:** `src/pages/auth/components/LoginForm.tsx`

Add Supabase import and update the `onSubmit` function:

```typescript
import { supabase } from '@/integrations/supabase/client';

// Inside onSubmit, after login success:
if (result.success) {
  toast({
    title: 'Connexion réussie',
    description: 'Bienvenue dans l\'application Stay Genius',
  });
  
  // Check if user is admin and redirect accordingly
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user?.id) {
    const { data: isAdmin } = await supabase.rpc('is_user_admin', { 
      _user_id: session.user.id 
    });
    
    if (isAdmin) {
      navigate('/admin');
    } else {
      navigate('/');
    }
  } else {
    navigate('/');
  }
}
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/MainMenu.tsx` | Compact width, remove admin menu item |
| `src/pages/auth/components/LoginForm.tsx` | Add role-based redirect logic |

---

## Technical Summary

### Menu Changes
- Width: `w-full sm:max-w-full` → `w-80 sm:max-w-sm` (320px fixed width)
- Remove fixed height constraint for natural content sizing
- Remove admin-only menu item entirely

### Login Redirect Flow
```
User submits login
    ↓
loginUser() succeeds
    ↓
Get current session
    ↓
Call is_user_admin RPC
    ↓
isAdmin? → /admin
    ↓
Not admin? → /
```
