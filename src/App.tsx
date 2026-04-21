import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Landing page components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Team from './components/Team';
import Footer from './components/Footer';
import './App.css';

// App components
import MobileAppLayout from './layouts/MobileAppLayout';
import LoginScreen from './features/auth/Login';
import HomeScreen from './features/app/HomeScreen';
import MapScreen from './features/app/MapScreen';
import FeedScreen from './features/app/FeedScreen';
import SavedScreen from './features/app/SavedScreen';
import ProfileScreen from './features/app/ProfileScreen';
import './features/app/AppScreens.css';

// Landing page (public)
function LandingPage() {
  return (
    <div className="app-container">
      <Navbar />
      <Hero />
      <Features />
      <Team />
      <Footer />
    </div>
  );
}

// Protected route: redirect to /login if not authenticated
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div className="login-spinner" style={{ width: 32, height: 32, border: '3px solid #e2e8f0', borderTopColor: '#2563eb' }} />
          <span style={{ color: '#64748b', fontSize: 14 }}>Đang tải...</span>
        </div>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

// Public route: redirect to /app/home if already authenticated
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (user) return <Navigate to="/app/home" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Landing page - full width */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth - mobile shell */}
          <Route path="/login" element={<PublicRoute><LoginScreen /></PublicRoute>} />

          {/* App - mobile shell with bottom nav */}
          <Route path="/app" element={<ProtectedRoute><MobileAppLayout /></ProtectedRoute>}>
            <Route path="home" element={<HomeScreen />} />
            <Route path="map" element={<MapScreen />} />
            <Route path="feed" element={<FeedScreen />} />
            <Route path="saved" element={<SavedScreen />} />
            <Route path="profile" element={<ProfileScreen />} />
            <Route index element={<Navigate to="home" replace />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
