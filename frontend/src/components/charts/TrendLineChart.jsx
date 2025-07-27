import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { TrendingUp, TrendingDown, Calendar, Info, Target, BarChart3 } from 'lucide-react';
import { PECUNIA_CHART_COLORS } from '../../utils/chartColors';

const TrendLineChart = ({ 
  data, 
  title, 
  subtitle,
  xDataKey = 'month',
  yDataKey = 'value',
  color = PECUNIA_CHART_COLORS.primary[0], // Use consistent primary color
  showArea = false,
  showTrends = true,
  showProjection = true,
  benchmarkValue = null,
  onDataPointClick
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState('6M');
  const [showBenchmark, setShowBenchmark] = useState(benchmarkValue !== null);

  // Calculate trend and statistics
  const latestValue = data[data.length - 1]?.[yDataKey] || 0;
  const previousValue = data[data.length - 2]?.[yDataKey] || 0;
  const trend = latestValue > previousValue ? 'up' : 'down';
  const trendPercentage = previousValue !== 0 ? (((latestValue - previousValue) / previousValue) * 100).toFixed(1) : 0;
  
  const maxValue = Math.max(...data.map(item => item[yDataKey]));
  const minValue = Math.min(...data.map(item => item[yDataKey]));
  const avgValue = data.reduce((sum, item) => sum + item[yDataKey], 0) / data.length;

  // Generate projection data for next 3 months
  const projectionData = showProjection ? generateProjection(data, 3) : [];

  function generateProjection(historicalData, months) {
    const projection = [];
    const recent = historicalData.slice(-3);
    const avgGrowth = recent.reduce((sum, item, index) => {
      if (index === 0) return sum;
      const prevValue = recent[index - 1][yDataKey];
      return sum + ((item[yDataKey] - prevValue) / prevValue);
    }, 0) / (recent.length - 1);

    let lastValue = historicalData[historicalData.length - 1][yDataKey];
    const lastMonth = new Date(historicalData[historicalData.length - 1][xDataKey] + " 1, 2025");
    
    for (let i = 1; i <= months; i++) {
      const projectedValue = lastValue * (1 + avgGrowth);
      const projectedMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + i, 1);
      projection.push({
        [xDataKey]: projectedMonth.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        [yDataKey]: projectedValue,
        projected: true
      });
      lastValue = projectedValue;
    }
    
    return projection;
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <div className="font-semibold text-gray-800 dark:text-white mb-2">{label}</div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Value:</span>
              <span className="font-medium text-gray-900 dark:text-white">${payload[0].value.toLocaleString()}</span>
            </div>
            {data.projected && (
              <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                📈 Projected value
              </div>
            )}
            {benchmarkValue && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">vs. Benchmark:</span>
                <span className={`text-sm ${payload[0].value > benchmarkValue ? 'text-green-500' : 'text-red-500'}`}>
                  {payload[0].value > benchmarkValue ? 'Above' : 'Below'} (${benchmarkValue.toLocaleString()})
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

  const CustomDot = (props) => {
    const { cx, cy, payload } = props;
    if (payload.projected) {
      return (
        <circle 
          cx={cx} 
          cy={cy} 
          r={3} 
          fill="none" 
          stroke={color} 
          strokeWidth={2}
          strokeDasharray="4 4"
        />
      );
    }
    return (
      <circle 
        cx={cx} 
        cy={cy} 
        r={4} 
        fill={color}
        stroke="white"
        strokeWidth={2}
        className="cursor-pointer hover:r-6 transition-all duration-200"
        onClick={() => onDataPointClick && onDataPointClick(payload)}
      />
    );
  };

  const periods = ['3M', '6M', '1Y', '2Y', 'ALL'];
  const allData = [...data, ...projectionData];

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
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {periods.map((period) => (
                <Button
                  key={period}
                  variant={selectedPeriod === period ? "default" : "ghost"}
                  size="sm"
                  className={`px-3 py-1 text-xs ${
                    selectedPeriod === period 
                      ? 'bg-[#5945a3] text-white' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  onClick={() => setSelectedPeriod(period)}
                >
                  {period}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            {/* Key Metrics */}
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Current</span>
                  <div className="flex items-center gap-2">
                    {showTrends && (
                      <>
                        {trend === 'up' ? (
                          <TrendingUp className="text-green-500" size={16} />
                        ) : (
                          <TrendingDown className="text-red-500" size={16} />
                        )}
                        <span className={`text-sm ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                          {trendPercentage}%
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-xl font-bold text-[#5945a3]">
                  ${latestValue.toLocaleString()}
                </div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Average</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  ${avgValue.toLocaleString()}
                </div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Range</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  ${minValue.toLocaleString()} - ${maxValue.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Benchmark Toggle */}
            {benchmarkValue && (
              <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <span className="text-sm text-blue-800 dark:text-blue-200">Show Benchmark</span>
                <Button
                  variant={showBenchmark ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowBenchmark(!showBenchmark)}
                  className="text-xs"
                >
                  {showBenchmark ? 'Hide' : 'Show'}
                </Button>
              </div>
            )}

            {/* Quick Insights */}
            <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-3">
                <Target className="text-green-600 dark:text-green-400" size={16} />
                <span className="font-medium text-green-800 dark:text-green-200 text-sm">Insights</span>
              </div>
              <div className="space-y-1 text-xs text-green-700 dark:text-green-300">
                <div>• {trend === 'up' ? 'Positive' : 'Negative'} trend ({trendPercentage}%)</div>
                <div>• {latestValue > avgValue ? 'Above' : 'Below'} average</div>
                {benchmarkValue && (
                  <div>• {latestValue > benchmarkValue ? 'Outperforming' : 'Underperforming'} benchmark</div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <ResponsiveContainer width="100%" height={350}>
              {showArea ? (
                <AreaChart data={allData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey={xDataKey} 
                    stroke="#666"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#666"
                    fontSize={12}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey={yDataKey} 
                    stroke={color}
                    fill={color}
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                  {showBenchmark && benchmarkValue && (
                    <Line
                      type="monotone"
                      dataKey={() => benchmarkValue}
                      stroke={PECUNIA_CHART_COLORS.primary[4]} // Warning yellow
                      strokeDasharray="5 5"
                      strokeWidth={2}
                      dot={false}
                      name="Benchmark"
                    />
                  )}
                </AreaChart>
              ) : (
                <LineChart data={allData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey={xDataKey} 
                    stroke="#666"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#666"
                    fontSize={12}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey={yDataKey} 
                    stroke={color}
                    strokeWidth={3}
                    dot={<CustomDot />}
                    activeDot={{ r: 6, fill: color }}
                  />
                  {showBenchmark && benchmarkValue && (
                    <Line
                      type="monotone"
                      dataKey={() => benchmarkValue}
                      stroke={PECUNIA_CHART_COLORS.primary[4]} // Warning yellow
                      strokeDasharray="5 5"
                      strokeWidth={2}
                      dot={false}
                      name="Benchmark"
                    />
                  )}
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendLineChart;