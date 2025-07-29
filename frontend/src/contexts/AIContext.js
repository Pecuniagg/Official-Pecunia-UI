import React, { createContext, useContext, useState, useEffect } from 'react';
import aiService from '../services/aiService';
import { mockData } from '../data/mockData';

const AIContext = createContext();

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};

export const AIProvider = ({ children }) => {
  const [aiInsights, setAiInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState({
    monthly_budget: 5000,
    monthly_income: 6500,
    monthly_expenses: 3750,
    savings_rate: 23,
    pecunia_score: 782,
    total_assets: 56000,
    total_liabilities: 10000,
    emergency_fund: 8500,
    age: 28,
    expenses: mockData.dashboard.expenses,
    goals: mockData.goals.personal
  });

  const [chatHistory, setChatHistory] = useState([]);

  // Get AI insights
  const getInsights = async (customData = null) => {
    setLoading(true);
    try {
      const data = customData || userProfile;
      const insights = await aiService.getComprehensiveAnalysis(data);
      setAiInsights(insights);
      return insights;
    } catch (error) {
      console.error('Failed to get AI insights:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Chat with AI
  const chatWithAI = async (message) => {
    try {
      const response = await aiService.chat(message, userProfile);
      
      const newMessage = {
        id: Date.now(),
        type: 'user',
        content: message,
        timestamp: new Date()
      };
      
      const aiResponse = {
        id: Date.now() + 1,
        type: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      setChatHistory(prev => [...prev, newMessage, aiResponse]);
      return response;
    } catch (error) {
      console.error('Chat error:', error);
      const errorResponse = "I'm having trouble processing your request right now. Please try again in a moment!";
      
      const aiResponse = {
        id: Date.now() + 1,
        type: 'assistant',
        content: errorResponse,
        timestamp: new Date()
      };
      
      setChatHistory(prev => [...prev, aiResponse]);
      return errorResponse;
    }
  };

  // Get goal strategy
  const getGoalStrategy = async (goal) => {
    try {
      return await aiService.generateGoalStrategy(goal);
    } catch (error) {
      console.error('Goal strategy error:', error);
      return null;
    }
  };

  // Create travel plan
  const createTravelPlan = async (preferences) => {
    try {
      return await aiService.createTravelPlan(preferences);
    } catch (error) {
      console.error('Travel plan error:', error);
      return null;
    }
  };

  // Analyze spending
  const analyzeSpending = async (transactions) => {
    try {
      return await aiService.analyzeSpending(transactions);
    } catch (error) {
      console.error('Spending analysis error:', error);
      return null;
    }
  };

  // Get personalized recommendations
  const getRecommendations = async () => {
    try {
      return await aiService.getPersonalizedRecommendations(userProfile);
    } catch (error) {
      console.error('Recommendations error:', error);
      return [];
    }
  };

  // Get financial predictions
  const getPredictions = async () => {
    try {
      return await aiService.getFinancialPredictions(userProfile);
    } catch (error) {
      console.error('Predictions error:', error);
      return {};
    }
  };

  // Smart budget optimization
  const optimizeBudget = async (spendingData) => {
    try {
      return await aiService.getBudgetOptimization(userProfile, spendingData);
    } catch (error) {
      console.error('Budget optimization error:', error);
      return { insights: [], optimization: [], alerts: [] };
    }
  };

  // Update user profile
  const updateUserProfile = async (newData) => {
    const updatedProfile = { ...userProfile, ...newData };
    setUserProfile(updatedProfile);
    
    // Automatically refresh insights with new data
    if (Object.keys(newData).length > 0) {
      await getInsights(updatedProfile);
    }
  };

  // Initialize AI insights on load
  useEffect(() => {
    getInsights();
  }, []);

  const value = {
    // State
    aiInsights,
    loading,
    userProfile,
    chatHistory,
    
    // Actions
    getInsights,
    chatWithAI,
    getGoalStrategy,
    createTravelPlan,
    analyzeSpending,
    getRecommendations,
    getPredictions,
    optimizeBudget,
    updateUserProfile,
    setChatHistory,
    
    // Utility functions
    isAIAvailable: () => !loading && aiInsights !== null,
    getAIInsightByType: (type) => {
      return aiInsights?.insights?.find(insight => insight.type === type) || null;
    },
    getRecommendationsByCategory: (category) => {
      return aiInsights?.recommendations?.filter(rec => rec.category === category) || [];
    }
  };

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  );
};