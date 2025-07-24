import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Target, Users, Calendar, DollarSign, TrendingUp, Plus } from 'lucide-react';
import { mockData } from '../data/mockData';

const Goals = () => {
  const [viewMode, setViewMode] = useState('grid');
  const { goals } = mockData;

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

  const PersonalGoalCard = ({ goal }) => (
    <Card className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{goal.title}</CardTitle>
          <Badge className={`${getStatusColor(goal.current, goal.target)} text-white`}>
            {goal.category}
          </Badge>
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
          <Progress value={getProgressPercentage(goal.current, goal.target)} className="h-2" />
          <div className="text-xs text-gray-500">
            {getProgressPercentage(goal.current, goal.target).toFixed(1)}% complete
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <Calendar size={14} />
            <span>{formatDate(goal.deadline)}</span>
          </div>
          <div className="flex items-center gap-1 text-green-600">
            <TrendingUp size={14} />
            <span>${(goal.target - goal.current).toLocaleString()} to go</span>
          </div>
        </div>

        <Button className="w-full bg-[#5945a3] hover:bg-[#4a3d8f]">
          Add Contribution
        </Button>
      </CardContent>
    </Card>
  );

  const GroupGoalCard = ({ goal }) => (
    <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
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
            <Calendar size={14} />
            <span>{formatDate(goal.deadline)}</span>
          </div>
          <span className="text-green-600 font-medium">
            ${(goal.target - goal.current).toLocaleString()} remaining
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm">
            View Details
          </Button>
          <Button className="bg-[#5945a3] hover:bg-[#4a3d8f]" size="sm">
            Contribute
          </Button>
        </div>
      </CardContent>
    </Card>
  );

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
          <Button className="bg-gradient-to-r from-[#5945a3] to-[#b37e91] hover:opacity-90">
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
            <div>
              <h3 className="font-semibold text-gray-900">AI Guidance</h3>
              <p className="text-sm text-gray-600">
                Based on your current savings rate, you're likely to achieve your Emergency Fund goal 2 months early! 
                Consider increasing your Dream Vacation contribution by $200/month to stay on track.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goals Tabs */}
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <Target size={16} />
            Personal Goals
          </TabsTrigger>
          <TabsTrigger value="group" className="flex items-center gap-2">
            <Users size={16} />
            Group Goals
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {goals.personal.map((goal) => (
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
                      {goals.personal.map((goal) => (
                        <tr key={goal.id} className="border-b hover:bg-gray-50">
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
                          </td>
                          <td className="p-4">
                            <Button size="sm" className="bg-[#5945a3] hover:bg-[#4a3d8f]">
                              Contribute
                            </Button>
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
              <GroupGoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Goals;