import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';
import { useToast } from '../hooks/use-toast';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Users,
  Plus,
  Image,
  Globe,
  Lock,
  Eye,
  MoreHorizontal,
  Bookmark,
  AlertCircle,
  CheckCircle,
  Bell,
  Search,
  Send,
  UserPlus,
  Settings
} from 'lucide-react';
import { mockData } from '../data/mockData';

const Feed = () => {
  const [newPost, setNewPost] = useState('');
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set());
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDM, setShowDM] = useState(null);
  const [dmMessage, setDmMessage] = useState('');
  const [error, setError] = useState(null);
  
  // Safe data extraction with error handling
  let feed, popularTickers, associates, tips;
  try {
    const data = mockData || {};
    feed = data.feed || [];
    popularTickers = data.popularTickers || [];
    associates = data.associates || [];
    tips = data.tips || [];
  } catch (err) {
    console.error('Error loading mockData:', err);
    setError('Failed to load feed data');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading Feed</h2>
          <p className="text-gray-600">Please try refreshing the page</p>
        </div>
      </div>
    );
  }
  
  const { toast } = useToast();

  const handleLike = (postId) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
        toast({ title: "Unliked", description: "Post removed from likes" });
      } else {
        newSet.add(postId);
        toast({ title: "Liked! ❤️", description: "Post added to your likes" });
      }
      return newSet;
    });
  };

  const handleSwipeRight = (userId) => {
    setShowDM(userId);
    toast({ title: "DM opened", description: `Start a conversation with ${userId}` });
  };

  const handleSendDM = () => {
    if (dmMessage.trim()) {
      toast({ 
        title: "Message sent! 📨", 
        description: `Your message has been sent to ${showDM}` 
      });
      setDmMessage('');
      setShowDM(null);
    }
  };

  const filteredFeed = (feed || []).filter(post => {
    if (!post) return false;
    
    if (searchQuery) {
      return (post.content && post.content.toLowerCase().includes(searchQuery.toLowerCase())) ||
             (post.author && post.author.toLowerCase().includes(searchQuery.toLowerCase())) ||
             (post.ticker && post.ticker.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (filter === 'all') return true;
    if (filter === 'investments') return post.ticker;
    if (filter === 'community') return post.author && post.author.includes('Group');
    return true;
  });

  const handleBookmark = (postId) => {
    setBookmarkedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
        toast({ title: "Bookmark removed", description: "Post removed from bookmarks" });
      } else {
        newSet.add(postId);
        toast({ title: "Bookmarked! 📌", description: "Post saved to bookmarks" });
      }
      return newSet;
    });
  };

  const handlePost = () => {
    if (!newPost.trim()) return;
    
    toast({
      title: "Post shared! 🎉",
      description: "Your financial insight has been shared with the community",
    });
    setNewPost('');
  };

  const PostCard = ({ post }) => {
    const isLiked = likedPosts.has(post.id);
    const isBookmarked = bookmarkedPosts.has(post.id);
    
    return (
      <Card className="mobile-card lg:card-professional hover:shadow-lg transition-all duration-200">
        <CardHeader className="mobile-card-header lg:pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 lg:h-10 lg:w-10">
                <AvatarImage src={post.author.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-[#5945a3] to-[#b37e91] text-white text-sm">
                  {post.author.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="mobile-subtitle lg:font-semibold">{post.author}</h4>
                <div className="flex items-center gap-2">
                  <p className="mobile-caption lg:text-sm text-gray-500">{post.time}</p>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="p-1 lg:p-2">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="mobile-card-content">
          <p className="mobile-body lg:text-gray-700 lg:dark:text-gray-300 mb-4">{post.content}</p>
          
          {/* Stock ticker information */}
          {post.ticker && post.stockPrice && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 lg:p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="font-semibold text-gray-900 dark:text-white">{post.ticker}</span>
                </div>
                <div className={`flex items-center gap-1 ${post.stockPrice.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
                  {post.stockPrice.startsWith('+') ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span className="font-semibold">{post.stockPrice}</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-4 lg:gap-6">
              <Button
                variant="ghost"
                size="sm"
                className={`mobile-btn-sm gap-2 ${isLiked ? 'text-red-500' : 'text-gray-500'}`}
                onClick={() => handleLike(post.id)}
              >
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                <span className="text-xs lg:text-sm">{(post.likes || 0) + (isLiked ? 1 : 0)}</span>
              </Button>
              <Button variant="ghost" size="sm" className="mobile-btn-sm gap-2 text-gray-500">
                <MessageCircle className="h-4 w-4" />
                <span className="text-xs lg:text-sm">{post.comments || 0}</span>
              </Button>
              <Button variant="ghost" size="sm" className="mobile-btn-sm gap-2 text-gray-500">
                <Share2 className="h-4 w-4" />
                <span className="hidden lg:inline text-xs lg:text-sm">Share</span>
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className={`mobile-btn-sm ${isBookmarked ? 'text-blue-500' : 'text-gray-500'}`}
              onClick={() => handleBookmark(post.id)}
            >
              <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
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
      <div className="mobile-container lg:max-w-6xl lg:mx-auto lg:p-6">
        {/* Search and Filter Bar */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search posts, users, or tickers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
            <Button
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => toast({ title: "Communities", description: "Explore financial communities feature coming soon!" })}
            >
              <Users className="h-4 w-4 mr-2" />
              Communities
            </Button>
          </div>
          
          {/* Filter Tabs */}
          <div className="flex gap-2">
            {[
              { key: 'all', label: 'All Posts' },
              { key: 'investments', label: 'Investments' },
              { key: 'community', label: 'Community' }
            ].map((tab) => (
              <Button
                key={tab.key}
                variant={filter === tab.key ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter(tab.key)}
                className={filter === tab.key 
                  ? 'bg-[#5945a3] text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
                }
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-8">
            {/* Post Composer */}
            <Card className="mobile-card lg:card-professional mb-4 lg:mb-6">
              <CardContent className="mobile-card-content">
                <div className="flex gap-3 lg:gap-4">
                  <Avatar className="h-8 w-8 lg:h-10 lg:w-10 flex-shrink-0">
                    <AvatarImage src="/api/placeholder/40/40" />
                    <AvatarFallback className="bg-gradient-to-br from-[#5945a3] to-[#b37e91] text-white">JD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Share your financial insights..."
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      className="mobile-textarea lg:min-h-[100px] lg:resize-none"
                    />
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-3 lg:mt-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="mobile-btn-sm gap-2">
                          <Image className="h-4 w-4" />
                          <span className="hidden sm:inline">Photo</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="mobile-btn-sm gap-2">
                          <Globe className="h-4 w-4" />
                          <span className="hidden sm:inline">Public</span>
                        </Button>
                      </div>
                      <Button 
                        onClick={handlePost}
                        disabled={!newPost.trim()}
                        className="mobile-btn lg:btn-professional w-full sm:w-auto"
                        style={{ background: 'var(--gradient-primary)' }}
                      >
                        Post
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feed Posts */}
            <div className="space-y-4 lg:space-y-6">
              {filteredFeed.map((post) => (
                <div key={post.id} className="relative">
                  <PostCard post={post} />
                  {/* Swipe Right to DM overlay */}
                  <div className="absolute top-2 right-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSwipeRight(post.author)}
                      className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-400/30"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {filteredFeed.length === 0 && (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No posts found matching your search</p>
                </div>
              )}
            </div>
            
            {/* DM Modal */}
            {showDM && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                  <h3 className="text-lg font-bold mb-4 text-gray-900">Send Message to {showDM}</h3>
                  <Textarea
                    placeholder="Type your message..."
                    value={dmMessage}
                    onChange={(e) => setDmMessage(e.target.value)}
                    className="mb-4"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSendDM} className="flex-1">
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                    <Button variant="outline" onClick={() => setShowDM(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-4 lg:space-y-6">
            {/* Popular Tickers */}
            <Card className="mobile-card lg:card-professional">
              <CardHeader className="mobile-card-header">
                <CardTitle className="mobile-subtitle lg:text-lg">Popular Tickers</CardTitle>
              </CardHeader>
              <CardContent className="mobile-card-content">
                <div className="space-y-2 lg:space-y-3">
                  {(popularTickers || []).map((ticker, index) => (
                    <div key={index} className="flex items-center justify-between p-2 lg:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                      <div>
                        <p className="mobile-caption lg:font-medium">{ticker.symbol || 'N/A'}</p>
                        <p className="mobile-caption text-gray-500">{ticker.name || 'Unknown'}</p>
                      </div>
                      <div className="text-right">
                        <p className="mobile-caption lg:font-semibold">${ticker.price || '0.00'}</p>
                        <p className={`mobile-caption ${(ticker.change && ticker.change.startsWith('+')) ? 'text-green-600' : 'text-red-500'}`}>
                          {ticker.change || '0.0%'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Associates */}
            <Card className="mobile-card lg:card-professional">
              <CardHeader className="mobile-card-header">
                <CardTitle className="mobile-subtitle lg:text-lg">Your Associates</CardTitle>
              </CardHeader>
              <CardContent className="mobile-card-content">
                <div className="space-y-2 lg:space-y-3">
                  {(associates || []).map((associate, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 lg:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                      <Avatar className="h-8 w-8 lg:h-10 lg:w-10">
                        <AvatarImage src={associate.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-[#5945a3] to-[#b37e91] text-white text-xs">
                          {associate.name ? associate.name.split(' ').map(n => n[0]).join('') : 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="mobile-caption lg:font-medium">{associate.name || 'Unknown User'}</p>
                        <p className="mobile-caption text-gray-500">{associate.status || 'No status'}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSwipeRight(associate.name || 'User')}
                          className="text-blue-500 hover:text-blue-600"
                        >
                          <Send size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-green-500 hover:text-green-600"
                        >
                          <UserPlus size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Financial Tips */}
            <Card className="mobile-card lg:card-professional">
              <CardHeader className="mobile-card-header">
                <CardTitle className="mobile-subtitle lg:text-lg">Financial Tips</CardTitle>
              </CardHeader>
              <CardContent className="mobile-card-content">
                <div className="space-y-3 lg:space-y-4">
                  {(tips || []).map((tip, index) => (
                    <div key={index} className="p-3 lg:p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                      <div className="flex items-start gap-2 lg:gap-3">
                        <AlertCircle className="h-4 w-4 lg:h-5 lg:w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="mobile-caption lg:font-semibold text-blue-900 dark:text-blue-100 mb-1">{tip.title || 'Financial Tip'}</h4>
                          <p className="mobile-caption text-blue-700 dark:text-blue-200">{tip.content || 'No content available'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;