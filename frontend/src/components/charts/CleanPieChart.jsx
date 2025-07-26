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
        <div className="bg-white dark:bg-gray-800 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm backdrop-blur-sm">
          <div className="font-medium text-gray-900 dark:text-white text-sm">{data.name}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">${data.value.toLocaleString()}</div>
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
    <div className="card-system h-full">
      {title && (
        <div className="px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-center">
            <h3 className="visual-hierarchy-3 text-gray-900 dark:text-white">{title}</h3>
            <div className="text-right">
              <div className="text-lg font-semibold text-[#5945a3]">
                {centerValue || `$${(total / 1000).toFixed(0)}K`}
              </div>
              <div className="text-xs text-muted">Total</div>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col h-full">
        <div className="relative bg-white dark:bg-gray-900 px-4 py-2">
          {/* Clean pie chart with proper spacing */}
          <ResponsiveContainer width="100%" height={260}>
            <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={45}
                paddingAngle={1}
                dataKey="value"
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
                onClick={(data) => onSegmentClick && onSegmentClick(data)}
                className="cursor-pointer outline-none"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    stroke={activeIndex === index ? '#ffffff' : 'none'}
                    strokeWidth={activeIndex === index ? 2 : 0}
                    className="transition-all duration-200 ease-out focus:outline-none"
                    style={{
                      filter: activeIndex === index ? 'brightness(1.05)' : 'brightness(1)',
                      transformOrigin: 'center'
                    }}
                  />
                ))}
              </Pie>
              <Tooltip 
                content={<CustomTooltip />}
                wrapperStyle={{ outline: 'none' }}
                cursor={false}
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center value display */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900 dark:text-white transition-all duration-200">
                {activeIndex !== null 
                  ? `${chartData[activeIndex].percentage}%` 
                  : `${chartData.length}`
                }
              </div>
              <div className="text-xs text-muted mt-1 transition-all duration-200">
                {activeIndex !== null 
                  ? chartData[activeIndex].name 
                  : 'Categories'
                }
              </div>
            </div>
          </div>
        </div>

        {/* Clean legend with proper spacing */}
        <div className="px-6 pb-6 pt-2 flex-1">
          <div className="grid grid-cols-1 gap-1">
            {chartData.map((entry, index) => (
              <div 
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 cursor-pointer group ${
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
                      transform: activeIndex === index ? 'scale(1.15)' : 'scale(1)'
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm truncate text-gray-900 dark:text-white">{entry.name}</div>
                    <div className="text-xs text-muted">{entry.percentage}%</div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-3">
                  <div className="font-semibold text-sm text-gray-900 dark:text-white">${entry.value.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CleanPieChart;