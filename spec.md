# HN Coach Client App

## Current State
- GoalsTab has optional photo upload (front/side) but no enforcement before saving
- Measurements has optional photo upload in weekly check-in but no enforcement
- Points system: footsteps = 15 pts, meal = 10 pts, weight = 20 pts, measurements = 50 pts
- No daily all-check-in bonus, no 7-day streak milestone, no progressive milestone rewards
- Login page is a full two-column wide layout (large, takes full screen)

## Requested Changes (Diff)

### Add
- Daily all-check-in bonus: 50 points when all 6 meals + weight are logged in one day
- 7-day streak bonus: 500 milestone points when 7 consecutive days of full bonus earned
- Progressive milestone rewards:
  - 2nd time earning 500-pt streak milestone: +500 bonus
  - 3rd time: +1000 bonus
  - 4th time: +2000 bonus
- Visual reward progression chart in the rewards/points section showing all milestone tiers
- Streak tracking stored in localStorage

### Modify
- GoalsTab: Require both front and side view images before saving goals (show validation error if missing)
- Measurements weekly check-in: Require both front and side images before completing check-in
- Points config: footsteps 15 → 20 pts
- Login page: Compact, small, centered card layout — no left/right split, minimal height, small illustration or logo only, login card is the focus

### Remove
- Large two-panel login page layout (full-screen split left/right)

## Implementation Plan
1. Update `src/frontend/src/utils/points.ts`: change footsteps to 20, add streak/bonus logic functions
2. Update `src/frontend/src/components/GoalsTab.tsx`: validate front+side images required on save
3. Update `src/frontend/src/components/Measurements.tsx`: validate front+side images required on weekly check-in submit
4. Update `src/frontend/src/components/HomeDashboard.tsx`: after logging all check-ins detect if daily bonus earned, award 50 pts; check 7-day streak and award milestone; check progressive milestones; update points reward chart section
5. Update `src/frontend/src/pages/AuthPage.tsx`: compact centered single-card login page
