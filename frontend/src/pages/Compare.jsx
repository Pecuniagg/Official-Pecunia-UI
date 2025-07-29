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
  Crown,
  PiggyBank
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

  const ComparisonCard = ({ title, icon: Icon, data, color, index = 0 }) => (
    <Card 
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
      onClick={() => toast({ title: `${title} Details`, description: "Opening detailed comparison analytics..." })}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20 transition-colors">
              <Icon className={`${color} transition-colors group-hover:text-[#5945a3]`} size={20} />
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">{title}</span>
          </div>
          <Badge variant="outline" className="text-xs bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
            vs {data.comparison}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Your Score</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900 dark:text-white">{data.yourScore}</span>
              <div className={`p-1 rounded-full ${data.trend === 'up' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {data.trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Average</span>
            <span className="font-medium text-gray-900 dark:text-white">{data.average}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Ranking</span>
            <Badge className={`text-xs ${data.ranking <= 25 ? 'bg-green-100 text-green-700 border-green-200' : data.ranking <= 50 ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}`}>
              Top {data.ranking}%
            </Badge>
          </div>
        </div>
        
        {/* Progress visualization */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Poor</span>
            <span>Excellent</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ${
                data.ranking <= 25 ? 'bg-green-500' : data.ranking <= 50 ? 'bg-blue-500' : 'bg-yellow-500'
              }`}
              style={{ width: `${Math.max(data.yourScore, 10)}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const FriendSelector = () => (
    <div className="space-y-8">
      {/* Fixed Compare with Friends Header */}
      <Card className="bg-gradient-to-r from-[#5945a3] to-[#6b59a8] text-white shadow-lg">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">Compare with Friends</h2>
              <p className="text-lg opacity-90">See how your financial progress stacks up</p>
            </div>
            <Button className="bg-white text-[#5945a3] hover:bg-gray-50 px-6 py-3 font-medium shadow-sm w-full lg:w-auto">
              <UserPlus size={16} className="mr-2" />
              Add Friend
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {compare.friends.map((friend, index) => {
          const isSelected = selectedFriend === friend.name;
          const isHovered = hoveredFriend === friend.name;
          const isLiked = likedFriends.has(friend.name);
          
          return (
            <Card
              key={index}
              className={`bg-white dark:bg-gray-800 border-2 transition-all duration-300 cursor-pointer group relative overflow-hidden shadow-sm hover:shadow-lg ${
                isSelected 
                  ? 'border-[#5945a3] shadow-xl transform scale-[1.02] dark:border-[#5945a3]' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-[#5945a3]/40 hover:transform hover:scale-[1.01]'
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
              <CardContent className="p-6">
                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute top-4 right-4">
                    <div className="p-2 bg-[#5945a3] rounded-full">
                      <Trophy className="text-white" size={16} />
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src="/api/placeholder/64/64" />
                      <AvatarFallback className="bg-gradient-to-br from-[#5945a3] to-[#b37e91] text-white text-xl font-bold">
                        {friend.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-white text-xl">{friend.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">Score: {friend.score}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                    <div className="font-bold text-gray-900 dark:text-white text-lg">{friend.netWorth}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Net Worth</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                    <div className="font-bold text-green-600 text-lg">{friend.growth}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Growth</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="ghost"
                    size="lg"
                    className={`flex-1 gap-2 transition-all duration-200 h-12 ${
                      isLiked 
                        ? 'text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30' 
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLikeFriend(friend.name);
                    }}
                  >
                    <Heart size={16} className={isLiked ? 'fill-current' : ''} />
                    <span className="font-medium">{isLiked ? 'Liked' : 'Like'}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="flex-1 gap-2 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 h-12"
                    onClick={(e) => {
                      e.stopPropagation();
                      toast({ title: "Profile viewed", description: `Viewing ${friend.name}'s profile` });
                    }}
                  >
                    <Eye size={16} />
                    <span className="font-medium">View</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const ComparisonCharts = () => (
    selectedFriend && (
      <div className="mt-12 space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Detailed Comparison with {selectedFriend}
          </h3>
          <Button
            variant="outline"
            size="lg"
            onClick={() => setShowInsights(!showInsights)}
            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 px-6 py-3 w-full lg:w-auto"
          >
            <Sparkles size={18} className="mr-2" />
            {showInsights ? 'Hide' : 'Show'} AI Insights
          </Button>
        </div>

        {/* Comparison metrics grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
          {compare.metrics.map((metric, index) => (
            <ComparisonCard
              key={index}
              title={metric.category}
              icon={metric.category === 'Net Worth' ? DollarSign : 
                    metric.category === 'Investments' ? TrendingUp : 
                    metric.category === 'Savings Rate' ? PiggyBank : 
                    BarChart3}
              data={metric}
              color={metric.trend === 'up' ? 'text-green-600' : 'text-red-500'}
              index={index}
            />
          ))}
        </div>

        {/* AI Insights Panel */}
        {showInsights && (
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                  <Sparkles className="text-blue-600 dark:text-blue-400" size={20} />
                </div>
                <span className="text-blue-900 dark:text-blue-100">AI Comparison Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="p-6 bg-white dark:bg-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-700">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                    <Target size={16} />
                    Key Advantage Areas
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                    You're performing exceptionally well in investment returns (+12.5% vs {selectedFriend}'s +8.2%). 
                    Your diversified portfolio strategy is paying off significantly.
                  </p>
                </div>
                <div className="p-6 bg-white dark:bg-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-700">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                    <TrendingUp size={16} />
                    Growth Opportunities
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                    Consider increasing your savings rate to match {selectedFriend}'s 28% rate. This could boost your financial goals timeline by 18 months.
                  </p>
                </div>
                <div className="p-6 bg-white dark:bg-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-700">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                    <Zap size={16} />
                    Action Recommendations
                  </h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      Automate an additional $200/month to savings
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      Consider rebalancing portfolio quarterly like {selectedFriend}
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      Explore high-yield savings accounts for better returns
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  );

  const renderDetailedModal = () => {
    if (!selectedFriend) return null;
    
    const friend = compare.friends.find(f => f.name === selectedFriend);
    if (!friend) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/api/placeholder/64/64" />
                  <AvatarFallback className="bg-gradient-to-br from-[#5945a3] to-[#b37e91] text-white text-xl font-bold">
                    {friend.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{friend.name}</h2>
                  <p className="text-gray-600 dark:text-gray-400">Detailed Financial Comparison</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedFriend(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </Button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 space-y-8">
            {/* Financial Overview Comparison */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-[#5945a3]" />
                Financial Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300">Your Stats</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Pecunia Score</span>
                      <span className="font-medium">782</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Monthly Savings</span>
                      <span className="font-medium">$2,500</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Investment Portfolio</span>
                      <span className="font-medium">$45,000</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300">{friend.name}&apos;s Stats</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Pecunia Score</span>
                      <span className="font-medium">{friend.score}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Monthly Savings</span>
                      <span className="font-medium">${(Math.random() * 3000 + 1000).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Investment Portfolio</span>
                      <span className="font-medium">${(Math.random() * 60000 + 20000).toFixed(0)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Learning Insights */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#5945a3]" />
                What You Can Learn
              </h3>
              <div className="bg-gradient-to-r from-[#5945a3]/10 to-[#b37e91]/10 rounded-lg p-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#5945a3] rounded-full mt-2"></div>
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>{friend.name}</strong> allocates 15% more to investments, which could boost your long-term wealth
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#5945a3] rounded-full mt-2"></div>
                    <p className="text-gray-700 dark:text-gray-300">
                      Their spending on dining out is 25% lower, freeing up more for savings goals
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Financial Comparison
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Compare your financial progress with friends and public benchmarks to stay motivated and informed
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-10">
            <TabsList className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-2 rounded-xl shadow-sm">
              <TabsTrigger 
                value="friends" 
                className="flex items-center gap-3 px-6 py-3 rounded-lg font-medium transition-all duration-200 data-[state=active]:bg-[#5945a3] data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                <Users size={18} />
                <span>Friends</span>
              </TabsTrigger>
              <TabsTrigger 
                value="public" 
                className="flex items-center gap-3 px-6 py-3 rounded-lg font-medium transition-all duration-200 data-[state=active]:bg-[#5945a3] data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                <Globe size={18} />
                <span>Public Data</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="friends">
            <FriendSelector />
            <ComparisonCharts />
          </TabsContent>

          <TabsContent value="public" className="space-y-8">
            <Card className="bg-gradient-to-r from-[#5945a3] to-[#b37e91] text-white shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-6 text-center lg:text-left">How You Compare to Others</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div 
                    className="text-center p-6 bg-white/10 rounded-xl backdrop-blur-sm cursor-pointer hover:bg-white/20 transition-all duration-200 group"
                    onClick={() => toast({ title: "Net Worth Ranking", description: "You're in the top 25% for your age group!" })}
                  >
                    <p className="text-3xl font-bold mb-2 group-hover:scale-105 transition-transform">Top 25%</p>
                    <p className="opacity-90 mb-3">Net Worth Ranking</p>
                    <Crown className="mx-auto text-yellow-300" size={24} />
                  </div>
                  <div 
                    className="text-center p-6 bg-white/10 rounded-xl backdrop-blur-sm cursor-pointer hover:bg-white/20 transition-all duration-200 group"
                    onClick={() => toast({ title: "Savings Performance", description: "Your savings rate exceeds national average" })}
                  >
                    <p className="text-3xl font-bold mb-2 group-hover:scale-105 transition-transform">Above Avg</p>
                    <p className="opacity-90 mb-3">Savings Rate</p>
                    <TrendingUp className="mx-auto text-green-300" size={24} />
                  </div>
                  <div 
                    className="text-center p-6 bg-white/10 rounded-xl backdrop-blur-sm cursor-pointer hover:bg-white/20 transition-all duration-200 group"
                    onClick={() => toast({ title: "Investment Portfolio", description: "Your portfolio diversity is excellent" })}
                  >
                    <p className="text-3xl font-bold mb-2 group-hover:scale-105 transition-transform">Excellent</p>
                    <p className="opacity-90 mb-3">Portfolio Health</p>
                    <Award className="mx-auto text-blue-300" size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed benchmarks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {[
                { title: "Age Group Average", subtitle: "25-35 years", value: "$45,200", comparison: "+$12,800", trend: "up" },
                { title: "Income Bracket", subtitle: "$50K-75K", value: "68th percentile", comparison: "Top third", trend: "up" },
                { title: "Geographic Region", subtitle: "Your metro area", value: "Above median", comparison: "+15%", trend: "up" },
                { title: "Career Stage", subtitle: "Mid-level professional", value: "82nd percentile", comparison: "Excellent", trend: "up" },
                { title: "Education Level", subtitle: "College graduate", value: "Above average", comparison: "+$8,500", trend: "up" },
                { title: "Industry Peers", subtitle: "Technology sector", value: "75th percentile", comparison: "Strong position", trend: "up" }
              ].map((benchmark, index) => (
                <Card 
                  key={index} 
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-[#5945a3]/30 transition-all duration-300 cursor-pointer group" 
                  onClick={() => toast({ title: benchmark.title, description: `Detailed ${benchmark.title.toLowerCase()} analysis` })}
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg group-hover:text-[#5945a3] transition-colors">{benchmark.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{benchmark.subtitle}</p>
                      </div>
                      <Badge className={`px-3 py-1 font-medium ${benchmark.trend === 'up' ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' : 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'}`}>
                        {benchmark.comparison}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-gray-900 dark:text-white">{benchmark.value}</span>
                      <div className={`p-2 rounded-full ${benchmark.trend === 'up' ? 'bg-green-100 text-green-600 dark:bg-green-900/20' : 'bg-red-100 text-red-600 dark:bg-red-900/20'}`}>
                        {benchmark.trend === 'up' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Compare;