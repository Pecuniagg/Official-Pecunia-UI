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
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
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
          response = await aiService.getComprehensiveAnalysis();
          break;
        case 'budget_optimization':
          response = await aiService.generateSmartBudget();
          break;
        case 'investment_strategy':
          response = await aiService.generateInvestmentStrategy();
          break;
        case 'competitive_insights':
          response = await aiService.getCompetitiveInsights();
          break;
        case 'travel_planning':
          const travelData = extractTravelData(message);
          response = await aiService.generateTravelPlan(travelData);
          break;
        case 'goal_strategy':
          const goalData = extractGoalData(message);
          response = await aiService.generateGoalStrategy(goalData);
          break;
        default:
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
        messageType: messageType
      };

      setLocalChatHistory(prev => [...prev, aiMessage]);

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
      <div className={`side-panel ${isOpen ? 'open' : ''}`}>
        <div className="flex flex-col h-full">
          {/* Header - Enhanced spacing */}
          <div className="card-spacing-lg border-b border-gray-100 bg-white dark:bg-gray-900 dark:border-gray-800">
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
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
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
                              className="text-left h-auto p-3 text-sm interactive border-gray-200 hover:border-[#5945a3] hover:bg-purple-50 dark:border-gray-700 dark:hover:border-[#5945a3] dark:hover:bg-purple-900/20"
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
                            ? 'bg-[#5945a3] text-white ml-4' 
                            : 'bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white mr-4'
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
                <Brain className="text-white" size={20} />
              </div>
              <div>
                <SheetTitle className="text-lg font-semibold text-gray-900">
                  Pecunia AI
                </SheetTitle>
                <p className="text-sm text-gray-500">
                  Your intelligent financial advisor
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="hover:bg-gray-100 transition-colors"
            >
              <X size={18} />
            </Button>
          </div>
        </SheetHeader>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {/* Welcome Message */}
          {allMessages.length === 0 && (
            <div className="p-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-[#5945a3] to-[#b37e91] rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
                  <Brain className="text-white" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Welcome to Pecunia AI
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  I'm your comprehensive financial advisor. I can analyze your finances, 
                  create budgets, plan investments, and much more.
                </p>
              </div>
            </div>
          )}

          {/* Chat Messages */}
          <div className="px-6 pb-6">
            {allMessages.map((msg, index) => (
              <div
                key={msg.id}
                className={`mb-6 animate-entrance animate-delay-whisper-${Math.min(index + 1, 6)}`}
              >
                <div className={`flex items-start gap-3 ${
                  msg.type === 'user' ? 'flex-row-reverse' : ''
                }`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.type === 'user' 
                      ? 'bg-[#5945a3]' 
                      : 'bg-gradient-to-br from-[#5945a3] to-[#b37e91]'
                  }`}>
                    {msg.type === 'user' ? (
                      <User className="text-white" size={16} />
                    ) : (
                      <Brain className="text-white" size={16} />
                    )}
                  </div>

                  {/* Message Content */}
                  <div className={`flex-1 ${msg.type === 'user' ? 'text-right' : ''}`}>
                    <div className={`inline-block max-w-[85%] ${
                      msg.type === 'user' 
                        ? 'bg-[#5945a3] text-white' 
                        : 'bg-white border border-gray-200'
                    } rounded-2xl px-4 py-3 shadow-sm hover-lift-premium transition-all duration-200`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </p>
                      {msg.messageType && (
                        <Badge 
                          variant="secondary" 
                          className="mt-2 text-xs bg-white/20 text-white border-white/30"
                        >
                          {msg.messageType.replace('_', ' ')}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1 px-1">
                      {msg.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="mb-6 animate-entrance">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#5945a3] to-[#b37e91] rounded-full flex items-center justify-center">
                    <Brain className="text-white" size={16} />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-xs text-gray-500">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Suggested Prompts */}
            {showSuggestions && allMessages.length === 0 && !isTyping && (
              <div className="space-y-6 animate-entrance animate-delay-whisper-2">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-700 mb-4">
                    What can I help you with today?
                  </p>
                </div>
                
                {suggestedPrompts.slice(0, 3).map((category, categoryIndex) => (
                  <div key={category.category} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <category.icon className="text-[#5945a3]" size={16} />
                      <h4 className="text-sm font-medium text-gray-700">
                        {category.category}
                      </h4>
                    </div>
                    <div className="space-y-2">
                      {category.prompts.map((prompt, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          className="w-full justify-start text-left h-auto p-3 text-sm text-gray-700 hover:bg-[#5945a3] hover:text-white transition-all duration-200 hover-lift-premium"
                          onClick={() => handlePromptClick(prompt)}
                          disabled={isTyping}
                        >
                          <Sparkles size={14} className="mr-2 flex-shrink-0" />
                          <span className="truncate">{prompt}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Context Info */}
        {userProfile && (
          <div className="px-6 py-3 bg-gray-50 border-t">
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <MessageCircle size={12} />
                <span>Context Active</span>
              </div>
              <div className="flex gap-3">
                <span>Score: {userProfile.pecunia_score || 782}</span>
                <span>Age: {aiService.userContext.age}</span>
                <span>Budget: ${userProfile.monthly_budget?.toLocaleString() || '5,000'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-6 bg-white border-t">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask me anything about your finances..."
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                className="border-gray-300 focus:border-[#5945a3] focus:ring-[#5945a3] transition-colors"
                disabled={isTyping}
              />
            </div>
            <Button 
              onClick={handleSend}
              disabled={!message.trim() || isTyping}
              className="bg-[#5945a3] hover:bg-[#4a3d8f] transition-all duration-200 hover-lift-premium"
            >
              {isTyping ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Send size={18} />
              )}
            </Button>
          </div>
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-gray-500">
              Press Enter to send
            </p>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Brain size={10} />
              <span>Powered by GPT-4</span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AIAssistant;