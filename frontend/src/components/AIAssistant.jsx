import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Bot, Send, Sparkles } from 'lucide-react';

const AIAssistant = ({ isOpen, onClose }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: "Hi! I'm Pecunia AI. I can help you with budgeting, investment advice, goal planning, and financial insights. What would you like to know?",
      timestamp: new Date()
    }
  ]);

  const suggestedPrompts = [
    "How can I improve my Pecunia score?",
    "Analyze my spending patterns",
    "Create a savings plan for my vacation",
    "What investment options suit my risk profile?"
  ];

  const handleSend = () => {
    if (!message.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    // Simulate AI response (this will be replaced with actual GPT integration)
    const aiResponse = {
      id: Date.now() + 1,
      type: 'assistant',
      content: `I understand you're asking about "${message}". This is a mock response. Once we integrate with the GPT API, I'll provide personalized financial insights based on your data and current market conditions.`,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, aiResponse]);
    setMessage('');
  };

  const handlePromptClick = (prompt) => {
    setMessage(prompt);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[420px] p-0 flex flex-col">
        <SheetHeader className="p-6 border-b">
          <SheetTitle className="flex items-center gap-2">
            <Bot className="text-[#5945a3]" size={24} />
            Pecunia AI Assistant
          </SheetTitle>
        </SheetHeader>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <Card className={`max-w-[80%] ${
                msg.type === 'user' 
                  ? 'bg-[#5945a3] text-white' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <CardContent className="p-3">
                  <p className="text-sm">{msg.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Suggested Prompts */}
        {messages.length === 1 && (
          <div className="px-6 pb-4">
            <p className="text-sm text-gray-600 mb-3">Try asking:</p>
            <div className="grid grid-cols-1 gap-2">
              {suggestedPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="justify-start text-left h-auto p-3 hover:bg-[#5945a3] hover:text-white transition-all"
                  onClick={() => handlePromptClick(prompt)}
                >
                  <Sparkles size={14} className="mr-2 flex-shrink-0" />
                  <span className="text-xs">{prompt}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask Pecunia anything..."
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1"
            />
            <Button 
              onClick={handleSend}
              className="bg-[#5945a3] hover:bg-[#4a3d8f]"
              size="sm"
            >
              <Send size={16} />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AIAssistant;