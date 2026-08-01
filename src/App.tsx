import { lazy, Suspense, type ReactNode } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Showcase from './components/Showcase';
import Features from './components/Features';
import Team from './components/Team';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import './App.css';
import './features/app/AppScreens.css';

const MobileAppLayout = lazy(() => import('./layouts/MobileAppLayout'));
const LoginScreen = lazy(() => import('./features/auth/Login'));
const HomeScreen = lazy(() => import('./features/app/HomeScreen'));
const MapScreen = lazy(() => import('./features/app/MapScreen'));
const FeedScreen = lazy(() => import('./features/app/FeedScreen'));
const SavedScreen = lazy(() => import('./features/app/SavedScreen'));
const ProfileScreen = lazy(() => import('./features/app/ProfileScreen'));
const StationDetailScreen = lazy(() => import('./features/app/StationDetailScreen'));
const BookingsScreen = lazy(() => import('./features/app/BookingsScreen'));
const AdminScreen = lazy(() => import('./features/app/AdminScreen'));

function LandingPage() {
  return (
    <div className="app-container">
      <Navbar />
      <Hero />
      <Showcase />
      <Features />
      <Team />
      <Footer />
      <Chatbot />
    </div>
  );
}

function RouteFallback() {
  return (
    <div style={{ minHeight: '100dvh', display: 'grid', placeItems: 'center', background: '#f4f7fb' }}>
      <div className="skeleton" style={{ width: 240, height: 12, borderRadius: 6 }} aria-label="Đang tải" />
    </div>
  );
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <RouteFallback />;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <RouteFallback />;
  if (user) return <Navigate to="/app/home" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Navigate to="/app/home" replace />} />
            <Route path="/about" element={<LandingPage />} />
            <Route path="/login" element={<PublicRoute><LoginScreen /></PublicRoute>} />

            <Route path="/app" element={<ProtectedRoute><MobileAppLayout /></ProtectedRoute>}>
              <Route path="home" element={<HomeScreen />} />
              <Route path="map" element={<MapScreen />} />
              <Route path="feed" element={<FeedScreen />} />
              <Route path="saved" element={<SavedScreen />} />
              <Route path="profile" element={<ProfileScreen />} />
              <Route path="bookings" element={<BookingsScreen />} />
              <Route path="stations/:stationId" element={<StationDetailScreen />} />
              <Route path="admin" element={<AdminScreen />} />
              <Route index element={<Navigate to="home" replace />} />
            </Route>

            <Route path="*" element={<Navigate to="/app/home" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
