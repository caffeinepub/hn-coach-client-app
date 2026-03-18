# HN Coach Client App

## Current State
The CoachAdminPage has two issues:
1. Images in the admin panel client detail view are too small (w-12 h-12 = 48px) with no way to view them full size
2. Comments fail to save because `saveActivityComment` and `getActivityComments` are missing from the frontend declaration files (`backend.d.ts`, `backend.did.d.ts`, `backend.did.js`), causing runtime errors when called via `(actor as any).saveActivityComment`

## Requested Changes (Diff)

### Add
- Image lightbox/modal in admin panel: clicking any activity image opens it full-screen with a close button
- `ActivityComment` interface in `backend.d.ts`
- `saveActivityComment` and `getActivityComments` methods to `backendInterface` in `backend.d.ts`
- (already done) `ActivityComment` type and methods added to `backend.did.d.ts` and `backend.did.js`

### Modify
- Admin panel meal images: increase from `w-12 h-12` to `w-16 h-16` or larger, add cursor-pointer and onClick to open lightbox
- Comment save call: change from `(actor as any).saveActivityComment` to properly typed `actor.saveActivityComment`
- Comment fetch: change from `(actor as any).getActivityComments` to `actor.getActivityComments`

### Remove
- Nothing

## Implementation Plan
1. `backend.d.ts` - already updated externally with ActivityComment type and methods
2. `backend.did.d.ts` - already updated externally
3. `backend.did.js` - already updated externally
4. Update `CoachAdminPage.tsx`:
   - Add a lightbox state (`lightboxUrl: string | null`)
   - Add lightbox overlay component that shows the full image with close button
   - Make all activity images (meal, weight if any) larger (`w-20 h-20`) with cursor-pointer and onClick to open lightbox
   - Update `saveActivityComment` mutation to use typed `actor.saveActivityComment(principal, activityKey, comment)`
   - Update `getActivityComments` query to use typed `actor.getActivityComments(principal)`
