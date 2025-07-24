import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
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
  ArrowUpRight
} from "lucide-react";
import { mockData } from "../data/mockData";
import PieChartComponent from "../components/charts/PieChart";
import { useToast } from "../hooks/use-toast";

const Dashboard = () => {
  const { dashboard, pecuniaScore } = mockData;
  const { toast } = useToast();
  
  // State for interactive features
  const [selectedChart, setSelectedChart] = useState(null);
  const [budgetEdit, setBudgetEdit] = useState(false);
  const [monthlyBudget, setMonthlyBudget] = useState(5000);
  const [activityFilter, setActivityFilter] = useState('all');
  const [showAllActivity, setShowAllActivity] = useState(false);

  // Interactive handlers
  const handleChartClick = (chartType, data) => {
    setSelectedChart({ type: chartType, data });
  };

  const handleBudgetSave = () => {
    setBudgetEdit(false);
    toast({
      title: "Budget Updated!",
      description: `Monthly budget set to $${monthlyBudget.toLocaleString()}`,
    });
  };

  const handleInsightAction = (action) => {
    switch(action) {
      case 'emergency_fund':
        toast({
          title: "Goal Updated!",
          description: "Added $2,750 to Emergency Fund goal",
        });
        break;
      case 'dining_alert':
        toast({
          title: "Budget Alert Set!",
          description: "You'll get notified when dining expenses exceed 20%",
        });
        break;
      default:
        toast({
          title: "Action Complete!",
          description: "Your request has been processed",
        });
    }
  };

  const ChartDetailModal = ({ chart, onClose }) => (
    <Dialog open={!!chart} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
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
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
                  <Button className="w-full justify-start" variant="outline">
                    <Edit size={16} className="mr-2" />
                    Edit Categories
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Plus size={16} className="mr-2" />
                    Add New Category
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Filter size={16} className="mr-2" />
                    Set Category Budget
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
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
              <Button size="sm" className="mt-3 bg-[#5945a3] hover:bg-[#4a3d8f]">
                Get Recommendations
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );


const Dashboard = () => {
  const { dashboard, pecuniaScore } = mockData;

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#5945a3] to-[#b37e91] rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold text-[#0a0a0f]" style={{ fontFamily: 'Neurial Grotesk, sans-serif' }}>
          My Financial Life Today
        </h1>
        <p className="text-lg opacity-90">
          AI Summary: You're on track with your savings goals. Consider increasing your emergency fund allocation.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-8">
        {/* Left Column - Charts */}
        <div className="col-span-6 space-y-8">
          {/* Expenses Chart */}
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="text-[#5945a3]" size={20} />
                Monthly Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PieChartComponent 
                data={dashboard.expenses} 
                colors={['#5945a3', '#b37e91', '#1e1b24', '#3b345b', '#0a0a0f']}
              />
            </CardContent>
          </Card>

          {/* Assets Chart */}
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PiggyBank className="text-[#5945a3]" size={20} />
                Assets Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PieChartComponent 
                data={dashboard.assets} 
                colors={['#5945a3', '#b37e91', '#1e1b24', '#3b345b']}
              />
            </CardContent>
          </Card>

          {/* Liabilities Chart */}
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="text-[#b37e91]" size={20} />
                Liabilities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PieChartComponent 
                data={dashboard.liabilities} 
                colors={['#b37e91', '#3b345b', '#1e1b24']}
              />
            </CardContent>
          </Card>
        </div>

        {/* Center Column */}
        <div className="col-span-3 space-y-8">
          {/* Budget Summary */}
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle>Budget Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Monthly Budget</span>
                <span className="font-semibold">$5,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Spent</span>
                <span className="font-semibold text-[#b37e91]">$3,750</span>
              </div>
              <Progress value={75} className="w-full" />
              <div className="text-sm text-gray-600">75% of budget used</div>
            </CardContent>
          </Card>

          {/* Cash Flow */}
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle>Cash Flow</CardTitle>
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
            </CardContent>
          </Card>

          {/* Financial Streams */}
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle>Income Streams</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {dashboard.incomeStreams.map((stream, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{stream.source}</span>
                  <span className="font-medium">${stream.amount.toLocaleString()}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="col-span-3 space-y-8">
          {/* Pecunia Score */}
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle>Pecunia Score</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
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
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#5945a3" />
                      <stop offset="100%" stopColor="#b37e91" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold">{pecuniaScore.current}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                +{pecuniaScore.change} from last month
              </p>
            </CardContent>
          </Card>

          {/* AI Snapshot */}
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-gray-50 to-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="text-[#5945a3]" size={20} />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-[#1e1b24]">
                  💡 Consider investing your surplus $2,750 in your emergency fund
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                <p className="text-sm text-[#1e1b24]">
                  🎯 You're 15% ahead of your savings goal this month
                </p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                <p className="text-sm text-[#1e1b24]">
                  ⚠️ Dining expenses increased by 25% this month
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Account Summary */}
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle>Accounts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {dashboard.accounts.map((account, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-sm">{account.name}</p>
                    <p className="text-xs text-gray-500">{account.type}</p>
                  </div>
                  <span className="font-semibold">${account.balance.toLocaleString()}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboard.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#5945a3] rounded-full"></div>
                  <div>
                    <p className="font-medium">{activity.description}</p>
                    <p className="text-sm text-gray-500">{activity.date}</p>
                  </div>
                </div>
                <span className={`font-semibold ${activity.amount > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {activity.amount > 0 ? '+' : ''}${Math.abs(activity.amount).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;