import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

class AIService {
  // Chat with AI assistant
  async chat(message, userContext = null) {
    try {
      const response = await axios.post(`${API}/ai/chat`, {
        message,
        user_context: userContext
      });
      return response.data.response;
    } catch (error) {
      console.error('AI Chat Error:', error);
      throw new Error('Unable to communicate with AI assistant');
    }
  }

  // Get comprehensive financial insights
  async getFinancialInsights(userData) {
    try {
      const response = await axios.post(`${API}/ai/financial-insights`, userData);
      return response.data;
    } catch (error) {
      console.error('Financial Insights Error:', error);
      throw new Error('Unable to generate financial insights');
    }
  }

  // Get goal achievement strategy
  async getGoalStrategy(goal, userContext) {
    try {
      const response = await axios.post(`${API}/ai/goal-strategy`, {
        goal,
        user_context: userContext
      });
      return response.data;
    } catch (error) {
      console.error('Goal Strategy Error:', error);
      throw new Error('Unable to generate goal strategy');
    }
  }

  // Create travel plan
  async createTravelPlan(preferences) {
    try {
      const response = await axios.post(`${API}/ai/travel-plan`, preferences);
      return response.data;
    } catch (error) {
      console.error('Travel Plan Error:', error);
      throw new Error('Unable to create travel plan');
    }
  }

  // Analyze spending patterns
  async analyzeSpending(transactions) {
    try {
      const response = await axios.post(`${API}/ai/spending-analysis`, {
        transactions
      });
      return response.data;
    } catch (error) {
      console.error('Spending Analysis Error:', error);
      throw new Error('Unable to analyze spending patterns');
    }
  }

  // Generate personalized recommendations based on user data
  async getPersonalizedRecommendations(userData) {
    try {
      const insights = await this.getFinancialInsights(userData);
      return insights.recommendations || [];
    } catch (error) {
      console.error('Recommendations Error:', error);
      return [];
    }
  }

  // Get AI predictions and forecasts
  async getFinancialPredictions(userData) {
    try {
      const insights = await this.getFinancialInsights(userData);
      return insights.predictions || {};
    } catch (error) {
      console.error('Predictions Error:', error);
      return {};
    }
  }

  // Smart budget optimization suggestions
  async getBudgetOptimization(budgetData, spendingData) {
    try {
      const [insights, spendingAnalysis] = await Promise.all([
        this.getFinancialInsights(budgetData),
        this.analyzeSpending(spendingData)
      ]);
      
      return {
        insights: insights.insights || [],
        optimization: spendingAnalysis.optimization || [],
        alerts: spendingAnalysis.alerts || []
      };
    } catch (error) {
      console.error('Budget Optimization Error:', error);
      return { insights: [], optimization: [], alerts: [] };
    }
  }

  // Investment suggestions based on user profile
  async getInvestmentSuggestions(userProfile) {
    try {
      const message = `Based on my financial profile, what investment options would you recommend? 
        I have ${userProfile.monthly_income} monthly income, ${userProfile.savings_rate}% savings rate, 
        and ${userProfile.risk_tolerance || 'moderate'} risk tolerance.`;
      
      const response = await this.chat(message, userProfile);
      return response;
    } catch (error) {
      console.error('Investment Suggestions Error:', error);
      return 'Unable to generate investment suggestions at this time.';
    }
  }

  // Smart goal prioritization
  async prioritizeGoals(goals, userContext) {
    try {
      const strategies = await Promise.all(
        goals.map(goal => this.getGoalStrategy(goal, userContext))
      );
      
      return goals.map((goal, index) => ({
        ...goal,
        aiStrategy: strategies[index],
        priority: strategies[index].feasibility === 'achievable' ? 'high' : 
                 strategies[index].feasibility === 'challenging' ? 'medium' : 'low'
      }));
    } catch (error) {
      console.error('Goal Prioritization Error:', error);
      return goals;
    }
  }

  // Market insights and trends
  async getMarketInsights() {
    try {
      const message = "What are the current market trends and insights I should be aware of for personal finance and investments?";
      const response = await this.chat(message);
      return response;
    } catch (error) {
      console.error('Market Insights Error:', error);
      return 'Market insights are currently unavailable.';
    }
  }

  // Debt payoff strategy
  async getDebtPayoffStrategy(debts, userContext) {
    try {
      const message = `Help me create a debt payoff strategy. My debts: ${JSON.stringify(debts)}. 
        My monthly income: $${userContext.monthly_income}, expenses: $${userContext.monthly_expenses}.`;
      
      const response = await this.chat(message, userContext);
      return response;
    } catch (error) {
      console.error('Debt Strategy Error:', error);
      return 'Unable to generate debt payoff strategy.';
    }
  }

  // Retirement planning insights
  async getRetirementPlanning(userProfile) {
    try {
      const message = `Analyze my retirement readiness. I'm ${userProfile.age} years old, 
        saving ${userProfile.savings_rate}% of income, with ${userProfile.total_assets} in assets.`;
      
      const response = await this.chat(message, userProfile);
      return response;
    } catch (error) {
      console.error('Retirement Planning Error:', error);
      return 'Retirement planning insights are currently unavailable.';
    }
  }

  // Tax optimization suggestions
  async getTaxOptimization(userProfile) {
    try {
      const message = `What tax optimization strategies would you recommend based on my financial situation?`;
      const response = await this.chat(message, userProfile);
      return response;
    } catch (error) {
      console.error('Tax Optimization Error:', error);
      return 'Tax optimization suggestions are currently unavailable.';
    }
  }
}

// Export singleton instance
export const aiService = new AIService();
export default aiService;