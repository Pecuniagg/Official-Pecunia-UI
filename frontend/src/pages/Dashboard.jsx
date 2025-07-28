import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PiggyBank, 
  CreditCard, 
  Target,
  Edit,
  Plus,
  Filter,
  Eye,
  MoreHorizontal,
  AlertCircle,
  CheckCircle,
  ArrowUpRight,
  BarChart3,
  Sparkles,
  Loader2,
  Brain
} from "lucide-react";
import { mockData } from "../data/mockData";
import PieChartComponent from "../components/charts/PieChart";
import AdvancedPieChart from "../components/charts/AdvancedPieChart";
import CleanPieChart from "../components/charts/CleanPieChart";
import { useToast } from "../hooks/use-toast";
import { useAI } from "../contexts/AIContext";
import AISmartDashboard from "../components/AISmartDashboard";
import aiService from "../services/aiService";
import AdvancedAnalyticsDashboard from "../components/AdvancedAnalyticsDashboard";

const Dashboard = () => {
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
  
  // State for interactive features
  const [selectedChart, setSelectedChart] = useState(null);
  const [budgetEdit, setBudgetEdit] = useState(false);
  const [monthlyBudget, setMonthlyBudget] = useState(5000);
  const [activityFilter, setActivityFilter] = useState('all');
  const [showAllActivity, setShowAllActivity] = useState(false);
  const [spendingAnalysis, setSpendingAnalysis] = useState(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [smartMode, setSmartMode] = useState(false);
  const [showScoreBreakdown, setShowScoreBreakdown] = useState(false);

  // Load AI insights on component mount
  useEffect(() => {
    if (!aiInsights) {
      getInsights();
    }
    loadAIInsights();
  }, []);

  const loadAIInsights = async () => {
    try {
      setLoadingInsights(true);
      
      // Update user context with current dashboard data
      aiService.updateUserContext({
        monthly_income: 6500,
        monthly_expenses: 3750,
        expenses: dashboard.expenses.reduce((acc, item) => ({ ...acc, [item.name]: item.value }), {}),
        assets: dashboard.assets.reduce((acc, item) => ({ ...acc, [item.name]: item.value }), {}),
        liabilities: dashboard.liabilities.reduce((acc, item) => ({ ...acc, [item.name]: item.value }), {})
      });

      // Get AI-powered dashboard insights
      const insights = await aiService.getDashboardInsights(dashboard);
      // Note: We're using the existing aiInsights from useAI context
      
    } catch (error) {
      console.error('Error loading AI insights:', error);
    } finally {
      setLoadingInsights(false);
    }
  };

  // Interactive handlers
  const handleChartClick = (chartType, data) => {
    setSelectedChart({ type: chartType, data });
  };

  const handleBudgetSave = async () => {
    setBudgetEdit(false);
    
    // Update user profile with new budget
    await updateUserProfile({ monthly_budget: monthlyBudget });
    
    toast({
      title: "Budget Updated! 🎯",
      description: `Monthly budget set to $${monthlyBudget.toLocaleString()}. AI insights refreshed!`,
    });
  };

  const handleInsightAction = async (action) => {
    switch(action) {
      case 'emergency_fund':
        await updateUserProfile({ 
          emergency_fund: userProfile.emergency_fund + 2750 
        });
        toast({
          title: "Goal Updated! 💰",
          description: "Added $2,750 to Emergency Fund goal",
        });
        break;
      case 'dining_alert':
        toast({
          title: "Budget Alert Set! 🚨",
          description: "You'll get notified when dining expenses exceed 20%",
        });
        break;
      case 'analyze_spending':
        const analysis = await analyzeSpending(dashboard.recentActivity);
        setSpendingAnalysis(analysis);
        toast({
          title: "Spending Analysis Complete! 📊",
          description: "AI has analyzed your spending patterns",
        });
        break;
      default:
        toast({
          title: "Action Complete",
          description: "Your request has been processed",
        });
    }
  };

  const handleAccountAction = (accountName, action) => {
    toast({
      title: `${action} ${accountName}`,
      description: `Account action completed successfully`,
    });
  };

  const handleSmartOptimize = async () => {
    try {
      const optimizedBudget = await aiService.autoOptimizeBudget({
        monthly_income: 6500,
        current_budget: monthlyBudget,
        expenses: dashboard.expenses
      });
      
      toast({
        title: "Budget Optimized",
        description: "AI has optimized your budget for better savings potential",
      });
      
      // Reload insights
      loadAIInsights();
      
    } catch (error) {
      console.error('Error optimizing budget:', error);
      toast({
        title: "Optimization Failed",
        description: "Unable to optimize budget at this time",
        variant: "destructive"
      });
    }
  };

  const ChartDetailModal = ({ chart, onClose }) => (
    <Dialog open={!!chart} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="text-[#5945a3]" size={20} />
            {chart?.type} Breakdown
          </DialogTitle>
        </DialogHeader>
        
        {chart && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-4">Category Details</h3>
                <div className="space-y-3">
                  {chart.data.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: ['#5945A3', '#B37E91', '#39D98A', '#FF4D67', '#FFB800'][index] }}
                        />
                        <span className="font-medium text-gray-900 dark:text-white">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900 dark:text-white">${item.value.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">{item.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Quick Actions</h3>
                <div className="space-y-2">
                  <Button 
                    className="w-full justify-start bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700" 
                    variant="outline"
                    onClick={() => toast({ title: "Category Editor", description: "Opening category management..." })}
                  >
                    <Edit size={16} className="mr-2" />
                    Edit Categories
                  </Button>
                  <Button 
                    className="w-full justify-start bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700" 
                    variant="outline"
                    onClick={() => toast({ title: "New Category", description: "Add new expense category..." })}
                  >
                    <Plus size={16} className="mr-2" />
                    Add New Category
                  </Button>
                  <Button 
                    className="w-full justify-start bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700" 
                    variant="outline"
                    onClick={() => toast({ title: "Budget Limits", description: "Setting category budgets..." })}
                  >
                    <Filter size={16} className="mr-2" />
                    Set Category Budget
                  </Button>
                  <Button 
                    className="w-full justify-start bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700" 
                    variant="outline"
                    onClick={() => toast({ title: "Trend Analysis", description: "Analyzing spending patterns..." })}
                  >
                    <Eye size={16} className="mr-2" />
                    View Trends
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                <Sparkles size={16} />
                AI Insight
              </h4>
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-4 leading-relaxed">
                Based on your {chart.type.toLowerCase()} patterns, you could save $150/month by optimizing your largest category. 
                Would you like personalized recommendations?
              </p>
              <Button 
                size="sm" 
                className="bg-[#5945a3] hover:bg-[#4a3d8f] text-white border-0 shadow-sm transition-all duration-200"
                onClick={() => toast({ title: "AI Recommendations", description: "Generating personalized suggestions..." })}
              >
                Get Recommendations
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  const filteredActivity = dashboard.recentActivity.filter(activity => {
    if (activityFilter === 'all') return true;
    if (activityFilter === 'income') return activity.amount > 0;
    if (activityFilter === 'expenses') return activity.amount < 0;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-1 rounded-lg mb-6 shadow-sm">
            <TabsTrigger value="overview" className="text-xs lg:text-sm font-medium transition-all duration-200">Overview</TabsTrigger>
            <TabsTrigger value="ai-insights" className="flex items-center gap-1 lg:gap-2 text-xs lg:text-sm font-medium transition-all duration-200">
              <Brain className="h-3 w-3 lg:h-4 lg:w-4" />
              <span className="hidden sm:inline">AI Insights</span>
              <span className="sm:hidden">AI</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="text-xs lg:text-sm font-medium hidden lg:block transition-all duration-200">Advanced Analytics</TabsTrigger>
            <TabsTrigger value="detailed" className="text-xs lg:text-sm font-medium hidden lg:block transition-all duration-200">Detailed Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-[#5945a3] to-[#b37e91] rounded-xl p-6 lg:p-8 text-white shadow-lg">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6">
                <div className="flex-1">
                  <h1 className="text-2xl lg:text-3xl font-bold mb-3 lg:mb-4">
                    My Financial Life Today
                  </h1>
                  <p className="text-base lg:text-lg opacity-90 leading-relaxed max-w-2xl">
                    {loadingInsights ? 'AI is analyzing your finances...' : 
                     aiInsights?.analysis?.analysis?.substring(0, 80) + '...' || 
                     'AI Summary: You\'re on track with your savings goals.'}
                  </p>
                </div>
                <Button 
                  onClick={handleSmartOptimize}
                  className="bg-white text-[#5945a3] hover:bg-gray-50 px-6 py-3 font-medium shadow-sm transition-all duration-200 hover:shadow-md"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Smart Optimize
                </Button>
              </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column - Charts */}
              <div className="lg:col-span-6 space-y-6">
                {/* Expenses Chart */}
                <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900 dark:text-white">
                        <CreditCard className="text-[#5945a3]" size={20} />
                        Monthly Expenses
                      </CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleChartClick('Expenses', dashboard.expenses)}
                        className="text-[#5945a3] hover:bg-purple-50 dark:hover:bg-purple-900/20 p-2 rounded-md"
                      >
                        <Eye size={16} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div onClick={() => handleChartClick('Expenses', dashboard.expenses)} className="cursor-pointer">
                      <CleanPieChart 
                        data={dashboard.expenses} 
                        title="Expenses"
                        onSegmentClick={(data) => handleChartClick('Expenses', dashboard.expenses)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Assets Chart */}
                <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900 dark:text-white">
                        <PiggyBank className="text-[#5945a3]" size={20} />
                        Assets Distribution
                      </CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleChartClick('Assets', dashboard.assets)}
                        className="text-[#5945a3] hover:bg-purple-50 dark:hover:bg-purple-900/20 p-2 rounded-md"
                      >
                        <Eye size={16} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div onClick={() => handleChartClick('Assets', dashboard.assets)} className="cursor-pointer">
                      <CleanPieChart 
                        data={dashboard.assets} 
                        title="Assets"
                        centerValue="$56K"
                        onSegmentClick={(data) => handleChartClick('Assets', dashboard.assets)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Liabilities Chart */}
                <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900 dark:text-white">
                        <CreditCard className="text-[#b37e91]" size={20} />
                        Liabilities
                      </CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleChartClick('Liabilities', dashboard.liabilities)}
                        className="text-[#5945a3] hover:bg-purple-50 dark:hover:bg-purple-900/20 p-2 rounded-md"
                      >
                        <Eye size={16} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div onClick={() => handleChartClick('Liabilities', dashboard.liabilities)} className="cursor-pointer">
                      <CleanPieChart 
                        data={dashboard.liabilities} 
                        title="Liabilities"
                        centerValue="$10K"
                        onSegmentClick={(data) => handleChartClick('Liabilities', dashboard.liabilities)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Center Column */}
              <div className="lg:col-span-3 space-y-6">
                {/* Budget Summary */}
                <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Budget Summary</CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setBudgetEdit(!budgetEdit)}
                        className="text-[#5945a3] hover:bg-purple-50 dark:hover:bg-purple-900/20 p-2 rounded-md"
                      >
                        <Edit size={16} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {budgetEdit ? (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="budget" className="text-sm font-medium text-gray-700 dark:text-gray-300">Monthly Budget</Label>
                          <Input
                            id="budget"
                            type="number"
                            value={monthlyBudget}
                            onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                            className="mt-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-[#5945a3] focus:ring-[#5945a3]"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={handleBudgetSave} 
                            className="bg-[#5945a3] hover:bg-[#4a3d8f] text-white flex-1"
                          >
                            Save
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => setBudgetEdit(false)} 
                            className="flex-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Monthly Budget</span>
                          <span className="font-semibold text-gray-900 dark:text-white">${monthlyBudget.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Spent</span>
                          <span className="font-semibold text-[#b37e91]">$3,750</span>
                        </div>
                        <div className="space-y-2">
                          <Progress value={75} className="w-full" />
                          <div className="text-sm text-gray-600 dark:text-gray-400">75% of budget used</div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                          onClick={() => toast({ title: "Budget Alert", description: "Alert set for 90% budget usage" })}
                        >
                          Set Alert
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Cash Flow */}
                <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Cash Flow</CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => toast({ title: "Cash Flow Details", description: "Opening detailed cash flow analysis..." })}
                        className="text-[#5945a3] hover:bg-purple-50 dark:hover:bg-purple-900/20 p-2 rounded-md"
                      >
                        <ArrowUpRight size={16} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Income</span>
                      <div className="flex items-center gap-2 text-green-600">
                        <TrendingUp size={16} />
                        <span className="font-semibold">$6,500</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Expenses</span>
                      <div className="flex items-center gap-2 text-red-500">
                        <TrendingDown size={16} />
                        <span className="font-semibold">$3,750</span>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900 dark:text-white">Net Flow</span>
                        <span className="font-bold text-green-600">+$2,750</span>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                      onClick={() => toast({ title: "Investment Suggestion", description: "Consider investing your surplus in index funds" })}
                    >
                      Optimize Surplus
                    </Button>
                  </CardContent>
                </Card>

                {/* Income Streams */}
                <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Income Streams</CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => toast({ title: "Add Income", description: "Adding new income source..." })}
                        className="text-[#5945a3] hover:bg-purple-50 dark:hover:bg-purple-900/20 p-2 rounded-md"
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {dashboard.incomeStreams.map((stream, index) => (
                      <div 
                        key={index} 
                        className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
                        onClick={() => toast({ title: `${stream.source} Details`, description: "Opening income stream details..." })}
                      >
                        <span className="text-sm text-gray-600 dark:text-gray-400">{stream.source}</span>
                        <span className="font-medium text-gray-900 dark:text-white">${stream.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-3 space-y-6">
                {/* Pecunia Score */}
                <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Pecunia Score</CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setShowScoreBreakdown(!showScoreBreakdown)}
                        className="text-[#5945a3] hover:bg-purple-50 dark:hover:bg-purple-900/20 p-2 rounded-md"
                      >
                        <Eye size={16} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-6">
                      <div 
                        className="relative w-32 h-32 mx-auto mb-4 cursor-pointer transition-transform hover:scale-105"
                        onClick={() => setShowScoreBreakdown(!showScoreBreakdown)}
                      >
                        <svg className="w-32 h-32 transform -rotate-90">
                          <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="#e5e7eb"
                            strokeWidth="8"
                            fill="none"
                          />
                          <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="url(#scoreGradient)"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${(782/1000) * 351.86} 351.86`}
                            className="transition-all duration-1000 ease-out"
                          />
                          <defs>
                            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#5945a3" />
                              <stop offset="100%" stopColor="#b37e91" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-[#5945a3]">782</div>
                            <div className="text-xs text-gray-500">Excellent</div>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Click to see breakdown</p>
                    </div>

                    {/* Score Breakdown */}
                    {showScoreBreakdown && (
                      <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                            <div className="text-lg font-bold text-green-600">825</div>
                            <div className="text-xs text-green-700 dark:text-green-300">Savings Rate</div>
                            <div className="text-xs text-gray-500">23% monthly</div>
                          </div>
                          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <div className="text-lg font-bold text-blue-600">795</div>
                            <div className="text-xs text-blue-700 dark:text-blue-300">Budget Control</div>
                            <div className="text-xs text-gray-500">Under by $1,250</div>
                          </div>
                          <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                            <div className="text-lg font-bold text-yellow-600">750</div>
                            <div className="text-xs text-yellow-700 dark:text-yellow-300">Debt Ratio</div>
                            <div className="text-xs text-gray-500">18% of income</div>
                          </div>
                          <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                            <div className="text-lg font-bold text-purple-600">760</div>
                            <div className="text-xs text-purple-700 dark:text-purple-300">Investment Mix</div>
                            <div className="text-xs text-gray-500">80% diversified</div>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                          <h4 className="font-semibold text-sm mb-3 text-gray-900 dark:text-white">How it's calculated:</h4>
                          <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                            <div className="flex justify-between">
                              <span>Savings Rate (30%)</span>
                              <span>825 × 0.30 = 248</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Budget Control (25%)</span>
                              <span>795 × 0.25 = 199</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Debt Management (25%)</span>
                              <span>750 × 0.25 = 188</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Investment Strategy (20%)</span>
                              <span>760 × 0.20 = 152</span>
                            </div>
                            <hr className="my-2 border-gray-300 dark:border-gray-600" />
                            <div className="flex justify-between font-semibold text-gray-900 dark:text-white">
                              <span>Total Score</span>
                              <span>787 → 782</span>
                            </div>
                            <div className="text-xs text-gray-500">
                              *Score adjusted for recent spending patterns
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="text-blue-600" size={16} />
                            <span className="font-semibold text-blue-800 dark:text-blue-200 text-sm">To reach 800+:</span>
                          </div>
                          <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                            <li>• Reduce debt ratio to under 15% (+15 points)</li>
                            <li>• Increase emergency fund to 6 months (+10 points)</li>
                            <li>• Diversify investments further (+8 points)</li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Fixed AI Insights Panel */}
                <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900 dark:text-white">
                        <Brain className="text-[#5945a3]" size={20} />
                        AI Insights
                      </CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSmartMode(!smartMode)}
                        className="text-[#5945a3] hover:bg-purple-50 dark:hover:bg-purple-900/20 p-2 rounded-md"
                      >
                        <ArrowUpRight size={16} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {loadingInsights ? (
                      <div className="animate-pulse space-y-3">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                          <Badge className="bg-green-100 text-green-700 border-green-300 text-xs font-medium px-2 py-1 rounded-md flex-shrink-0">
                            Opportunity
                          </Badge>
                          <span className="text-sm text-gray-900 dark:text-white leading-relaxed">
                            High-yield savings rates increased
                          </span>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <Badge className="bg-blue-100 text-blue-700 border-blue-300 text-xs font-medium px-2 py-1 rounded-md flex-shrink-0">
                            Insight
                          </Badge>
                          <span className="text-sm text-gray-900 dark:text-white leading-relaxed">
                            Emergency fund 85% complete
                          </span>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                          <Badge className="bg-orange-100 text-orange-700 border-orange-300 text-xs font-medium px-2 py-1 rounded-md flex-shrink-0">
                            Warning
                          </Badge>
                          <span className="text-sm text-gray-900 dark:text-white leading-relaxed">
                            Dining expenses above average
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Accounts Panel */}
                <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Accounts</CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => toast({ title: "Add Account", description: "Connect new bank account..." })}
                        className="text-[#5945a3] hover:bg-purple-50 dark:hover:bg-purple-900/20 p-2 rounded-md"
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {dashboard.accounts.map((account, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer group"
                        onClick={() => handleAccountAction(account.name, 'View')}
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm text-gray-900 dark:text-white">{account.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{account.type}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-gray-900 dark:text-white">
                            ${Math.abs(account.balance).toLocaleString()}
                          </span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAccountAction(account.name, 'Manage');
                            }}
                          >
                            <MoreHorizontal size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Recent Activity */}
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</CardTitle>
                  <div className="flex items-center gap-3">
                    <Tabs value={activityFilter} onValueChange={setActivityFilter} className="w-auto">
                      <TabsList className="grid grid-cols-3 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                        <TabsTrigger value="all" className="text-sm px-4 py-2">All</TabsTrigger>
                        <TabsTrigger value="income" className="text-sm px-4 py-2">Income</TabsTrigger>
                        <TabsTrigger value="expenses" className="text-sm px-4 py-2">Expenses</TabsTrigger>
                      </TabsList>
                    </Tabs>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toast({ title: "Add Transaction", description: "Recording new transaction..." })}
                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <Plus size={16} className="mr-2" />
                      Add
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(showAllActivity ? filteredActivity : filteredActivity.slice(0, 5)).map((activity, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
                      onClick={() => toast({ title: `${activity.description} Details`, description: "Opening transaction details..." })}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${activity.amount > 0 ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-red-100 dark:bg-red-900/30 text-red-600'}`}>
                          {activity.amount > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        </div>
                        <div>
                          <p className="font-medium text-sm text-gray-900 dark:text-white">{activity.description}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{activity.date}</p>
                        </div>
                      </div>
                      <div className={`font-semibold ${activity.amount > 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {activity.amount > 0 ? '+' : ''}${Math.abs(activity.amount).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
                {filteredActivity.length > 5 && (
                  <Button 
                    variant="outline" 
                    className="w-full mt-4 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                    onClick={() => setShowAllActivity(!showAllActivity)}
                  >
                    {showAllActivity ? 'Show Less' : `View All ${filteredActivity.length} Transactions`}
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-insights" className="space-y-6">
            <AISmartDashboard />
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <AdvancedAnalyticsDashboard />
          </TabsContent>

          <TabsContent value="detailed" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Investment Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Total Return</span>
                      <span className="font-semibold text-green-600">+$12,450</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Annual Return</span>
                      <span className="font-semibold text-gray-900 dark:text-white">12.8%</span>
                    </div>
                    <Progress value={85} className="w-full" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Savings Goals Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Emergency Fund</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">$8,500 / $10,000</span>
                      </div>
                      <Progress value={85} className="w-full" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">House Down Payment</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">$35,000 / $80,000</span>
                      </div>
                      <Progress value={44} className="w-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Chart Detail Modal */}
        <ChartDetailModal chart={selectedChart} onClose={() => setSelectedChart(null)} />
      </div>
    </div>
  );
};

export default Dashboard;