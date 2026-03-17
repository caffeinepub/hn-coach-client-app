# HN Coach Client App

## Current State
Full-stack health/fitness tracking app with React frontend. Orange/navy theme throughout. HomeDashboard has: daily quote at top, promotions/classes slideshow, weight log, nutrition tip panel, meals check-in, weekly check-in (measurements), weekly meal summary, and right-side panel with nutrition + motivation cards. Login page (AuthPage) uses orange accents with fitness illustration.

## Requested Changes (Diff)

### Add
- Nothing new to add

### Modify
- **Theme**: Replace all orange accents (#f97316, orange-*, amber-*) with forest green (#2D6A4F and variants: light #52B788, dark #1B4332, accent #40916C). White backgrounds, black/dark gray text. Active tab highlight, buttons, badges, gradients, borders — all switch to forest green palette. Professional, clean, minimal.
- **Login page (AuthPage)**: Update to forest green theme — replace orange "HN" highlight and all orange accents with forest green. Keep illustration and compact layout.
- **Daily Motivation card placement**: Move the MotivationPanel / daily motivation card from its current position to just ABOVE the Weekly Meal Summary section inside HomeDashboard.
- **index.css**: Update CSS custom properties and any hardcoded orange colors to forest green equivalents.
- All components that use orange/amber Tailwind classes should switch to green equivalents.

### Remove
- Nothing to remove

## Implementation Plan
1. Update `index.css` — change CSS variables and any hardcoded orange to forest green palette (--primary, --accent, etc.)
2. Update `HomeDashboard.tsx` — move MotivationPanel component to just above the Weekly Meal Summary section; replace all orange/amber Tailwind classes with green equivalents
3. Update `AuthPage.tsx` — replace orange styling with forest green; keep "HN" highlighted but in green
4. Update `Header.tsx` — replace orange pill/gradient with forest green
5. Update `MealCheckin.tsx`, `WeightLog.tsx`, `Measurements.tsx`, `Promotions.tsx`, `Classes.tsx`, `NutritionPanel.tsx`, `MotivationPanel.tsx`, `ProfileTab.tsx`, `GoalsTab.tsx`, `CoachAdminPage.tsx` — replace orange/amber classes with forest green equivalents
6. Validate and fix any build errors
