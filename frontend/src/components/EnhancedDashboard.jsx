import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PiggyBank, 
  CreditCard, 
  Target,
  ArrowUpRight,
  BarChart3,
  Sparkles,
  Brain,
  Eye,
  Plus
} from "lucide-react";
import { mockData } from "../data/mockData";
import CleanPieChart from "./charts/CleanPieChart";
import { useToast } from "../hooks/use-toast";
import { useAI } from "../contexts/AIContext";

const EnhancedDashboard = () => {
  const { dashboard, pecuniaScore } = mockData;
  const { toast } = useToast();
  const { 
    aiInsights, 
    loading: aiLoading, 
    getInsights, 
    analyzeSpending, 
    optimizeBudget,
    userProfile,
    updateUserProfile 
  } = useAI();
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(false);

  const handleAIAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      await analyzeSpending(dashboard);
      setShowAIInsights(true);
      toast({
        title: "AI Analysis Complete",
        description: "Your spending has been analyzed and insights are ready.",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleOptimizeBudget = async () => {
    setIsAnalyzing(true);
    try {
      await optimizeBudget(dashboard);
      toast({
        title: "Budget Optimized",
        description: "Your budget has been optimized based on AI recommendations.",
      });
    } catch (error) {
      toast({
        title: "Optimization Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Enhanced metrics with gradients and animations
  const metrics = [
    {
      title: "Total Balance",
      value: `$${dashboard.totalBalance.toLocaleString()}`,
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "primary",
      gradient: "gradient-primary"
    },
    {
      title: "Monthly Income",
      value: `$${dashboard.monthlyIncome.toLocaleString()}`,
      change: "+8.2%",
      trend: "up",
      icon: TrendingUp,
      color: "success",
      gradient: "gradient-success"
    },
    {
      title: "Monthly Expenses",
      value: `$${dashboard.monthlyExpenses.toLocaleString()}`,
      change: "-3.1%",
      trend: "down",
      icon: CreditCard,
      color: "primary",
      gradient: "gradient-secondary"
    },
    {
      title: "Savings Rate",
      value: `${dashboard.savingsRate}%`,
      change: "+4.7%",
      trend: "up",
      icon: PiggyBank,
      color: "success",
      gradient: "gradient-success"
    }
  ];

  const quickActions = [
    {
      title: "AI Analysis",
      description: "Get smart insights",
      icon: Brain,
      action: handleAIAnalysis,
      loading: isAnalyzing,
      variant: "primary"
    },
    {
      title: "Optimize Budget",
      description: "AI-powered optimization",
      icon: Sparkles,
      action: handleOptimizeBudget,
      loading: isAnalyzing,
      variant: "secondary"
    },
    {
      title: "View Insights",
      description: "See AI recommendations",
      icon: Eye,
      action: () => setShowAIInsights(true),
      loading: false,
      variant: "secondary"
    }
  ];

  return (
    <div className="app-modern min-h-screen">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-modern-hero">Financial Dashboard</h1>
            <p className="text-modern-subtitle mt-2">
              Your comprehensive financial overview with AI-powered insights
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="metric-card p-4 text-center">
              <div className="metric-value text-2xl">{pecuniaScore}</div>
              <div className="metric-label">Pecunia Score</div>
            </div>
          </div>
        </div>

        {/* Enhanced Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <div key={index} className="card-data-rich p-6 interactive-hover">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-full bg-gradient-to-r ${metric.gradient}`}>
                  <metric.icon className="h-6 w-6 text-white" />
                </div>
                <div className={`status-${metric.trend === 'up' ? 'positive' : 'negative'}`}>
                  {metric.trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  {metric.change}
                </div>
              </div>
              <div className="space-y-2">
                <div className="metric-value text-2xl">{metric.value}</div>
                <div className="metric-label">{metric.title}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="card-modern p-6">
          <h3 className="text-modern-title mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                disabled={action.loading}
                className={`${action.variant === 'primary' ? 'btn-modern-primary' : 'btn-modern-secondary'} 
                  interactive-hover p-6 text-left h-auto space-y-2`}
              >
                <div className="flex items-center gap-3">
                  <action.icon className="h-5 w-5" />
                  <div>
                    <div className="font-semibold">{action.title}</div>
                    <div className="text-sm opacity-80">{action.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Expenses Chart */}
          <div className="chart-modern">
            <h3 className="text-modern-title mb-6">Monthly Expenses</h3>
            <div className="h-80">
              <CleanPieChart
                data={dashboard.monthlyExpenses}
                showLegend={true}
                centerDisplay="percentage"
                height={300}
              />
            </div>
          </div>

          {/* Assets Chart */}
          <div className="chart-modern">
            <h3 className="text-modern-title mb-6">Asset Distribution</h3>
            <div className="h-80">
              <CleanPieChart
                data={dashboard.assets}
                showLegend={true}
                centerDisplay="value"
                height={300}
              />
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="card-modern p-6">
          <h3 className="text-modern-title mb-6">Financial Progress</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-modern-body">Monthly Savings Goal</span>
                <span className="text-gradient-primary font-semibold">
                  ${dashboard.monthlySavings.toLocaleString()} / $5,000
                </span>
              </div>
              <div className="progress-modern">
                <div 
                  className="progress-modern-bar" 
                  style={{ width: `${(dashboard.monthlySavings / 5000) * 100}%` }}
                />
              </div>
              <div className="text-modern-muted mt-1">
                {Math.round((dashboard.monthlySavings / 5000) * 100)}% of monthly goal
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-modern-body">Emergency Fund</span>
                <span className="text-gradient-secondary font-semibold">
                  ${dashboard.emergencyFund.toLocaleString()} / $15,000
                </span>
              </div>
              <div className="progress-modern">
                <div 
                  className="progress-modern-bar" 
                  style={{ width: `${(dashboard.emergencyFund / 15000) * 100}%` }}
                />
              </div>
              <div className="text-modern-muted mt-1">
                {Math.round((dashboard.emergencyFund / 15000) * 100)}% of target
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-modern-body">Investment Portfolio</span>
                <span className="text-gradient-primary font-semibold">
                  ${dashboard.totalInvestments.toLocaleString()} / $50,000
                </span>
              </div>
              <div className="progress-modern">
                <div 
                  className="progress-modern-bar" 
                  style={{ width: `${(dashboard.totalInvestments / 50000) * 100}%` }}
                />
              </div>
              <div className="text-modern-muted mt-1">
                {Math.round((dashboard.totalInvestments / 50000) * 100)}% of target
              </div>
            </div>
          </div>
        </div>

        {/* AI Insights Section */}
        {showAIInsights && aiInsights && (
          <div className="card-elevated p-6 glow-primary">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-modern-title flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Financial Insights
              </h3>
              <button
                onClick={() => setShowAIInsights(false)}
                className="btn-modern-secondary px-3 py-1 text-sm"
              >
                Hide
              </button>
            </div>
            <div className="space-y-4">
              <div className="glass-effect p-4 rounded-lg">
                <h4 className="text-gradient-primary font-semibold mb-2">
                  Key Recommendations
                </h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <ArrowUpRight className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-modern-body">
                      Consider increasing your emergency fund by $200/month
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <ArrowUpRight className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-modern-body">
                      Your dining expenses are 15% above average - potential savings opportunity
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <ArrowUpRight className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-modern-body">
                      Great job on maintaining your savings rate!
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedDashboard;