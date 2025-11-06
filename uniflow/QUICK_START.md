# 🚀 UniFlow Quick Start Guide

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Current Setup Status
✅ **All 119 components created**  
✅ **Folder structure organized**  
✅ **Index files for clean imports**  
✅ **Ready for development**

---

## 📦 Installation

The project already has basic dependencies installed. To add additional packages:

```bash
# Navigate to project directory
cd uniflow

# Install additional dependencies (optional)
npm install react-router-dom axios
npm install @tanstack/react-query  # For API state management
npm install zustand  # For state management (lightweight alternative to Redux)
```

---

## 🏃‍♂️ Running the Development Server

```bash
# Start development server
npm run dev

# Server will run on http://localhost:5173
```

---

## 📁 Project Structure Overview

```
uniflow/
├── src/
│   └── components/
│       ├── auth/                    # 7 components
│       ├── superadmin/              # 9 components
│       ├── academic/
│       │   ├── hod/                 # 11 components
│       │   └── placement/           # 10 components
│       ├── nonacademic/
│       │   ├── sports/              # 7 components
│       │   └── studentbody/
│       │       ├── facultyhead/     # 7 components
│       │       └── teamrep/         # 8 components
│       ├── faculty/                 # 11 components
│       ├── student/                 # 14 components
│       ├── shared/                  # 25 components
│       └── analytics/               # 11 components
```

---

## 🔧 Recommended Next Steps

### 1. Set Up Routing (Priority: High)

Create `src/routes/AppRoutes.jsx`:

```javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login, PrivateRoute, RoleBasedRoute } from './components/auth';
import { SuperAdminDashboard } from './components/superadmin';
import { HODDashboard } from './components/academic/hod';
import { StudentDashboard } from './components/student';
// ... import other components

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Super Admin Routes */}
        <Route path="/superadmin/*" element={
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['superadmin']}>
              <SuperAdminDashboard />
            </RoleBasedRoute>
          </PrivateRoute>
        } />
        
        {/* Student Routes */}
        <Route path="/student/*" element={
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </RoleBasedRoute>
          </PrivateRoute>
        } />
        
        {/* Add more routes... */}
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
```

Update `src/App.jsx`:

```javascript
import AppRoutes from './routes/AppRoutes';
import './App.css';

function App() {
  return <AppRoutes />;
}

export default App;
```

### 2. Create API Service Layer

Create `src/services/api.js`:

```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api'; // Your backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
};

export const eventsAPI = {
  getAll: () => api.get('/events'),
  getById: (id) => api.get(`/events/${id}`),
  create: (eventData) => api.post('/events', eventData),
  update: (id, eventData) => api.put(`/events/${id}`, eventData),
  delete: (id) => api.delete(`/events/${id}`),
};

// Add more API endpoints...

export default api;
```

### 3. State Management (Choose One)

#### Option A: Context API (Simple)

Create `src/context/AuthContext.jsx`:

```javascript
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('token', userData.token);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

#### Option B: Zustand (Recommended)

```bash
npm install zustand
```

Create `src/store/authStore.js`:

```javascript
import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  login: (userData) => set({ user: userData, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
```

### 4. Add Styling (Choose One)

#### Option A: Tailwind CSS (Recommended)

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Configure `tailwind.config.js`:

```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

#### Option B: Material-UI

```bash
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
```

#### Option C: Ant Design

```bash
npm install antd
```

### 5. Environment Variables

Create `.env`:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=UniFlow
```

Access in code:

```javascript
const API_URL = import.meta.env.VITE_API_BASE_URL;
```

---

## 🧪 Testing Setup (Optional)

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

Create `src/components/__tests__/Login.test.jsx`:

```javascript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Login from '../auth/Login';

describe('Login Component', () => {
  it('renders login form', () => {
    render(<Login />);
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });
});
```

---

## 📖 Component Usage Examples

### Using Shared Components

```javascript
import { EventCard, Modal, Table, Loader } from './components/shared';

function MyComponent() {
  return (
    <div>
      <EventCard 
        event={eventData} 
        onRegister={handleRegister} 
      />
      
      <Table 
        columns={columns} 
        data={data} 
        sortable={true} 
      />
      
      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        title="Event Details"
      >
        <p>Modal content here</p>
      </Modal>
    </div>
  );
}
```

### Protected Routes

```javascript
import { PrivateRoute, RoleBasedRoute } from './components/auth';

<PrivateRoute>
  <RoleBasedRoute allowedRoles={['hod', 'faculty']}>
    <HODDashboard />
  </RoleBasedRoute>
</PrivateRoute>
```

---

## 🎨 Styling Tips

### Add Component-Specific CSS

Create `src/styles/components/` folder:
- `auth.css`
- `dashboard.css`
- `events.css`
- etc.

### Global Styles

Update `src/index.css`:

```css
:root {
  --primary-color: #4F46E5;
  --secondary-color: #06B6D4;
  --success-color: #10B981;
  --error-color: #EF4444;
  --warning-color: #F59E0B;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
}
```

---

## 🔍 Debugging Tips

1. **React DevTools**: Install browser extension
2. **Console Logs**: Use `console.log()` for debugging
3. **Network Tab**: Check API requests in browser DevTools
4. **Error Boundaries**: Wrap components with `<ErrorBoundary>`

---

## 📚 Useful Resources

- [React Documentation](https://react.dev)
- [React Router](https://reactrouter.com)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Zustand](https://zustand-demo.pmnd.rs/)

---

## 🎯 Development Workflow

1. **Start Dev Server**: `npm run dev`
2. **Make Changes**: Edit component files
3. **Hot Reload**: Changes appear automatically
4. **Test Locally**: Test in browser
5. **Commit Changes**: Use git for version control

---

## 📝 Common Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Package Management
npm install [package]     # Install package
npm uninstall [package]   # Remove package
npm update               # Update packages

# Git Commands
git add .
git commit -m "message"
git push origin main
```

---

## ✅ Checklist for Production

- [ ] Environment variables configured
- [ ] API endpoints connected
- [ ] Authentication implemented
- [ ] All routes protected
- [ ] Error handling added
- [ ] Loading states implemented
- [ ] Form validations added
- [ ] Responsive design tested
- [ ] Browser compatibility checked
- [ ] Performance optimized
- [ ] Build tested (`npm run build`)

---

## 🎉 You're All Set!

Your UniFlow frontend is ready for development. Start by:
1. Running `npm run dev`
2. Opening http://localhost:5173
3. Implementing authentication flow
4. Connecting to backend API

**Happy Coding! 🚀**
