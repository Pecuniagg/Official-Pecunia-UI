import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '../hooks/use-toast';

const AuthContext = createContext();

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const { toast } = useToast();

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('pecunia_token');
      if (token) {
        try {
          const response = await fetch(`${BACKEND_URL}/api/auth/verify`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
            setIsAuthenticated(true);
            setOnboardingComplete(data.onboarding_complete);
          } else {
            // Invalid token, remove it
            localStorage.removeItem('pecunia_token');
            setUser(null);
            setIsAuthenticated(false);
            setOnboardingComplete(false);
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('pecunia_token');
          setUser(null);
          setIsAuthenticated(false);
          setOnboardingComplete(false);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const register = async (userData) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Registration failed');
      }

      // Store token and update state
      localStorage.setItem('pecunia_token', data.access_token);
      setUser(data.user);
      setIsAuthenticated(true);
      setOnboardingComplete(data.user.onboarding_complete);

      toast({
        title: "Welcome to Pecunia! 🎉",
        description: `Registration successful. Welcome, ${data.user.name}!`,
      });

      return { success: true, user: data.user };
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  const login = async (credentials) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Login failed');
      }

      // Store token and update state
      localStorage.setItem('pecunia_token', data.access_token);
      setUser(data.user);
      setIsAuthenticated(true);
      setOnboardingComplete(data.user.onboarding_complete);

      toast({
        title: "Welcome back! 👋",
        description: `Successfully logged in as ${data.user.name}`,
      });

      return { success: true, user: data.user };
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: error.message || "Please check your credentials",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  const completeOnboarding = async (onboardingData) => {
    try {
      const token = localStorage.getItem('pecunia_token');
      const response = await fetch(`${BACKEND_URL}/api/auth/onboarding`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(onboardingData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Onboarding failed');
      }

      // Update state
      setUser(data.user);
      setOnboardingComplete(true);

      toast({
        title: "Onboarding Complete! 🚀",
        description: "Your Pecunia experience is now personalized!",
      });

      return { success: true, user: data.user };
    } catch (error) {
      console.error('Onboarding error:', error);
      toast({
        title: "Onboarding Failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('pecunia_token');
    setUser(null);
    setIsAuthenticated(false);
    setOnboardingComplete(false);
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  const value = {
    user,
    isAuthenticated,
    onboardingComplete,
    loading,
    register,
    login,
    logout,
    completeOnboarding,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};