import React from 'react';

const PieChartComponent = ({ data, colors = ['#5945A3', '#B37E91', '#39D98A', '#FF4D67', '#FFB800', '#00D4FF'] }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  let cumulativePercentage = 0;
  const segments = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const startAngle = cumulativePercentage * 3.6; // Convert percentage to degrees
    const endAngle = (cumulativePercentage + percentage) * 3.6;
    cumulativePercentage += percentage;
    
    const largeArcFlag = percentage > 50 ? 1 : 0;
    const x1 = 50 + 40 * Math.cos((startAngle - 90) * Math.PI / 180);
    const y1 = 50 + 40 * Math.sin((startAngle - 90) * Math.PI / 180);
    const x2 = 50 + 40 * Math.cos((endAngle - 90) * Math.PI / 180);
    const y2 = 50 + 40 * Math.sin((endAngle - 90) * Math.PI / 180);
    
    const pathData = [
      `M 50 50`,
      `L ${x1} ${y1}`,
      `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');
    
    return {
      path: pathData,
      color: colors[index % colors.length],
      percentage: percentage.toFixed(1),
      ...item
    };
  });

  return (
    <div className="flex items-center justify-between">
      <div className="relative">
        <svg width="200" height="200" viewBox="0 0 100 100" className="transform hover:scale-105 transition-transform duration-300">
          {segments.map((segment, index) => (
            <path
              key={index}
              d={segment.path}
              fill={segment.color}
              className="hover:opacity-80 transition-opacity duration-200 cursor-pointer"
              stroke="white"
              strokeWidth="0.5"
            />
          ))}
          <circle cx="50" cy="50" r="15" fill="white" />
          <text x="50" y="55" textAnchor="middle" className="text-xs font-semibold fill-gray-800">
            ${(total / 1000).toFixed(0)}K
          </text>
        </svg>
      </div>
      
      <div className="flex-1 ml-8">
        <div className="space-y-3">
          {segments.map((segment, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: segment.color }}
                />
                <span className="text-sm font-medium text-gray-700">{segment.name}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold">${segment.value.toLocaleString()}</div>
                <div className="text-xs text-gray-500">{segment.percentage}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PieChartComponent;