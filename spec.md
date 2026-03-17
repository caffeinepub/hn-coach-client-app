# HN Coach Client App

## Current State
New project — no existing code.

## Requested Changes (Diff)

### Add
- Client login/registration system with role-based access (coach admin vs client)
- Daily weight logging: date + weight value
- Weekly body measurements: left bicep, right bicep, chest/breast, waist, hips, left thigh, right thigh
- Dashboard showing progress over time (weight and measurement history)
- "Join a Class" section: list of available classes clients can sign up for
- Promotions/announcements space: coach posts deals, specials, motivational content

### Modify
N/A

### Remove
N/A

## Implementation Plan
- Backend: User auth via authorization component; data models for WeightEntry (userId, date, weight), MeasurementEntry (userId, date, all 7 measurements), ClassSession (id, name, date, description, capacity, enrolled[]), Promotion (id, title, body, createdAt)
- Backend APIs: logWeight, getWeightHistory, logMeasurements, getMeasurementHistory, getClasses, joinClass, getPromotions, createPromotion (coach), createClass (coach)
- Frontend: Login/Register page, Client dashboard with tabs: Weight Log, Measurements, Classes, Promotions; Coach admin view for managing classes and promotions
