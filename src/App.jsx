import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
// import DemoBanner from './components/DemoBanner';
import LoginTester from './components/LoginTester';
import ProtectedRoute from './components/ProtectedRoute';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect, Suspense, lazy } from 'react';

// Lazy load all page components for better performance
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ServiceDetails = lazy(() => import('./pages/ServiceDetails'));
const MyProfile = lazy(() => import('./pages/MyProfile'));
const Services = lazy(() => import('./pages/Services'));
const SafetyGuide = lazy(() => import('./pages/SafetyGuide'));
const AddListing = lazy(() => import('./pages/AddListing'));
const PetsSupplies = lazy(() => import('./pages/PetsSupplies'));
const ListingDetails = lazy(() => import('./pages/ListingDetails'));
const MyListings = lazy(() => import('./pages/MyListings'));
const MyOrders = lazy(() => import('./pages/MyOrders'));
const MedicalConsultation = lazy(() => import('./pages/MedicalConsultation'));
const PetHealthDashboard = lazy(() => import('./pages/PetHealthDashboard'));
const Community = lazy(() => import('./pages/Community'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="loading loading-spinner loading-lg text-warm-500"></div>
  </div>
);

function App() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App min-h-screen flex flex-col bg-white dark:bg-gray-900">
            {/* <DemoBanner /> */}
            <Navbar />
            
            <main className="flex-grow">
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/pets-supplies" element={<PetsSupplies />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/safety-guide" element={<SafetyGuide />} />
                  <Route path="/medical-consultation" element={<MedicalConsultation />} />
                  <Route path="/community" element={<Community />} />

                  {/* Protected routes */}
                  <Route
                    path="/listing/:id"
                    element={
                      <ProtectedRoute>
                        <ListingDetails />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/service/:id"
                    element={
                      <ProtectedRoute>
                        <ServiceDetails />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/add-listing"
                    element={
                      <ProtectedRoute>
                        <AddListing />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/my-listings"
                    element={
                      <ProtectedRoute>
                        <MyListings />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/my-orders"
                    element={
                      <ProtectedRoute>
                        <MyOrders />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/pet-health-dashboard"
                    element={
                      <ProtectedRoute>
                        <PetHealthDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <MyProfile />
                      </ProtectedRoute>
                    }
                  />

                  {/* 404 Page */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
            
            <Footer />
            
            {/* Login Tester for debugging */}
            <LoginTester />
            
            {/* Toast notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#f1761a',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
