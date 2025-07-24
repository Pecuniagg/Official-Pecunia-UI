import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { TrendingUp, TrendingDown, DollarSign, PiggyBank, CreditCard, Target } from "lucide-react";
import { mockData } from "../data/mockData";
import PieChartComponent from "../components/charts/PieChart";
import LineChartComponent from "../components/charts/LineChart";

const Dashboard = () => {
  const { dashboard, pecuniaScore } = mockData;

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#5945a3] to-[#b37e91] rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Neurial Grotesk, sans-serif' }}>
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
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  💡 Consider investing your surplus $2,750 in your emergency fund
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  🎯 You're 15% ahead of your savings goal this month
                </p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
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