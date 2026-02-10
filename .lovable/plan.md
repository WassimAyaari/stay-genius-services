

# Remove Redundant Request Count Badges

## Problem
The "Requests" tab in both Housekeeping and IT Management pages shows a badge with the total request count (e.g., "3", "1"). These are not static -- they come from the database -- but they are redundant since the sidebar already shows notification badges for new pending requests.

## Changes

### File: `src/pages/admin/HousekeepingManager.tsx` (lines 163-168)
- Remove the Badge from the "Requests" TabsTrigger, leaving just the text "Requests"

### File: `src/pages/admin/InformationTechnologyManager.tsx` (lines 133-138)
- Remove the Badge from the "Requests" TabsTrigger, leaving just the text "Requests"

Both files also have unused Badge imports that can be cleaned up.

## Result
The "Requests" tabs will display only the word "Requests" with no number badge, matching a cleaner look while relying on the sidebar notifications for new item alerts.
