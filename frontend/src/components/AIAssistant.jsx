import React, { useState, useEffect, useRef } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Loader2, 
  Brain, 
  TrendingUp, 
  Target, 
  DollarSign, 
  PiggyBank,
  Plane,
  BarChart3,
  Lightbulb,
  Zap,
  CheckCircle,
  ArrowRight,
  RefreshCw,
  Bell,
  Shield
} from 'lucide-react';
import { useAI } from '../contexts/AIContext';
import aiService from '../services/aiService';

const AIAssistant = ({ isOpen, onClose }) => {
  const { chatHistory, userProfile, loading } = useAI();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [quickActions, setQuickActions] = useState([]);
  const [localChatHistory, setLocalChatHistory] = useState([]);
  const [smartSuggestions, setSmartSuggestions] = useState([]);
  const messagesEndRef = useRef(null);

  // Enhanced suggested prompts with categories
  const suggestedPrompts = {
    financial_analysis: [
      "Analyze my complete financial situation and give me a comprehensive strategy",
      "How do I compare to others in my age group financially?",
      "What's my biggest financial opportunity right now?",
      "Create an automated financial plan for me"
    ],
    budgeting: [
      "Optimize my budget to save more money",
      "Where am I overspending and how can I fix it?",
      "Create a smart budget that maximizes my savings",
      "Set up automatic savings for me"
    ],
    investing: [
      "What should I invest in right now with current market conditions?",
      "Create a personalized investment strategy for me",
      "How should I diversify my portfolio?",
      "What ETFs should I buy this month?"
    ],
    goals: [
      "Help me create a plan to achieve my financial goals",
      "How can I save for a house down payment faster?",
      "What's the best retirement saving strategy for me?",
      "Create an emergency fund plan"
    ],
    travel: [
      "Plan a budget-friendly vacation for me",
      "How can I save money on my next trip?",
      "Create a complete travel itinerary with budget",
      "Find the best travel deals for my budget"
    ]
  };

  useEffect(() => {
    loadSmartSuggestions();
  }, []);

  const loadSmartSuggestions = async () => {
    try {
      const suggestions = await aiService.getProactiveSuggestions({
        page: 'ai_assistant',
        context: 'chat_interface'
      });
      setSmartSuggestions([suggestions.response]);
    } catch (error) {
      console.error('Error loading smart suggestions:', error);
    }
  };

  const handleSend = async () => {
    if (!message.trim() || isTyping) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setLocalChatHistory(prev => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);

    try {
      // Determine the type of request and handle accordingly
      const messageType = determineMessageType(message);
      let response;

      switch (messageType) {
        case 'comprehensive_analysis':
          setCurrentTask('Analyzing your complete financial situation...');
          response = await aiService.getComprehensiveAnalysis();
          break;
        case 'budget_optimization':
          setCurrentTask('Optimizing your budget...');
          response = await aiService.generateSmartBudget();
          break;
        case 'investment_strategy':
          setCurrentTask('Creating your investment strategy...');
          response = await aiService.generateInvestmentStrategy();
          break;
        case 'competitive_insights':
          setCurrentTask('Comparing you to your peers...');
          response = await aiService.getCompetitiveInsights();
          break;
        case 'travel_planning':
          setCurrentTask('Planning your trip...');
          const travelData = extractTravelData(message);
          response = await aiService.generateTravelPlan(travelData);
          break;
        case 'goal_strategy':
          setCurrentTask('Creating your goal strategy...');
          const goalData = extractGoalData(message);
          response = await aiService.generateGoalStrategy(goalData);
          break;
        default:
          setCurrentTask('Thinking...');
          response = await aiService.chatWithAI(message, {
            page: 'ai_assistant',
            user_context: aiService.userContext
          });
      }

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: formatAIResponse(response, messageType),
        timestamp: new Date(),
        messageType: messageType,
        rawResponse: response
      };

      setLocalChatHistory(prev => [...prev, aiMessage]);
      
      // Generate quick actions based on the response
      generateQuickActions(response, messageType);

    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: "I apologize, but I'm having trouble processing that request. Please try again or rephrase your question.",
        timestamp: new Date()
      };
      setLocalChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      setCurrentTask(null);
    }
  };

  const determineMessageType = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('comprehensive') || lowerMessage.includes('complete analysis') || lowerMessage.includes('financial situation')) {
      return 'comprehensive_analysis';
    }
    if (lowerMessage.includes('budget') || lowerMessage.includes('optimize') || lowerMessage.includes('save money')) {
      return 'budget_optimization';
    }
    if (lowerMessage.includes('invest') || lowerMessage.includes('portfolio') || lowerMessage.includes('stocks') || lowerMessage.includes('market')) {
      return 'investment_strategy';
    }
    if (lowerMessage.includes('compare') || lowerMessage.includes('peers') || lowerMessage.includes('age group')) {
      return 'competitive_insights';
    }
    if (lowerMessage.includes('travel') || lowerMessage.includes('trip') || lowerMessage.includes('vacation')) {
      return 'travel_planning';
    }
    if (lowerMessage.includes('goal') || lowerMessage.includes('save for') || lowerMessage.includes('achieve')) {
      return 'goal_strategy';
    }
    
    return 'general_chat';
  };

  const extractTravelData = (message) => {
    // Extract travel data from message (basic implementation)
    const budgetMatch = message.match(/\$?(\d+(?:,\d+)?)/);
    const budget = budgetMatch ? parseInt(budgetMatch[1].replace(',', '')) : 2000;
    
    return {
      budget: budget,
      destination: 'flexible',
      duration: '1 week',
      interests: ['sightseeing', 'food', 'culture'],
      group_size: 1
    };
  };

  const extractGoalData = (message) => {
    // Extract goal data from message (basic implementation)
    const amountMatch = message.match(/\$?(\d+(?:,\d+)?)/);
    const amount = amountMatch ? parseInt(amountMatch[1].replace(',', '')) : 10000;
    
    return {
      title: 'Financial Goal',
      target: amount,
      current: amount * 0.2,
      deadline: '2025-12-31',
      monthly_income: aiService.userContext.monthly_income
    };
  };

  const formatAIResponse = (response, messageType) => {
    switch (messageType) {
      case 'comprehensive_analysis':
        return `📊 **Comprehensive Financial Analysis**\n\n${response.analysis}\n\n**Key Action Items:**\n${response.action_items?.map(item => `• ${item}`).join('\n') || 'Analysis complete'}`;
      
      case 'budget_optimization':
        return `💰 **Smart Budget Optimization**\n\n${response.budget}\n\n**Savings Rate:** ${response.savings_rate}%\n**Optimization Score:** ${response.optimization_score}/100`;
      
      case 'investment_strategy':
        return `📈 **Investment Strategy**\n\n${response.strategy}\n\n**Expected Return:** ${(response.expected_return * 100).toFixed(1)}%\n**Risk Level:** ${response.risk_score}/100\n**Rebalance:** ${response.rebalance_frequency}`;
      
      case 'competitive_insights':
        return `🏆 **Competitive Analysis**\n\n${response.insights}\n\n**Your Ranking:** ${response.percentile_ranking}th percentile\n**Competitive Score:** ${response.competitive_score}/100`;
      
      case 'travel_planning':
        return `✈️ **Travel Plan**\n\n${response.plan}\n\n**Budget:** $${response.total_budget?.toLocaleString()}\n**Savings Tips:** ${response.savings_opportunities?.join(', ')}`;
      
      case 'goal_strategy':
        return `🎯 **Goal Strategy**\n\n${response.strategy}\n\n**Monthly Target:** $${response.monthly_target?.toLocaleString()}\n**Success Probability:** ${Math.round(response.probability_of_success * 100)}%`;
      
      default:
        return response.response || response.analysis || response;
    }
  };

  const generateQuickActions = (response, messageType) => {
    const actions = [];
    
    switch (messageType) {
      case 'comprehensive_analysis':
        actions.push(
          { text: 'Optimize My Budget', action: 'budget_optimization', icon: PiggyBank },
          { text: 'Create Investment Plan', action: 'investment_strategy', icon: TrendingUp },
          { text: 'Set Up Goals', action: 'goal_planning', icon: Target }
        );
        break;
      case 'budget_optimization':
        actions.push(
          { text: 'Automate Savings', action: 'automate_savings', icon: Zap },
          { text: 'Track Expenses', action: 'track_expenses', icon: BarChart3 },
          { text: 'Set Alerts', action: 'set_alerts', icon: Bell }
        );
        break;
      case 'investment_strategy':
        actions.push(
          { text: 'View ETF Recommendations', action: 'etf_recommendations', icon: TrendingUp },
          { text: 'Risk Assessment', action: 'risk_assessment', icon: Shield },
          { text: 'Portfolio Review', action: 'portfolio_review', icon: BarChart3 }
        );
        break;
    }
    
    setQuickActions(actions);
  };

  const handlePromptClick = async (prompt) => {
    if (isTyping) return;
    setMessage(prompt);
    await handleSend();
  };

  const handleQuickAction = async (action) => {
    const actionMessages = {
      'budget_optimization': 'Create an optimized budget plan for me',
      'investment_strategy': 'What should I invest in right now?',
      'goal_planning': 'Help me set up my financial goals',
      'automate_savings': 'How can I automate my savings?',
      'track_expenses': 'Show me how to track my expenses better',
      'set_alerts': 'Set up spending alerts for me'
    };
    
    const message = actionMessages[action] || 'Help me with this task';
    setMessage(message);
    await handleSend();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [localChatHistory]);

  const allMessages = [...chatHistory, ...localChatHistory];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[480px] p-0 flex flex-col animate-slide-in-bottom">
        <SheetHeader className="p-6 border-b animate-entrance-down bg-gradient-to-r from-[#5945a3] to-[#b37e91] text-white">
          <SheetTitle className="flex items-center gap-2">
            <Brain className="text-white icon-premium" size={24} />
            Pecunia AI Assistant
          </SheetTitle>
          <p className="text-sm text-white/90 text-left animate-fade-in-up animate-stagger-1">
            Your intelligent financial advisor powered by GPT-4
          </p>
        </SheetHeader>

        {/* Current Task Indicator */}
        {currentTask && (
          <div className="px-6 py-3 bg-blue-50 border-b animate-pulse">
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin text-blue-600" size={16} />
              <span className="text-sm text-blue-800">{currentTask}</span>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {allMessages.length === 0 && (
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 animate-scale-in">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="text-[#5945a3] icon-premium" size={16} />
                  <span className="font-medium">Welcome to Pecunia AI!</span>
                </div>
                <p className="text-sm text-gray-700 animate-fade-in-up animate-stagger-1">
                  I'm your comprehensive financial advisor. I can analyze your finances, create budgets, 
                  plan investments, organize travel, and much more. I'll handle the heavy lifting so you can focus on achieving your goals!
                </p>
              </CardContent>
            </Card>
          )}

          {allMessages.map((msg, index) => (
            <div
              key={msg.id}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} ai-insight animate-fade-in-up`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Card className={`max-w-[85%] card-premium ${
                msg.type === 'user' 
                  ? 'bg-[#5945a3] text-white animate-fade-in-right' 
                  : 'bg-white border-gray-200 animate-fade-in-left hover-glow-subtle'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {msg.type === 'ai' && (
                      <Brain className="text-[#5945a3] mt-1 flex-shrink-0" size={16} />
                    )}
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                      {msg.messageType && (
                        <Badge 
                          variant="secondary" 
                          className="mt-2 bg-[#5945a3]/10 text-[#5945a3] text-xs"
                        >
                          {msg.messageType.replace('_', ' ')}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <span className="text-xs opacity-70 mt-2 block">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </CardContent>
              </Card>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <Card className="bg-gray-50 border-gray-200 animate-scale-in">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Brain className="text-[#5945a3] animate-pulse" size={16} />
                    <div className="flex items-center gap-2">
                      <Loader2 className="animate-spin text-[#5945a3]" size={16} />
                      <span className="text-sm text-gray-600">AI is analyzing and thinking...</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        {quickActions.length > 0 && (
          <div className="px-6 py-3 border-t bg-gray-50 animate-fade-in-up">
            <p className="text-sm font-medium text-gray-700 mb-2">Quick Actions:</p>
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="btn-premium text-xs flex items-center gap-1"
                  onClick={() => handleQuickAction(action.action)}
                >
                  <action.icon size={12} />
                  {action.text}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Suggested Prompts */}
        {allMessages.length === 0 && !isTyping && (
          <div className="px-6 pb-4 max-h-60 overflow-y-auto animate-fade-in-up animate-stagger-2">
            <p className="text-sm text-gray-600 mb-3 font-medium">What can I help you with?</p>
            
            {Object.entries(suggestedPrompts).map(([category, prompts]) => (
              <div key={category} className="mb-4">
                <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1">
                  {category === 'financial_analysis' && <BarChart3 size={12} />}
                  {category === 'budgeting' && <PiggyBank size={12} />}
                  {category === 'investing' && <TrendingUp size={12} />}
                  {category === 'goals' && <Target size={12} />}
                  {category === 'travel' && <Plane size={12} />}
                  {category.replace('_', ' ').toUpperCase()}
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {prompts.slice(0, 2).map((prompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="justify-start text-left h-auto p-3 hover:bg-[#5945a3] hover:text-white transition-all btn-premium text-xs"
                      onClick={() => handlePromptClick(prompt)}
                      disabled={isTyping}
                    >
                      <Sparkles size={12} className="mr-2 flex-shrink-0" />
                      <span>{prompt}</span>
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Context Info */}
        {userProfile && (
          <div className="px-6 pb-2 animate-fade-in-up animate-stagger-4">
            <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Brain size={12} className="text-[#5945a3]" />
                <strong>AI Context:</strong>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span>Score: {userProfile.pecunia_score}</span>
                <span>Budget: ${userProfile.monthly_budget?.toLocaleString()}</span>
                <span>Savings: {userProfile.savings_rate}%</span>
                <span>Age: {aiService.userContext.age}</span>
              </div>
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t p-4 bg-white animate-fade-in-up animate-stagger-5">
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask me anything about your finances..."
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              className="flex-1 input-whisper focus-premium"
              disabled={isTyping}
            />
            <Button 
              onClick={handleSend}
              className="bg-[#5945a3] hover:bg-[#4a3d8f] btn-premium"
              size="sm"
              disabled={!message.trim() || isTyping}
            >
              {isTyping ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Send size={16} />
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
            <Brain size={10} />
            Powered by GPT-4 • Press Enter to send
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AIAssistant;