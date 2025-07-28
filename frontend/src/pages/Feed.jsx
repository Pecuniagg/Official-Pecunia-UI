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
  Hash,
  TrendingDown
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Enhanced Feed Container with 12-Column Grid */}
      <div className="max-w-7xl mx-auto py-6 px-4 lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Feed Area (8-9 columns equivalent) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Fixed Search and Filter Header */}
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1 relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Search size={18} />
                    </div>
                    <Input
                      placeholder="Search posts, users, or tickers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 pr-4 py-3 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:border-[#5945a3] focus:ring-[#5945a3] focus:ring-2 focus:ring-opacity-20 transition-all duration-200"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Tabs value={selectedFilter} onValueChange={setSelectedFilter} className="w-auto">
                      <TabsList className="grid grid-cols-4 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                        <TabsTrigger value="all" className="text-xs lg:text-sm px-3 py-2">All</TabsTrigger>
                        <TabsTrigger value="tips" className="text-xs lg:text-sm px-3 py-2">Tips</TabsTrigger>
                        <TabsTrigger value="market" className="text-xs lg:text-sm px-3 py-2">Market</TabsTrigger>
                        <TabsTrigger value="social" className="text-xs lg:text-sm px-3 py-2">Social</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Post Creation Card */}
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gradient-to-br from-[#5945a3] to-[#b37e91] text-white font-semibold">
                      YU
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Share your thoughts</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Connect with the financial community</p>
                  </div>
                </div>

                <div className="mb-4">
                  <textarea
                    className="w-full min-h-24 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:border-[#5945a3] focus:ring-[#5945a3] focus:ring-2 focus:ring-opacity-20 transition-all duration-200 resize-none"
                    placeholder="What's on your mind? Share market insights, tips, or ask questions..."
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <button 
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                        postOptions.photo 
                          ? 'text-[#5945a3] bg-purple-50 dark:bg-purple-900/20' 
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => setPostOptions(prev => ({ ...prev, photo: !prev.photo }))}
                    >
                      <Camera size={18} />
                      <span className="text-sm font-medium">Photo</span>
                    </button>
                    <button 
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                        postOptions.public 
                          ? 'text-[#5945a3] bg-purple-50 dark:bg-purple-900/20' 
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => setPostOptions(prev => ({ ...prev, public: !prev.public }))}
                    >
                      <Globe size={18} />
                      <span className="text-sm font-medium">Public</span>
                    </button>
                  </div>
                  <Button 
                    onClick={handlePostSubmit}
                    disabled={!postContent.trim()}
                    className="bg-gradient-to-r from-[#5945a3] to-[#6b59a8] hover:from-[#4a3d8f] to-[#5945a3] text-white px-6 py-2 font-medium shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Post
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Feed Posts */}
            <div className="space-y-4">
              {filteredPosts.map((post, index) => (
                <Card key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-11 w-11">
                          <AvatarImage src={post.avatar} />
                          <AvatarFallback className="bg-gradient-to-br from-[#5945a3] to-[#b37e91] text-white font-semibold text-sm">
                            {post.author ? post.author.split(' ').map(n => n[0]).join('') : 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {post.author || 'Unknown User'}
                          </p>
                          <span className="text-sm text-gray-500 dark:text-gray-400 opacity-70">
                            {post.time || '2h ago'}
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 opacity-60 hover:opacity-100">
                        <MoreHorizontal size={16} />
                      </Button>
                    </div>

                    <div className="mb-4 space-y-3">
                      <p className="text-gray-900 dark:text-white leading-relaxed text-sm lg:text-base">
                        {post.content || 'No content available'}
                      </p>
                      
                      {/* Stock Mentions with Better Spacing */}
                      {post.mentions && post.mentions.length > 0 && (
                        <div className="py-3 border-t border-b border-gray-200 dark:border-gray-700">
                          <div className="flex flex-wrap gap-2">
                            {post.mentions.map((mention, idx) => (
                              <Badge 
                                key={idx} 
                                className="bg-purple-100 text-[#5945a3] border-purple-200 hover:bg-purple-200 transition-colors cursor-pointer text-xs font-medium px-2 py-1"
                              >
                                ${mention}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-6 pt-2">
                      <button 
                        className={`flex items-center gap-2 text-sm transition-colors ${
                          likedPosts.has(index) 
                            ? 'text-red-500' 
                            : 'text-gray-500 dark:text-gray-400 hover:text-red-500'
                        }`}
                        onClick={() => handleLike(index)}
                      >
                        <Heart size={16} className={likedPosts.has(index) ? 'fill-current' : ''} />
                        <span className="font-medium">
                          {(post.likes || 0) + (likedPosts.has(index) ? 1 : 0)}
                        </span>
                      </button>
                      <button className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors">
                        <MessageCircle size={16} />
                        <span className="font-medium">{post.comments || 0}</span>
                      </button>
                      <button className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-green-500 transition-colors">
                        <Share2 size={16} />
                        <span className="font-medium">Share</span>
                      </button>
                      <button 
                        className={`flex items-center gap-2 text-sm transition-colors ml-auto ${
                          bookmarkedPosts.has(index) 
                            ? 'text-[#5945a3]' 
                            : 'text-gray-500 dark:text-gray-400 hover:text-[#5945a3]'
                        }`}
                        onClick={() => handleBookmark(index)}
                      >
                        <Bookmark size={16} className={bookmarkedPosts.has(index) ? 'fill-current' : ''} />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredPosts.length === 0 && (
                <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <CardContent className="py-16 text-center">
                    <Hash size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No posts found</h3>
                    <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filters</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Enhanced Sidebar (4 columns equivalent) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Fixed Popular Tickers with Proper Colors */}
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Popular Tickers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(popularTickers || []).map((ticker, index) => {
                  const change = ticker.change || 0;
                  const isPositive = change >= 0;
                  
                  return (
                    <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer border border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#5945a3] to-[#b37e91] rounded-full flex items-center justify-center shadow-sm">
                          <span className="text-white font-bold text-sm">
                            {ticker.symbol ? ticker.symbol.slice(0, 2) : 'T'}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">
                            {ticker.symbol || 'TICKER'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {ticker.name || 'Stock Name'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                          ${ticker.price || '0.00'}
                        </p>
                        <div className={`flex items-center gap-1 justify-end ${
                          isPositive ? 'text-green-600' : 'text-red-500'
                        }`}>
                          {isPositive ? (
                            <TrendingUp size={12} />
                          ) : (
                            <TrendingDown size={12} />
                          )}
                          <span className="text-xs font-medium">
                            {isPositive ? '+' : ''}{change.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Financial Associates */}
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Connect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(associates || []).map((associate, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer border border-gray-200 dark:border-gray-600">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={associate.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-[#5945a3] to-[#b37e91] text-white font-semibold text-sm">
                        {associate.name ? associate.name.split(' ').map(n => n[0]).join('') : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {associate.name || 'Unknown User'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {associate.status || 'No status'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSwipeRight(associate.name || 'User')}
                        className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2"
                      >
                        <Send size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-green-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 p-2"
                      >
                        <UserPlus size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Financial Tips */}
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Financial Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(tips || []).map((tip, index) => (
                  <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-100 dark:border-blue-800/50">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1 text-sm">
                          {tip.title || 'Financial Tip'}
                        </h4>
                        <p className="text-sm text-blue-700 dark:text-blue-200 leading-relaxed">
                          {tip.content || 'No content available'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;