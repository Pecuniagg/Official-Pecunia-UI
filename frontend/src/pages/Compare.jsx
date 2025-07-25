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
      className="shadow-lg card-whisper group"
      onClick={() => toast({ title: `${title} Details`, description: "Opening detailed comparison analytics..." })}
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className={`${color} icon-whisper`} size={20} />
            <span className="group-hover:text-[#5945a3] transition-colors duration-300">{title}</span>
          </div>
          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity btn-whisper">
            <Eye size={14} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((item, itemIndex) => (
            <div 
              key={itemIndex} 
              className="flex items-center justify-between hover-whisper p-2 rounded group cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                toast({ title: `${item.name}'s Performance`, description: `View detailed metrics for ${item.name}` });
              }}
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 hover-breath">
                  <AvatarImage src="/api/placeholder/32/32" />
                  <AvatarFallback className="bg-gradient-to-br from-[#5945a3] to-[#b37e91] text-white">
                    {item.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-sm group-hover:text-[#5945a3] transition-colors">{item.name}</span>
                {itemIndex === 0 && (
                  <Crown className="text-yellow-500" size={14} />
                )}
              </div>
              <div className="text-right">
                <p className="font-semibold animate-flow">{item.value}</p>
                {item.trend && (
                  <div className="flex items-center gap-1">
                    {item.trend > 0 ? (
                      <TrendingUp className="text-green-600" size={12} />
                    ) : (
                      <TrendingDown className="text-red-500" size={12} />
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
    <Card className="mb-8 card-whisper">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="text-[#5945a3] icon-whisper" size={20} />
            <span>Select Friends to Compare</span>
          </div>
          <Button 
            onClick={handleAddFriend}
            className="bg-gradient-to-r from-[#5945a3] to-[#b37e91] hover:opacity-90 btn-whisper"
            size="sm"
          >
            <UserPlus size={14} className="mr-1" />
            Invite Friends
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {compare.friends.map((friend, index) => {
            const isSelected = selectedFriend === friend.name;
            const isHovered = hoveredFriend === friend.name;
            const isLiked = likedFriends.has(friend.name);
            
            return (
              <div
                key={index}
                className={`relative p-4 border rounded-lg cursor-pointer transition-all duration-300 card-breath group overflow-hidden ${
                  isSelected 
                    ? 'border-[#5945a3] bg-gradient-to-br from-purple-50 to-blue-50 shadow-md' 
                    : 'border-gray-200 hover:border-[#5945a3]/30 hover:shadow-sm'
                }`}
                onClick={() => {
                  setSelectedFriend(selectedFriend === friend.name ? null : friend.name);
                  toast({ 
                    title: selectedFriend === friend.name ? "Deselected" : "Selected for comparison", 
                    description: `${friend.name} ${selectedFriend === friend.name ? 'deselected' : 'selected for detailed comparison'}` 
                  });
                }}
                onMouseEnter={() => setHoveredFriend(friend.name)}
                onMouseLeave={() => setHoveredFriend(null)}
              >
                {/* Background gradient effect */}
                {(isSelected || isHovered) && (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#5945a3]/3 to-[#b37e91]/3"></div>
                )}
                
                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <Trophy className="text-[#5945a3]" size={16} />
                  </div>
                )}
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10 hover-breath">
                        <AvatarImage src="/api/placeholder/40/40" />
                        <AvatarFallback className="bg-gradient-to-br from-[#5945a3] to-[#b37e91] text-white">
                          {friend.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {/* Online status indicator */}
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium hover:text-[#5945a3] transition-colors">{friend.name}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-600">Score: {friend.score}</p>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={10} 
                              className={`${i < Math.floor(friend.score / 200) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`p-1 transition-all duration-300 ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLikeFriend(friend.name);
                        }}
                      >
                        <Heart size={12} fill={isLiked ? 'currentColor' : 'none'} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 text-gray-400 hover:text-[#5945a3] transition-colors opacity-0 group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          toast({ title: "Profile shared", description: `${friend.name}'s comparison shared` });
                        }}
                      >
                        <Share2 size={12} />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between items-center hover-whisper p-1 rounded">
                      <span className="text-gray-600">Net Worth</span>
                      <span className="font-medium animate-flow">${friend.netWorth.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center hover-whisper p-1 rounded">
                      <span className="text-gray-600">Savings Rate</span>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{friend.savingsRate}%</span>
                        {friend.savingsRate > 20 && (
                          <Zap className="text-green-500" size={12} />
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Performance indicator bar */}
                  <div className="mt-3 progress-silk h-1">
                    <div 
                      className="progress-bar-silk h-full transition-all duration-1000"
                      style={{ width: `${(friend.score / 1000) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {selectedFriend && (
          <div className="mt-4 p-3 bg-gradient-to-r from-[#5945a3]/8 to-[#b37e91]/8 rounded-lg animate-breath">
            <p className="text-sm text-[#5945a3] font-medium">
              🎯 Comparing with {selectedFriend} - Scroll down to see detailed analysis
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const ComparisonCharts = () => {
    if (!selectedFriend) {
      return (
        <Card className="text-center py-12 card-refined hover-glow animate-scale-gentle">
          <CardContent>
            <Users className="w-12 h-12 mx-auto text-gray-400 mb-4 animate-counter" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Select a Friend to Compare</h3>
            <p className="text-gray-500 mb-4">Choose someone from your network to see detailed comparisons</p>
            <Button 
              onClick={handleAddFriend}
              className="bg-gradient-to-r from-[#5945a3] to-[#b37e91] hover:opacity-90 btn-refined"
            >
              <UserPlus size={16} className="mr-2" />
              Invite More Friends
            </Button>
          </CardContent>
        </Card>
      );
    }

    const friend = compare.friends.find(f => f.name === selectedFriend);
    const myData = {
      netWorth: 89000,
      savingsRate: 23,
      score: 782
    };

    const netWorthResult = getComparisonResult(myData.netWorth, friend.netWorth);
    const savingsResult = getComparisonResult(myData.savingsRate, friend.savingsRate);
    const scoreResult = getComparisonResult(myData.score, friend.score);

    return (
      <div className="space-y-8">
        {/* Comparison Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card 
            className="text-center card-refined hover-glow cursor-pointer group animate-entrance"
            onClick={() => toast({ title: "Net Worth Analysis", description: "View detailed net worth breakdown and trends" })}
          >
            <CardContent className="p-6">
              <DollarSign className="w-8 h-8 mx-auto mb-3 text-green-600 icon-refined group-hover:scale-110" />
              <h3 className="font-semibold mb-2 group-hover:text-[#5945a3] transition-colors">Net Worth</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center hover-subtle p-1 rounded">
                  <span className="text-sm text-gray-600">You</span>
                  <span className="font-bold animate-counter">${myData.netWorth.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center hover-subtle p-1 rounded">
                  <span className="text-sm text-gray-600">{friend.name}</span>
                  <span className="font-bold animate-counter">${friend.netWorth.toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t">
                <div className="flex items-center justify-center gap-2">
                  {netWorthResult.isAhead ? (
                    <ChevronUp className="text-green-600 animate-scale-gentle" size={16} />
                  ) : (
                    <ChevronDown className="text-red-500 animate-scale-gentle" size={16} />
                  )}
                  <p className={`text-sm font-medium ${netWorthResult.isAhead ? 'text-green-600' : 'text-red-500'}`}>
                    {netWorthResult.percentage}% {netWorthResult.isAhead ? 'ahead' : 'behind'}
                  </p>
                </div>
              </div>
              {/* Progress visualization */}
              <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-1000"
                  style={{ width: `${(myData.netWorth / Math.max(myData.netWorth, friend.netWorth)) * 100}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="text-center card-refined hover-glow cursor-pointer group animate-entrance animate-delay-1"
            onClick={() => toast({ title: "Savings Rate Analysis", description: "Compare saving strategies and habits" })}
          >
            <CardContent className="p-6">
              <PieChart className="w-8 h-8 mx-auto mb-3 text-blue-600 icon-refined group-hover:scale-110" />
              <h3 className="font-semibold mb-2 group-hover:text-[#5945a3] transition-colors">Savings Rate</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center hover-subtle p-1 rounded">
                  <span className="text-sm text-gray-600">You</span>
                  <div className="flex items-center gap-1">
                    <span className="font-bold animate-counter">{myData.savingsRate}%</span>
                    {myData.savingsRate > 20 && <Sparkles className="text-yellow-500 animate-scale-gentle" size={12} />}
                  </div>
                </div>
                <div className="flex justify-between items-center hover-subtle p-1 rounded">
                  <span className="text-sm text-gray-600">{friend.name}</span>
                  <div className="flex items-center gap-1">
                    <span className="font-bold animate-counter">{friend.savingsRate}%</span>
                    {friend.savingsRate > 20 && <Sparkles className="text-yellow-500 animate-scale-gentle" size={12} />}
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t">
                <div className="flex items-center justify-center gap-2">
                  {savingsResult.isAhead ? (
                    <ChevronUp className="text-green-600 animate-scale-gentle" size={16} />
                  ) : (
                    <ChevronDown className="text-red-500 animate-scale-gentle" size={16} />
                  )}
                  <p className={`text-sm font-medium ${savingsResult.isAhead ? 'text-green-600' : 'text-red-500'}`}>
                    {Math.abs(myData.savingsRate - friend.savingsRate)}% {savingsResult.isAhead ? 'higher' : 'lower'}
                  </p>
                </div>
              </div>
              <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-1000"
                  style={{ width: `${(myData.savingsRate / Math.max(myData.savingsRate, friend.savingsRate)) * 100}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="text-center card-refined hover-glow cursor-pointer group animate-entrance animate-delay-2"
            onClick={() => toast({ title: "Pecunia Score Breakdown", description: "Detailed score analysis and improvement tips" })}
          >
            <CardContent className="p-6">
              <Target className="w-8 h-8 mx-auto mb-3 text-purple-600 icon-refined group-hover:scale-110" />
              <h3 className="font-semibold mb-2 group-hover:text-[#5945a3] transition-colors">Pecunia Score</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center hover-subtle p-1 rounded">
                  <span className="text-sm text-gray-600">You</span>
                  <div className="flex items-center gap-1">
                    <span className="font-bold animate-counter">{myData.score}</span>
                    {myData.score > 750 && <Award className="text-gold animate-scale-gentle" size={12} />}
                  </div>
                </div>
                <div className="flex justify-between items-center hover-subtle p-1 rounded">
                  <span className="text-sm text-gray-600">{friend.name}</span>
                  <div className="flex items-center gap-1">
                    <span className="font-bold animate-counter">{friend.score}</span>
                    {friend.score > 750 && <Award className="text-gold animate-scale-gentle" size={12} />}
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t">
                <div className="flex items-center justify-center gap-2">
                  {scoreResult.isAhead ? (
                    <ChevronUp className="text-green-600 animate-scale-gentle" size={16} />
                  ) : (
                    <ChevronDown className="text-red-500 animate-scale-gentle" size={16} />
                  )}
                  <p className={`text-sm font-medium ${scoreResult.isAhead ? 'text-green-600' : 'text-red-500'}`}>
                    {Math.abs(myData.score - friend.score)} points {scoreResult.isAhead ? 'ahead' : 'behind'}
                  </p>
                </div>
              </div>
              <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-400 to-purple-600 transition-all duration-1000"
                  style={{ width: `${(myData.score / Math.max(myData.score, friend.score)) * 100}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 card-refined hover-glow animate-entrance animate-delay-3">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="text-[#5945a3] icon-refined" size={20} />
                <span>What You Can Learn from {friend.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowInsights(!showInsights);
                  toast({ 
                    title: showInsights ? "Insights Hidden" : "AI Insights Revealed 🤖", 
                    description: showInsights ? "Insights collapsed" : "Personalized learning opportunities displayed" 
                  });
                }}
                className="btn-refined"
              >
                {showInsights ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`space-y-3 transition-all duration-500 ${showInsights ? 'max-h-96 opacity-100' : 'max-h-20 opacity-60'} overflow-hidden`}>
              <div 
                className="p-3 bg-white rounded-lg hover-subtle cursor-pointer group animate-slide-left"
                onClick={() => toast({ title: "Investment Strategy Details", description: "Opening detailed investment analysis and recommendations" })}
              >
                <h4 className="font-medium text-sm mb-1 flex items-center gap-2 group-hover:text-[#5945a3] transition-colors">
                  💡 Investment Strategy
                  <TrendingUp className="text-green-500 animate-scale-gentle" size={12} />
                </h4>
                <p className="text-sm text-gray-600">
                  {friend.name} has a higher net worth through aggressive investment allocation. 
                  Consider increasing your stock portfolio by 10-15%.
                </p>
              </div>
              <div 
                className="p-3 bg-white rounded-lg hover-subtle cursor-pointer group animate-slide-left animate-delay-1"
                onClick={() => toast({ title: "Savings Optimization", description: "Learn about automated saving strategies" })}
              >
                <h4 className="font-medium text-sm mb-1 flex items-center gap-2 group-hover:text-[#5945a3] transition-colors">
                  🎯 Savings Habits
                  <Target className="text-blue-500 animate-scale-gentle" size={12} />
                </h4>
                <p className="text-sm text-gray-600">
                  Their {friend.savingsRate}% savings rate suggests automated transfers. 
                  Try increasing your automatic savings by $200/month.
                </p>
              </div>
              <div 
                className="p-3 bg-white rounded-lg hover-subtle cursor-pointer group animate-slide-left animate-delay-2"
                onClick={() => toast({ title: "Goal Achievement Tips", description: "Strategic goal setting based on successful patterns" })}
              >
                <h4 className="font-medium text-sm mb-1 flex items-center gap-2 group-hover:text-[#5945a3] transition-colors">
                  📈 Goal Achievement
                  <Award className="text-purple-500 animate-scale-gentle" size={12} />
                </h4>
                <p className="text-sm text-gray-600">
                  Based on their patterns, consider setting a stretch goal for your emergency fund 
                  to accelerate your financial progress.
                </p>
              </div>
              
              {showInsights && (
                <div className="mt-4 p-3 bg-gradient-to-r from-[#5945a3]/10 to-[#b37e91]/10 rounded-lg animate-scale-gentle">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-[#5945a3] font-medium">💪 Ready to implement these insights?</p>
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-[#5945a3] to-[#b37e91] hover:opacity-90 btn-refined"
                      onClick={() => toast({ title: "Action Plan Created! 📋", description: "Your personalized improvement plan is ready" })}
                    >
                      Create Action Plan
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-whisper">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#0a0a0f] mb-2 animate-silk" style={{ fontFamily: 'Neurial Grotesk, sans-serif' }}>
          Compare
        </h1>
        <p className="text-[#3b345b] animate-silk animate-delay-whisper-1">Learn from friends and benchmark against others</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-8 animate-silk animate-delay-whisper-2">
          <TabsTrigger value="friends" className="flex items-center gap-2 btn-whisper nav-whisper">
            <Users size={16} className="icon-whisper" />
            Friends
          </TabsTrigger>
          <TabsTrigger value="public" className="flex items-center gap-2 btn-whisper nav-whisper">
            <Globe size={16} className="icon-whisper" />
            Public Data
          </TabsTrigger>
        </TabsList>

        <TabsContent value="friends" className="animate-breath">
          <FriendSelector />
          <ComparisonCharts />
        </TabsContent>

        <TabsContent value="public" className="space-y-6 animate-breath">
          <Card className="bg-gradient-to-r from-[#5945a3] to-[#b37e91] text-white card-whisper hover-glow-subtle">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 animate-silk">How You Compare to Others</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 grid-whisper">
                <div 
                  className="text-center cursor-pointer hover-breath group"
                  onClick={() => toast({ title: "Net Worth Ranking", description: "You're in the top 25% for your age group!" })}
                >
                  <p className="text-3xl font-bold mb-2 animate-flow group-hover:scale-102 transition-transform">Top 25%</p>
                  <p className="opacity-90">Net Worth Ranking</p>
                  <Crown className="mx-auto mt-2 text-yellow-300" size={20} />
                </div>
                <div 
                  className="text-center cursor-pointer hover-breath group"
                  onClick={() => toast({ title: "Savings Performance", description: "Your savings rate exceeds national average" })}
                >
                  <p className="text-3xl font-bold mb-2 animate-flow group-hover:scale-102 transition-transform">Above Avg</p>
                  <p className="opacity-90">Savings Rate</p>
                  <TrendingUp className="mx-auto mt-2 text-green-300" size={20} />
                </div>
                <div 
                  className="text-center cursor-pointer hover-breath group"
                  onClick={() => toast({ title: "Financial Health", description: "Excellent financial discipline and planning!" })}
                >
                  <p className="text-3xl font-bold mb-2 animate-flow group-hover:scale-102 transition-transform">Excellent</p>
                  <p className="opacity-90">Financial Health</p>
                  <Sparkles className="mx-auto mt-2 text-yellow-300" size={20} />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="card-refined hover-glow animate-slide-left animate-delay-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="text-[#5945a3] icon-refined" size={20} />
                  National Averages (Age 25-35)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div 
                  className="flex justify-between items-center p-3 bg-gray-50 rounded hover-subtle cursor-pointer group"
                  onClick={() => toast({ title: "Net Worth Comparison", description: "Detailed breakdown vs national average" })}
                >
                  <span className="group-hover:text-[#5945a3] transition-colors">Average Net Worth</span>
                  <span className="font-semibold animate-counter">${compare.public.avgNetWorth.toLocaleString()}</span>
                </div>
                <div 
                  className="flex justify-between items-center p-3 bg-gray-50 rounded hover-subtle cursor-pointer group"
                  onClick={() => toast({ title: "Savings Rate Analysis", description: "How your savings rate compares nationally" })}
                >
                  <span className="group-hover:text-[#5945a3] transition-colors">Average Savings Rate</span>
                  <span className="font-semibold animate-counter">{compare.public.avgSavingsRate}%</span>
                </div>
                <div 
                  className="flex justify-between items-center p-3 bg-gray-50 rounded hover-subtle cursor-pointer group"
                  onClick={() => toast({ title: "Score Benchmarking", description: "Pecunia score vs national distribution" })}
                >
                  <span className="group-hover:text-[#5945a3] transition-colors">Average Pecunia Score</span>
                  <span className="font-semibold animate-counter">{compare.public.avgScore}</span>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Trophy className="text-[#5945a3] animate-scale-gentle" size={16} />
                    Your Performance
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center hover-subtle p-1 rounded">
                      <span className="text-sm">Net Worth</span>
                      <Badge className="bg-green-100 text-green-800 hover-glow animate-scale-gentle">Above Average</Badge>
                    </div>
                    <div className="flex justify-between items-center hover-subtle p-1 rounded">
                      <span className="text-sm">Savings Rate</span>
                      <Badge className="bg-green-100 text-green-800 hover-glow animate-scale-gentle">Above Average</Badge>
                    </div>
                    <div className="flex justify-between items-center hover-subtle p-1 rounded">
                      <span className="text-sm">Pecunia Score</span>
                      <Badge className="bg-blue-100 text-blue-800 hover-glow animate-scale-gentle">Excellent</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-refined hover-glow animate-slide-right animate-delay-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="text-[#5945a3] icon-refined" size={20} />
                  Improvement Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div 
                  className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer hover-glow group animate-slide-left"
                  onClick={() => toast({ title: "Milestone Progress", description: "Detailed roadmap to $100K net worth" })}
                >
                  <h4 className="font-medium mb-2 flex items-center gap-2 group-hover:text-[#5945a3] transition-colors">
                    🎯 Next Milestone
                    <Target className="animate-scale-gentle" size={14} />
                  </h4>
                  <p className="text-sm text-gray-700">
                    Reach $100K net worth to join the top 20% of your age group. 
                    You're 87% there!
                  </p>
                  <div className="mt-2 h-2 bg-blue-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-1000" style={{ width: '87%' }}></div>
                  </div>
                </div>
                
                <div 
                  className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer hover-glow group animate-slide-left animate-delay-1"
                  onClick={() => toast({ title: "Savings Strength", description: "Your exceptional savings performance analysis" })}
                >
                  <h4 className="font-medium mb-2 flex items-center gap-2 group-hover:text-[#5945a3] transition-colors">
                    💪 Strength
                    <TrendingUp className="text-green-600 animate-scale-gentle" size={14} />
                  </h4>
                  <p className="text-sm text-gray-700">
                    Your 23% savings rate puts you in the top 30% nationally. 
                    Keep up the great work!
                  </p>
                </div>
                
                <div 
                  className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors cursor-pointer hover-glow group animate-slide-left animate-delay-2"
                  onClick={() => toast({ title: "Growth Strategy", description: "Personalized investment allocation recommendations" })}
                >
                  <h4 className="font-medium mb-2 flex items-center gap-2 group-hover:text-[#5945a3] transition-colors">
                    🚀 Growth Opportunity
                    <Sparkles className="text-yellow-600 animate-scale-gentle" size={14} />
                  </h4>
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