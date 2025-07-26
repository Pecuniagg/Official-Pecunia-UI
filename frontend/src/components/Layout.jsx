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
    <div className="flex h-screen" style={{ background: 'var(--color-bg-primary)' }}>
      {/* Fixed Sidebar */}
      <div className="fixed inset-y-0 left-0 w-[280px] border-r" style={{ 
        background: 'var(--color-surface-dark)', 
        borderColor: 'var(--color-border)' 
      }}>
        <div className="flex flex-col h-full">
          {/* Logo - Generous spacing */}
          <div className="section-spacing breathing-space-vertical">
            <h1 className="text-professional-hero text-[#5945a3] dark:text-white tracking-tight transition-colors duration-300" style={{ fontFamily: 'Neurial Grotesk, sans-serif' }}>
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
                      className={`nav-professional flex items-center gap-3 px-4 py-3 text-sm font-medium ${
                        isActive(item.href) ? 'active' : ''
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
              className="w-full flex items-center gap-3 btn-professional bg-gradient-to-r from-[#5945a3] to-[#b37e91] hover:opacity-90 text-white border-0 shadow-sm"
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
        <header className="fixed top-0 right-0 left-[280px] h-16 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 z-10 transition-colors duration-300">
          <div className="flex items-center justify-between h-full px-8">
            <div className="flex items-center gap-6">
              <h2 className="text-professional-title text-gray-900 dark:text-white transition-colors duration-300">
                {navigation.find(nav => nav.href === location.pathname)?.name || "Dashboard"}
              </h2>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors duration-200" size={16} />
                <Input 
                  placeholder="Search..." 
                  className="pl-10 w-80 input-professional bg-gray-50 dark:bg-gray-800 border-0 focus:bg-white dark:focus:bg-gray-700 dark:text-white"
                />
              </div>
              
              <Button variant="ghost" size="sm" className="relative btn-professional text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-[#b37e91] rounded-full"></span>
              </Button>
              
              <Avatar className="h-8 w-8 ring-2 ring-transparent hover:ring-[#5945a3] transition-all duration-200 cursor-pointer">
                <AvatarImage src="/api/placeholder/32/32" />
                <AvatarFallback className="bg-[#5945a3] text-white">JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Page Content - Improved spacing and breathing room */}
        <main className="pt-16 min-h-screen">
          <div className="container section-spacing-lg max-w-[1200px] mx-auto scroll-professional">
            {children}
          </div>
        </main>
      </div>

      {/* Quick Action Button - Non-overlapping, side panel trigger */}
      <Button
        onClick={() => setShowQuickActions(true)}
        className="fixed bottom-8 right-8 h-14 px-6 btn-professional bg-gradient-to-r from-[#5945a3] to-[#b37e91] hover:opacity-90 shadow-lg hover:shadow-xl text-white border-0 z-50"
        size="lg"
      >
        <Plus size={20} className="mr-2 transition-transform duration-200" />
        Quick Action
      </Button>

      {/* AI Assistant - Enhanced side panel */}
      <AIAssistant isOpen={showAI} onClose={() => setShowAI(false)} />
      
      {/* Quick Action Panel - Enhanced side panel */}
      <QuickActionPanel isOpen={showQuickActions} onClose={() => setShowQuickActions(false)} />
      
      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
};

export default Layout;