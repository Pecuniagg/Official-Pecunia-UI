import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { 
  Target, 
  Users, 
  Calendar as CalendarIcon, 
  DollarSign, 
  TrendingUp, 
  Plus,
  Edit,
  Share2,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
  Trophy,
  Zap,
  Clock,
  Settings,
  Eye,
  ArrowRight,
  PiggyBank,
  Calculator,
  Sparkles,
  Loader2
} from 'lucide-react';
import { mockData } from '../data/mockData';
import { useToast } from '../hooks/use-toast';
import { useAI } from '../contexts/AIContext';

const Goals = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [activeTab, setActiveTab] = useState('personal');
  const [showNewGoal, setShowNewGoal] = useState(false);
  const [showContribution, setShowContribution] = useState(null);
  const [showGoalDetails, setShowGoalDetails] = useState(null);
  const [editingGoal, setEditingGoal] = useState(null);
  const [goalFilter, setGoalFilter] = useState('all');
  const [goalStrategies, setGoalStrategies] = useState({});
  
  // AI integration
  const { getGoalStrategy, aiInsights, getInsights, userProfile } = useAI();
  
  // New goal state
  const [newGoal, setNewGoal] = useState({
    title: '',
    target: '',
    deadline: null,
    category: '',
    description: '',
    priority: 'medium'
  });

  // Contribution state
  const [contributionAmount, setContributionAmount] = useState('');
  const [contributionType, setContributionType] = useState('one-time');

  const { goals } = mockData;
  const { toast } = useToast();

  // Load AI strategies for goals
  useEffect(() => {
    const loadGoalStrategies = async () => {
      if (!goals.personal || !getGoalStrategy) return;
      
      const strategiesToLoad = goals.personal.filter(goal => !goalStrategies[goal.id]);
      
      for (const goal of strategiesToLoad) {
        try {
          const strategy = await getGoalStrategy(goal);
          if (strategy) {
            setGoalStrategies(prev => ({
              ...prev,
              [goal.id]: strategy
            }));
          }
        } catch (error) {
          console.error('Failed to load strategy for goal:', goal.id, error);
        }
      }
    };

    loadGoalStrategies();
  }, [goals.personal, getGoalStrategy]); // Removed goalStrategies from dependencies to prevent infinite loop

  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline set';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid date';
    }
  };

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const getStatusColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-blue-500';
    if (percentage >= 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusBadge = (percentage) => {
    if (percentage >= 100) return { text: 'Completed', variant: 'default', color: 'text-green-600' };
    if (percentage >= 80) return { text: 'On Track', variant: 'default', color: 'text-blue-600' };
    if (percentage >= 50) return { text: 'In Progress', variant: 'secondary', color: 'text-yellow-600' };
    return { text: 'Needs Attention', variant: 'destructive', color: 'text-red-600' };
  };

  const getAutomatedContribution = (goal) => {
    const monthsUntilDeadline = Math.max(1, Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24 * 30)));
    const remaining = goal.target - goal.current;
    const baseAmount = remaining / monthsUntilDeadline;
    
    // Adjust based on priority
    const priorityMultiplier = {
      'high': 1.5,
      'medium': 1.0,
      'low': 0.7
    };
    
    const adjustedAmount = baseAmount * (priorityMultiplier[goal.priority] || 1.0);
    
    // Cap at reasonable monthly amount (20% of assumed monthly income)
    const monthlyIncomeEstimate = 6500; // Should come from user profile
    const maxMonthlyContribution = monthlyIncomeEstimate * 0.2;
    
    return Math.min(Math.round(adjustedAmount), maxMonthlyContribution);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleCreateGoal = async () => {
    try {
      console.log('Creating goal:', newGoal);
      toast({
        title: "Goal Created",
        description: "Your new goal has been added successfully.",
      });
      setShowNewGoal(false);
      setNewGoal({
        title: '',
        target: '',
        deadline: null,
        category: '',
        description: '',
        priority: 'medium'
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create goal. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleContribution = (goalId, amount, type) => {
    console.log('Adding contribution:', { goalId, amount, type });
    toast({
      title: "Contribution Added",
      description: `$${amount} has been added to your goal.`,
    });
    setShowContribution(null);
    setContributionAmount('');
  };

  const handleGoalAction = (action, goalId) => {
    console.log('Goal action:', action, goalId);
    toast({
      title: "Goal Action",
      description: `Goal ${action} successfully.`,
    });
  };

  const filteredGoals = (goals[activeTab] || []).filter(goal => {
    if (goalFilter === 'all') return true;
    const percentage = getProgressPercentage(goal.current, goal.target);
    switch (goalFilter) {
      case 'completed': return percentage >= 100;
      case 'active': return percentage < 100 && percentage > 0;
      case 'not-started': return percentage === 0;
      default: return true;
    }
  });

  const GoalCard = ({ goal, isGroup = false }) => {
    const percentage = getProgressPercentage(goal.current, goal.target);
    const status = getStatusBadge(percentage);
    const strategy = goalStrategies[goal.id];

    return (
      <Card className="card-modern interactive-hover group transition-all duration-200">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              {isGroup ? (
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Users className="text-white" size={20} />
                </div>
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-[#6b5bb5] to-[#c58ca1] rounded-full flex items-center justify-center">
                  <Target className="text-white" size={20} />
                </div>
              )}
              <div>
                <CardTitle className="text-professional-title text-lg">{goal.title}</CardTitle>
                <p className="text-professional-body text-sm">{goal.category}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={`${getPriorityColor(goal.priority)} text-xs`}>
                {goal.priority}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity btn-professional"
                onClick={() => setShowGoalDetails(goal)}
              >
                <Eye size={16} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-professional-body text-sm">Progress</span>
              <span className="text-professional-subtitle font-semibold">{percentage.toFixed(1)}%</span>
            </div>
            <div className="progress-professional" data-value={percentage.toFixed(0)}>
              <Progress value={percentage} className="h-2" />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-professional-body text-sm">Current</p>
              <p className="text-professional-subtitle font-semibold">${goal.current.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-professional-body text-sm">Target</p>
              <p className="text-professional-subtitle font-semibold">${goal.target.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <CalendarIcon size={14} className="text-gray-400" />
              <span className="text-professional-body text-sm">{formatDate(goal.deadline)}</span>
            </div>
            <Badge variant={status.variant} className={`${status.color} text-xs`}>
              {status.text}
            </Badge>
          </div>

          {strategy && strategy.strategy && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="text-blue-600" size={16} />
                <span className="text-professional-subtitle text-sm font-medium text-blue-800 dark:text-blue-300">
                  AI Strategy
                </span>
              </div>
              <p className="text-professional-body text-sm text-blue-700 dark:text-blue-300">
                {typeof strategy.strategy === 'string' 
                  ? strategy.strategy.substring(0, 120) + (strategy.strategy.length > 120 ? '...' : '')
                  : 'Strategy loading...'
                }
              </p>
            </div>
          )}

          {/* Group Goal Member Contributions */}
          {isGroup && goal.members && goal.contributions && (
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-2 mb-3">
                <Users className="text-purple-600" size={16} />
                <span className="text-professional-subtitle text-sm font-medium text-purple-800 dark:text-purple-300">
                  Member Contributions
                </span>
              </div>
              <div className="space-y-2">
                {goal.members.map((member, index) => {
                  const contribution = goal.contributions[member] || 0;
                  const percentage = ((contribution / goal.target) * 100).toFixed(1);
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {member.split(' ')[0][0]}
                        </div>
                        <span className="text-sm font-medium text-purple-800 dark:text-purple-200">
                          {member}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-purple-800 dark:text-purple-200">
                          ${contribution.toLocaleString()}
                        </div>
                        <div className="text-xs text-purple-600 dark:text-purple-400">
                          {percentage}% of goal
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 pt-2 border-t border-purple-200 dark:border-purple-700">
                <div className="flex justify-between text-sm">
                  <span className="text-purple-700 dark:text-purple-300">Total from members:</span>
                  <span className="font-bold text-purple-800 dark:text-purple-200">
                    ${Object.values(goal.contributions).reduce((sum, contrib) => sum + contrib, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Automated Contribution Suggestion */}
          {!isGroup && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Calculator className="text-green-600" size={16} />
                  <span className="text-professional-subtitle text-sm font-medium text-green-800 dark:text-green-300">
                    Smart Contribution
                  </span>
                </div>
                <Badge className="bg-green-100 text-green-800 text-xs">
                  {goal.priority} priority
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-professional-body text-sm text-green-700 dark:text-green-300">
                  Suggested monthly amount:
                </span>
                <span className="font-bold text-green-800 dark:text-green-200">
                  ${getAutomatedContribution(goal).toLocaleString()}
                </span>
              </div>
              <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                Based on deadline and priority level
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              size="sm"
              className="flex-1 btn-professional"
              onClick={() => setShowContribution(goal.id)}
            >
              <DollarSign size={16} className="mr-2" />
              Contribute
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="btn-professional"
              onClick={() => setEditingGoal(goal)}
            >
              <Edit size={16} />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="btn-professional"
            >
              <Share2 size={16} />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="mobile-layout" style={{ 
      background: 'var(--color-bg-primary)', 
      color: 'var(--color-text-white)',
      minHeight: '100vh'
    }}>
      <div className="mobile-container lg:max-w-7xl lg:mx-auto lg:p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-0 mb-4 lg:mb-8">
          <div>
            <h1 className="mobile-title lg:text-modern-hero">Financial Goals</h1>
            <p className="mobile-body lg:text-modern-subtitle mt-1 lg:mt-2">Track and achieve your financial objectives with AI-powered strategies</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 lg:gap-3 w-full lg:w-auto">
            <Button
              variant="outline"
              size="sm"
              className="mobile-btn-sm lg:btn-modern-secondary flex-1 lg:flex-none"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              {viewMode === 'grid' ? 'List View' : 'Grid View'}
            </Button>
            <Button
              className="mobile-btn lg:btn-modern-primary flex-1 lg:flex-none"
              onClick={() => setShowNewGoal(true)}
            >
              <Plus size={16} className="mr-2" />
              New Goal
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-gray-50 dark:bg-gray-800/50 p-1 rounded-lg mb-4 lg:mb-8 w-full lg:w-auto">
            <TabsTrigger value="personal" className="nav-modern-item flex-1 lg:flex-none">
              <Target className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
              <span className="text-xs lg:text-sm">Personal Goals</span>
            </TabsTrigger>
            <TabsTrigger value="group" className="nav-modern-item flex-1 lg:flex-none">
              <Users className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
              <span className="text-xs lg:text-sm">Group Goals</span>
            </TabsTrigger>
        </TabsList>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-2 lg:gap-4 mb-4 lg:mb-6">
          <Select value={goalFilter} onValueChange={setGoalFilter}>
            <SelectTrigger className="mobile-input lg:w-48 lg:input-professional">
              <SelectValue placeholder="Filter goals" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Goals</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="not-started">Not Started</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="personal" className="space-y-4 lg:space-y-6">
          <div className={`grid ${viewMode === 'grid' ? 'mobile-grid-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-4 lg:gap-6`}>
            {filteredGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="group" className="space-y-4 lg:space-y-6">
          <div className={`grid ${viewMode === 'grid' ? 'mobile-grid-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-4 lg:gap-6`}>
            {(goals.group || []).map((goal) => (
              <GoalCard key={goal.id} goal={goal} isGroup={true} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* New Goal Dialog */}
      <Dialog open={showNewGoal} onOpenChange={setShowNewGoal}>
        <DialogContent className="sm:max-w-[425px] card-professional">
          <DialogHeader>
            <DialogTitle className="text-professional-title">Create New Goal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-professional-subtitle">Goal Title</Label>
              <Input
                id="title"
                placeholder="Enter goal title"
                value={newGoal.title}
                onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                className="input-professional"
              />
            </div>
            <div>
              <Label htmlFor="target" className="text-professional-subtitle">Target Amount</Label>
              <Input
                id="target"
                type="number"
                placeholder="Enter target amount"
                value={newGoal.target}
                onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
                className="input-professional"
              />
            </div>
            <div>
              <Label htmlFor="category" className="text-professional-subtitle">Category</Label>
              <Select value={newGoal.category} onValueChange={(value) => setNewGoal({...newGoal, category: value})}>
                <SelectTrigger className="input-professional">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Emergency Fund">Emergency Fund</SelectItem>
                  <SelectItem value="Travel">Travel</SelectItem>
                  <SelectItem value="Investment">Investment</SelectItem>
                  <SelectItem value="Home">Home</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priority" className="text-professional-subtitle">Priority</Label>
              <Select value={newGoal.priority} onValueChange={(value) => setNewGoal({...newGoal, priority: value})}>
                <SelectTrigger className="input-professional">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="description" className="text-professional-subtitle">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter goal description"
                value={newGoal.description}
                onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                className="input-professional"
              />
            </div>
            <div className="flex gap-2">
              <Button
                className="flex-1 btn-professional"
                onClick={handleCreateGoal}
              >
                Create Goal
              </Button>
              <Button
                variant="outline"
                className="btn-professional"
                onClick={() => setShowNewGoal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Enhanced Contribution Dialog with Refined Animation */}
      <Dialog open={showContribution !== null} onOpenChange={() => setShowContribution(null)}>
        <DialogContent className="sm:max-w-[500px] card-professional overflow-hidden">
          <DialogHeader className="pb-6">
            <DialogTitle className="text-xl font-semibold text-professional-title flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-[#5945a3]" />
              Add Contribution
            </DialogTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Boost your savings goal with a new contribution
            </p>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Amount Input with Enhanced Styling */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-medium text-professional-subtitle">
                Contribution Amount
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={contributionAmount}
                  onChange={(e) => setContributionAmount(e.target.value)}
                  className="input-professional pl-10 text-lg font-medium h-12 transition-all duration-200 focus:ring-2 focus:ring-[#5945a3]/20 focus:border-[#5945a3]"
                />
              </div>
              {contributionAmount && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 animate-in fade-in duration-200">
                  ${contributionAmount} will be added to your goal
                </p>
              )}
            </div>

            {/* Type Selection with Better Styling */}
            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm font-medium text-professional-subtitle">
                Contribution Type
              </Label>
              <Select value={contributionType} onValueChange={setContributionType}>
                <SelectTrigger className="input-professional h-12 transition-all duration-200 focus:ring-2 focus:ring-[#5945a3]/20">
                  <SelectValue placeholder="Choose contribution frequency" />
                </SelectTrigger>
                <SelectContent className="animate-in slide-in-from-top-2 duration-200">
                  <SelectItem value="one-time" className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-orange-500" />
                      One-time Payment
                    </div>
                  </SelectItem>
                  <SelectItem value="monthly" className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      Monthly Recurring
                    </div>
                  </SelectItem>
                  <SelectItem value="weekly" className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-green-500" />
                      Weekly Recurring
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons with Enhanced Styling */}
            <div className="flex gap-3 pt-4">
              <Button
                className="flex-1 h-12 bg-gradient-to-r from-[#5945a3] to-[#6b59a8] hover:from-[#4a3d8f] hover:to-[#5945a3] text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                onClick={() => handleContribution(showContribution, contributionAmount, contributionType)}
                disabled={!contributionAmount || contributionAmount <= 0}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Contribution
              </Button>
              <Button
                variant="outline"
                className="h-12 px-6 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
                onClick={() => setShowContribution(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
};

export default Goals;