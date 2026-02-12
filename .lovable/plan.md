
## Problem Analysis
The card moves when clicking the three dots (dropdown menu) or the Create Staff button because:

1. **Dialog doesn't have `modal={false}`**: The Radix Dialog Root doesn't explicitly set `modal={false}`, which may cause the scrollbar to disappear when the dialog opens
2. **Select component doesn't have `modal={false}`**: The Select component in the Create Staff form also doesn't prevent the modal behavior from affecting scrollbars
3. **Dropdown menu behavior**: When the dropdown opens, it may trigger scrollbar calculations that shift the layout

Even though `overflow-y: scroll !important;` is set globally on the body in `index.css`, the Radix components' default modal behavior can still override this by manipulating the `overflow` property on the html or body element.

## Solution

### 1. **Dialog Component (src/components/ui/dialog.tsx)**
Add `modal={false}` to the Dialog Root to prevent it from controlling scrollbar visibility:
```tsx
const Dialog = DialogPrimitive.Root
// Change to:
const Dialog: typeof DialogPrimitive.Root = (props) => <DialogPrimitive.Root {...props} modal={false} />
```

**Rationale**: This tells Radix Dialog not to manage the scrollbar, allowing our global CSS to maintain scrollbar visibility.

### 2. **Select Component (src/components/ui/select.tsx)**
Add `modal={false}` to the Select Root to prevent it from triggering scrollbar removal:
```tsx
const Select = SelectPrimitive.Root
// Change to:
const Select: typeof SelectPrimitive.Root = (props) => <SelectPrimitive.Root {...props} modal={false} />
```

**Rationale**: Same as Dialog - prevents Select from controlling scrollbar behavior.

### 3. **AdminLayout Optimization (src/components/admin/AdminLayout.tsx)**
The inner content div already uses `overflow-auto`, which is correct. No changes needed here.

## Expected Result
- The Create Staff button click will open the dialog without the scrollbar disappearing
- The three dots (dropdown menu) will open without triggering any scrollbar shifts
- Selecting a role from the dropdown will not cause layout movement
- The card/content will remain fixed in place during all interactions

## Technical Details
- `modal={false}` on Radix Dialog/Select tells them not to manage `inert` attribute or body scrollbar
- Our global CSS (`overflow-y: scroll !important;`) will maintain the scrollbar consistently
- Dropdown menus use Portal without modal behavior, so they won't cause shifts
