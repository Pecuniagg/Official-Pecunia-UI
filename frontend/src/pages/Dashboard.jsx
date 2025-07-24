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
  Loader2
} from "lucide-react";
import { mockData } from "../data/mockData";
import PieChartComponent from "../components/charts/PieChart";
import { useToast } from "../hooks/use-toast";
import { useAI } from "../contexts/AIContext";

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

  // Load AI insights on component mount
  useEffect(() => {
    if (!aiInsights) {
      getInsights();
    }
  }, []);

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
    <div className="space-y-8 animate-entrance">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#5945a3] to-[#b37e91] rounded-2xl p-8 text-white animate-entrance-down">
        <h1 className="text-3xl font-bold text-[#0a0a0f] animate-slide-left animate-delay-1" style={{ fontFamily: 'Neurial Grotesk, sans-serif' }}>
          My Financial Life Today
        </h1>
        <p className="text-lg opacity-90 animate-slide-left animate-delay-2">
          AI Summary: You're on track with your savings goals. Consider increasing your emergency fund allocation.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-8 grid-staggered">
        {/* Left Column - Interactive Charts */}
        <div className="col-span-6 space-y-8">
          {/* Expenses Chart */}
          <Card className="shadow-lg card-refined card-entrance">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="text-[#5945a3] icon-refined" size={20} />
                Monthly Expenses
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleChartClick('Expenses', dashboard.expenses)}
                className="text-[#5945a3] hover:bg-purple-50 btn-refined focus-refined"
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
          <Card className="shadow-lg card-refined">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <PiggyBank className="text-[#5945a3] icon-refined" size={20} />
                Assets Distribution
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleChartClick('Assets', dashboard.assets)}
                className="text-[#5945a3] hover:bg-purple-50 btn-refined focus-refined"
              >
                <Eye size={16} />
              </Button>
            </CardHeader>
            <CardContent>
              <div onClick={() => handleChartClick('Assets', dashboard.assets)} className="cursor-pointer">
                <PieChartComponent 
                  data={dashboard.assets} 
                  colors={['#5945a3', '#b37e91', '#1e1b24', '#3b345b']}
                />
              </div>
            </CardContent>
          </Card>

          {/* Liabilities Chart */}
          <Card className="shadow-lg card-refined">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="text-[#b37e91] icon-refined" size={20} />
                Liabilities
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleChartClick('Liabilities', dashboard.liabilities)}
                className="text-[#5945a3] hover:bg-purple-50 btn-refined focus-refined"
              >
                <Eye size={16} />
              </Button>
            </CardHeader>
            <CardContent>
              <div onClick={() => handleChartClick('Liabilities', dashboard.liabilities)} className="cursor-pointer">
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
          <Card className="shadow-lg card-refined">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Budget Summary</CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setBudgetEdit(!budgetEdit)}
                className="text-[#5945a3] hover:bg-purple-50 btn-refined focus-refined"
              >
                <Edit size={16} />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {budgetEdit ? (
                <div className="space-y-3 animate-scale-gentle">
                  <Label htmlFor="budget">Monthly Budget</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={monthlyBudget}
                    onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                    className="input-refined focus-refined"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleBudgetSave} className="bg-[#5945a3] hover:bg-[#4a3d8f] btn-refined">
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setBudgetEdit(false)} className="btn-refined">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Monthly Budget</span>
                    <span className="font-semibold">${monthlyBudget.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Spent</span>
                    <span className="font-semibold text-[#b37e91]">$3,750</span>
                  </div>
                  <div className="progress-refined">
                    <Progress value={75} className="w-full" />
                  </div>
                  <div className="text-sm text-gray-600">75% of budget used</div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full btn-refined"
                    onClick={() => toast({ title: "Budget Alert", description: "Alert set for 90% budget usage" })}
                  >
                    Set Alert
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Interactive Cash Flow */}
          <Card className="shadow-lg card-refined">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Cash Flow</CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => toast({ title: "Cash Flow Details", description: "Opening detailed cash flow analysis..." })}
                className="text-[#5945a3] hover:bg-purple-50 btn-refined focus-refined"
              >
                <ArrowUpRight size={16} />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Income</span>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp size={16} />
                  <span className="font-semibold">$6,500</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Expenses</span>
                <div className="flex items-center gap-1 text-red-500">
                  <TrendingDown size={16} />
                  <span className="font-semibold">$3,750</span>
                </div>
              </div>
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Net Flow</span>
                  <span className="font-bold text-green-600">+$2,750</span>
                </div>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full btn-refined"
                onClick={() => toast({ title: "Investment Suggestion", description: "Consider investing your surplus in index funds" })}
              >
                Optimize Surplus
              </Button>
            </CardContent>
          </Card>

          {/* Financial Streams */}
          <Card className="shadow-lg card-refined">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Income Streams</CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => toast({ title: "Add Income", description: "Adding new income source..." })}
                className="text-[#5945a3] hover:bg-purple-50 btn-refined focus-refined"
              >
                <Plus size={16} />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {dashboard.incomeStreams.map((stream, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center hover:bg-gray-50 p-2 rounded transition-colors cursor-pointer hover-subtle"
                  onClick={() => toast({ title: `${stream.source} Details`, description: "Opening income stream details..." })}
                >
                  <span className="text-sm text-gray-600">{stream.source}</span>
                  <span className="font-medium">${stream.amount.toLocaleString()}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="col-span-3 space-y-8">
          {/* Interactive Pecunia Score */}
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 hover-lift card-entrance">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Pecunia Score</CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => toast({ title: "Score History", description: "Viewing score improvement tips..." })}
                className="text-[#5945a3] hover:bg-purple-50 hover-scale-small"
              >
                <Eye size={16} />
              </Button>
            </CardHeader>
            <CardContent className="text-center">
              <div 
                className="relative w-32 h-32 mx-auto mb-4 cursor-pointer hover-scale transition-transform duration-300 animate-morphing"
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
                    className="progress-animate"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#5945a3" />
                      <stop offset="100%" stopColor="#b37e91" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold counter-animate">{pecuniaScore.current}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3 animate-fade-in-up animate-stagger-3">
                +{pecuniaScore.change} from last month
              </p>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full hover-bounce btn-ripple"
                onClick={() => toast({ title: "Improvement Plan", description: "3 steps to reach 800+ score" })}
              >
                Improve Score
              </Button>
            </CardContent>
          </Card>

          {/* Interactive AI Insights */}
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-gray-50 to-white">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Target className="text-[#5945a3]" size={20} />
                AI Insights
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => getInsights()}
                disabled={aiLoading}
                className="text-[#5945a3] hover:bg-purple-50"
              >
                {aiLoading ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {aiLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="animate-spin mr-2" size={20} />
                  <span className="text-gray-600">AI is analyzing your finances...</span>
                </div>
              ) : aiInsights?.insights ? (
                aiInsights.insights.slice(0, 3).map((insight, index) => (
                  <div key={index} className={`p-3 rounded-lg border ${
                    insight.type === 'success' ? 'bg-green-50 border-green-100' : 
                    insight.type === 'warning' ? 'bg-yellow-50 border-yellow-100' : 
                    'bg-blue-50 border-blue-100'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-[#1e1b24] mb-2">
                          {insight.type === 'success' ? '✅' : insight.type === 'warning' ? '⚠️' : '💡'} {insight.description}
                        </p>
                        {insight.action && (
                          <Button 
                            size="xs" 
                            className="bg-[#5945a3] hover:bg-[#4a3d8f]"
                            onClick={() => handleInsightAction(insight.type)}
                          >
                            {insight.action}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                // Fallback to mock data
                <>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-sm text-[#1e1b24] mb-2">
                      💡 Consider investing your surplus $2,750 in your emergency fund
                    </p>
                    <Button 
                      size="xs" 
                      className="bg-[#5945a3] hover:bg-[#4a3d8f]"
                      onClick={() => handleInsightAction('emergency_fund')}
                    >
                      Do It
                    </Button>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                    <p className="text-sm text-[#1e1b24] mb-2">
                      🎯 You're 15% ahead of your savings goal this month
                    </p>
                    <Button 
                      size="xs" 
                      variant="outline"
                      onClick={() => toast({ title: "Goal Progress", description: "Opening savings goal details..." })}
                    >
                      View Goal
                    </Button>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                    <p className="text-sm text-[#1e1b24] mb-2">
                      ⚠️ Dining expenses increased by 25% this month
                    </p>
                    <Button 
                      size="xs" 
                      variant="outline"
                      onClick={() => handleInsightAction('dining_alert')}
                    >
                      Set Alert
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Interactive Account Summary */}
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Accounts</CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => toast({ title: "Add Account", description: "Connect new bank account..." })}
                className="text-[#5945a3] hover:bg-purple-50"
              >
                <Plus size={16} />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {dashboard.accounts.map((account, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center hover:bg-gray-50 p-2 rounded transition-colors cursor-pointer group"
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
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
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
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Activity</CardTitle>
          <div className="flex items-center gap-2">
            <Tabs value={activityFilter} onValueChange={setActivityFilter} className="w-auto">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="income">Income</TabsTrigger>
                <TabsTrigger value="expenses">Expenses</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => toast({ title: "Add Transaction", description: "Recording new transaction..." })}
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
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group"
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
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
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
            <div className="text-center mt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowAllActivity(!showAllActivity)}
              >
                {showAllActivity ? 'Show Less' : `Show All ${filteredActivity.length} Transactions`}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chart Detail Modal */}
      <ChartDetailModal 
        chart={selectedChart} 
        onClose={() => setSelectedChart(null)} 
      />
    </div>
  );
};

export default Dashboard;