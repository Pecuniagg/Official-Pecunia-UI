import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { TrendingUp, TrendingDown, Award, Target, Info, Users, BarChart3 } from 'lucide-react';
import { PECUNIA_CHART_COLORS } from '../../utils/chartColors';

const ComparisonBarChart = ({ 
  data, 
  title, 
  subtitle,
  xDataKey = 'category',
  yDataKey = 'value',
  comparisonKey = 'benchmark',
  colors, // Allow override but use consistent colors by default
  showComparison = true,
  showPercentages = true,
  benchmarkLabel = 'Benchmark',
  userLabel = 'You',
  onBarClick
}) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortBy, setSortBy] = useState('value');
  const [sortOrder, setSortOrder] = useState('desc');

  // Use consistent colors unless specifically overridden
  const chartColors = colors || [PECUNIA_CHART_COLORS.primary[0], PECUNIA_CHART_COLORS.primary[1]];

  // Enhanced data with calculations and insights
  const enhancedData = data.map(item => {
    const userValue = item[yDataKey];
    const benchmarkValue = item[comparisonKey] || 0;
    const difference = userValue - benchmarkValue;
    const percentageDiff = benchmarkValue !== 0 ? ((difference / benchmarkValue) * 100).toFixed(1) : 0;
    
    return {
      ...item,
      difference,
      percentageDiff: parseFloat(percentageDiff),
      performance: difference > 0 ? 'above' : difference < 0 ? 'below' : 'equal',
      insight: generateInsight(item.name, userValue, benchmarkValue, difference)
    };
  });

  function generateInsight(category, userValue, benchmarkValue, difference) {
    const absPercentage = Math.abs(((difference / benchmarkValue) * 100)).toFixed(0);
    if (difference > 0) {
      return `You're ${absPercentage}% above average in ${category}`;
    } else if (difference < 0) {
      return `You're ${absPercentage}% below average in ${category}`;
    } else {
      return `You're right on average for ${category}`;
    }
  }

  // Sort data
  const sortedData = [...enhancedData].sort((a, b) => {
    const aValue = sortBy === 'value' ? a[yDataKey] : a.percentageDiff;
    const bValue = sortBy === 'value' ? b[yDataKey] : b.percentageDiff;
    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
  });

  // Calculate summary statistics
  const totalCategories = enhancedData.length;
  const aboveAverage = enhancedData.filter(item => item.performance === 'above').length;
  const belowAverage = enhancedData.filter(item => item.performance === 'below').length;
  const overallScore = (aboveAverage / totalCategories * 100).toFixed(0);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = sortedData.find(item => item[xDataKey] === label);
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-w-sm">
          <div className="font-semibold text-gray-800 dark:text-white mb-2">{label}</div>
          <div className="space-y-2">
            {payload.map((entry, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">{entry.name}:</span>
                <span className="font-medium text-gray-900 dark:text-white">${entry.value.toLocaleString()}</span>
              </div>
            ))}
            {data && (
              <>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Difference:</span>
                  <span className={`font-medium ${data.performance === 'above' ? 'text-green-500' : 'text-red-500'}`}>
                    {data.performance === 'above' ? '+' : ''}${data.difference.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">% vs Average:</span>
                  <span className={`font-medium ${data.performance === 'above' ? 'text-green-500' : 'text-red-500'}`}>
                    {data.performance === 'above' ? '+' : ''}{data.percentageDiff}%
                  </span>
                </div>
                <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/30 rounded text-xs text-blue-800 dark:text-blue-200">
                  💡 {data.insight}
                </div>
              </>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full shadow-lg card-premium hover-glow-subtle">
      <CardHeader className="pb-6">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <BarChart3 className="text-[#5945a3]" size={20} />
              {title}
              <Info size={16} className="text-gray-400" />
            </CardTitle>
            {subtitle && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={sortBy === 'value' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('value')}
              className="text-xs"
            >
              Sort by Value
            </Button>
            <Button
              variant={sortBy === 'performance' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('performance')}
              className="text-xs"
            >
              Sort by Performance
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="text-xs"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            {/* Performance Summary */}
            <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-2 mb-3">
                <Award className="text-purple-600 dark:text-purple-400" size={20} />
                <span className="font-medium text-purple-800 dark:text-purple-200">Performance Score</span>
              </div>
              <div className="text-3xl font-bold text-purple-700 dark:text-purple-300 mb-2">{overallScore}%</div>
              <div className="text-sm text-purple-600 dark:text-purple-400">
                Above average in {aboveAverage} of {totalCategories} categories
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingUp className="text-green-600 dark:text-green-400" size={16} />
                  <span className="text-sm text-green-800 dark:text-green-200">Above Average</span>
                </div>
                <span className="font-bold text-green-700 dark:text-green-300">{aboveAverage}</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingDown className="text-red-600 dark:text-red-400" size={16} />
                  <span className="text-sm text-red-800 dark:text-red-200">Below Average</span>
                </div>
                <span className="font-bold text-red-700 dark:text-red-300">{belowAverage}</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <Target className="text-blue-600 dark:text-blue-400" size={16} />
                  <span className="text-sm text-blue-800 dark:text-blue-200">On Target</span>
                </div>
                <span className="font-bold text-blue-700 dark:text-blue-300">
                  {totalCategories - aboveAverage - belowAverage}
                </span>
              </div>
            </div>

            {/* Top Performers */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Users className="text-gray-600 dark:text-gray-400" size={16} />
                <span className="font-medium text-gray-800 dark:text-gray-200 text-sm">Top Performers</span>
              </div>
              <div className="space-y-2">
                {enhancedData
                  .filter(item => item.performance === 'above')
                  .sort((a, b) => b.percentageDiff - a.percentageDiff)
                  .slice(0, 3)
                  .map((item, index) => (
                    <div key={index} className="flex justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-400 truncate">{item[xDataKey]}</span>
                      <span className="text-green-600 dark:text-green-400 font-medium">+{item.percentageDiff}%</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={sortedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey={xDataKey} 
                  stroke="#666"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  stroke="#666"
                  fontSize={12}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar 
                  dataKey={yDataKey} 
                  name={userLabel}
                  fill={chartColors[0]}
                  radius={[4, 4, 0, 0]}
                  onClick={(data) => onBarClick && onBarClick(data)}
                  className="cursor-pointer"
                >
                  {sortedData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.performance === 'above' ? chartColors[0] : chartColors[1]}
                    />
                  ))}
                </Bar>
                {showComparison && (
                  <Bar 
                    dataKey={comparisonKey} 
                    name={benchmarkLabel}
                    fill="#e2e8f0"
                    radius={[4, 4, 0, 0]}
                    opacity={0.7}
                  />
                )}
              </BarChart>
            </ResponsiveContainer>

            {/* Category Details */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedData.slice(0, 4).map((item, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    selectedCategory === item[xDataKey] 
                      ? 'border-purple-300 bg-purple-50 dark:border-purple-600 dark:bg-purple-900/20' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => setSelectedCategory(
                    selectedCategory === item[xDataKey] ? null : item[xDataKey]
                  )}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-sm text-gray-900 dark:text-white">{item[xDataKey]}</span>
                    <Badge 
                      variant={item.performance === 'above' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {item.performance === 'above' ? '+' : ''}{item.percentageDiff}%
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    You: ${item[yDataKey].toLocaleString()} | Avg: ${item[comparisonKey].toLocaleString()}
                  </div>
                  {selectedCategory === item[xDataKey] && (
                    <div className="text-xs text-blue-600 dark:text-blue-400 mt-2 p-2 bg-blue-50 dark:bg-blue-900/30 rounded">
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

export default ComparisonBarChart;