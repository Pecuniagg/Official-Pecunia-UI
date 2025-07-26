import React from 'react';

const ColorSystemDemo = () => {
  return (
    <div className="app-modern min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-modern-hero mb-4">
            Modern Color System Demo
          </h1>
          <p className="text-modern-subtitle">
            Rich gradient-enhanced color system with depth and elegance
          </p>
        </div>

        {/* Card System Demo */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="card-modern p-6">
            <h3 className="text-modern-title mb-3">Standard Card</h3>
            <p className="text-modern-body mb-4">
              Modern card with gradient background and subtle animations
            </p>
            <div className="flex gap-3">
              <div className="status-positive">+12.5%</div>
              <div className="status-negative">-3.2%</div>
            </div>
          </div>

          <div className="card-data-rich p-6">
            <h3 className="text-modern-title mb-3">Data Rich Card</h3>
            <p className="text-modern-body mb-4">
              Enhanced card with data depth gradients and tactile feel
            </p>
            <div className="progress-modern mb-4">
              <div className="progress-modern-bar" style={{ width: '75%' }}></div>
            </div>
            <div className="text-gradient-primary text-sm font-semibold">
              Progress: 75%
            </div>
          </div>

          <div className="card-elevated p-6">
            <h3 className="text-modern-title mb-3">Elevated Card</h3>
            <p className="text-modern-body mb-4">
              Premium elevated card with advanced shadow and glow effects
            </p>
            <div className="metric-card p-4 mt-4">
              <div className="metric-value">$12,459</div>
              <div className="metric-label">Total Value</div>
            </div>
          </div>
        </div>

        {/* Button System Demo */}
        <div className="card-modern p-8 mb-12">
          <h2 className="text-modern-title mb-6">Enhanced Button System</h2>
          <div className="flex flex-wrap gap-4">
            <button className="btn-modern-primary">
              Primary Action
            </button>
            <button className="btn-modern-secondary">
              Secondary Action
            </button>
            <button className="btn-modern-primary glow-primary">
              Glowing Button
            </button>
          </div>
        </div>

        {/* Status & Progress Demo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="card-modern p-6">
            <h3 className="text-modern-title mb-4">Status Indicators</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="status-positive">
                  <span>✓</span> Positive Status
                </div>
                <span className="text-modern-body">Portfolio up 15.2%</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="status-negative">
                  <span>✗</span> Negative Status
                </div>
                <span className="text-modern-body">Risk level increased</span>
              </div>
            </div>
          </div>

          <div className="card-modern p-6">
            <h3 className="text-modern-title mb-4">Progress System</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-modern-body">Savings Goal</span>
                  <span className="text-gradient-primary font-semibold">85%</span>
                </div>
                <div className="progress-modern">
                  <div className="progress-modern-bar" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-modern-body">Investment Portfolio</span>
                  <span className="text-gradient-secondary font-semibold">62%</span>
                </div>
                <div className="progress-modern">
                  <div className="progress-modern-bar" style={{ width: '62%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Demo */}
        <div className="chart-modern mb-12">
          <h3 className="text-modern-title mb-4">Chart Container</h3>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <div className="metric-value text-4xl mb-2">$45,892</div>
              <div className="metric-label">Total Portfolio Value</div>
              <div className="mt-4 flex justify-center gap-4">
                <div className="glow-success px-4 py-2 rounded-lg">
                  <span className="text-gradient-primary">+12.5% YTD</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Input System Demo */}
        <div className="card-modern p-6 mb-12">
          <h3 className="text-modern-title mb-4">Enhanced Input System</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="text" 
              placeholder="Enter your name..."
              className="input-modern"
            />
            <input 
              type="email" 
              placeholder="Enter your email..."
              className="input-modern"
            />
          </div>
        </div>

        {/* Navigation Demo */}
        <div className="card-modern p-6 mb-12">
          <h3 className="text-modern-title mb-4">Navigation System</h3>
          <div className="nav-modern rounded-lg p-4 max-w-sm">
            <div className="nav-modern-item">
              <span>📊</span> Dashboard
            </div>
            <div className="nav-modern-item active">
              <span>🎯</span> Goals
            </div>
            <div className="nav-modern-item">
              <span>💰</span> Portfolio
            </div>
            <div className="nav-modern-item">
              <span>📈</span> Analytics
            </div>
          </div>
        </div>

        {/* Glass Effect Demo */}
        <div className="glass-effect p-8 mb-12">
          <h3 className="text-modern-title mb-4">Glass Morphism Effect</h3>
          <p className="text-modern-body">
            This demonstrates the glass morphism effect with backdrop blur and subtle transparency.
            The effect adapts beautifully to both light and dark modes.
          </p>
        </div>

        {/* Interactive Elements */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="interactive-hover card-modern p-6 text-center">
            <h4 className="text-modern-title mb-2">Interactive Hover</h4>
            <p className="text-modern-body">Hover me for effects</p>
          </div>
          <div className="interactive-hover card-data-rich p-6 text-center">
            <h4 className="text-modern-title mb-2">Data Rich Hover</h4>
            <p className="text-modern-body">Enhanced interactions</p>
          </div>
          <div className="interactive-hover card-elevated p-6 text-center">
            <h4 className="text-modern-title mb-2">Elevated Hover</h4>
            <p className="text-modern-body">Premium experience</p>
          </div>
        </div>

        {/* Gradient Border Demo */}
        <div className="gradient-border mb-12">
          <div className="p-8 text-center">
            <h3 className="text-modern-title mb-4">Gradient Border Effect</h3>
            <p className="text-modern-body">
              This container has a gradient border that creates a premium, modern look.
            </p>
          </div>
        </div>

        {/* Typography Showcase */}
        <div className="card-modern p-8">
          <h2 className="text-modern-hero mb-6">Typography System</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-modern-title">Modern Title</h3>
              <p className="text-modern-subtitle">Enhanced subtitle with perfect contrast</p>
            </div>
            <div>
              <p className="text-modern-body">
                This is the body text with optimal readability and line height.
                Perfect for longer content sections.
              </p>
            </div>
            <div>
              <p className="text-modern-muted">
                Muted text for secondary information and labels.
              </p>
            </div>
            <div className="flex gap-4">
              <span className="text-gradient-primary">Primary Gradient Text</span>
              <span className="text-gradient-secondary">Secondary Gradient Text</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorSystemDemo;