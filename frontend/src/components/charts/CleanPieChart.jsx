import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const CleanPieChart = ({ 
  data, 
  title, 
  colors = ['#5945a3', '#b37e91', '#1e1b24', '#3b345b', '#0a0a0f'],
  centerValue,
  onSegmentClick
}) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Clean data preparation
  const chartData = data.map((item, index) => ({
    ...item,
    percentage: ((item.value / total) * 100).toFixed(1),
    color: colors[index % colors.length]
  }));

  // Simplified, clean tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white px-3 py-2 border border-gray-200 rounded-lg shadow-sm">
          <div className="font-medium text-gray-900 text-sm">{data.name}</div>
          <div className="text-sm text-gray-600">${data.value.toLocaleString()}</div>
          <div className="text-xs text-[#5945a3]">{data.percentage}%</div>
        </div>
      );
    }
    return null;
  };

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  return (
    <Card className="card-system">
      {title && (
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="visual-hierarchy-3">{title}</CardTitle>
            <div className="text-right">
              <div className="text-lg font-semibold text-[#5945a3]">
                {centerValue || `$${(total / 1000).toFixed(0)}K`}
              </div>
              <div className="text-xs text-muted">Total</div>
            </div>
          </div>
        </CardHeader>
      )}
      <CardContent className="p-0">
        <div className="relative">
          {/* Clean pie chart with proper spacing */}
          <ResponsiveContainer width="100%" height={280}>
            <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={50}
                paddingAngle={1}
                dataKey="value"
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
                onClick={(data) => onSegmentClick && onSegmentClick(data)}
                className="cursor-pointer"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    stroke={activeIndex === index ? '#ffffff' : 'none'}
                    strokeWidth={activeIndex === index ? 2 : 0}
                    className="transition-all duration-200 ease-out"
                    style={{
                      filter: activeIndex === index ? 'brightness(1.05)' : 'brightness(1)',
                      transformOrigin: 'center'
                    }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center value display */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900 dark:text-white">
                {activeIndex !== null 
                  ? `${chartData[activeIndex].percentage}%` 
                  : `${chartData.length}`
                }
              </div>
              <div className="text-xs text-muted mt-1">
                {activeIndex !== null 
                  ? chartData[activeIndex].name 
                  : 'Categories'
                }
              </div>
            </div>
          </div>
        </div>

        {/* Clean legend with proper spacing */}
        <div className="px-6 pb-6 pt-4">
          <div className="grid grid-cols-1 gap-2">
            {chartData.map((entry, index) => (
              <div 
                key={index}
                className={`flex items-center justify-between p-2 rounded-lg transition-all duration-200 cursor-pointer group ${
                  activeIndex === index ? 'bg-gray-50 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                onClick={() => onSegmentClick && onSegmentClick(entry)}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0 transition-all duration-200"
                    style={{ 
                      backgroundColor: entry.color,
                      transform: activeIndex === index ? 'scale(1.2)' : 'scale(1)'
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm truncate">{entry.name}</div>
                    <div className="text-xs text-muted">{entry.percentage}% of total</div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-semibold text-sm">${entry.value.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CleanPieChart;