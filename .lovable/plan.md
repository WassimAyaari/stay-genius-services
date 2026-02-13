

# Fix: Notification Click Navigates to Service Page Instead of Detail Page

## Change
Update `StaffNotificationBell.tsx` to navigate to the correct service management page (e.g., `/admin/housekeeping`) instead of the dedicated detail page (`/admin/requests/:id`). The "Requests" tab should also be auto-selected.

## What Changes

### 1. `src/components/admin/StaffNotificationBell.tsx`
- Remove the `navigate('/admin/requests/...')` logic
- Always use the `serviceTypeToRoute` mapping to find the right service page from the notification message
- Append `?tab=requests` query param so the page opens on the Requests tab automatically

### 2. Service Manager Pages (HousekeepingManager, MaintenanceManager, SecurityManager, InformationTechnologyManager)
- Read the `tab` query parameter from the URL
- If `tab=requests`, set the active tab to "requests" on mount so the user lands directly on the requests list

### 3. Optionally remove `ServiceRequestDetailPage.tsx` and its route
- Since it's no longer needed, remove the dedicated detail page and the `/admin/requests/:requestId` route from `AdminRoutes.tsx`

## Technical Details

**Navigation logic (simplified):**
```tsx
const route = Object.entries(serviceTypeToRoute).find(([key]) =>
  notif.message.toLowerCase().includes(key)
);
if (route) {
  navigate(`${route[1]}?tab=requests`);
}
```

**Tab auto-selection in each manager page:**
```tsx
const [searchParams] = useSearchParams();
const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'items');
```

### Files to modify
- `src/components/admin/StaffNotificationBell.tsx`
- `src/pages/admin/HousekeepingManager.tsx`
- `src/pages/admin/MaintenanceManager.tsx`
- `src/pages/admin/SecurityManager.tsx`
- `src/pages/admin/InformationTechnologyManager.tsx`

### Files to remove
- `src/pages/admin/ServiceRequestDetailPage.tsx`
- Route entry in `src/routes/AdminRoutes.tsx`
