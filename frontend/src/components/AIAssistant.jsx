import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Brain, 
  Send, 
  Sparkles, 
  Loader2, 
  TrendingUp, 
  Target, 
  PiggyBank,
  Plane,
  BarChart3,
  X,
  User,
  MessageCircle
} from 'lucide-react';
import { useAI } from '../contexts/AIContext';
import aiService from '../services/aiService';

const AIAssistant = ({ isOpen, onClose }) => {
  const { chatHistory, userProfile } = useAI();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [localChatHistory, setLocalChatHistory] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);

  // Refined suggested prompts with better organization
  const suggestedPrompts = [
    {
      category: "Financial Analysis",
      icon: BarChart3,
      prompts: [
        "Analyze my complete financial situation and give me a comprehensive strategy",
        "How do I compare to others in my age group financially?"
      ]
    },
    {
      category: "Budgeting",
      icon: PiggyBank,
      prompts: [
        "Optimize my budget to save more money",
        "Create a smart budget that maximizes my savings"
      ]
    },
    {
      category: "Investing",
      icon: TrendingUp,
      prompts: [
        "What should I invest in right now with current market conditions?",
        "Create a personalized investment strategy for me"
      ]
    },
    {
      category: "Goals",
      icon: Target,
      prompts: [
        "Help me create a plan to achieve my financial goals",
        "How can I save for a house down payment faster?"
      ]
    },
    {
      category: "Travel",
      icon: Plane,
      prompts: [
        "Plan a budget-friendly vacation for me",
        "Create a complete travel itinerary with budget"
      ]
    }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [localChatHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!message.trim() || isTyping) return;

    const userMessage = {
      type: 'user',
      content: message,
      timestamp: new Date().toLocaleTimeString()
    };

    setLocalChatHistory(prev => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);
    setShowSuggestions(false);

    try {
      const messageType = determineMessageType(message);
      let response;

      switch (messageType) {
        case 'comprehensive_analysis':
          response = await aiService.getComprehensiveAnalysis(userProfile);
          break;
        case 'budget_optimization':
          response = await aiService.getSmartBudget(userProfile);
          break;
        case 'investment_strategy':
          response = await aiService.getInvestmentStrategy(userProfile);
          break;
        case 'competitive_insights':
          response = await aiService.getCompetitiveInsights(userProfile);
          break;
        case 'travel_planning':
          const travelData = extractTravelData(message);
          response = await aiService.getTravelPlan(travelData);
          break;
        case 'goal_strategy':
          const goalData = extractGoalData(message);
          response = await aiService.getGoalStrategy(goalData);
          break;
        default:
          response = await aiService.chat(message);
      }

      const aiMessage = {
        type: 'ai',
        content: formatAIResponse(response, messageType),
        timestamp: new Date().toLocaleTimeString()
      };

      setLocalChatHistory(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage = {
        type: 'ai',
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        timestamp: new Date().toLocaleTimeString()
      };

      setLocalChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
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
        return `${response.analysis}\n\n**Key Action Items:**\n${response.action_items?.map(item => `• ${item}`).join('\n') || 'Analysis complete'}`;
      
      case 'budget_optimization':
        return `${response.budget}\n\n**Savings Rate:** ${response.savings_rate}%\n**Optimization Score:** ${response.optimization_score}/100`;
      
      case 'investment_strategy':
        return `${response.strategy}\n\n**Expected Return:** ${(response.expected_return * 100).toFixed(1)}%\n**Risk Level:** ${response.risk_score}/100`;
      
      case 'competitive_insights':
        return `${response.insights}\n\n**Your Ranking:** ${response.percentile_ranking}th percentile\n**Competitive Score:** ${response.competitive_score}/100`;
      
      case 'travel_planning':
        return `${response.plan}\n\n**Budget:** $${response.total_budget?.toLocaleString()}`;
      
      case 'goal_strategy':
        return `${response.strategy}\n\n**Monthly Target:** $${response.monthly_target?.toLocaleString()}`;
      
      default:
        return response.response || response.analysis || response;
    }
  };

  const handlePromptClick = async (prompt) => {
    if (isTyping) return;
    setMessage(prompt);
    setShowSuggestions(false);
    
    // Small delay to show the message in input before sending
    setTimeout(() => {
      handleSend();
    }, 100);
  };

  const allMessages = [...chatHistory, ...localChatHistory];

  return (
    <>
      {/* Overlay */}
      <div 
        className={`side-panel-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />
      
      {/* Side Panel */}
      <div className={`side-panel ${isOpen ? 'open' : ''} ai-assistant-container`}>
        <div className="flex flex-col h-full">
          {/* Header - Enhanced spacing */}
          <div className="ai-assistant-header">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#5945a3] to-[#b37e91] rounded-full flex items-center justify-center shadow-sm">
                  <Brain className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="visual-hierarchy-3 text-gray-900 dark:text-white">AI Assistant</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Your financial advisor</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="interactive text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={20} />
              </Button>
            </div>
          </div>

          {/* Chat Container - Improved spacing */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto ai-assistant-content">
              {allMessages.length === 0 && showSuggestions ? (
                <div className="space-y-6">
                  <div className="text-center breathing-space">
                    <Sparkles className="mx-auto text-[#5945a3] mb-4" size={32} />
                    <h4 className="visual-hierarchy-3 text-gray-900 dark:text-white mb-2">
                      How can I help you today?
                    </h4>
                    <p className="text-muted">
                      Ask me anything about your finances, or choose from these suggestions:
                    </p>
                  </div>
                  
                  {suggestedPrompts.map((category, idx) => {
                    const Icon = category.icon;
                    return (
                      <div key={idx} className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Icon size={16} className="text-[#5945a3]" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {category.category}
                          </span>
                        </div>
                        <div className="grid gap-2">
                          {category.prompts.map((prompt, promptIdx) => (
                            <Button
                              key={promptIdx}
                              variant="outline"
                              className="text-left h-auto p-3 text-sm ai-suggestion-button"
                              onClick={() => handlePromptClick(prompt)}
                            >
                              {prompt}
                            </Button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-4">
                  {allMessages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] ${msg.type === 'user' ? 'order-2' : 'order-1'}`}>
                        <div className={`p-4 rounded-lg transition-all duration-200 ${
                          msg.type === 'user' 
                            ? 'user-message' 
                            : 'ai-message'
                        }`}>
                          <div className="flex items-start gap-3">
                            {msg.type === 'ai' && (
                              <Brain className="text-[#5945a3] mt-1 flex-shrink-0" size={16} />
                            )}
                            <div className="flex-1">
                              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                {msg.content}
                              </div>
                              {msg.timestamp && (
                                <div className="text-xs opacity-70 mt-2">
                                  {msg.timestamp}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg max-w-[80%] mr-4">
                        <div className="flex items-center gap-3">
                          <Brain className="text-[#5945a3]" size={16} />
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-gray-100 bg-white dark:bg-gray-900 dark:border-gray-800">
              <div className="flex gap-3">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything about your finances..."
                  className="flex-1 focus:ring-[#5945a3] transition-all duration-200 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  disabled={isTyping}
                />
                <Button
                  onClick={handleSend}
                  disabled={!message.trim() || isTyping}
                  className="bg-[#5945a3] hover:bg-[#4a3d8f] text-white interactive border-0 px-4"
                >
                  {isTyping ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <Send size={20} />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIAssistant;