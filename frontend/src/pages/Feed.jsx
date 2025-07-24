import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Heart, MessageCircle, Share2, TrendingUp, Users, DollarSign } from 'lucide-react';
import { mockData } from '../data/mockData';

const Feed = () => {
  const [newPost, setNewPost] = useState('');
  const { feed } = mockData;

  const handlePost = () => {
    if (newPost.trim()) {
      // This would send to backend in real implementation
      console.log('New post:', newPost);
      setNewPost('');
    }
  };

  const PopularTickers = () => (
    <Card className="sticky top-4">
      <CardHeader>
        <h3 className="font-semibold text-gray-900">Popular Tickers</h3>
      </CardHeader>
      <CardContent className="space-y-3">
        {[
          { symbol: '$AAPL', price: '+2.3%', color: 'text-green-600' },
          { symbol: '$TSLA', price: '+15.2%', color: 'text-green-600' },
          { symbol: '$GOOGL', price: '-1.1%', color: 'text-red-500' },
          { symbol: '$MSFT', price: '+0.8%', color: 'text-green-600' },
          { symbol: '$AMZN', price: '-0.5%', color: 'text-red-500' }
        ].map((ticker, index) => (
          <div key={index} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
            <span className="font-medium text-sm">{ticker.symbol}</span>
            <span className={`text-sm font-semibold ${ticker.color}`}>{ticker.price}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  const Associates = () => (
    <Card className="sticky top-4">
      <CardHeader>
        <h3 className="font-semibold text-gray-900">Your Associates</h3>
      </CardHeader>
      <CardContent className="space-y-3">
        {[
          { name: 'Sarah Johnson', status: 'online', avatar: '/api/placeholder/32/32' },
          { name: 'Mike Chen', status: 'away', avatar: '/api/placeholder/32/32' },
          { name: 'Emily Davis', status: 'online', avatar: '/api/placeholder/32/32' },
          { name: 'David Wilson', status: 'offline', avatar: '/api/placeholder/32/32' }
        ].map((associate, index) => (
          <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
            <div className="relative">
              <Avatar className="h-8 w-8">
                <AvatarImage src={associate.avatar} />
                <AvatarFallback>{associate.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                associate.status === 'online' ? 'bg-green-500' : 
                associate.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
              }`}></div>
            </div>
            <span className="text-sm font-medium">{associate.name}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  const PostCard = ({ post }) => (
    <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.avatar} />
            <AvatarFallback>{post.user.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900">{post.user}</h4>
              {post.isGroup && <Badge variant="secondary" className="text-xs">Group</Badge>}
            </div>
            <p className="text-sm text-gray-500">{post.time}</p>
          </div>
        </div>

        <p className="text-gray-800 mb-4 leading-relaxed">{post.content}</p>

        {post.ticker && (
          <div className="bg-gray-50 rounded-lg p-3 mb-4 hover:bg-gray-100 cursor-pointer transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#5945a3]">{post.ticker}</span>
              <span className={`font-semibold ${
                post.stockPrice.startsWith('+') ? 'text-green-600' : 'text-red-500'
              }`}>
                {post.stockPrice}
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 hover:text-red-500">
              <Heart size={16} />
              <span>{post.likes}</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 hover:text-blue-500">
              <MessageCircle size={16} />
              <span>{post.comments}</span>
            </Button>
          </div>
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
            <Share2 size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#0a0a0f] mb-2" style={{ fontFamily: 'Neurial Grotesk, sans-serif' }}>
          Feed
        </h1>
        <p className="text-[#3b345b]">The social finance stream</p>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Sidebar */}
        <div className="col-span-3 space-y-6">
          <PopularTickers />
          
          {/* Market Summary */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900">Market Summary</h3>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">S&P 500</span>
                <span className="text-sm font-semibold text-green-600">+1.2%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">NASDAQ</span>
                <span className="text-sm font-semibold text-green-600">+0.8%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">DOW</span>
                <span className="text-sm font-semibold text-red-500">-0.3%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Feed */}
        <div className="col-span-6 space-y-6">
          {/* Post Composer */}
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/api/placeholder/40/40" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder="Share your financial insights, achievements, or questions..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className="min-h-[100px] border-0 resize-none focus:ring-0 p-0 text-base"
                  />
                  <div className="flex justify-between items-center pt-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <DollarSign size={16} />
                      <span>Add ticker symbol</span>
                    </div>
                    <Button 
                      onClick={handlePost}
                      disabled={!newPost.trim()}
                      className="bg-[#5945a3] hover:bg-[#4a3d8f]"
                    >
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feed Posts */}
          <div className="space-y-6">
            {feed.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Load More */}
          <div className="text-center">
            <Button variant="outline" size="lg" className="w-full max-w-xs">
              Load More Posts
            </Button>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="col-span-3 space-y-6">
          <Associates />
          
          {/* Group Invites */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900">Group Invites</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users size={16} className="text-blue-600" />
                  <span className="font-medium text-sm">Investment Club</span>
                </div>
                <p className="text-xs text-gray-600 mb-3">Monthly investment discussions and portfolio reviews</p>
                <div className="flex gap-2">
                  <Button size="xs" className="bg-blue-600 hover:bg-blue-700">Accept</Button>
                  <Button size="xs" variant="outline">Decline</Button>
                </div>
              </div>
              
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users size={16} className="text-green-600" />
                  <span className="font-medium text-sm">Budgeting Buddies</span>
                </div>
                <p className="text-xs text-gray-600 mb-3">Support group for budget management and saving goals</p>
                <div className="flex gap-2">
                  <Button size="xs" className="bg-green-600 hover:bg-green-700">Accept</Button>
                  <Button size="xs" variant="outline">Decline</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trending Topics */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900">Trending</h3>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                '#EmergencyFund',
                '#InvestmentTips',
                '#BudgetingHacks',
                '#RetirementPlanning',
                '#SideHustle',
                '#DebtFree'
              ].map((tag, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-[#5945a3] hover:bg-purple-50"
                >
                  {tag}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Feed;