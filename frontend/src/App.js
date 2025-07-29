import React from "react";
import "./App.css";
import "./styles/animations.css";
import "./styles/pecunia-theme.css";
import "./styles/ai-assistant-refined.css";
import "./styles/compare-refined.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AIProvider } from "./contexts/AIContext";
import { Toaster } from "./components/ui/toaster";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Goals from "./pages/Goals";
import Feed from "./pages/Feed";
import Planner from "./pages/Planner";
import Profile from "./pages/Profile";
import Compare from "./pages/Compare";
import AuthPage from "./components/auth/AuthPage";
import OnboardingPage from "./components/auth/OnboardingPage";

// Protected Routes Component
const ProtectedRoutes = () => {
  const { isAuthenticated, onboardingComplete, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-purple-200 border-t-[#5945a3] rounded-full animate-spin"></div>
          <span className="text-lg font-medium text-gray-700 dark:text-gray-300">Loading Pecunia...</span>
        </div>
      </div>
    );
  }

  // Show authentication page if not authenticated
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  // Show onboarding page if not completed
  if (!onboardingComplete) {
    return <OnboardingPage />;
  }

  // Show main app if authenticated and onboarding complete
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/compare" element={<Compare />} />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <AIProvider>
          <BrowserRouter>
            <ProtectedRoutes />
            <Toaster />
          </BrowserRouter>
        </AIProvider>
      </AuthProvider>
    </div>
  );
}

export default App;