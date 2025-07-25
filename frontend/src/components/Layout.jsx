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
import { useTheme } from '../contexts/ThemeContext';

const Layout = ({ children }) => {
  const location = useLocation();
  const { isDarkMode } = useTheme();
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
    <div className={`flex h-screen bg-white ${isDarkMode ? 'dark' : ''} transition-colors duration-300`}>
      {/* Fixed Sidebar - Enhanced spacing and breathing room */}
      <div className="fixed inset-y-0 left-0 w-[280px] bg-white border-r border-gray-100 dark:bg-gray-900 dark:border-gray-800">
        <div className="flex flex-col h-full">
          {/* Logo - Generous spacing */}
          <div className="section-spacing breathing-space-vertical">
            <h1 className="visual-hierarchy-1 text-[#5945a3] dark:text-white tracking-tight transition-colors duration-300" style={{ fontFamily: 'Neurial Grotesk, sans-serif' }}>
              Pecunia
            </h1>
          </div>

          {/* Navigation - Improved spacing and hierarchy */}
          <nav className="flex-1 px-6 pb-8">
            <ul className="stack-spacing-sm">
              {navigation.map((item, index) => {
                const Icon = item.icon;
                return (
                  <li key={item.name} className="transition-all duration-150 ease-in-out">
                    <Link
                      to={item.href}
                      className={`interactive flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out ${
                        isActive(item.href)
                          ? "bg-[#5945a3] text-white shadow-sm"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                      }`}
                    >
                      <Icon size={20} className="transition-transform duration-200 ease-in-out" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* AI Assistant Button - Consistent spacing */}
          <div className="px-6 pb-8 border-t border-gray-100 dark:border-gray-800 pt-6">
            <Button
              onClick={() => setShowAI(true)}
              className="w-full flex items-center gap-3 bg-gradient-to-r from-[#5945a3] to-[#b37e91] hover:opacity-90 interactive text-white border-0 shadow-sm transition-all duration-200 ease-in-out"
            >
              <Bot size={20} />
              Ask Pecunia
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content - Improved spacing and layout */}
      <div className="flex-1 ml-[280px] min-h-screen">
        {/* Top Bar - Cleaner design with consistent spacing */}
        <header className="fixed top-0 right-0 left-[280px] h-16 bg-white/95 backdrop-blur-md border-b border-gray-100 z-10 dark:bg-gray-900/95 dark:border-gray-800 transition-colors duration-300">
          <div className="flex items-center justify-between h-full px-8">
            <div className="flex items-center gap-6">
              <h2 className="text-xl font-semibold text-gray-900 animate-fade-in-right animate-stagger-1">
                {navigation.find(nav => nav.href === location.pathname)?.name || "Dashboard"}
              </h2>
            </div>
            
            <div className="flex items-center gap-4 animate-fade-in-left animate-stagger-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#3b345b] transition-colors duration-200" size={16} />
                <Input 
                  placeholder="Search..." 
                  className="pl-10 w-80 bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-[#5945a3] transition-all duration-200 input-focus hover-scale-small"
                />
              </div>
              
              <Button variant="ghost" size="sm" className="relative hover:bg-gray-50 btn-whisper focus-whisper">
                <Bell size={20} className="text-[#3b345b] icon-whisper" />
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-[#b37e91] rounded-full"></span>
              </Button>
              
              <Avatar className="h-8 w-8 hover-scale-small transition-transform duration-200">
                <AvatarImage src="/api/placeholder/32/32" />
                <AvatarFallback className="bg-[#5945a3] text-white">JD</AvatarFallback>
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
        className="fixed bottom-8 right-8 h-14 px-6 bg-gradient-to-r from-[#5945a3] to-[#b37e91] hover:opacity-90 shadow-xl hover:shadow-2xl btn-whisper"
        size="lg"
      >
        <Plus size={20} className="mr-2 hover-rotate transition-transform duration-300" />
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