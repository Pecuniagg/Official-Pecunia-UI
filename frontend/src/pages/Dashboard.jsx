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
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: ['#5945a3', '#b37e91', '#1e1b24', '#3b345b', '#0a0a0f'][index] }}
                        />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${item.value.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">{item.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => toast({ title: "Category Editor", description: "Opening category management..." })}
                  >
                    <Edit size={16} className="mr-2" />
                    Edit Categories
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => toast({ title: "New Category", description: "Add new expense category..." })}
                  >
                    <Plus size={16} className="mr-2" />
                    Add New Category
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => toast({ title: "Budget Limits", description: "Setting category budgets..." })}
                  >
                    <Filter size={16} className="mr-2" />
                    Set Category Budget
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => toast({ title: "Trend Analysis", description: "Analyzing spending patterns..." })}
                  >
                    <Eye size={16} className="mr-2" />
                    View Trends
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-[#1e1b24] mb-2">💡 AI Insight</h4>
              <p className="text-sm text-[#1e1b24]">
                Based on your {chart.type.toLowerCase()} patterns, you could save $150/month by optimizing your largest category. 
                Would you like personalized recommendations?
              </p>
              <Button 
                size="sm" 
                className="mt-3 bg-[#5945a3] hover:bg-[#4a3d8f]"
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
    <div className="space-y-8">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ai-insights" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Insights
          </TabsTrigger>
          <TabsTrigger value="advanced">Advanced Analytics</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          {/* Hero Banner */}
          <div className="bg-gradient-to-r from-[#5945a3] to-[#b37e91] rounded-2xl p-8 text-white card-premium hover-glow-subtle">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-[#0a0a0f] animate-entrance-elastic animate-delay-whisper-1" style={{ fontFamily: 'Neurial Grotesk, sans-serif' }}>
                  My Financial Life Today
                </h1>
                <p className="text-lg opacity-90 animate-entrance-elastic animate-delay-whisper-2">
                  {loadingInsights ? 'AI is analyzing your finances...' : 
                   aiInsights?.analysis?.analysis?.substring(0, 100) + '...' || 
                   'AI Summary: You\'re on track with your savings goals. Consider increasing your emergency fund allocation.'}
                </p>
              </div>
              <Button 
                onClick={handleSmartOptimize}
                className="bg-white text-[#5945a3] hover:bg-gray-100 btn-premium"
              >
                <Brain className="h-4 w-4 mr-2" />
                Smart Optimize
              </Button>
            </div>
          </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-8 grid-premium">
        {/* Left Column - Interactive Charts */}
        <div className="col-span-6 space-y-8">
          {/* Expenses Chart */}
          <Card className="shadow-lg card-premium hover-glow-subtle">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="text-[#5945a3] icon-premium" size={20} />
                Monthly Expenses
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleChartClick('Expenses', dashboard.expenses)}
                className="text-[#5945a3] hover:bg-purple-50 btn-premium focus-premium"
              >
                <Eye size={16} />
              </Button>
            </CardHeader>
            <CardContent>
              <div onClick={() => handleChartClick('Expenses', dashboard.expenses)} className="cursor-pointer">
                <PieChartComponent 
                  data={dashboard.expenses} 
                  colors={['#5945a3', '#b37e91', '#1e1b24', '#3b345b', '#0a0a0f']}
                />
              </div>
            </CardContent>
          </Card>

          {/* Assets Chart */}
          <Card className="shadow-lg card-premium hover-glow-subtle">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <PiggyBank className="text-[#5945a3] icon-premium" size={20} />
                Assets Distribution
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleChartClick('Assets', dashboard.assets)}
                className="text-[#5945a3] hover:bg-purple-50 btn-premium focus-premium"
              >
                <Eye size={16} />
              </Button>
            </CardHeader>
            <CardContent>
              <div onClick={() => handleChartClick('Assets', dashboard.assets)} className="cursor-pointer chart-premium">
                <PieChartComponent 
                  data={dashboard.assets} 
                  colors={['#5945a3', '#b37e91', '#1e1b24', '#3b345b']}
                />
              </div>
            </CardContent>
          </Card>

          {/* Liabilities Chart */}
          <Card className="shadow-lg card-premium hover-glow-subtle">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="text-[#b37e91] icon-premium" size={20} />
                Liabilities
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleChartClick('Liabilities', dashboard.liabilities)}
                className="text-[#5945a3] hover:bg-purple-50 btn-premium focus-premium"
              >
                <Eye size={16} />
              </Button>
            </CardHeader>
            <CardContent>
              <div onClick={() => handleChartClick('Liabilities', dashboard.liabilities)} className="cursor-pointer chart-premium">
                <PieChartComponent 
                  data={dashboard.liabilities} 
                  colors={['#b37e91', '#3b345b', '#1e1b24']}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Center Column */}
        <div className="col-span-3 space-y-8">
          {/* Interactive Budget Summary */}
          <Card className="shadow-lg card-premium hover-glow-subtle">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Budget Summary</CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setBudgetEdit(!budgetEdit)}
                className="text-[#5945a3] hover:bg-purple-50 btn-premium focus-premium"
              >
                <Edit size={16} />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {budgetEdit ? (
                <div className="space-y-3 animate-entrance-spring">
                  <Label htmlFor="budget">Monthly Budget</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={monthlyBudget}
                    onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                    className="input-whisper focus-premium"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleBudgetSave} className="bg-[#5945a3] hover:bg-[#4a3d8f] btn-premium">
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setBudgetEdit(false)} className="btn-premium">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between hover-float">
                    <span className="text-sm text-gray-600">Monthly Budget</span>
                    <span className="font-semibold">${monthlyBudget.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between hover-float">
                    <span className="text-sm text-gray-600">Spent</span>
                    <span className="font-semibold text-[#b37e91]">$3,750</span>
                  </div>
                  <div className="progress-silk">
                    <Progress value={75} className="w-full" />
                  </div>
                  <div className="text-sm text-gray-600">75% of budget used</div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full btn-premium"
                    onClick={() => toast({ title: "Budget Alert", description: "Alert set for 90% budget usage" })}
                  >
                    Set Alert
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Interactive Cash Flow */}
          <Card className="shadow-lg card-premium hover-glow-subtle">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Cash Flow</CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => toast({ title: "Cash Flow Details", description: "Opening detailed cash flow analysis..." })}
                className="text-[#5945a3] hover:bg-purple-50 btn-premium focus-premium"
              >
                <ArrowUpRight size={16} />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between hover-float">
                <span className="text-sm text-gray-600">Income</span>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp size={16} />
                  <span className="font-semibold animate-flow">$6,500</span>
                </div>
              </div>
              <div className="flex items-center justify-between hover-float">
                <span className="text-sm text-gray-600">Expenses</span>
                <div className="flex items-center gap-1 text-red-500">
                  <TrendingDown size={16} />
                  <span className="font-semibold animate-flow">$3,750</span>
                </div>
              </div>
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between hover-float">
                  <span className="font-medium">Net Flow</span>
                  <span className="font-bold text-green-600 animate-flow">+$2,750</span>
                </div>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full btn-premium"
                onClick={() => toast({ title: "Investment Suggestion", description: "Consider investing your surplus in index funds" })}
              >
                Optimize Surplus
              </Button>
            </CardContent>
          </Card>

          {/* Financial Streams */}
          <Card className="shadow-lg card-whisper">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Income Streams</CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => toast({ title: "Add Income", description: "Adding new income source..." })}
                className="text-[#5945a3] hover:bg-purple-50 btn-whisper focus-whisper"
              >
                <Plus size={16} />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {dashboard.incomeStreams.map((stream, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center hover:bg-gray-50 p-2 rounded transition-colors cursor-pointer hover-whisper"
                  onClick={() => toast({ title: `${stream.source} Details`, description: "Opening income stream details..." })}
                >
                  <span className="text-sm text-gray-600">{stream.source}</span>
                  <span className="font-medium animate-flow">${stream.amount.toLocaleString()}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="col-span-3 space-y-8">
          {/* Interactive Pecunia Score */}
          <Card className="shadow-lg card-refined card-entrance">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Pecunia Score</CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => toast({ title: "Score History", description: "Viewing score improvement tips..." })}
                className="text-[#5945a3] hover:bg-purple-50 btn-refined focus-refined"
              >
                <Eye size={16} />
              </Button>
            </CardHeader>
            <CardContent className="text-center">
              <div 
                className="relative w-32 h-32 mx-auto mb-4 cursor-pointer score-circle"
                onClick={() => toast({ title: "Score Breakdown", description: "Credit: 780, Savings: 795, Debt Ratio: 770" })}
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
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(pecuniaScore.current / 100) * 351.86} 351.86`}
                    strokeLinecap="round"
                    className="progress-circle"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#5945a3" />
                      <stop offset="100%" stopColor="#b37e91" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold animate-counter">{pecuniaScore.current}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3 animate-slide-left animate-delay-3">
                +{pecuniaScore.change} from last month
              </p>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full btn-refined"
                onClick={() => toast({ title: "Improvement Plan", description: "3 steps to reach 800+ score" })}
              >
                Improve Score
              </Button>
            </CardContent>
          </Card>

          {/* AI Insights Preview */}
          <Card className="shadow-lg card-premium hover-glow-subtle">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Brain className="text-[#5945a3] icon-premium" size={20} />
                AI Insights
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSmartMode(!smartMode)}
                className="text-[#5945a3] hover:bg-purple-50 btn-premium focus-premium"
              >
                <ArrowUpRight size={16} />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {loadingInsights ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Opportunity
                    </Badge>
                    <span className="text-sm">High-yield savings rates increased</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Insight
                    </Badge>
                    <span className="text-sm">Emergency fund 85% complete</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      Warning
                    </Badge>
                    <span className="text-sm">Dining expenses above average</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Interactive Account Summary */}
          <Card className="shadow-lg card-refined">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Accounts</CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => toast({ title: "Add Account", description: "Connect new bank account..." })}
                className="text-[#5945a3] hover:bg-purple-50 btn-refined focus-refined"
              >
                <Plus size={16} />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {dashboard.accounts.map((account, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center hover:bg-gray-50 p-2 rounded hover-subtle cursor-pointer group"
                  onClick={() => handleAccountAction(account.name, 'View')}
                >
                  <div>
                    <p className="font-medium text-sm">{account.name}</p>
                    <p className="text-xs text-gray-500">{account.type}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">${Math.abs(account.balance).toLocaleString()}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="opacity-0 group-hover:opacity-100 transition-opacity btn-refined"
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

      {/* Interactive Recent Activity */}
      <Card className="shadow-lg card-refined animate-entrance animate-delay-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Activity</CardTitle>
          <div className="flex items-center gap-2">
            <Tabs value={activityFilter} onValueChange={setActivityFilter} className="w-auto">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all" className="btn-refined">All</TabsTrigger>
                <TabsTrigger value="income" className="btn-refined">Income</TabsTrigger>
                <TabsTrigger value="expenses" className="btn-refined">Expenses</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => toast({ title: "Add Transaction", description: "Recording new transaction..." })}
              className="btn-refined focus-refined"
            >
              <Plus size={16} className="mr-1" />
              Add
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(showAllActivity ? filteredActivity : filteredActivity.slice(0, 5)).map((activity, index) => (
              <div 
                key={index} 
                className={`flex items-center justify-between p-4 bg-gray-50 rounded-lg hover-subtle cursor-pointer group animate-slide-left animate-delay-${index + 1}`}
                onClick={() => toast({ 
                  title: "Transaction Details", 
                  description: `${activity.description} - ${activity.date} - Category: ${activity.amount > 0 ? 'Income' : 'Expense'}` 
                })}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${activity.amount > 0 ? 'bg-green-500' : 'bg-[#5945a3]'}`}></div>
                  <div>
                    <p className="font-medium">{activity.description}</p>
                    <p className="text-sm text-gray-500">{activity.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-semibold ${activity.amount > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {activity.amount > 0 ? '+' : ''}${Math.abs(activity.amount).toLocaleString()}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="opacity-0 group-hover:opacity-100 transition-opacity btn-refined"
                    onClick={(e) => {
                      e.stopPropagation();
                      toast({ title: "Edit Transaction", description: "Opening transaction editor..." });
                    }}
                  >
                    <Edit size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {filteredActivity.length > 5 && (
            <div className="text-center mt-4 animate-scale-gentle animate-delay-6">
              <Button 
                variant="outline" 
                onClick={() => setShowAllActivity(!showAllActivity)}
                className="btn-refined"
              >
                {showAllActivity ? 'Show Less' : `Show All ${filteredActivity.length} Transactions`}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-8">
          <AISmartDashboard />
        </TabsContent>

        <TabsContent value="advanced" className="space-y-8">
          <AdvancedAnalyticsDashboard data={dashboard} />
        </TabsContent>

        <TabsContent value="detailed" className="space-y-8">
          {/* Recent Activity */}
          <Card className="shadow-lg card-refined animate-entrance animate-delay-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Activity</CardTitle>
              <div className="flex items-center gap-2">
                <Tabs value={activityFilter} onValueChange={setActivityFilter} className="w-auto">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all" className="btn-refined">All</TabsTrigger>
                    <TabsTrigger value="income" className="btn-refined">Income</TabsTrigger>
                    <TabsTrigger value="expenses" className="btn-refined">Expenses</TabsTrigger>
                  </TabsList>
                </Tabs>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toast({ title: "Add Transaction", description: "Recording new transaction..." })}
                  className="btn-refined focus-refined"
                >
                  <Plus size={16} className="mr-1" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(showAllActivity ? filteredActivity : filteredActivity.slice(0, 5)).map((activity, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center justify-between p-4 bg-gray-50 rounded-lg hover-subtle cursor-pointer group animate-slide-left animate-delay-${index + 1}`}
                    onClick={() => toast({ 
                      title: "Transaction Details", 
                      description: `${activity.description} - ${activity.date} - Category: ${activity.amount > 0 ? 'Income' : 'Expense'}` 
                    })}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${activity.amount > 0 ? 'bg-green-500' : 'bg-[#5945a3]'}`}></div>
                      <div>
                        <p className="font-medium">{activity.description}</p>
                        <p className="text-sm text-gray-500">{activity.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold ${activity.amount > 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {activity.amount > 0 ? '+' : ''}${Math.abs(activity.amount).toLocaleString()}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="opacity-0 group-hover:opacity-100 transition-opacity btn-refined"
                        onClick={(e) => {
                          e.stopPropagation();
                          toast({ title: "Edit Transaction", description: "Opening transaction editor..." });
                        }}
                      >
                        <Edit size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredActivity.length > 5 && (
                <div className="text-center mt-4 animate-scale-gentle animate-delay-6">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAllActivity(!showAllActivity)}
                    className="btn-refined"
                  >
                    {showAllActivity ? 'Show Less' : `Show All ${filteredActivity.length} Transactions`}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Chart Detail Modal */}
      <ChartDetailModal 
        chart={selectedChart} 
        onClose={() => setSelectedChart(null)} 
      />
    </div>
  );
};

export default Dashboard;