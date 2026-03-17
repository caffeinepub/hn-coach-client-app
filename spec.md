# HN Coach Client App

## Current State
The app has a lavender/white/black theme with 3D card effects. The dashboard homepage has:
- A daily motivation card at the top (showing a quote + date line)
- An HN Points card with dark background (oklch ~0.2)
- A collapsible Milestone Reward Chart with dark background (oklch ~0.18)
- Goals icon rendered as just `🎯` in the Header nav button

## Requested Changes (Diff)

### Add
- Welcome [username] text in the motivation card date/subtitle area (alongside date)

### Modify
- HN Points card background: change from dark (oklch(0.2 0.04 260) gradient) to lavender (oklch(0.92 0.06 290) or similar light lavender)
- Milestone Reward Chart collapsible card background: change from dark (oklch(0.18 0.04 260) gradient) to lavender
- Goals nav button in Header: change label from `Goals` to `My Goals`, keep 🎯 emoji
- Daily motivation card date line: prepend `Welcome, [username]!` — fetch username via `useUserProfile()` hook (already available). Show as "Welcome, [Name] · [date]" or two lines.

### Remove
- Nothing removed

## Implementation Plan
1. In `HomeDashboard.tsx`: import and use `useUserProfile` hook to get profile name
2. In daily motivation card date area: show `Welcome, [name]!` above or alongside the date
3. In HN Points card: replace dark gradient background with light lavender gradient (e.g. oklch(0.93 0.07 290) to oklch(0.88 0.09 290)). Update text colors for contrast on light background.
4. In Milestone Reward Chart collapsible card: same lavender background treatment, update text colors.
5. In `Header.tsx`: update Goals button label from `Goals` to `My Goals`
