import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Target, 
  MessageSquare, 
  Calendar, 
  User, 
  BarChart3,
  Search,
  Bell,
  Bot,
  Plus,
  CreditCard,
  Receipt,
  Goal,
  Clock
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Toaster } from "./ui/toaster";
import AIAssistant from "./AIAssistant";
import QuickActionPanel from "./QuickActionPanel";

const Layout = ({ children }) => {
  const location = useLocation();
  const [showAI, setShowAI] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Goals", href: "/goals", icon: Target },
    { name: "Feed", href: "/feed", icon: MessageSquare },
    { name: "Planner", href: "/planner", icon: Calendar },
    { name: "Profile", href: "/profile", icon: User },
    { name: "Compare", href: "/compare", icon: BarChart3 },
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <div className="flex h-screen bg-white">
      {/* Fixed Sidebar */}
      <div className="fixed inset-y-0 left-0 w-[280px] bg-white border-r border-gray-100">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-8 animate-fade-in-down">
            <h1 className="text-2xl font-bold tracking-tight hover-glow transition-all duration-300" style={{ fontFamily: 'Neurial Grotesk, sans-serif' }}>
              Pecunia
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-6 animate-fade-in-left animate-stagger-2">
            <ul className="space-y-2">
              {navigation.map((item, index) => {
                const Icon = item.icon;
                return (
                  <li key={item.name} className={`animate-fade-in-left animate-stagger-${index + 1}`}>
                    <Link
                      to={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 nav-item hover-lift ${
                        isActive(item.href)
                          ? "bg-[#5945a3] text-white shadow-lg transform scale-105 animate-glow"
                          : "text-[#3b345b] hover:bg-gray-50 hover:text-[#0a0a0f] hover-scale-small"
                      }`}
                    >
                      <Icon size={20} className="hover-scale-small transition-transform duration-200" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* AI Assistant Button */}
          <div className="p-6 border-t border-gray-100">
            <Button
              onClick={() => setShowAI(true)}
              className="w-full flex items-center gap-3 bg-gradient-to-r from-[#5945a3] to-[#b37e91] hover:opacity-90 transition-all duration-300"
            >
              <Bot size={20} />
              Ask Pecunia
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-[280px]">
        {/* Top Bar */}
        <header className="fixed top-0 right-0 left-[280px] h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 z-10">
          <div className="flex items-center justify-between h-full px-8">
            <div className="flex items-center gap-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {navigation.find(nav => nav.href === location.pathname)?.name || "Dashboard"}
              </h2>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#3b345b]" size={16} />
                <Input 
                  placeholder="Search..." 
                  className="pl-10 w-80 bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-[#5945a3] transition-all duration-200"
                />
              </div>
              
              <Button variant="ghost" size="sm" className="relative hover:bg-gray-50">
                <Bell size={20} className="text-[#3b345b]" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-[#b37e91] rounded-full"></span>
              </Button>
              
              <Avatar className="h-8 w-8">
                <AvatarImage src="/api/placeholder/32/32" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="pt-16 p-8 min-h-screen">
          <div className="max-w-[1200px] mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Quick Action Button */}
      <Button
        onClick={() => setShowQuickActions(true)}
        className="fixed bottom-8 right-8 h-14 px-6 bg-gradient-to-r from-[#5945a3] to-[#b37e91] hover:opacity-90 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
        size="lg"
      >
        <Plus size={20} className="mr-2" />
        Quick Action
      </Button>

      {/* AI Assistant */}
      <AIAssistant isOpen={showAI} onClose={() => setShowAI(false)} />
      
      {/* Quick Action Panel */}
      <QuickActionPanel isOpen={showQuickActions} onClose={() => setShowQuickActions(false)} />
      
      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
};

export default Layout;