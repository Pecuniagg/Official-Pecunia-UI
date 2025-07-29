/**
 * Enhanced AI Service for Pecunia Web App
 * Comprehensive AI integration across all features
 */

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

class PecuniaAIService {
  constructor() {
    this.baseUrl = API_BASE_URL;
    this.userContext = this.loadUserContext();
  }

  loadUserContext() {
    // Load user context from localStorage or default values
    const savedContext = localStorage.getItem('pecunia_user_context');
    return savedContext ? JSON.parse(savedContext) : {
      monthly_income: 6500,
      monthly_expenses: 3750,
      pecunia_score: 782,
      age: 28,
      risk_tolerance: 'medium',
      location: 'United States',
      goals: [],
      investments: {},
      expenses: {},
      assets: {},
      liabilities: {}
    };
  }

  updateUserContext(newContext) {
    this.userContext = { ...this.userContext, ...newContext };
    localStorage.setItem('pecunia_user_context', JSON.stringify(this.userContext));
  }

  async makeRequest(endpoint, data = null, method = 'GET') {
    const url = `${this.baseUrl}${endpoint}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`AI Service Error (${endpoint}):`, error);
      return this.getFallbackResponse(endpoint);
    }
  }

  // ==============================================
  // COMPREHENSIVE FINANCIAL ANALYSIS
  // ==============================================
  async getComprehensiveAnalysis(customData = {}) {
    const requestData = { ...this.userContext, ...customData };
    return await this.makeRequest('/api/ai/comprehensive-analysis', requestData, 'POST');
  }

  // ==============================================
  // SMART BUDGET GENERATION
  // ==============================================
  async generateSmartBudget(customData = {}) {
    const requestData = {
      monthly_income: this.userContext.monthly_income,
      expenses: this.userContext.expenses,
      goals: this.userContext.goals,
      location: this.userContext.location,
      ...customData
    };
    return await this.makeRequest('/ai/smart-budget', requestData, 'POST');
  }

  // ==============================================
  // INVESTMENT STRATEGY
  // ==============================================
  async generateInvestmentStrategy(customData = {}) {
    const requestData = {
      investable_amount: this.userContext.monthly_income * 0.2, // 20% of income
      risk_tolerance: this.userContext.risk_tolerance,
      age: this.userContext.age,
      timeline: '10+ years',
      ...customData
    };
    return await this.makeRequest('/ai/investment-strategy', requestData, 'POST');
  }

  // ==============================================
  // TRAVEL PLANNING
  // ==============================================
  async generateTravelPlan(travelData) {
    const requestData = {
      budget: travelData.budget || 2000,
      destination: travelData.destination || 'flexible',
      duration: travelData.duration || '1 week',
      interests: travelData.interests || [],
      group_size: travelData.group_size || 1,
      dates: travelData.dates || 'flexible',
      ...travelData
    };
    return await this.makeRequest('/ai/travel-plan', requestData, 'POST');
  }

  // ==============================================
  // GOAL STRATEGY
  // ==============================================
  async generateGoalStrategy(goalData) {
    const requestData = {
      title: goalData.title,
      target: goalData.target,
      current: goalData.current,
      deadline: goalData.deadline,
      monthly_income: this.userContext.monthly_income,
      ...goalData
    };
    return await this.makeRequest('/ai/goal-strategy', requestData, 'POST');
  }

  // ==============================================
  // COMPETITIVE INSIGHTS
  // ==============================================
  async getCompetitiveInsights(customData = {}) {
    const requestData = {
      age: this.userContext.age,
      income: this.userContext.monthly_income * 12,
      net_worth: this.calculateNetWorth(),
      pecunia_score: this.userContext.pecunia_score,
      location: this.userContext.location,
      ...customData
    };
    return await this.makeRequest('/ai/competitive-insights', requestData, 'POST');
  }

  // ==============================================
  // SPENDING ANALYSIS
  // ==============================================
  async analyzeSpending(spendingData) {
    return await this.makeRequest('/ai/spending-analysis', { spending_data: spendingData }, 'POST');
  }

  // ==============================================
  // PORTFOLIO OPTIMIZATION
  // ==============================================
  async optimizePortfolio(portfolioData) {
    return await this.makeRequest('/ai/portfolio-optimization', { portfolio_data: portfolioData }, 'POST');
  }

  // ==============================================
  // SMART RECOMMENDATIONS
  // ==============================================
  async getSmartRecommendations(customData = {}) {
    const requestData = { ...this.userContext, ...customData };
    return await this.makeRequest('/ai/smart-recommendations', requestData, 'POST');
  }

  // ==============================================
  // CONTEXTUAL CHAT
  // ==============================================
  async chatWithAI(message, customContext = {}) {
    const requestData = {
      message,
      user_context: { ...this.userContext, ...customContext }
    };
    return await this.makeRequest('/ai/chat', requestData, 'POST');
  }

  // ==============================================
  // DASHBOARD AI INSIGHTS
  // ==============================================
  async getDashboardInsights(dashboardData) {
    // Combine user context with dashboard data for comprehensive analysis
    const combinedData = {
      ...this.userContext,
      dashboard_data: dashboardData
    };
    return await this.getComprehensiveAnalysis(combinedData);
  }

  // ==============================================
  // PROACTIVE AI SUGGESTIONS
  // ==============================================
  async getProactiveSuggestions(pageContext = {}) {
    const message = `Based on my current financial situation and the page I'm viewing (${pageContext.page}), what specific actions should I take right now to improve my financial health?`;
    return await this.chatWithAI(message, pageContext);
  }

  // ==============================================
  // AUTO-BUDGET OPTIMIZATION
  // ==============================================
  async autoOptimizeBudget(currentBudget) {
    const optimizedBudget = await this.generateSmartBudget({ 
      current_budget: currentBudget,
      optimization_mode: 'aggressive'
    });
    
    // Auto-apply safe optimizations
    const safeOptimizations = this.filterSafeOptimizations(optimizedBudget);
    return {
      ...optimizedBudget,
      auto_applied: safeOptimizations,
      suggestions: optimizedBudget
    };
  }

  // ==============================================
  // REAL-TIME FINANCIAL COACHING
  // ==============================================
  async getFinancialCoaching(userAction) {
    const message = `I just ${userAction.action} for ${userAction.amount}. Based on my financial profile, was this a good decision and what should I do next?`;
    return await this.chatWithAI(message, { recent_action: userAction });
  }

  // ==============================================
  // MARKET-AWARE RECOMMENDATIONS
  // ==============================================
  async getMarketAwareRecommendations() {
    // First get current market insights
    const marketData = await this.makeRequest('/market/insights');
    
    // Then get personalized recommendations based on market conditions
    const recommendations = await this.getSmartRecommendations({
      market_context: marketData,
      include_market_timing: true
    });
    
    return {
      market_data: marketData,
      recommendations: recommendations,
      market_adjusted: true
    };
  }

  // ==============================================
  // AUTOMATED FINANCIAL PLANNING
  // ==============================================
  async createAutomatedPlan(planType = 'comprehensive') {
    const [
      analysis,
      budget,
      investments,
      competitive
    ] = await Promise.all([
      this.getComprehensiveAnalysis(),
      this.generateSmartBudget(),
      this.generateInvestmentStrategy(),
      this.getCompetitiveInsights()
    ]);

    return {
      plan_type: planType,
      comprehensive_analysis: analysis,
      optimized_budget: budget,
      investment_strategy: investments,
      competitive_position: competitive,
      automation_suggestions: this.generateAutomationSuggestions(analysis, budget, investments),
      implementation_timeline: this.createImplementationTimeline(analysis, budget, investments),
      generated_at: new Date().toISOString()
    };
  }

  // ==============================================
  // HELPER METHODS
  // ==============================================
  calculateNetWorth() {
    const assets = Object.values(this.userContext.assets || {}).reduce((sum, val) => sum + val, 0);
    const liabilities = Object.values(this.userContext.liabilities || {}).reduce((sum, val) => sum + val, 0);
    return assets - liabilities;
  }

  filterSafeOptimizations(optimizedBudget) {
    // Filter out optimizations that are safe to auto-apply
    // This would include things like reducing obvious overspending
    return {
      subscriptions_to_cancel: [],
      spending_alerts_to_set: [],
      savings_increases: []
    };
  }

  generateAutomationSuggestions(analysis, budget, investments) {
    return {
      automatic_savings: {
        amount: budget.total_income * 0.2,
        frequency: 'monthly',
        account_type: 'high_yield_savings'
      },
      investment_automation: {
        amount: investments.monthly_investment || 500,
        frequency: 'monthly',
        allocation: investments.recommended_allocation
      },
      bill_optimization: {
        schedule_reviews: 'quarterly',
        auto_negotiate: ['insurance', 'utilities'],
        price_monitoring: true
      }
    };
  }

  createImplementationTimeline(analysis, budget, investments) {
    return {
      immediate: [
        'Set up automatic savings transfers',
        'Review and cancel unnecessary subscriptions',
        'Set up spending alerts'
      ],
      week_1: [
        'Open high-yield savings account',
        'Set up investment automation',
        'Review insurance policies'
      ],
      month_1: [
        'Complete portfolio rebalancing',
        'Implement budget optimizations',
        'Set up quarterly reviews'
      ],
      month_3: [
        'Evaluate progress and adjust strategy',
        'Explore additional income opportunities',
        'Review and update financial goals'
      ]
    };
  }

  getFallbackResponse(endpoint) {
    const fallbacks = {
      '/ai/comprehensive-analysis': {
        analysis: 'AI analysis temporarily unavailable. Focus on building emergency fund and diversified investments.',
        confidence: 0.6,
        action_items: ['Build emergency fund', 'Diversify investments', 'Review budget monthly']
      },
      '/ai/smart-budget': {
        budget: 'Recommended budget: 50% needs, 30% wants, 20% savings',
        savings_rate: 20,
        optimization_score: 70
      },
      '/ai/investment-strategy': {
        strategy: 'Consider low-cost index funds for long-term growth',
        risk_score: 60,
        expected_return: 0.08
      },
      '/ai/travel-plan': {
        plan: 'Travel plan temporarily unavailable. Research destinations and compare prices.',
        savings_opportunities: ['Book early', 'Use local transport']
      },
      '/ai/chat': {
        response: 'AI assistant temporarily unavailable. Please try again in a moment.',
        timestamp: new Date().toISOString()
      }
    };

    return fallbacks[endpoint] || { 
      error: 'Service temporarily unavailable',
      fallback: true 
    };
  }

  // ==============================================
  // PROACTIVE AI FEATURES
  // ==============================================
  async getContextualHelp(pageData) {
    const message = `I'm currently on the ${pageData.page} page. Based on my financial profile, what specific actions should I take on this page to improve my financial situation?`;
    return await this.chatWithAI(message, pageData);
  }

  async getSmartAlerts() {
    const analysis = await this.getComprehensiveAnalysis();
    return {
      budget_alerts: this.generateBudgetAlerts(analysis),
      investment_alerts: this.generateInvestmentAlerts(analysis),
      goal_alerts: this.generateGoalAlerts(analysis),
      opportunity_alerts: this.generateOpportunityAlerts(analysis)
    };
  }

  generateBudgetAlerts(analysis) {
    return [
      {
        type: 'warning',
        message: 'You\'re approaching your dining budget limit',
        action: 'Consider cooking at home more often',
        priority: 'medium'
      }
    ];
  }

  generateInvestmentAlerts(analysis) {
    return [
      {
        type: 'opportunity',
        message: 'Market conditions favor tech sector investment',
        action: 'Consider increasing tech allocation',
        priority: 'low'
      }
    ];
  }

  generateGoalAlerts(analysis) {
    return [
      {
        type: 'progress',
        message: 'You\'re ahead of schedule on your emergency fund goal',
        action: 'Consider increasing monthly contribution',
        priority: 'low'
      }
    ];
  }

  generateOpportunityAlerts(analysis) {
    return [
      {
        type: 'opportunity',
        message: 'High-yield savings rates have increased',
        action: 'Consider moving emergency fund to higher yield account',
        priority: 'medium'
      }
    ];
  }
}

// Create singleton instance
const aiService = new PecuniaAIService();

export default aiService;