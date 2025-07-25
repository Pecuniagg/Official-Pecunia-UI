import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-secondary">Theme</span>
      <button
        onClick={toggleTheme}
        className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full theme-toggle hover-lift-premium focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
        aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
      >
        <div className="flex items-center gap-2">
          <Sun 
            className={`w-4 h-4 transition-all duration-300 ${
              isDarkMode ? 'opacity-50 scale-90' : 'opacity-100 scale-100'
            }`} 
          />
          <div className="relative">
            <div className="w-8 h-4 bg-white/20 rounded-full">
              <div
                className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-all duration-300 ${
                  isDarkMode ? 'translate-x-4' : 'translate-x-0.5'
                }`}
              />
            </div>
          </div>
          <Moon 
            className={`w-4 h-4 transition-all duration-300 ${
              isDarkMode ? 'opacity-100 scale-100' : 'opacity-50 scale-90'
            }`} 
          />
        </div>
        <span className="text-sm font-medium text-white">
          {isDarkMode ? 'Dark' : 'Light'}
        </span>
      </button>
    </div>
  );
};

export default ThemeToggle;