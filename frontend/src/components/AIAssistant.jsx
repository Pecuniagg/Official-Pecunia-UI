import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Bot, Send, Sparkles, Loader2 } from 'lucide-react';
import { useAI } from '../contexts/AIContext';

const AIAssistant = ({ isOpen, onClose }) => {
  const { chatHistory, chatWithAI, userProfile, loading } = useAI();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const suggestedPrompts = [
    "How can I improve my Pecunia score?",
    "Analyze my spending patterns this month",
    "What's the best way to reach my savings goals?",
    "Should I increase my emergency fund or invest?",
    "Help me optimize my budget allocation"
  ];

  const handleSend = async () => {
    if (!message.trim() || isTyping) return;

    setIsTyping(true);
    try {
      await chatWithAI(message);
      setMessage('');
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handlePromptClick = async (prompt) => {
    if (isTyping) return;
    
    setMessage(prompt);
    setIsTyping(true);
    try {
      await chatWithAI(prompt);
      setMessage('');
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsTyping(false);
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const chatContainer = document.getElementById('ai-chat-messages');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[420px] p-0 flex flex-col animate-slide-in-bottom">
        <SheetHeader className="p-6 border-b animate-fade-in-down">
          <SheetTitle className="flex items-center gap-2">
            <Bot className="text-[#5945a3] animate-pulse-soft" size={24} />
            Pecunia AI Assistant
          </SheetTitle>
          <p className="text-sm text-gray-600 text-left animate-fade-in-up animate-stagger-1">
            Your personal financial advisor powered by AI
          </p>
        </SheetHeader>

        {/* Messages */}
        <div id="ai-chat-messages" className="flex-1 overflow-y-auto p-6 space-y-4">
          {chatHistory.length === 0 && (
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 animate-scale-in">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="text-[#5945a3] animate-bounce-soft" size={16} />
                  <span className="font-medium">Welcome!</span>
                </div>
                <p className="text-sm text-gray-700 animate-fade-in-up animate-stagger-1">
                  Hi! I'm Pecunia AI. I can help you with budgeting, investment advice, goal planning, 
                  and personalized financial insights based on your data. What would you like to know?
                </p>
              </CardContent>
            </Card>
          )}

          {chatHistory.map((msg, index) => (
            <div
              key={msg.id}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} ai-insight animate-fade-in-up`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Card className={`max-w-[80%] hover-scale-small transition-transform duration-200 ${
                msg.type === 'user' 
                  ? 'bg-[#5945a3] text-white animate-fade-in-right' 
                  : 'bg-gray-50 border-gray-200 animate-fade-in-left'
              }`}>
                <CardContent className="p-3">
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </CardContent>
              </Card>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <Card className="bg-gray-50 border-gray-200 animate-scale-in">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={16} />
                    <span className="text-sm text-gray-600">AI is thinking...</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Suggested Prompts */}
        {chatHistory.length === 0 && !isTyping && (
          <div className="px-6 pb-4 animate-fade-in-up animate-stagger-2">
            <p className="text-sm text-gray-600 mb-3">Try asking:</p>
            <div className="grid grid-cols-1 gap-2">
              {suggestedPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className={`justify-start text-left h-auto p-3 hover:bg-[#5945a3] hover:text-white transition-all hover-lift btn-ripple animate-fade-in-up animate-stagger-${index + 3}`}
                  onClick={() => handlePromptClick(prompt)}
                  disabled={isTyping}
                >
                  <Sparkles size={14} className="mr-2 flex-shrink-0 hover-rotate transition-transform duration-200" />
                  <span className="text-xs">{prompt}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Context Info */}
        {userProfile && (
          <div className="px-6 pb-2 animate-fade-in-up animate-stagger-4">
            <div className="text-xs text-gray-500 bg-gray-50 rounded p-2 hover-scale-small transition-transform duration-200">
              <strong>Context:</strong> Pecunia Score: {userProfile.pecunia_score} | 
              Budget: ${userProfile.monthly_budget.toLocaleString()} | 
              Savings: {userProfile.savings_rate}%
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t p-4 animate-fade-in-up animate-stagger-5">
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask Pecunia anything..."
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              className="flex-1 input-focus"
              disabled={isTyping}
            />
            <Button 
              onClick={handleSend}
              className="bg-[#5945a3] hover:bg-[#4a3d8f] btn-ripple hover-scale-small"
              size="sm"
              disabled={!message.trim() || isTyping}
            >
              {isTyping ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Send size={16} className="hover-bounce transition-transform duration-200" />
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2 animate-fade-in-up animate-stagger-6">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AIAssistant;