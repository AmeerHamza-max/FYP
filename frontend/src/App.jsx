import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages Import
import LandingPage from './pages/LandingPage/LandingPage';
import Dashboard from './pages/Dashboard/Dashboard'; 
import CreateCampaign from './pages/campaign/CreateCampaign';
import EditCampaign from './pages/campaign/EditCampaign';
import Campaigns from './pages/campaign/Campaigns'; 
import ViewCampaign from './pages/campaign/ViewCampaign'; 

// --- INFLUENCER IMPORTS ---
import Influencers from './pages/Influencer/Influencers'; 
import InfluencerProfile from './pages/Influencer/InfluencerProfile'; 

import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import Pricing from './pages/Pricing/Pricing';
import Checkout from './pages/Pricing/Checkout'; 
import AboutUs from './pages/About/AboutUs'; 
import HowItWorks from './pages/HowItWorks/HowItWorks';
import LegalPage from './pages/LegalPage'; 
import Analytics from './pages/Analytics/Analytics'; 
import Profile from './pages/Profile'; 
import Contact from './pages/Contact';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about-us" element={<AboutUs />} /> 
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Legal Pages */}
        <Route path="/legal/:type" element={<LegalPage />} />
        <Route path="/privacy" element={<Navigate to="/legal/privacy" replace />} />
        <Route path="/terms" element={<Navigate to="/legal/terms" replace />} />
        <Route path="/security" element={<Navigate to="/legal/security" replace />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login isModal={false} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        
        {/* --- Protected Routes --- */}
        
        {/* ANALYTICS ROUTE (Ab Protected hai taake Auth header mil sake) */}
        <Route 
          path="/analytics" 
          element={<ProtectedRoute><Analytics /></ProtectedRoute>} 
        />

        {/* INFLUENCERS ROUTES */}
        <Route 
          path="/influencers" 
          element={<ProtectedRoute><Influencers /></ProtectedRoute>} 
        />
        <Route 
          path="/influencer/:id" 
          element={<ProtectedRoute><InfluencerProfile /></ProtectedRoute>} 
        />

        <Route 
          path="/checkout" 
          element={<ProtectedRoute><Checkout /></ProtectedRoute>} 
        />

        <Route 
          path="/dashboard" 
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
        />

        <Route 
          path="/campaigns" 
          element={<ProtectedRoute><Campaigns /></ProtectedRoute>} 
        />

        {/* VIEW CAMPAIGN ROUTE */}
        <Route 
          path="/campaign/view/:id" 
          element={<ProtectedRoute><ViewCampaign /></ProtectedRoute>} 
        />

        {/* EDIT CAMPAIGN ROUTE */}
        <Route 
          path="/campaign/edit/:id" 
          element={<ProtectedRoute><EditCampaign /></ProtectedRoute>} 
        />

        <Route 
          path="/create-campaign" 
          element={<ProtectedRoute><CreateCampaign /></ProtectedRoute>} 
        />

        <Route 
          path="/profile" 
          element={<ProtectedRoute><Profile /></ProtectedRoute>} 
        />

        {/* Fallback to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;