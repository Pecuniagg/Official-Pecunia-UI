import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Send, 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  TrendingUp, 
  Search,
  Filter,
  MoreHorizontal,
  UserPlus,
  AlertCircle,
  Camera,
  Globe,
  Users,
  Hash
} from 'lucide-react';
import { mockData } from '../data/mockData';
import { useToast } from '../hooks/use-toast';

const Feed = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set());
  const [postContent, setPostContent] = useState('');
  const [postOptions, setPostOptions] = useState({
    photo: false,
    public: true
  });

  const { toast } = useToast();

  // Safe data extraction with fallbacks
  const feed = Array.isArray(mockData.feed) ? mockData.feed : 
               mockData.feed?.posts ? mockData.feed.posts : [];
  const popularTickers = mockData.feed?.popularTickers || mockData.popularTickers || [];
  const associates = mockData.feed?.associates || mockData.associates || [];
  const tips = mockData.feed?.tips || mockData.tips || [];

  const handleSwipeRight = (name) => {
    toast({
      title: `Message sent to ${name}!`,
      description: "Your direct message has been sent",
    });
  };

  const handleLike = (postId) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleBookmark = (postId) => {
    setBookmarkedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handlePostSubmit = () => {
    if (!postContent.trim()) return;
    
    toast({
      title: "Post shared!",
      description: "Your post has been shared with the community"
    });
    
    setPostContent('');
    setPostOptions({ photo: false, public: true });
  };

  const filteredPosts = feed.filter(post => {
    if (!post) return false;
    
    const matchesSearch = !searchQuery || 
      (post.content && post.content.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (post.author && post.author.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = selectedFilter === 'all' || post.type === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen" style={{ 
      background: 'var(--color-bg-primary)', 
      color: 'var(--color-text-white)' 
    }}>
      {/* Enhanced Feed Container with 12-Column Grid */}
      <div className="feed-container py-6">
        {/* Main Feed Area (8-9 columns equivalent) */}
        <div className="feed-main">
          {/* Search and Filter Header */}
          <Card className="mobile-card lg:card-professional mb-6">
            <CardContent className="mobile-card-content">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    placeholder="Search posts, users, or tickers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white border-gray-200 focus:border-[#5945a3]"
                  />
                </div>
                <div className="flex gap-2">
                  <Tabs value={selectedFilter} onValueChange={setSelectedFilter} className="w-auto">
                    <TabsList className="grid grid-cols-4 lg:grid-cols-4">
                      <TabsTrigger value="all" className="text-xs lg:text-sm">All</TabsTrigger>
                      <TabsTrigger value="tips" className="text-xs lg:text-sm">Tips</TabsTrigger>
                      <TabsTrigger value="market" className="text-xs lg:text-sm">Market</TabsTrigger>
                      <TabsTrigger value="social" className="text-xs lg:text-sm">Social</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Post Creation Card */}
          <Card className="post-creation-card mb-6">
            <div className="post-creation-header">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gradient-to-br from-[#5945a3] to-[#b37e91] text-white">
                  YU
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-sm">Share your thoughts</p>
                <p className="text-xs text-gray-500">Connect with the financial community</p>
              </div>
            </div>

            <div className="post-creation-input-area">
              <textarea
                className="post-creation-input"
                placeholder="What's on your mind? Share market insights, tips, or ask questions..."
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                rows={3}
              />
            </div>

            <div className="post-creation-footer">
              <div className="post-creation-options">
                <div 
                  className={`post-option ${postOptions.photo ? 'text-[#5945a3]' : ''}`}
                  onClick={() => setPostOptions(prev => ({ ...prev, photo: !prev.photo }))}
                >
                  <Camera size={16} />
                  <span>Photo</span>
                </div>
                <div 
                  className={`post-option ${postOptions.public ? 'text-[#5945a3]' : ''}`}
                  onClick={() => setPostOptions(prev => ({ ...prev, public: !prev.public }))}
                >
                  <Globe size={16} />
                  <span>Public</span>
                </div>
              </div>
              <button 
                className="post-submit-button"
                onClick={handlePostSubmit}
                disabled={!postContent.trim()}
              >
                Post
              </button>
            </div>
          </Card>

          {/* Enhanced Feed Posts with Strong Hierarchy */}
          <div className="space-y-4">
            {filteredPosts.map((post, index) => (
              <Card key={index} className="feed-post-card">
                <div className="feed-post-header">
                  <div className="feed-post-user-info">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={post.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-[#5945a3] to-[#b37e91] text-white">
                        {post.author ? post.author.split(' ').map(n => n[0]).join('') : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="feed-post-user-name">{post.author || 'Unknown User'}</p>
                      <span className="feed-post-timestamp">{post.time || '2h ago'}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="opacity-60 hover:opacity-100">
                    <MoreHorizontal size={16} />
                  </Button>
                </div>

                <div className="feed-post-content">
                  {post.content || 'No content available'}
                  
                  {/* Stock Mentions with Better Spacing */}
                  {post.mentions && post.mentions.length > 0 && (
                    <div className="feed-post-stock-mentions">
                      {post.mentions.map((mention, idx) => (
                        <span key={idx} className="stock-mention">
                          ${mention}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="feed-post-actions">
                  <button 
                    className={`feed-post-action ${likedPosts.has(index) ? 'text-red-500' : ''}`}
                    onClick={() => handleLike(index)}
                  >
                    <Heart size={16} className={likedPosts.has(index) ? 'fill-current' : ''} />
                    <span>{(post.likes || 0) + (likedPosts.has(index) ? 1 : 0)}</span>
                  </button>
                  <button className="feed-post-action">
                    <MessageCircle size={16} />
                    <span>{post.comments || 0}</span>
                  </button>
                  <button className="feed-post-action">
                    <Share2 size={16} />
                    <span>Share</span>
                  </button>
                  <button 
                    className={`feed-post-action ${bookmarkedPosts.has(index) ? 'text-[#5945a3]' : ''}`}
                    onClick={() => handleBookmark(index)}
                  >
                    <Bookmark size={16} className={bookmarkedPosts.has(index) ? 'fill-current' : ''} />
                  </button>
                </div>
              </Card>
            ))}

            {filteredPosts.length === 0 && (
              <Card className="feed-post-card text-center py-12">
                <div className="text-gray-500">
                  <Hash size={48} className="mx-auto mb-4 opacity-20" />
                  <p className="text-lg font-medium mb-2">No posts found</p>
                  <p className="text-sm">Try adjusting your search or filters</p>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Enhanced Sidebar (3-4 columns equivalent) */}
        <div className="feed-sidebar">
          {/* Popular Tickers */}
          <Card className="mobile-card lg:card-professional">
            <CardHeader className="mobile-card-header">
              <CardTitle className="mobile-subtitle lg:text-lg">Popular Tickers</CardTitle>
            </CardHeader>
            <CardContent className="mobile-card-content">
              <div className="space-y-3">
                {(popularTickers || []).map((ticker, index) => (
                  <div key={index} className="flex items-center justify-between p-2 lg:p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-[#5945a3] to-[#b37e91] rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-xs lg:text-sm">{ticker.symbol ? ticker.symbol.slice(0, 2) : 'T'}</span>
                      </div>
                      <div>
                        <p className="mobile-caption lg:font-medium">{ticker.symbol || 'TICKER'}</p>
                        <p className="mobile-caption text-gray-500">{ticker.name || 'Stock Name'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`mobile-caption lg:font-semibold ${(ticker.change || 0) >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                        ${ticker.price || '0.00'}
                      </p>
                      <div className="flex items-center gap-1">
                        <TrendingUp size={12} className={`${(ticker.change || 0) >= 0 ? 'text-green-600' : 'text-red-500'}`} />
                        <span className={`mobile-caption ${(ticker.change || 0) >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                          {(ticker.change || 0) >= 0 ? '+' : ''}{ticker.change || '0.00'}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Financial Associates */}
          <Card className="mobile-card lg:card-professional">
            <CardHeader className="mobile-card-header">
              <CardTitle className="mobile-subtitle lg:text-lg">Connect</CardTitle>
            </CardHeader>
            <CardContent className="mobile-card-content">
              <div className="space-y-3 lg:space-y-4">
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
  );
};

export default Feed;