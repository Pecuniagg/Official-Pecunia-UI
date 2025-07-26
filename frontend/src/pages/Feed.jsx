import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Heart, MessageCircle, Share2, TrendingUp, Users, DollarSign, MoreHorizontal, BookOpen } from 'lucide-react';
import { mockData } from '../data/mockData';

const Feed = () => {
  const [newPost, setNewPost] = useState('');
  const [likedPosts, setLikedPosts] = useState(new Set());
  const { feed } = mockData;

  const handlePost = () => {
    if (newPost.trim()) {
      console.log('New post:', newPost);
      setNewPost('');
    }
  };

  const handleLike = (postId) => {
    setLikedPosts(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(postId)) {
        newLiked.delete(postId);
      } else {
        newLiked.add(postId);
      }
      return newLiked;
    });
  };

  const PopularTickers = () => (
    <Card className="card-professional hover-professional">
      <CardHeader className="pb-4">
        <h3 className="text-professional-title flex items-center gap-2">
          <TrendingUp className="text-[#5945a3]" size={20} />
          Popular Tickers
        </h3>
      </CardHeader>
      <CardContent className="space-y-2">
        {[
          { symbol: '$AAPL', price: '+2.3%', color: 'text-green-600' },
          { symbol: '$TSLA', price: '+15.2%', color: 'text-green-600' },
          { symbol: '$GOOGL', price: '-1.1%', color: 'text-red-500' },
          { symbol: '$MSFT', price: '+0.8%', color: 'text-green-600' },
          { symbol: '$AMZN', price: '-0.5%', color: 'text-red-500' }
        ].map((ticker, index) => (
          <div key={index} className="flex justify-between items-center p-3 rounded-lg cursor-pointer interactive group" 
               style={{ 
                 transition: 'background-color 0.2s ease',
                 ':hover': { backgroundColor: 'var(--color-surface-hover)' }
               }}
               onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)'}
               onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <span className="text-professional-subtitle font-medium">{ticker.symbol}</span>
            <span className={`text-professional-subtitle font-semibold ${ticker.color} group-hover:scale-105 transition-transform`}>
              {ticker.price}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  const Associates = () => (
    <Card className="card-professional hover-professional">
      <CardHeader className="pb-4">
        <h3 className="text-professional-title flex items-center gap-2">
          <Users className="text-[#5945a3]" size={20} />
          Your Associates
        </h3>
      </CardHeader>
      <CardContent className="space-y-3">
        {[
          { name: 'Alice Johnson', status: 'online', achievement: 'Saved $5K this month' },
          { name: 'Bob Smith', status: 'offline', achievement: 'Completed emergency fund' },
          { name: 'Carol Davis', status: 'online', achievement: 'Reached investment goal' },
          { name: 'David Wilson', status: 'away', achievement: 'Improved credit score' }
        ].map((associate, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg cursor-pointer interactive group"
               style={{ 
                 transition: 'background-color 0.2s ease',
               }}
               onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)'}
               onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-10 w-10 ring-2 ring-transparent group-hover:ring-[#5945a3] transition-all">
                  <AvatarImage src={`/api/placeholder/40/40`} />
                  <AvatarFallback style={{ background: 'var(--color-primary-accent)', color: 'var(--color-text-white)' }}>
                    {associate.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                  associate.status === 'online' ? 'bg-green-500' : 
                  associate.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                }`} />
              </div>
              <div>
                <p className="text-professional-subtitle font-medium">{associate.name}</p>
                <p className="text-professional-body text-sm">{associate.achievement}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="btn-professional opacity-0 group-hover:opacity-100 transition-opacity">
              View
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  const FinancialTips = () => (
    <Card className="card-professional hover-professional">
      <CardHeader className="pb-4">
        <h3 className="text-professional-title flex items-center gap-2">
          <BookOpen className="text-[#5945a3]" size={20} />
          Financial Tips
        </h3>
      </CardHeader>
      <CardContent className="space-y-4">
        {[
          {
            title: "Emergency Fund Rule",
            tip: "Save 3-6 months of expenses for emergencies",
            category: "Savings"
          },
          {
            title: "50/30/20 Rule",
            tip: "50% needs, 30% wants, 20% savings",
            category: "Budgeting"
          },
          {
            title: "Credit Score",
            tip: "Pay bills on time to maintain good credit",
            category: "Credit"
          }
        ].map((tip, index) => (
          <div key={index} className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-professional-subtitle font-medium">{tip.title}</h4>
              <Badge variant="outline" className="text-xs">{tip.category}</Badge>
            </div>
            <p className="text-professional-body text-sm">{tip.tip}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  const PostCard = ({ post }) => (
    <Card className="card-professional hover-professional">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-transparent hover:ring-[#5945a3] transition-all">
              <AvatarImage src={post.avatar} />
              <AvatarFallback style={{ background: 'var(--color-primary-accent)', color: 'var(--color-text-white)' }}>
                {post.author.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-professional-subtitle font-medium">{post.author}</p>
              <p className="text-professional-body text-sm">{post.time}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="btn-professional">
            <MoreHorizontal size={16} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-professional-body">{post.content}</p>
        
        {post.ticker && (
          <div className="flex items-center gap-2 p-3 rounded-lg" style={{ backgroundColor: 'var(--color-surface-elevated)' }}>
            <DollarSign className="text-[#5945a3]" size={16} />
            <span className="text-professional-subtitle font-medium">{post.ticker}</span>
            <Badge variant="outline" className={`${post.stockPrice.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
              {post.stockPrice}
            </Badge>
          </div>
        )}

        <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              size="sm"
              className={`btn-professional gap-2 ${likedPosts.has(post.id) ? 'text-red-500' : 'text-gray-500'}`}
              onClick={() => handleLike(post.id)}
            >
              <Heart size={16} className={likedPosts.has(post.id) ? 'fill-current' : ''} />
              <span>{post.likes + (likedPosts.has(post.id) ? (likedPosts.has(post.id) ? 1 : 0) : 0)}</span>
            </Button>
            <Button variant="ghost" size="sm" className="btn-professional gap-2 text-gray-500">
              <MessageCircle size={16} />
              <span>{post.comments}</span>
            </Button>
            <Button variant="ghost" size="sm" className="btn-professional gap-2 text-gray-500">
              <Share2 size={16} />
              Share
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div style={{ 
      background: 'var(--color-bg-primary)', 
      color: 'var(--color-text-white)',
      minHeight: '100vh'
    }}>
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-professional-hero">Community Feed</h1>
          <p className="text-professional-body mt-2">Connect with fellow investors and share financial insights</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Post */}
            <Card className="card-professional">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/api/placeholder/40/40" />
                    <AvatarFallback style={{ background: 'var(--color-primary-accent)', color: 'var(--color-text-white)' }}>
                      JD
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea 
                      placeholder="What's on your mind about finance?"
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      className="min-h-[100px] resize-none border-0 focus:ring-0 p-0 text-base"
                      style={{ 
                        background: 'transparent',
                        color: 'var(--color-text-white)'
                      }}
                    />
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" style={{ color: 'var(--color-text-muted)' }}>
                          💰 Add Topic
                        </Button>
                        <Button variant="ghost" size="sm" style={{ color: 'var(--color-text-muted)' }}>
                          📊 Add Chart
                        </Button>
                      </div>
                      <Button 
                        onClick={handlePost} 
                        disabled={!newPost.trim()}
                        className="btn-professional"
                        style={{ background: 'var(--color-primary-accent)' }}
                      >
                        Post
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
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <PopularTickers />
            <Associates />
            <FinancialTips />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;