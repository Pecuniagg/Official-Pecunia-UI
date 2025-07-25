import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useToast } from '../hooks/use-toast';
import { 
  TrendingUp, 
  Users, 
  Globe, 
  Target, 
  DollarSign, 
  PieChart,
  BarChart3,
  Sparkles,
  Trophy,
  Zap,
  ChevronUp,
  ChevronDown,
  Star,
  Heart,
  Share2,
  Eye,
  UserPlus,
  TrendingDown,
  Award,
  Crown
} from 'lucide-react';
import { mockData } from '../data/mockData';

const Compare = () => {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [hoveredFriend, setHoveredFriend] = useState(null);
  const [likedFriends, setLikedFriends] = useState(new Set());
  const [activeTab, setActiveTab] = useState('friends');
  const [showInsights, setShowInsights] = useState(false);
  const { compare } = mockData;
  const { toast } = useToast();

  const handleLikeFriend = (friendName) => {
    setLikedFriends(prev => {
      const newSet = new Set(prev);
      if (newSet.has(friendName)) {
        newSet.delete(friendName);
        toast({ title: "Removed from favorites", description: `${friendName} unfavorited` });
      } else {
        newSet.add(friendName);
        toast({ title: "Added to favorites! ⭐", description: `${friendName} added to your compare favorites` });
      }
      return newSet;
    });
  };

  const handleAddFriend = () => {
    toast({ 
      title: "Invite Friends", 
      description: "Send invitations to compare financial progress together" 
    });
  };

  const getComparisonResult = (myValue, friendValue, isHigherBetter = true) => {
    const isAhead = isHigherBetter ? myValue > friendValue : myValue < friendValue;
    const percentage = Math.abs(((myValue - friendValue) / friendValue * 100)).toFixed(1);
    return { isAhead, percentage };
  };

  const ComparisonCard = ({ title, icon: Icon, data, color, index = 0 }) => (
    <Card 
      className="shadow-lg card-refined hover-glow group animate-entrance cursor-pointer"
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={() => toast({ title: `${title} Details`, description: "Opening detailed comparison analytics..." })}
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className={`${color} icon-refined group-hover:scale-110 transition-transform duration-300`} size={20} />
            <span className="group-hover:text-[#5945a3] transition-colors">{title}</span>
          </div>
          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity btn-refined">
            <Eye size={14} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item, itemIndex) => (
            <div 
              key={itemIndex} 
              className="flex items-center justify-between hover-subtle p-2 rounded group cursor-pointer animate-slide-left"
              style={{ animationDelay: `${(index * 0.1) + (itemIndex * 0.05)}s` }}
              onClick={(e) => {
                e.stopPropagation();
                toast({ title: `${item.name}'s Performance`, description: `View detailed metrics for ${item.name}` });
              }}
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 hover-scale-subtle">
                  <AvatarImage src="/api/placeholder/32/32" />
                  <AvatarFallback className="bg-gradient-to-br from-[#5945a3] to-[#b37e91] text-white">
                    {item.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-sm group-hover:text-[#5945a3] transition-colors">{item.name}</span>
                {itemIndex === 0 && (
                  <Crown className="text-yellow-500 animate-scale-gentle" size={14} />
                )}
              </div>
              <div className="text-right">
                <p className="font-semibold animate-counter">{item.value}</p>
                {item.trend && (
                  <div className="flex items-center gap-1">
                    {item.trend > 0 ? (
                      <TrendingUp className="text-green-600 animate-scale-gentle" size={12} />
                    ) : (
                      <TrendingDown className="text-red-500 animate-scale-gentle" size={12} />
                    )}
                    <p className={`text-xs ${item.trend > 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {item.trend > 0 ? '+' : ''}{item.trend}%
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const FriendSelector = () => (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Select Friends to Compare</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {compare.friends.map((friend, index) => (
            <div
              key={index}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                selectedFriend === friend.name 
                  ? 'border-[#5945a3] bg-purple-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedFriend(selectedFriend === friend.name ? null : friend.name)}
            >
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/api/placeholder/40/40" />
                  <AvatarFallback>{friend.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{friend.name}</p>
                  <p className="text-sm text-gray-600">Score: {friend.score}</p>
                </div>
              </div>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">Net Worth</span>
                  <span className="font-medium">${friend.netWorth.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Savings Rate</span>
                  <span className="font-medium">{friend.savingsRate}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const ComparisonCharts = () => {
    if (!selectedFriend) {
      return (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Select a Friend to Compare</h3>
            <p className="text-gray-500">Choose someone from your network to see detailed comparisons</p>
          </CardContent>
        </Card>
      );
    }

    const friend = compare.friends.find(f => f.name === selectedFriend);
    const myData = {
      netWorth: 89000, // This would come from user's actual data
      savingsRate: 23,
      score: 782
    };

    return (
      <div className="space-y-8">
        {/* Comparison Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center">
            <CardContent className="p-6">
              <DollarSign className="w-8 h-8 mx-auto mb-3 text-green-600" />
              <h3 className="font-semibold mb-2">Net Worth</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">You</span>
                  <span className="font-bold">${myData.netWorth.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{friend.name}</span>
                  <span className="font-bold">${friend.netWorth.toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t">
                <p className={`text-sm font-medium ${
                  myData.netWorth > friend.netWorth ? 'text-green-600' : 'text-red-500'
                }`}>
                  {Math.abs(((myData.netWorth - friend.netWorth) / friend.netWorth * 100)).toFixed(1)}% 
                  {myData.netWorth > friend.netWorth ? ' ahead' : ' behind'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <PieChart className="w-8 h-8 mx-auto mb-3 text-blue-600" />
              <h3 className="font-semibold mb-2">Savings Rate</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">You</span>
                  <span className="font-bold">{myData.savingsRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{friend.name}</span>
                  <span className="font-bold">{friend.savingsRate}%</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t">
                <p className={`text-sm font-medium ${
                  myData.savingsRate > friend.savingsRate ? 'text-green-600' : 'text-red-500'
                }`}>
                  {Math.abs(myData.savingsRate - friend.savingsRate)}% 
                  {myData.savingsRate > friend.savingsRate ? ' higher' : ' lower'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <Target className="w-8 h-8 mx-auto mb-3 text-purple-600" />
              <h3 className="font-semibold mb-2">Pecunia Score</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">You</span>
                  <span className="font-bold">{myData.score}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{friend.name}</span>
                  <span className="font-bold">{friend.score}</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t">
                <p className={`text-sm font-medium ${
                  myData.score > friend.score ? 'text-green-600' : 'text-red-500'
                }`}>
                  {Math.abs(myData.score - friend.score)} points 
                  {myData.score > friend.score ? ' ahead' : ' behind'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="text-[#5945a3]" size={20} />
              What You Can Learn from {friend.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-white rounded-lg">
                <h4 className="font-medium text-sm mb-1">💡 Investment Strategy</h4>
                <p className="text-sm text-gray-600">
                  {friend.name} has a higher net worth through aggressive investment allocation. 
                  Consider increasing your stock portfolio by 10-15%.
                </p>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <h4 className="font-medium text-sm mb-1">🎯 Savings Habits</h4>
                <p className="text-sm text-gray-600">
                  Their {friend.savingsRate}% savings rate suggests automated transfers. 
                  Try increasing your automatic savings by $200/month.
                </p>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <h4 className="font-medium text-sm mb-1">📈 Goal Achievement</h4>
                <p className="text-sm text-gray-600">
                  Based on their patterns, consider setting a stretch goal for your emergency fund 
                  to accelerate your financial progress.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#0a0a0f] mb-2" style={{ fontFamily: 'Neurial Grotesk, sans-serif' }}>
          Compare
        </h1>
        <p className="text-[#3b345b]">Learn from friends and benchmark against others</p>
      </div>

      <Tabs defaultValue="friends" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="friends" className="flex items-center gap-2">
            <Users size={16} />
            Friends
          </TabsTrigger>
          <TabsTrigger value="public" className="flex items-center gap-2">
            <Globe size={16} />
            Public Data
          </TabsTrigger>
        </TabsList>

        <TabsContent value="friends">
          <FriendSelector />
          <ComparisonCharts />
        </TabsContent>

        <TabsContent value="public" className="space-y-6">
          <Card className="bg-gradient-to-r from-[#5945a3] to-[#b37e91] text-white">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">How You Compare to Others</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold mb-2">Top 25%</p>
                  <p className="opacity-90">Net Worth Ranking</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold mb-2">Above Avg</p>
                  <p className="opacity-90">Savings Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold mb-2">Excellent</p>
                  <p className="opacity-90">Financial Health</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>National Averages (Age 25-35)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span>Average Net Worth</span>
                  <span className="font-semibold">${compare.public.avgNetWorth.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span>Average Savings Rate</span>
                  <span className="font-semibold">{compare.public.avgSavingsRate}%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span>Average Pecunia Score</span>
                  <span className="font-semibold">{compare.public.avgScore}</span>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-3">Your Performance</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Net Worth</span>
                      <Badge className="bg-green-100 text-green-800">Above Average</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Savings Rate</span>
                      <Badge className="bg-green-100 text-green-800">Above Average</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Pecunia Score</span>
                      <Badge className="bg-blue-100 text-blue-800">Excellent</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Improvement Suggestions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium mb-2">🎯 Next Milestone</h4>
                  <p className="text-sm text-gray-700">
                    Reach $100K net worth to join the top 20% of your age group. 
                    You're 87% there!
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium mb-2">💪 Strength</h4>
                  <p className="text-sm text-gray-700">
                    Your 23% savings rate puts you in the top 30% nationally. 
                    Keep up the great work!
                  </p>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-medium mb-2">🚀 Growth Opportunity</h4>
                  <p className="text-sm text-gray-700">
                    Consider increasing investment allocation to accelerate net worth growth 
                    and reach top 15% within 2 years.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Compare;