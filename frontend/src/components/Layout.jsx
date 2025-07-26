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
          {/* Logo */}
          <div className="p-6">
            <h1 className="text-2xl font-bold tracking-tight" style={{ 
              color: 'var(--color-primary-accent)',
              fontFamily: 'Neurial Grotesk, sans-serif' 
            }}>
              Pecunia
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-6 pb-8">
            <ul className="space-y-2">
              {navigation.map((item, index) => {
                const Icon = item.icon;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`nav-item flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                        isActive(item.href) ? 'active' : ''
                      }`}
                    >
                      <Icon size={20} />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* AI Assistant Button */}
          <div className="px-6 pb-8 border-t pt-6" style={{ borderColor: 'var(--color-border)' }}>
            <Button
              onClick={() => setShowAI(true)}
              className="w-full flex items-center gap-3 btn-primary"
              style={{ background: 'var(--gradient-primary)' }}
            >
              <Bot size={20} />
              Ask Pecunia
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-[280px] min-h-screen">
        {/* Top Bar */}
        <header className="fixed top-0 right-0 left-[280px] h-16 backdrop-blur-md border-b z-10" style={{ 
          background: 'rgba(10, 10, 15, 0.95)', 
          borderColor: 'var(--color-border)' 
        }}>
          <div className="flex items-center justify-between h-full px-8">
            <div className="flex items-center gap-6">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text-white)' }}>
                {navigation.find(nav => nav.href === location.pathname)?.name || "Dashboard"}
              </h2>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" size={16} style={{ color: 'var(--color-text-muted)' }} />
                <Input 
                  placeholder="Search..." 
                  className="pl-10 w-80 input"
                  style={{ 
                    background: 'var(--color-input)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text-white)'
                  }}
                />
              </div>
              
              <Button variant="ghost" size="sm" className="relative" style={{ color: 'var(--color-text-secondary)' }}>
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full" style={{ background: 'var(--color-secondary-accent)' }}></span>
              </Button>
              
              <Avatar className="h-8 w-8 ring-2 ring-transparent hover:ring-opacity-50 transition-all duration-200 cursor-pointer" style={{ '--tw-ring-color': 'var(--color-primary-accent)' }}>
                <AvatarImage src="/api/placeholder/32/32" />
                <AvatarFallback style={{ background: 'var(--color-primary-accent)', color: 'var(--color-text-white)' }}>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="pt-16 min-h-screen">
          <div className="container max-w-[1200px] mx-auto p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Quick Action Button */}
      <Button
        onClick={() => setShowQuickActions(true)}
        className="fixed bottom-8 right-8 h-14 px-6 shadow-lg hover:shadow-xl z-50 btn-primary"
        style={{ background: 'var(--gradient-primary)' }}
        size="lg"
      >
        <Plus size={20} className="mr-2" />
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