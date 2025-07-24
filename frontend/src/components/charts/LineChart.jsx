import React from 'react';

const LineChartComponent = ({ data, title }) => {
  // Simple mock line chart component
  return (
    <div className="w-full h-48 bg-gray-50 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="text-lg font-semibold text-gray-600 mb-2">{title}</div>
        <div className="text-sm text-gray-500">Line Chart Component</div>
        <div className="text-xs text-gray-400">Mock visualization</div>
      </div>
    </div>
  );
};

export default LineChartComponent;