import React, { useState } from 'react';
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
  Calculator
} from 'lucide-react';
import { mockData } from '../data/mockData';
import { useToast } from '../hooks/use-toast';
import { format } from 'date-fns';

const Goals = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [activeTab, setActiveTab] = useState('personal');
  const [showNewGoal, setShowNewGoal] = useState(false);
  const [showContribution, setShowContribution] = useState(null);
  const [showGoalDetails, setShowGoalDetails] = useState(null);
  const [editingGoal, setEditingGoal] = useState(null);
  const [goalFilter, setGoalFilter] = useState('all');
  
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

  const getStatusColor = (current, target) => {
    const percentage = getProgressPercentage(current, target);
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  const getDaysRemaining = (deadline) => {
    const today = new Date();
    const targetDate = new Date(deadline);
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleCreateGoal = () => {
    if (!newGoal.title || !newGoal.target || !newGoal.deadline) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Goal Created! 🎯",
      description: `${newGoal.title} has been added to your goals`,
    });

    setNewGoal({
      title: '',
      target: '',
      deadline: null,
      category: '',
      description: '',
      priority: 'medium'
    });
    setShowNewGoal(false);
  };

  const handleContribution = (goalId) => {
    if (!contributionAmount || parseFloat(contributionAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid contribution amount",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Contribution Added! 💰",
      description: `$${contributionAmount} ${contributionType === 'recurring' ? 'monthly contribution set up' : 'added to your goal'}`,
    });

    setContributionAmount('');
    setShowContribution(null);
  };

  const handleGoalAction = (action, goalId, goalTitle) => {
    switch(action) {
      case 'edit':
        setEditingGoal(goalId);
        toast({
          title: "Edit Mode Activated",
          description: `Editing ${goalTitle}`,
        });
        break;
      case 'share':
        toast({
          title: "Goal Shared! 📤",
          description: `${goalTitle} shared with your network`,
        });
        break;
      case 'priority':
        toast({
          title: "Priority Updated",
          description: `${goalTitle} marked as high priority`,
        });
        break;
      case 'automate':
        toast({
          title: "Automation Set Up! 🤖",
          description: `Auto-contributions enabled for ${goalTitle}`,
        });
        break;
      default:
        toast({
          title: "Action Complete",
          description: "Your request has been processed",
        });
    }
  };

  const NewGoalModal = () => (
    <Dialog open={showNewGoal} onOpenChange={setShowNewGoal}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="text-[#5945a3]" size={20} />
            Create New Goal
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Goal Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Emergency Fund"
                value={newGoal.title}
                onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="target">Target Amount *</Label>
              <Input
                id="target"
                type="number"
                placeholder="10000"
                value={newGoal.target}
                onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Target Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newGoal.deadline ? format(newGoal.deadline, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={newGoal.deadline}
                    onSelect={(date) => setNewGoal({...newGoal, deadline: date})}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={newGoal.category} onValueChange={(value) => setNewGoal({...newGoal, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="emergency">Emergency Fund</SelectItem>
                  <SelectItem value="vacation">Vacation</SelectItem>
                  <SelectItem value="home">Home Purchase</SelectItem>
                  <SelectItem value="car">Vehicle</SelectItem>
                  <SelectItem value="investment">Investment</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Why is this goal important to you?"
              value={newGoal.description}
              onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label>Priority Level</Label>
            <div className="flex gap-2">
              {['low', 'medium', 'high'].map((priority) => (
                <Button
                  key={priority}
                  variant={newGoal.priority === priority ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setNewGoal({...newGoal, priority})}
                  className={newGoal.priority === priority ? 'bg-[#5945a3] hover:bg-[#4a3d8f]' : ''}
                >
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowNewGoal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateGoal} className="bg-[#5945a3] hover:bg-[#4a3d8f]">
              Create Goal
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const ContributionModal = () => (
    <Dialog open={!!showContribution} onOpenChange={() => setShowContribution(null)}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PiggyBank className="text-[#5945a3]" size={20} />
            Add Contribution
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="500"
              value={contributionAmount}
              onChange={(e) => setContributionAmount(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Contribution Type</Label>
            <div className="flex gap-2">
              <Button
                variant={contributionType === 'one-time' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setContributionType('one-time')}
                className={contributionType === 'one-time' ? 'bg-[#5945a3] hover:bg-[#4a3d8f]' : ''}
              >
                One-time
              </Button>
              <Button
                variant={contributionType === 'recurring' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setContributionType('recurring')}
                className={contributionType === 'recurring' ? 'bg-[#5945a3] hover:bg-[#4a3d8f]' : ''}
              >
                Monthly
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowContribution(null)}>
              Cancel
            </Button>
            <Button onClick={() => handleContribution(showContribution)} className="bg-[#5945a3] hover:bg-[#4a3d8f]">
              Add Contribution
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const GoalDetailsModal = () => (
    <Dialog open={!!showGoalDetails} onOpenChange={() => setShowGoalDetails(null)}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="text-[#5945a3]" size={20} />
            {showGoalDetails?.title}
          </DialogTitle>
        </DialogHeader>
        
        {showGoalDetails && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <p className="text-2xl font-bold">${showGoalDetails.current.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Current Amount</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <Target className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <p className="text-2xl font-bold">${showGoalDetails.target.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Target Amount</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <Clock className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                  <p className="text-2xl font-bold">{getDaysRemaining(showGoalDetails.deadline)}</p>
                  <p className="text-sm text-gray-600">Days Remaining</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-4">Progress Analytics</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Overall Progress</span>
                      <span className="text-sm font-semibold">
                        {getProgressPercentage(showGoalDetails.current, showGoalDetails.target).toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={getProgressPercentage(showGoalDetails.current, showGoalDetails.target)} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Monthly Required</p>
                      <p className="font-semibold">${Math.round((showGoalDetails.target - showGoalDetails.current) / Math.max(getDaysRemaining(showGoalDetails.deadline) / 30, 1)).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Remaining</p>
                      <p className="font-semibold">${(showGoalDetails.target - showGoalDetails.current).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Smart Actions</h3>
                <div className="space-y-2">
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setShowContribution(showGoalDetails.id)}
                  >
                    <Plus size={16} className="mr-2" />
                    Add Contribution
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => handleGoalAction('automate', showGoalDetails.id, showGoalDetails.title)}
                  >
                    <Zap size={16} className="mr-2" />
                    Set Up Auto-Contribute
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => handleGoalAction('share', showGoalDetails.id, showGoalDetails.title)}
                  >
                    <Share2 size={16} className="mr-2" />
                    Share with Friends
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => toast({ title: "Goal Calculator", description: "Opening advanced goal calculator..." })}
                  >
                    <Calculator size={16} className="mr-2" />
                    Goal Calculator
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-[#1e1b24] mb-2">🎯 AI Strategy</h4>
              <p className="text-sm text-[#1e1b24]">
                Based on your current progress and timeline, you're {getProgressPercentage(showGoalDetails.current, showGoalDetails.target) >= 50 ? 'on track' : 'behind schedule'}. 
                {getProgressPercentage(showGoalDetails.current, showGoalDetails.target) < 50 
                  ? ' Consider increasing your monthly contribution to stay on target.'
                  : ' Keep up the great work! You might even finish early.'
                }
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  const PersonalGoalCard = ({ goal }) => (
    <Card className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{goal.title}</CardTitle>
          <div className="flex items-center gap-1">
            <Badge className={`${getStatusColor(goal.current, goal.target)} text-white`}>
              {goal.category}
            </Badge>
            <Button 
              variant="ghost" 
              size="sm" 
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => setShowGoalDetails(goal)}
            >
              <Eye size={14} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">{goal.description}</p>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span className="font-semibold">
              ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
            </span>
          </div>
          <div 
            className="cursor-pointer"
            onClick={() => setShowGoalDetails(goal)}
          >
            <Progress value={getProgressPercentage(goal.current, goal.target)} className="h-2" />
          </div>
          <div className="text-xs text-gray-500">
            {getProgressPercentage(goal.current, goal.target).toFixed(1)}% complete
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <CalendarIcon size={14} />
            <span>{formatDate(goal.deadline)}</span>
          </div>
          <div className="flex items-center gap-1 text-green-600">
            <TrendingUp size={14} />
            <span>${(goal.target - goal.current).toLocaleString()} to go</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            className="flex-1 bg-[#5945a3] hover:bg-[#4a3d8f]"
            size="sm"
            onClick={() => setShowContribution(goal.id)}
          >
            <Plus size={14} className="mr-1" />
            Contribute
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleGoalAction('share', goal.id, goal.title)}
          >
            <Share2 size={14} />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleGoalAction('edit', goal.id, goal.title)}
          >
            <Edit size={14} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const filteredPersonalGoals = goals.personal.filter(goal => {
    if (goalFilter === 'all') return true;
    if (goalFilter === 'on-track') return getProgressPercentage(goal.current, goal.target) >= 50;
    if (goalFilter === 'behind') return getProgressPercentage(goal.current, goal.target) < 50;
    if (goalFilter === 'completed') return getProgressPercentage(goal.current, goal.target) >= 100;
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#0a0a0f] mb-2" style={{ fontFamily: 'Neurial Grotesk, sans-serif' }}>
            Goals
          </h1>
          <p className="text-[#3b345b] mt-2">Track your financial objectives and milestones</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-white shadow-sm' : ''}
            >
              Grid
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
              className={viewMode === 'table' ? 'bg-white shadow-sm' : ''}
            >
              Table
            </Button>
          </div>
          <Button 
            className="bg-gradient-to-r from-[#5945a3] to-[#b37e91] hover:opacity-90"
            onClick={() => setShowNewGoal(true)}
          >
            <Plus size={16} className="mr-2" />
            New Goal
          </Button>
        </div>
      </div>

      {/* AI Guidance */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#5945a3] rounded-full flex items-center justify-center">
              <Target className="text-white" size={16} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">AI Guidance</h3>
              <p className="text-sm text-gray-600">
                Based on your current savings rate, you're likely to achieve your Emergency Fund goal 2 months early! 
                Consider increasing your Dream Vacation contribution by $200/month to stay on track.
              </p>
            </div>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => toast({ title: "AI Optimizer", description: "Opening goal optimization suggestions..." })}
            >
              Optimize All Goals
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Goals Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-8">
          <TabsList>
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <Target size={16} />
              Personal Goals
            </TabsTrigger>
            <TabsTrigger value="group" className="flex items-center gap-2">
              <Users size={16} />
              Group Goals
            </TabsTrigger>
          </TabsList>

          {activeTab === 'personal' && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Filter:</span>
              <Select value={goalFilter} onValueChange={setGoalFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Goals</SelectItem>
                  <SelectItem value="on-track">On Track</SelectItem>
                  <SelectItem value="behind">Behind</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <TabsContent value="personal">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPersonalGoals.map((goal) => (
                <PersonalGoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Personal Goals Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4">Goal</th>
                        <th className="text-left p-4">Progress</th>
                        <th className="text-left p-4">Target</th>
                        <th className="text-left p-4">Deadline</th>
                        <th className="text-left p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPersonalGoals.map((goal) => (
                        <tr key={goal.id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => setShowGoalDetails(goal)}>
                          <td className="p-4">
                            <div>
                              <p className="font-medium">{goal.title}</p>
                              <p className="text-sm text-gray-600">{goal.description}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="w-32">
                              <Progress value={getProgressPercentage(goal.current, goal.target)} />
                              <p className="text-xs text-gray-500 mt-1">
                                {getProgressPercentage(goal.current, goal.target).toFixed(1)}%
                              </p>
                            </div>
                          </td>
                          <td className="p-4">
                            <p className="font-medium">${goal.target.toLocaleString()}</p>
                            <p className="text-sm text-gray-600">${goal.current.toLocaleString()} saved</p>
                          </td>
                          <td className="p-4">
                            <p className="text-sm">{formatDate(goal.deadline)}</p>
                            <p className="text-xs text-gray-500">{getDaysRemaining(goal.deadline)} days left</p>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-1">
                              <Button 
                                size="sm" 
                                className="bg-[#5945a3] hover:bg-[#4a3d8f]"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowContribution(goal.id);
                                }}
                              >
                                Contribute
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleGoalAction('edit', goal.id, goal.title);
                                }}
                              >
                                <Edit size={14} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="group">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {goals.group.map((goal) => (
              <Card key={goal.id} className="shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="text-[#5945a3]" size={20} />
                    {goal.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Group Progress</span>
                      <span className="font-semibold">
                        ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
                      </span>
                    </div>
                    <Progress value={getProgressPercentage(goal.current, goal.target)} className="h-2" />
                    <div className="text-xs text-gray-500">
                      {getProgressPercentage(goal.current, goal.target).toFixed(1)}% complete
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Member Contributions</p>
                    {Object.entries(goal.contributions).map(([member, amount]) => (
                      <div key={member} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">{member}</span>
                        <span className="font-medium">${amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center text-sm pt-2 border-t">
                    <div className="flex items-center gap-1 text-gray-600">
                      <CalendarIcon size={14} />
                      <span>{formatDate(goal.deadline)}</span>
                    </div>
                    <span className="text-green-600 font-medium">
                      ${(goal.target - goal.current).toLocaleString()} remaining
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toast({ title: "Group Details", description: "Opening group goal management..." })}
                    >
                      <Eye size={14} className="mr-1" />
                      Details
                    </Button>
                    <Button 
                      className="bg-[#5945a3] hover:bg-[#4a3d8f]" 
                      size="sm"
                      onClick={() => setShowContribution(goal.id)}
                    >
                      <Plus size={14} className="mr-1" />
                      Contribute
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <NewGoalModal />
      <ContributionModal />
      <GoalDetailsModal />
    </div>
  );
};

export default Goals;