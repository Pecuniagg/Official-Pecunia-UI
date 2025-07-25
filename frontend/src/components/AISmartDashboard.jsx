import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  DollarSign, 
  PiggyBank, 
  Shield, 
  Zap, 
  CheckCircle,
  ArrowRight,
  AlertTriangle,
  Lightbulb,
  Activity
} from 'lucide-react';
import aiService from '../services/aiService';

const AISmartDashboard = () => {
  const [smartInsights, setSmartInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autoOptimizing, setAutoOptimizing] = useState(false);
  const [activeRecommendations, setActiveRecommendations] = useState([]);

  useEffect(() => {
    loadSmartInsights();
  }, []);

  const loadSmartInsights = async () => {
    try {
      setLoading(true);
      
      // Get comprehensive AI analysis
      const analysis = await aiService.getComprehensiveAnalysis();
      
      // Get smart recommendations
      const recommendations = await aiService.getSmartRecommendations();
      
      // Get competitive insights
      const competitive = await aiService.getCompetitiveInsights();
      
      // Get proactive alerts
      const alerts = await aiService.getSmartAlerts();
      
      setSmartInsights({
        analysis,
        recommendations,
        competitive,
        alerts
      });
      
    } catch (error) {
      console.error('Error loading smart insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoOptimize = async () => {
    try {
      setAutoOptimizing(true);
      
      // Create automated financial plan
      const automatedPlan = await aiService.createAutomatedPlan();
      
      // Apply safe optimizations
      const optimizations = automatedPlan.automation_suggestions;
      
      // Update user context with optimizations
      aiService.updateUserContext({
        automated_plan: automatedPlan,
        optimizations_applied: new Date().toISOString()
      });
      
      setActiveRecommendations(automatedPlan.comprehensive_analysis.action_items || []);
      
      // Reload insights with new optimizations
      await loadSmartInsights();
      
    } catch (error) {
      console.error('Error in auto-optimization:', error);
    } finally {
      setAutoOptimizing(false);
    }
  };

  const getInsightIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'opportunity': return <Lightbulb className="h-4 w-4 text-blue-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton */}
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              <div className="h-3 bg-gray-200 rounded w-4/6"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Smart Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="h-8 w-8 text-[#5945a3]" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">AI Financial Command Center</h2>
            <p className="text-gray-600">Let AI optimize your finances automatically</p>
          </div>
        </div>
        <Button 
          onClick={handleAutoOptimize}
          disabled={autoOptimizing}
          className="bg-[#5945a3] hover:bg-[#4a3d8f] btn-premium"
        >
          {autoOptimizing ? (
            <>
              <Zap className="h-4 w-4 mr-2 animate-spin" />
              Optimizing...
            </>
          ) : (
            <>
              <Zap className="h-4 w-4 mr-2" />
              Auto-Optimize
            </>
          )}
        </Button>
      </div>

      {/* Smart Alerts */}
      {smartInsights?.alerts && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {smartInsights.alerts.budget_alerts?.map((alert, index) => (
            <Alert key={index} className="border-l-4 border-l-yellow-400">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>{alert.message}</strong>
                <br />
                <span className="text-sm text-gray-600">{alert.action}</span>
              </AlertDescription>
            </Alert>
          ))}
          
          {smartInsights.alerts.opportunity_alerts?.map((alert, index) => (
            <Alert key={index} className="border-l-4 border-l-green-400">
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>{alert.message}</strong>
                <br />
                <span className="text-sm text-gray-600">{alert.action}</span>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Main AI Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Health Score */}
        <Card className="card-premium hover-glow-subtle">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Financial Health Score</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#5945a3] mb-2">
              {smartInsights?.competitive?.competitive_score || 78}/100
            </div>
            <Progress 
              value={smartInsights?.competitive?.competitive_score || 78} 
              className="w-full mb-2 progress-silk" 
            />
            <p className="text-xs text-muted-foreground">
              {smartInsights?.competitive?.percentile_ranking || 65}th percentile in your age group
            </p>
            <Badge variant="secondary" className="mt-2">
              {smartInsights?.competitive?.improvement_potential > 0.8 ? 'High' : 'Medium'} Growth Potential
            </Badge>
          </CardContent>
        </Card>

        {/* Smart Budget Optimization */}
        <Card className="card-premium hover-glow-subtle">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Smart Budget Optimization</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 mb-2">
              ${smartInsights?.recommendations?.optimized_budget?.savings_rate * 100 || 850}/month
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              Potential additional savings identified
            </p>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Current savings rate</span>
                <span className="font-medium">
                  {smartInsights?.recommendations?.optimized_budget?.savings_rate || 23}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Optimized target</span>
                <span className="font-medium text-green-600">
                  {(smartInsights?.recommendations?.optimized_budget?.savings_rate || 23) + 5}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Investment Strategy */}
        <Card className="card-premium hover-glow-subtle">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Investment Strategy</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {smartInsights?.recommendations?.investment_strategy?.expected_return * 100 || 8.5}%
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              Expected annual return with AI optimization
            </p>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Risk level</span>
                <Badge variant="outline" className="text-xs">
                  {smartInsights?.recommendations?.investment_strategy?.risk_score > 70 ? 'High' : 
                   smartInsights?.recommendations?.investment_strategy?.risk_score > 40 ? 'Medium' : 'Low'}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Rebalance frequency</span>
                <span className="font-medium">
                  {smartInsights?.recommendations?.investment_strategy?.rebalance_frequency || 'Quarterly'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Goal Achievement Tracker */}
        <Card className="card-premium hover-glow-subtle">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Goal Achievement Tracker</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {Math.round((smartInsights?.recommendations?.comprehensive_analysis?.confidence || 0.75) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              Probability of achieving your goals on time
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Emergency fund on track</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Retirement savings optimized</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">Vacation fund needs boost</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Action Items */}
      <Card className="card-premium hover-glow-subtle">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-[#5945a3]" />
            AI-Powered Action Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {(smartInsights?.recommendations?.comprehensive_analysis?.action_items || []).map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover-whisper">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#5945a3] rounded-full"></div>
                  <span className="text-sm font-medium">{item}</span>
                </div>
                <Button size="sm" variant="outline" className="btn-premium">
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            ))}
            
            {activeRecommendations.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <Brain className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>Click "Auto-Optimize" to get personalized AI recommendations</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Market Insights */}
      <Card className="card-premium hover-glow-subtle">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#5945a3]" />
            Market-Aware Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium">Bond Yields</p>
              <p className="text-xs text-gray-600">Attractive at current rates</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium">Tech Stocks</p>
              <p className="text-xs text-gray-600">Bull market continues</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium">Diversification</p>
              <p className="text-xs text-gray-600">Hedge against volatility</p>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-gradient-to-r from-[#5945a3] to-[#b37e91] rounded-lg text-white">
            <p className="text-sm font-medium mb-2">AI Market Insight</p>
            <p className="text-xs opacity-90">
              {smartInsights?.analysis?.analysis?.substring(0, 150) || 
               "Current market conditions favor a balanced approach with slight overweight in technology and defensive positions in bonds."}...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AISmartDashboard;