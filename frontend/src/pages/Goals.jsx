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
      
      for (const goal of goals.personal) {
        if (!goalStrategies[goal.id]) {
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
      }
    };

    loadGoalStrategies();
  }, [goals.personal, getGoalStrategy, goalStrategies]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

      {/* Contribution Dialog */}
      <Dialog open={showContribution !== null} onOpenChange={() => setShowContribution(null)}>
        <DialogContent className="sm:max-w-[425px] card-professional">
          <DialogHeader>
            <DialogTitle className="text-professional-title">Add Contribution</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount" className="text-professional-subtitle">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter contribution amount"
                value={contributionAmount}
                onChange={(e) => setContributionAmount(e.target.value)}
                className="input-professional"
              />
            </div>
            <div>
              <Label htmlFor="type" className="text-professional-subtitle">Type</Label>
              <Select value={contributionType} onValueChange={setContributionType}>
                <SelectTrigger className="input-professional">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one-time">One-time</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button
                className="flex-1 btn-professional"
                onClick={() => handleContribution(showContribution, contributionAmount, contributionType)}
              >
                Add Contribution
              </Button>
              <Button
                variant="outline"
                className="btn-professional"
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