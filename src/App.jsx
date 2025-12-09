import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
// import DemoBanner from './components/DemoBanner';
import LoginTester from './components/LoginTester';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ServiceDetails from './pages/ServiceDetails';
import MyProfile from './pages/MyProfile';
import Services from './pages/Services';
import SafetyGuide from './pages/SafetyGuide';
import AddListing from './pages/AddListing';
import PetsSupplies from './pages/PetsSupplies';
import ListingDetails from './pages/ListingDetails';
import MyListings from './pages/MyListings';
import MyOrders from './pages/MyOrders';
import MedicalConsultation from './pages/MedicalConsultation';
import PetHealthDashboard from './pages/PetHealthDashboard';
import Community from './pages/Community';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';

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
