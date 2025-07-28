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
      className="shadow-lg card-whisper group compare-box"
      onClick={() => toast({ title: `${title} Details`, description: "Opening detailed comparison analytics..." })}
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className={`${color} icon-whisper`} size={20} />
            <span className="mobile-subtitle lg:text-lg">{title}</span>
          </div>
          <Badge variant="outline" className="text-xs">
            vs {data.comparison}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="mobile-caption text-gray-600">Your Score</span>
            <div className="flex items-center gap-2">
              <span className="mobile-subtitle lg:font-bold">{data.yourScore}</span>
              <div className={`p-1 rounded-full ${data.trend === 'up' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {data.trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="mobile-caption text-gray-600">Average</span>
            <span className="mobile-body font-medium">{data.average}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="mobile-caption text-gray-600">Ranking</span>
            <Badge variant={data.ranking <= 25 ? "default" : data.ranking <= 50 ? "secondary" : "outline"}>
              Top {data.ranking}%
            </Badge>
          </div>
        </div>
        
        {/* Progress visualization */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Poor</span>
            <span>Excellent</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 delay-${index * 100} ${
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
      <div className="flex justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Compare with Friends</h2>
          <p className="text-gray-400">See how your financial progress stacks up</p>
        </div>
        <Button className="bg-gradient-to-r from-[#5945a3] to-[#b37e91] text-white px-6 py-3">
          <UserPlus size={16} className="mr-2" />
          Add Friend
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {compare.friends.map((friend, index) => {
          const isSelected = selectedFriend === friend.name;
          const isHovered = hoveredFriend === friend.name;
          const isLiked = likedFriends.has(friend.name);
          
          return (
            <div
              key={index}
              className={`p-6 bg-white rounded-2xl border-2 transition-all duration-300 cursor-pointer relative overflow-hidden ${
                isSelected 
                  ? 'border-[#5945a3] shadow-xl transform scale-[1.02]' 
                  : 'border-gray-200 hover:border-[#5945a3]/40 hover:shadow-lg hover:transform hover:scale-[1.01]'
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
              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3">
                  <Trophy className="text-[#5945a3]" size={18} />
                </div>
              )}
              
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/api/placeholder/48/48" />
                    <AvatarFallback className="bg-gradient-to-br from-[#5945a3] to-[#b37e91] text-white">
                      {friend.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{friend.name}</h3>
                  <p className="text-sm text-gray-600">Score: {friend.score}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-gray-900">{friend.netWorth}</div>
                  <div className="text-xs text-gray-600">Net Worth</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-green-600">{friend.growth}</div>
                  <div className="text-xs text-gray-600">Growth</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex-1 gap-1 transition-all duration-200 ${isLiked ? 'text-red-500' : 'text-gray-500'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLikeFriend(friend.name);
                  }}
                >
                  <Heart size={14} className={isLiked ? 'fill-current' : ''} />
                  <span className="text-xs">{isLiked ? 'Liked' : 'Like'}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 gap-1 text-gray-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    toast({ title: "Profile viewed", description: `Viewing ${friend.name}'s profile` });
                  }}
                >
                  <Eye size={14} />
                  <span className="text-xs">View</span>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const ComparisonCharts = () => (
    selectedFriend && (
      <div className="space-y-4 lg:space-y-6 mt-6 lg:mt-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 lg:gap-0">
          <h3 className="mobile-title lg:text-xl lg:font-bold">Detailed Comparison with {selectedFriend}</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowInsights(!showInsights)}
            className="mobile-btn-sm lg:btn-whisper w-full lg:w-auto"
          >
            <Sparkles size={16} className="mr-2" />
            {showInsights ? 'Hide' : 'Show'} AI Insights
          </Button>
        </div>

        {/* Comparison metrics grid */}
        <div className="mobile-grid-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
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
          <Card className="mobile-card lg:card-whisper border-2 border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
            <CardHeader className="mobile-card-header">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="text-blue-600 dark:text-blue-400" size={20} />
                <span className="mobile-subtitle lg:text-lg">AI Comparison Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="mobile-card-content">
              <div className="space-y-3 lg:space-y-4">
                <div className="p-3 lg:p-4 bg-white dark:bg-blue-900/30 rounded-lg">
                  <h4 className="mobile-subtitle lg:font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    🎯 Key Advantage Areas
                  </h4>
                  <p className="mobile-body text-blue-800 dark:text-blue-200">
                    You're performing exceptionally well in investment returns (+12.5% vs {selectedFriend}'s +8.2%). 
                    Your diversified portfolio strategy is paying off significantly.
                  </p>
                </div>
                <div className="p-3 lg:p-4 bg-white dark:bg-blue-900/30 rounded-lg">
                  <h4 className="mobile-subtitle lg:font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    📈 Growth Opportunities
                  </h4>
                  <p className="mobile-body text-blue-800 dark:text-blue-200">
                    Consider increasing your savings rate to match {selectedFriend}'s 28% rate. This could boost your financial goals timeline by 18 months.
                  </p>
                </div>
                <div className="p-3 lg:p-4 bg-white dark:bg-blue-900/30 rounded-lg">
                  <h4 className="mobile-subtitle lg:font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    🚀 Action Recommendations
                  </h4>
                  <ul className="mobile-body text-blue-800 dark:text-blue-200 space-y-1">
                    <li>• Automate an additional $200/month to savings</li>
                    <li>• Consider rebalancing portfolio quarterly like {selectedFriend}</li>
                    <li>• Explore high-yield savings accounts for better returns</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  );

  return (
    <div className="max-w-7xl mx-auto p-6" style={{ 
      background: 'var(--color-bg-primary)', 
      color: 'var(--color-text-white)',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-text-white)' }}>
          Financial Comparison
        </h1>
        <p className="text-lg" style={{ color: 'var(--color-text-muted)' }}>
          Compare your financial progress with friends and public benchmarks
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-8 w-auto">
          <TabsTrigger value="friends" className="flex items-center gap-2">
            <Users size={16} />
            <span>Friends</span>
          </TabsTrigger>
          <TabsTrigger value="public" className="flex items-center gap-2">
            <Globe size={16} />
            <span>Public Data</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="friends">
          <FriendSelector />
          <ComparisonCharts />
        </TabsContent>

        <TabsContent value="public" className="space-y-6">
            <Card className="bg-gradient-to-r from-[#5945a3] to-[#b37e91] text-white card-whisper hover-glow-subtle compare-public-data-box">
              <CardContent className="p-4 lg:p-8">
                <h2 className="mobile-title lg:text-2xl lg:font-bold mb-3 lg:mb-4 animate-silk">How You Compare to Others</h2>
                <div className="mobile-grid-1 lg:grid-cols-3 gap-4 lg:gap-6 grid-whisper">
                  <div 
                    className="text-center cursor-pointer hover-breath group"
                    onClick={() => toast({ title: "Net Worth Ranking", description: "You're in the top 25% for your age group!" })}
                  >
                    <p className="text-2xl lg:text-3xl font-bold mb-2 animate-flow group-hover:scale-102 transition-transform">Top 25%</p>
                    <p className="opacity-90 mobile-body">Net Worth Ranking</p>
                    <Crown className="mx-auto mt-2 text-yellow-300" size={20} />
                  </div>
                  <div 
                    className="text-center cursor-pointer hover-breath group"
                    onClick={() => toast({ title: "Savings Performance", description: "Your savings rate exceeds national average" })}
                  >
                    <p className="text-2xl lg:text-3xl font-bold mb-2 animate-flow group-hover:scale-102 transition-transform">Above Avg</p>
                    <p className="opacity-90 mobile-body">Savings Rate</p>
                    <TrendingUp className="mx-auto mt-2 text-green-300" size={20} />
                  </div>
                  <div 
                    className="text-center cursor-pointer hover-breath group"
                    onClick={() => toast({ title: "Investment Portfolio", description: "Your portfolio diversity is excellent" })}
                  >
                    <p className="text-2xl lg:text-3xl font-bold mb-2 animate-flow group-hover:scale-102 transition-transform">Excellent</p>
                    <p className="opacity-90 mobile-body">Portfolio Health</p>
                    <Award className="mx-auto mt-2 text-blue-300" size={20} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed benchmarks */}
            <div className="mobile-grid-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
              {[
                { title: "Age Group Average", subtitle: "25-35 years", value: "$45,200", comparison: "+$12,800", trend: "up" },
                { title: "Income Bracket", subtitle: "$50K-75K", value: "68th percentile", comparison: "Top third", trend: "up" },
                { title: "Geographic Region", subtitle: "Your metro area", value: "Above median", comparison: "+15%", trend: "up" },
                { title: "Career Stage", subtitle: "Mid-level professional", value: "82nd percentile", comparison: "Excellent", trend: "up" },
                { title: "Education Level", subtitle: "College graduate", value: "Above average", comparison: "+$8,500", trend: "up" },
                { title: "Industry Peers", subtitle: "Technology sector", value: "75th percentile", comparison: "Strong position", trend: "up" }
              ].map((benchmark, index) => (
                <Card key={index} className="mobile-card lg:card-whisper hover:shadow-lg transition-all duration-200 cursor-pointer" 
                      onClick={() => toast({ title: benchmark.title, description: `Detailed ${benchmark.title.toLowerCase()} analysis` })}>
                  <CardContent className="mobile-card-content">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="mobile-subtitle lg:font-semibold">{benchmark.title}</h3>
                        <p className="mobile-caption text-gray-500">{benchmark.subtitle}</p>
                      </div>
                      <Badge variant="outline" className={benchmark.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                        {benchmark.comparison}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="mobile-body font-semibold">{benchmark.value}</span>
                      <div className={`p-1 rounded-full ${benchmark.trend === 'up' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {benchmark.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
    </div>
  );
};

export default Compare;