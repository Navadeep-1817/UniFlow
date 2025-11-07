# 🚀 Trainer System - Quick Setup Guide

## Step 1: Add Routes to Your App.jsx

```javascript
// Add these imports at the top of your App.jsx
import TrainerDashboard from './components/trainer/TrainerDashboard';
import TrainerLogin from './components/trainer/TrainerLogin';
import TrainerRegister from './components/trainer/TrainerRegister';
import TrainerProfile from './components/trainer/TrainerProfile';

// Add these routes in your <Routes> component
<Route path="/trainer/register" element={<TrainerRegister />} />
<Route path="/trainer/login" element={<TrainerLogin />} />
<Route path="/trainer/dashboard" element={<TrainerDashboard />} />
<Route path="/trainer/profile" element={<TrainerProfile />} />
```

## Step 2: Test the Complete Flow

### Frontend URLs
- Registration: `http://localhost:5173/trainer/register`
- Login: `http://localhost:5173/trainer/login`
- Dashboard: `http://localhost:5173/trainer/dashboard`
- Profile: `http://localhost:5173/trainer/profile`

### Quick Test Steps
1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd uniflow && npm run dev`
3. Navigate to `/trainer/register`
4. Fill registration form and submit
5. You'll be auto-redirected to dashboard
6. Verify trainer in MongoDB (set `isVerified: true`)
7. Login as HOD and allocate trainer to event
8. Login as trainer and see allocated event

## Step 3: Verify Trainer in MongoDB

```javascript
// Using MongoDB Compass or mongosh
db.trainers.updateOne(
  { email: "john.trainer@example.com" },
  { $set: { isVerified: true } }
)
```

## That's it! The system is ready to use. 🎉

See `TRAINER_SYSTEM_DOCUMENTATION.md` for complete details.
