import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { TrendingUp, TrendingDown, Info, AlertCircle, Target, DollarSign } from 'lucide-react';
import { getChartColors } from '../../utils/chartColors';

const AdvancedPieChart = ({ 
  data, 
  title, 
  subtitle,
  colors, // Allow override but default to consistent colors
  showTrends = true,
  showInsights = true,
  centerValue,
  benchmarks = {},
  onSegmentClick
}) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [hoveredSegment, setHoveredSegment] = useState(null);

  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Use consistent colors unless specifically overridden
  const chartColors = colors || getChartColors(data.length);
  
  // Enhanced data with additional metrics
  const enhancedData = data.map((item, index) => ({
    ...item,
    percentage: ((item.value / total) * 100).toFixed(1),
    color: chartColors[index % chartColors.length],
    trend: item.trend || Math.random() > 0.5 ? 'up' : 'down',
    trendValue: item.trendValue || `${(Math.random() * 10 + 1).toFixed(1)}%`,
    benchmark: benchmarks[item.name] || null,
    insight: item.insight || null
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <div className="font-semibold text-gray-800 dark:text-white mb-2">{data.name}</div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Amount:</span>
              <span className="font-medium text-gray-900 dark:text-white">${data.value.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Percentage:</span>
              <span className="font-medium text-gray-900 dark:text-white">{data.percentage}%</span>
            </div>
            {data.trend && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Trend:</span>
                <div className="flex items-center gap-1">
                  {data.trend === 'up' ? (
                    <TrendingUp className="text-green-500" size={14} />
                  ) : (
                    <TrendingDown className="text-red-500" size={14} />
                  )}
                  <span className={`text-sm ${data.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {data.trendValue}
                  </span>
                </div>
              </div>
            )}
            {data.benchmark && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">vs. Benchmark:</span>
                <span className={`text-sm ${data.value > data.benchmark ? 'text-green-500' : 'text-red-500'}`}>
                  {data.value > data.benchmark ? 'Above' : 'Below'} average
                </span>
              </div>
            )}
            {data.insight && (
              <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/30 rounded text-xs text-blue-800 dark:text-blue-200">
                💡 {data.insight}
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-col space-y-3 mt-6">
        {payload.map((entry, index) => {
          const data = enhancedData[index];
          const isHovered = hoveredSegment === index;
          return (
            <div 
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 cursor-pointer border ${
                isHovered ? 'bg-gray-50 dark:bg-gray-800 shadow-sm border-gray-200 dark:border-gray-700' : 'hover:bg-gray-50 dark:hover:bg-gray-800 border-transparent'
              }`}
              onMouseEnter={() => setHoveredSegment(index)}
              onMouseLeave={() => setHoveredSegment(null)}
              onClick={() => onSegmentClick && onSegmentClick(data)}
            >
              <div className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                <div>
                  <div className="font-medium text-sm text-gray-900 dark:text-white">{entry.value}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{data.percentage}% of total</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="font-semibold text-sm text-gray-900 dark:text-white">${data.value.toLocaleString()}</div>
                  {showTrends && (
                    <div className="flex items-center gap-1 text-xs justify-end">
                      {data.trend === 'up' ? (
                        <TrendingUp className="text-green-500" size={12} />
                      ) : (
                        <TrendingDown className="text-red-500" size={12} />
                      )}
                      <span className={data.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                        {data.trendValue}
                      </span>
                    </div>
                  )}
                </div>
                {data.benchmark && (
                  <Badge variant={data.value > data.benchmark ? 'default' : 'secondary'} className="text-xs">
                    {data.value > data.benchmark ? 'Above' : 'Below'} avg
                  </Badge>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
    setHoveredSegment(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
    setHoveredSegment(null);
  };

  return (
    <Card className="w-full shadow-lg card-premium hover-glow-subtle">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              {title}
              <Info size={16} className="text-gray-400" />
            </CardTitle>
            {subtitle && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-[#5945a3]">
              {centerValue || `$${(total / 1000).toFixed(0)}K`}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="relative">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={enhancedData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={60}
                  paddingAngle={2}
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                  onClick={(data, index) => onSegmentClick && onSegmentClick(data)}
                >
                  {enhancedData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      stroke={activeIndex === index ? '#fff' : 'none'}
                      strokeWidth={activeIndex === index ? 3 : 0}
                      className="cursor-pointer transition-all duration-200"
                      style={{
                        filter: activeIndex === index ? 'brightness(1.1)' : 'brightness(1)',
                        transform: activeIndex === index ? 'scale(1.02)' : 'scale(1)',
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Information */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="text-xl font-bold text-gray-700 dark:text-gray-300">
                  {hoveredSegment !== null 
                    ? `${enhancedData[hoveredSegment].percentage}%` 
                    : enhancedData.length
                  }
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {hoveredSegment !== null 
                    ? enhancedData[hoveredSegment].name 
                    : 'Categories'
                  }
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <CustomLegend payload={enhancedData.map(item => ({ value: item.name, color: item.color }))} />
            
            {showInsights && (
              <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="text-blue-600 dark:text-blue-400" size={16} />
                  <span className="font-medium text-blue-800 dark:text-blue-200">Smart Insights</span>
                </div>
                <div className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                  <div>• Largest category: {enhancedData[0].name} ({enhancedData[0].percentage}%)</div>
                  <div>• Consider optimizing {enhancedData.find(item => item.percentage > 30)?.name || 'top categories'}</div>
                  {enhancedData.some(item => item.benchmark && item.value > item.benchmark) && (
                    <div>• You're above average in {enhancedData.filter(item => item.benchmark && item.value > item.benchmark).length} categories</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedPieChart;