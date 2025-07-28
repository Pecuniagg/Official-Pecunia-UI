import React, { useState } from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { TrendingUp, TrendingDown, DollarSign, AlertCircle, Target, Info, Activity } from 'lucide-react';
import { PECUNIA_CHART_COLORS } from '../../utils/chartColors';

const CashFlowChart = ({ 
  data, 
  title = "Cash Flow Analysis", 
  subtitle = "Monthly income vs expenses with net flow",
  showProjection = true,
  onDataPointClick
}) => {
  const [viewType, setViewType] = useState('combined'); // 'combined', 'area', 'stacked'
  const [selectedMonth, setSelectedMonth] = useState(null);

  // Calculate enhanced data with insights
  const enhancedData = data.map((item, index) => {
    const netFlow = item.income - item.expenses;
    const savingsRate = item.income > 0 ? ((netFlow / item.income) * 100).toFixed(1) : 0;
    const expenseRatio = item.income > 0 ? ((item.expenses / item.income) * 100).toFixed(1) : 0;
    
    // Calculate trend compared to previous month
    const prevItem = index > 0 ? data[index - 1] : null;
    const incomeChange = prevItem ? ((item.income - prevItem.income) / prevItem.income * 100).toFixed(1) : 0;
    const expenseChange = prevItem ? ((item.expenses - prevItem.expenses) / prevItem.expenses * 100).toFixed(1) : 0;
    
    return {
      ...item,
      netFlow,
      savingsRate: parseFloat(savingsRate),
      expenseRatio: parseFloat(expenseRatio),
      incomeChange: parseFloat(incomeChange),
      expenseChange: parseFloat(expenseChange),
      healthScore: calculateHealthScore(savingsRate, expenseRatio, netFlow),
      insight: generateInsight(netFlow, savingsRate, expenseRatio, incomeChange)
    };
  });

  function calculateHealthScore(savingsRate, expenseRatio, netFlow) {
    let score = 0;
    if (savingsRate >= 20) score += 40;
    else if (savingsRate >= 10) score += 25;
    else if (savingsRate >= 5) score += 15;
    
    if (expenseRatio <= 70) score += 30;
    else if (expenseRatio <= 80) score += 20;
    else if (expenseRatio <= 90) score += 10;
    
    if (netFlow > 0) score += 30;
    else if (netFlow > -500) score += 15;
    
    return Math.min(score, 100);
  }

  function generateInsight(netFlow, savingsRate, expenseRatio, incomeChange) {
    if (netFlow > 0 && savingsRate >= 20) {
      return "Excellent! You're saving over 20% of your income.";
    } else if (netFlow > 0 && savingsRate >= 10) {
      return "Good savings rate! Consider increasing to 20% if possible.";
    } else if (netFlow > 0) {
      return "Positive cash flow, but try to increase your savings rate.";
    } else if (netFlow > -500) {
      return "Slight deficit. Review expenses to improve cash flow.";
    } else {
      return "Significant deficit. Immediate budget review recommended.";
    }
  }

  // Calculate summary statistics
  const avgIncome = enhancedData.reduce((sum, item) => sum + item.income, 0) / enhancedData.length;
  const avgExpenses = enhancedData.reduce((sum, item) => sum + item.expenses, 0) / enhancedData.length;
  const avgNetFlow = enhancedData.reduce((sum, item) => sum + item.netFlow, 0) / enhancedData.length;
  const avgSavingsRate = enhancedData.reduce((sum, item) => sum + item.savingsRate, 0) / enhancedData.length;
  const avgHealthScore = enhancedData.reduce((sum, item) => sum + item.healthScore, 0) / enhancedData.length;

  const positiveMonths = enhancedData.filter(item => item.netFlow > 0).length;
  const totalMonths = enhancedData.length;
  const consistencyScore = ((positiveMonths / totalMonths) * 100).toFixed(0);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = enhancedData.find(item => item.month === label);
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg max-w-sm">
          <div className="font-semibold text-gray-800 mb-2">{label}</div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Income:</span>
              <span className="font-medium text-green-600">${payload.find(p => p.dataKey === 'income')?.value.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Expenses:</span>
              <span className="font-medium text-red-600">${payload.find(p => p.dataKey === 'expenses')?.value.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Net Flow:</span>
              <span className={`font-medium ${data?.netFlow > 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${data?.netFlow.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Savings Rate:</span>
              <span className="font-medium">{data?.savingsRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Health Score:</span>
              <span className="font-medium">{data?.healthScore}/100</span>
            </div>
            {data?.insight && (
              <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-800">
                💡 {data.insight}
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const viewTypes = [
    { key: 'combined', label: 'Combined', icon: Activity },
    { key: 'area', label: 'Area', icon: TrendingUp },
    { key: 'stacked', label: 'Stacked', icon: Target }
  ];

  const renderChart = () => {
    const commonProps = {
      data: enhancedData,
      margin: { top: 20, right: 30, left: 20, bottom: 5 }
    };

    switch (viewType) {
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="income" 
                stackId="1" 
                stroke="#10b981" 
                fill="#10b981" 
                fillOpacity={0.3}
                name="Income"
              />
              <Area 
                type="monotone" 
                dataKey="expenses" 
                stackId="2" 
                stroke="#ef4444" 
                fill="#ef4444" 
                fillOpacity={0.3}
                name="Expenses"
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      
      case 'stacked':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="income" fill="#10b981" name="Income" />
              <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
            </ComposedChart>
          </ResponsiveContainer>
        );
      
      default:
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="income" fill="#10b981" name="Income" opacity={0.7} />
              <Bar dataKey="expenses" fill="#ef4444" name="Expenses" opacity={0.7} />
              <Line 
                type="monotone" 
                dataKey="netFlow" 
                stroke="#5945a3" 
                strokeWidth={3}
                dot={{ fill: '#5945a3', r: 5 }}
                name="Net Flow"
              />
            </ComposedChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <Card className="w-full shadow-lg card-premium hover-glow-subtle">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="text-[#5945a3]" size={20} />
              {title}
              <Info size={16} className="text-gray-400" />
            </CardTitle>
            {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2">
            {viewTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Button
                  key={type.key}
                  variant={viewType === type.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewType(type.key)}
                  className="text-xs"
                >
                  <Icon size={14} className="mr-1" />
                  {type.label}
                </Button>
              );
            })}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-4">
            {/* Health Score */}
            <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Target className="text-green-600" size={16} />
                <span className="font-medium text-green-800 text-sm">Health Score</span>
              </div>
              <div className="text-2xl font-bold text-green-700">{avgHealthScore.toFixed(0)}/100</div>
              <div className="text-xs text-green-600 mt-1">
                Financial wellness indicator
              </div>
            </div>

            {/* Key Metrics */}
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Avg Monthly Income</div>
                <div className="text-lg font-semibold text-green-600">
                  ${avgIncome.toLocaleString()}
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Avg Monthly Expenses</div>
                <div className="text-lg font-semibold text-red-600">
                  ${avgExpenses.toLocaleString()}
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Avg Net Flow</div>
                <div className={`text-lg font-semibold ${avgNetFlow > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${avgNetFlow.toLocaleString()}
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Avg Savings Rate</div>
                <div className="text-lg font-semibold text-[#5945a3]">
                  {avgSavingsRate.toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Consistency Score */}
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="text-purple-600" size={16} />
                <span className="font-medium text-purple-800 text-sm">Consistency</span>
              </div>
              <div className="text-xl font-bold text-purple-700">{consistencyScore}%</div>
              <div className="text-xs text-purple-600">
                {positiveMonths} of {totalMonths} months positive
              </div>
            </div>

            {/* Quick Insights */}
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="text-blue-600" size={16} />
                <span className="font-medium text-blue-800 text-sm">Quick Insights</span>
              </div>
              <div className="space-y-1 text-xs text-blue-700">
                <div>• {avgSavingsRate >= 20 ? 'Excellent' : avgSavingsRate >= 10 ? 'Good' : 'Low'} savings rate</div>
                <div>• {consistencyScore >= 80 ? 'Consistent' : 'Inconsistent'} positive flow</div>
                <div>• {avgHealthScore >= 80 ? 'Excellent' : avgHealthScore >= 60 ? 'Good' : 'Needs improvement'} financial health</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            {renderChart()}
            
            {/* Month-by-Month Breakdown */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {enhancedData.slice(-6).map((item, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    selectedMonth === item.month 
                      ? 'border-purple-300 bg-purple-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedMonth(
                    selectedMonth === item.month ? null : item.month
                  )}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-sm">{item.month}</span>
                    <Badge 
                      variant={item.netFlow > 0 ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {item.netFlow > 0 ? '+' : ''}${item.netFlow.toLocaleString()}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-600 mb-1">
                    Savings Rate: {item.savingsRate}%
                  </div>
                  <div className="text-xs text-gray-600 mb-1">
                    Health Score: {item.healthScore}/100
                  </div>
                  {selectedMonth === item.month && (
                    <div className="text-xs text-blue-600 mt-2 p-2 bg-blue-50 rounded">
                      {item.insight}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CashFlowChart;