import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Activity,
  Target,
  Award,
  Info,
  Download,
  Share2,
  RefreshCw,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

import AdvancedPieChart from './charts/AdvancedPieChart';
import CleanPieChart from './charts/CleanPieChart';
import TrendLineChart from './charts/TrendLineChart';
import ComparisonBarChart from './charts/ComparisonBarChart';
import CashFlowChart from './charts/CashFlowChart';

const AdvancedAnalyticsDashboard = ({ data }) => {
  const [selectedInsight, setSelectedInsight] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Mock data for demonstration - in real app, this would come from props or API
  const mockData = {
    expenses: [
      { name: 'Housing', value: 1500, percentage: 40, trend: 'up', trendValue: '2.3%', insight: 'Housing costs are within healthy range but trending up' },
      { name: 'Food', value: 600, percentage: 16, trend: 'down', trendValue: '1.2%', insight: 'Great job reducing food expenses this month' },
      { name: 'Transportation', value: 450, percentage: 12, trend: 'up', trendValue: '5.1%', insight: 'Transportation costs increased - consider carpooling or public transit' },
      { name: 'Entertainment', value: 300, percentage: 8, trend: 'up', trendValue: '3.4%', insight: 'Entertainment spending is reasonable but trending up' },
      { name: 'Other', value: 900, percentage: 24, trend: 'down', trendValue: '0.8%', insight: 'Other expenses are well-controlled' }
    ],
    assets: [
      { name: 'Savings', value: 25000, percentage: 45, trend: 'up', trendValue: '4.2%', insight: 'Excellent savings growth rate' },
      { name: 'Investments', value: 20000, percentage: 36, trend: 'up', trendValue: '6.1%', insight: 'Strong investment performance' },
      { name: 'Real Estate', value: 8000, percentage: 14, trend: 'up', trendValue: '1.5%', insight: 'Real estate value appreciation' },
      { name: 'Other', value: 3000, percentage: 5, trend: 'down', trendValue: '0.3%', insight: 'Other assets remain stable' }
    ],
    trends: [
      { month: 'Jan', value: 3200, insight: 'Strong start to the year' },
      { month: 'Feb', value: 3450, insight: 'Continued growth momentum' },
      { month: 'Mar', value: 3300, insight: 'Slight dip but still positive' },
      { month: 'Apr', value: 3800, insight: 'Excellent recovery' },
      { month: 'May', value: 3950, insight: 'New monthly record' },
      { month: 'Jun', value: 4100, insight: 'Outstanding performance' },
      { month: 'Jul', value: 4200, insight: 'Maintaining strong trajectory' }
    ],
    comparison: [
      { category: 'Savings Rate', value: 2750, benchmark: 2200, insight: 'You save 25% more than average' },
      { category: 'Monthly Expenses', value: 3750, benchmark: 4200, insight: 'Your expenses are 11% below average' },
      { category: 'Investment Returns', value: 1200, benchmark: 980, insight: 'Your returns are 22% above average' },
      { category: 'Emergency Fund', value: 8500, benchmark: 6000, insight: 'Strong emergency fund - 42% above recommended' },
      { category: 'Debt to Income', value: 1200, benchmark: 1800, insight: 'Excellent debt management - 33% below average' }
    ],
    cashFlow: [
      { month: 'Jan', income: 6500, expenses: 3200, netFlow: 3300 },
      { month: 'Feb', income: 6600, expenses: 3450, netFlow: 3150 },
      { month: 'Mar', income: 6500, expenses: 3300, netFlow: 3200 },
      { month: 'Apr', income: 6700, expenses: 3800, netFlow: 2900 },
      { month: 'May', income: 6800, expenses: 3950, netFlow: 2850 },
      { month: 'Jun', income: 6500, expenses: 4100, netFlow: 2400 },
      { month: 'Jul', income: 6600, expenses: 4200, netFlow: 2400 }
    ]
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const handleExport = () => {
    // Export functionality
    console.log('Exporting analytics data...');
  };

  const handleShare = () => {
    // Share functionality
    console.log('Sharing analytics...');
  };

  const overallInsights = [
    {
      type: 'success',
      icon: CheckCircle,
      title: 'Strong Financial Health',
      message: 'Your savings rate is 25% above average and you maintain consistent positive cash flow.',
      action: 'View Details',
      actionFn: () => setSelectedInsight('savings')
    },
    {
      type: 'warning',
      icon: AlertCircle,
      title: 'Transportation Costs Rising',
      message: 'Transportation expenses increased by 5.1% last month. Consider optimization strategies.',
      action: 'Optimize Now',
      actionFn: () => setSelectedInsight('transportation')
    },
    {
      type: 'info',
      icon: TrendingUp,
      title: 'Investment Performance',
      message: 'Your investments are performing 22% above market average. Consider rebalancing.',
      action: 'Review Portfolio',
      actionFn: () => setSelectedInsight('investments')
    }
  ];

  const QuickInsightCard = ({ insight }) => {
    const IconComponent = insight.icon;
    const colorClasses = {
      success: 'bg-green-50 border-green-200 text-green-800',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      info: 'bg-blue-50 border-blue-200 text-blue-800'
    };

    return (
      <Card className={`${colorClasses[insight.type]} border-2 transition-all duration-200 hover:shadow-md`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <IconComponent size={20} className="mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-semibold text-sm mb-1">{insight.title}</h4>
              <p className="text-xs mb-3 opacity-90">{insight.message}</p>
              <Button 
                size="sm" 
                variant="outline" 
                className="text-xs"
                onClick={insight.actionFn}
              >
                {insight.action}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="breathing-space-lg">
      {/* Header with Actions */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="visual-hierarchy-1 text-gray-900 dark:text-white">Advanced Analytics</h1>
          <p className="text-muted mt-2">Comprehensive financial insights and visualization</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing} className="interactive border-gray-200">
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport} className="interactive border-gray-200">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare} className="interactive border-gray-200">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {overallInsights.map((insight, index) => (
          <QuickInsightCard key={index} insight={insight} />
        ))}
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-gray-50 dark:bg-gray-800 p-1 rounded-lg mb-8">
          <TabsTrigger value="overview" className="interactive flex items-center gap-2 text-sm font-medium">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="expenses" className="interactive flex items-center gap-2 text-sm font-medium">
            <PieChart className="h-4 w-4" />
            Expenses
          </TabsTrigger>
          <TabsTrigger value="trends" className="interactive flex items-center gap-2 text-sm font-medium">
            <TrendingUp className="h-4 w-4" />
            Trends
          </TabsTrigger>
          <TabsTrigger value="comparison" className="interactive flex items-center gap-2 text-sm font-medium">
            <Award className="h-4 w-4" />
            Comparison
          </TabsTrigger>
          <TabsTrigger value="cashflow" className="interactive flex items-center gap-2 text-sm font-medium">
            <Activity className="h-4 w-4" />
            Cash Flow
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <CleanPieChart 
              data={mockData.expenses}
              title="Monthly Expenses Breakdown"
              colors={['#5945a3', '#b37e91', '#1e1b24', '#3b345b', '#0a0a0f']}
              onSegmentClick={(data) => console.log('Expense segment clicked:', data)}
            />
            <CleanPieChart 
              data={mockData.assets}
              title="Asset Distribution"
              colors={['#5945a3', '#b37e91', '#1e1b24', '#3b345b']}
              centerValue="$56K"
              onSegmentClick={(data) => console.log('Asset segment clicked:', data)}
            />
          </div>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-8">
          <div className="max-w-4xl mx-auto">
            <CleanPieChart 
              data={mockData.expenses}
              title="Detailed Expense Analysis"
              colors={['#5945a3', '#b37e91', '#1e1b24', '#3b345b', '#0a0a0f']}
              onSegmentClick={(data) => console.log('Detailed expense clicked:', data)}
            />
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <TrendLineChart
            data={mockData.trends}
            title="Net Worth Trend Analysis"
            subtitle="Your financial growth over time with projections"
            showArea={false}
            showTrends={true}
            showProjection={true}
            benchmarkValue={3500}
            onDataPointClick={(data) => console.log('Trend point clicked:', data)}
          />
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <ComparisonBarChart
            data={mockData.comparison}
            title="Performance vs Peers"
            subtitle="How you compare to others in your age group and income bracket"
            showComparison={true}
            showPercentages={true}
            benchmarkLabel="Age Group Average"
            userLabel="Your Performance"
            onBarClick={(data) => console.log('Comparison bar clicked:', data)}
          />
        </TabsContent>

        <TabsContent value="cashflow" className="space-y-6">
          <CashFlowChart
            data={mockData.cashFlow}
            title="Monthly Cash Flow Analysis"
            subtitle="Income vs expenses with financial health indicators"
            showProjection={true}
            onDataPointClick={(data) => console.log('Cash flow point clicked:', data)}
          />
        </TabsContent>
      </Tabs>

      {/* Detailed Insight Modal/Panel */}
      {selectedInsight && (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Info className="text-blue-600" size={20} />
                Detailed Insight: {selectedInsight}
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedInsight(null)}
              >
                ×
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg">
                <h4 className="font-semibold mb-2">Analysis Summary</h4>
                <p className="text-sm text-gray-600">
                  Based on your {selectedInsight} data, we've identified key patterns and opportunities 
                  for optimization. This analysis uses AI to provide personalized recommendations.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-white rounded-lg">
                  <h5 className="font-medium text-sm mb-2">Key Findings</h5>
                  <ul className="text-xs space-y-1">
                    <li>• Performance above average</li>
                    <li>• Positive trend trajectory</li>
                    <li>• Room for optimization</li>
                  </ul>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <h5 className="font-medium text-sm mb-2">Recommendations</h5>
                  <ul className="text-xs space-y-1">
                    <li>• Continue current strategy</li>
                    <li>• Consider rebalancing</li>
                    <li>• Monitor trends closely</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdvancedAnalyticsDashboard;