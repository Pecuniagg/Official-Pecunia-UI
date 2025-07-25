import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Switch } from '../components/ui/switch';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { useToast } from '../hooks/use-toast';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';
import { 
  User, 
  MessageSquare, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Clock,
  CreditCard,
  Settings,
  Shield,
  CheckCircle,
  AlertCircle,
  Heart,
  MessageCircle,
  Share2,
  Edit,
  Copy,
  Eye,
  ThumbsUp,
  Star,
  Sun,
  Moon,
  Palette
} from 'lucide-react';
import { mockData } from '../data/mockData';

const Profile = () => {
  const [lendingEnabled, setLendingEnabled] = useState(mockData.profile.lending.available);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [hoveredStat, setHoveredStat] = useState(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [selectedTab, setSelectedTab] = useState('posts');
  const { profile } = mockData;
  const { toast } = useToast();

  const handleLike = (postId) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
        toast({ title: "Like removed", description: "Post unliked" });
      } else {
        newSet.add(postId);
        toast({ title: "Post liked! ❤️", description: "Your engagement helps the community" });
      }
      return newSet;
    });
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopiedEmail(true);
    toast({ title: "Email copied! 📋", description: "Email address copied to clipboard" });
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleLendingAction = (action, requestId) => {
    toast({
      title: `Request ${action}d`,
      description: `Lending request has been ${action}d successfully`,
    });
  };

  const StatCard = ({ icon: Icon, label, value, color = "text-gray-900", index }) => (
    <Card 
      className="text-center card-whisper hover-glow-subtle cursor-pointer group relative overflow-hidden"
      onMouseEnter={() => setHoveredStat(index)}
      onMouseLeave={() => setHoveredStat(null)}
      onClick={() => toast({ title: `${label} Details`, description: `View detailed ${label.toLowerCase()} analytics` })}
    >
      <CardContent className="p-6 relative z-10">
        <div className="relative">
          <Icon className={`w-8 h-8 mx-auto mb-3 icon-whisper transition-all duration-300 ${color} ${hoveredStat === index ? 'scale-105' : ''}`} />
          <div className={`absolute inset-0 bg-gradient-to-r from-[#5945a3]/8 to-[#b37e91]/8 rounded-full opacity-0 transition-opacity duration-300 ${hoveredStat === index ? 'opacity-100' : ''}`}></div>
        </div>
        <p className={`text-2xl font-bold animate-flow transition-all duration-300 ${hoveredStat === index ? 'scale-102' : ''}`}>
          {value}
        </p>
        <p className="text-sm text-gray-600 transition-colors duration-300">{label}</p>
        {hoveredStat === index && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#5945a3]/3 to-[#b37e91]/3"></div>
        )}
      </CardContent>
      <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r ${color.includes('blue') ? 'from-blue-400 to-blue-600' : color.includes('green') ? 'from-green-400 to-green-600' : color.includes('purple') ? 'from-purple-400 to-purple-600' : 'from-orange-400 to-orange-600'} transform scale-x-0 transition-transform duration-300 ${hoveredStat === index ? 'scale-x-100' : ''}`}></div>
    </Card>
  );

  const PostItem = ({ post, index = 0 }) => {
    const postId = `post-${index}`;
    const isLiked = likedPosts.has(postId);
    
    return (
      <Card className="mb-4 card-refined hover-lift group animate-slide-left" style={{ animationDelay: `${index * 0.1}s` }}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-8 w-8 hover-scale-subtle cursor-pointer">
              <AvatarImage src="/api/placeholder/32/32" />
              <AvatarFallback className="bg-gradient-to-br from-[#5945a3] to-[#b37e91] text-white">JD</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium text-sm hover:text-[#5945a3] transition-colors cursor-pointer">{profile.name}</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity btn-refined">
              <Edit size={14} />
            </Button>
          </div>
          <p className="text-sm text-gray-800 mb-4 leading-relaxed">
            Just reached 75% of my emergency fund goal! The key was automating transfers every payday. 
            Consistency beats perfection every time. 💪 #FinancialGoals
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button 
                className={`flex items-center gap-2 text-sm transition-all duration-300 hover-scale-subtle ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                onClick={() => handleLike(postId)}
              >
                <Heart 
                  size={16} 
                  fill={isLiked ? 'currentColor' : 'none'} 
                  className={`transition-all duration-300 ${isLiked ? 'animate-scale-gentle' : ''}`} 
                />
                <span className="animate-counter">{isLiked ? 25 : 24} likes</span>
              </button>
              <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#5945a3] transition-colors hover-scale-subtle">
                <MessageCircle size={16} />
                <span>8 comments</span>
              </button>
              <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#5945a3] transition-colors hover-scale-subtle">
                <Share2 size={16} />
                <span>Share</span>
              </button>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="sm" className="btn-refined">
                <Eye size={14} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const LendingRequestCard = ({ request, index = 0 }) => (
    <Card className="mb-4 card-refined hover-glow group animate-slide-left" style={{ animationDelay: `${index * 0.1}s` }}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 hover-scale-subtle cursor-pointer">
              <AvatarImage src="/api/placeholder/40/40" />
              <AvatarFallback className="bg-gradient-to-br from-[#5945a3] to-[#b37e91] text-white">
                {request.requester.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium hover:text-[#5945a3] transition-colors cursor-pointer">{request.requester}</p>
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-600">Credit Score: {request.creditScore}</p>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={12} 
                      className={`${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'} animate-scale-gentle`}
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover-glow animate-scale-gentle animate-delay-1">
            ${request.amount.toLocaleString()}
          </Badge>
        </div>
        
        <div className="mb-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <p className="text-sm text-gray-700 mb-2">
            <strong>Purpose:</strong> {request.purpose}
          </p>
          <p className="text-sm text-gray-600">
            Requested on {new Date(request.requestDate).toLocaleDateString()}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            size="sm" 
            className="bg-green-600 hover:bg-green-700 btn-refined flex-1"
            onClick={() => handleLendingAction('approve', request.id)}
          >
            <CheckCircle size={14} className="mr-1 icon-refined" />
            Approve
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="btn-refined hover:border-red-300 hover:text-red-600"
            onClick={() => handleLendingAction('decline', request.id)}
          >
            <AlertCircle size={14} className="mr-1" />
            Decline
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            className="btn-refined"
            onClick={() => toast({ title: "Request Details", description: "Opening detailed view..." })}
          >
            <Eye size={14} className="mr-1" />
            Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const LendingHistoryItem = ({ loan, index = 0 }) => (
    <div 
      className="flex items-center justify-between p-4 border rounded-lg mb-3 hover-subtle group cursor-pointer animate-slide-left"
      style={{ animationDelay: `${index * 0.05}s` }}
      onClick={() => toast({ title: "Loan Details", description: `View detailed history for ${loan.borrower}` })}
    >
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#5945a3] to-[#b37e91] animate-scale-gentle"></div>
        <div>
          <p className="font-medium group-hover:text-[#5945a3] transition-colors">{loan.borrower}</p>
          <p className="text-sm text-gray-600">${loan.amount.toLocaleString()} • {loan.status}</p>
          <p className="text-xs text-gray-500">Returned: {new Date(loan.returnDate).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="text-right">
        <Badge className={`transition-all duration-300 hover-glow ${loan.status === 'Completed' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'}`}>
          {loan.status}
        </Badge>
        <p className="text-sm text-green-600 mt-1 animate-counter">+${loan.interestEarned} earned</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-entrance">
      {/* Profile Header */}
      <Card className="bg-gradient-to-r from-[#5945a3] via-[#b37e91] to-[#3b345b] text-white card-refined hover-glow animate-entrance-down">
        <CardContent className="p-8">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <Avatar className="h-20 w-20 border-4 border-white/20 hover-scale-subtle cursor-pointer">
                <AvatarImage src="/api/placeholder/80/80" />
                <AvatarFallback className="text-2xl bg-[#1e1b24] text-white">JD</AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Edit size={16} className="text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2 animate-slide-left animate-delay-1">{profile.name}</h1>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-lg opacity-90 animate-slide-left animate-delay-2">{profile.email}</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`text-white/80 hover:text-white btn-refined ${copiedEmail ? 'text-green-300' : ''}`}
                  onClick={handleCopyEmail}
                >
                  <Copy size={14} className={`transition-all duration-300 ${copiedEmail ? 'animate-scale-gentle' : ''}`} />
                </Button>
              </div>
              <p className="opacity-75 animate-slide-left animate-delay-3">Member since {profile.joinDate}</p>
            </div>
            <div className="text-right">
              <div 
                className="text-3xl font-bold animate-counter cursor-pointer hover-scale-subtle"
                onClick={() => toast({ title: "Pecunia Score", description: "Your financial health score based on spending habits and goals" })}
              >
                {profile.pecuniaScore}
              </div>
              <p className="opacity-90">Pecunia Score</p>
              <div className="mt-2 flex justify-end">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    className={`${i < 4 ? 'text-yellow-300 fill-current' : 'text-white/30'} animate-scale-gentle hover-scale-subtle cursor-pointer`}
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={MessageSquare}
          label="Posts"
          value={profile.posts}
          color="text-blue-500"
          index={0}
        />
        <StatCard
          icon={Users}
          label="Followers"
          value={profile.followers}
          color="text-green-500"
          index={1}
        />
        <StatCard
          icon={User}
          label="Following"
          value={profile.following}
          color="text-purple-500"
          index={2}
        />
        <StatCard
          icon={TrendingUp}
          label="Score Rank"
          value="Top 15%"
          color="text-orange-500"
          index={3}
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="mb-8 animate-slide-left animate-delay-4">
          <TabsTrigger value="posts" className="flex items-center gap-2 btn-refined nav-indicator">
            <MessageSquare size={16} className="icon-refined" />
            Posts
          </TabsTrigger>
          <TabsTrigger value="lending" className="flex items-center gap-2 btn-refined nav-indicator">
            <DollarSign size={16} className="icon-refined" />
            Lending
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2 btn-refined nav-indicator">
            <Settings size={16} className="icon-refined" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-6 animate-scale-gentle">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold animate-slide-left">Recent Posts</h2>
                <Button 
                  className="bg-gradient-to-r from-[#5945a3] to-[#b37e91] hover:opacity-90 btn-refined"
                  onClick={() => toast({ title: "Create Post", description: "Opening post composer..." })}
                >
                  <MessageSquare size={14} className="mr-1" />
                  New Post
                </Button>
              </div>
              <PostItem index={0} />
              <PostItem index={1} />
              <PostItem index={2} />
            </div>
            
            <div>
              <Card className="card-refined hover-glow animate-slide-right animate-delay-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="text-[#5945a3] icon-refined" size={20} />
                    Activity Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center hover-subtle p-2 rounded cursor-pointer group">
                    <span className="text-gray-600 group-hover:text-[#5945a3] transition-colors">Posts this month</span>
                    <span className="font-semibold animate-counter">12</span>
                  </div>
                  <div className="flex justify-between items-center hover-subtle p-2 rounded cursor-pointer group">
                    <span className="text-gray-600 group-hover:text-[#5945a3] transition-colors">Avg. likes per post</span>
                    <span className="font-semibold animate-counter">18</span>
                  </div>
                  <div className="flex justify-between items-center hover-subtle p-2 rounded cursor-pointer group">
                    <span className="text-gray-600 group-hover:text-[#5945a3] transition-colors">Comments received</span>
                    <span className="font-semibold animate-counter">94</span>
                  </div>
                  <div className="flex justify-between items-center hover-subtle p-2 rounded cursor-pointer group">
                    <span className="text-gray-600 group-hover:text-[#5945a3] transition-colors">New followers</span>
                    <span className="font-semibold text-green-600 animate-counter">+23</span>
                  </div>
                  <div className="mt-4 p-3 bg-gradient-to-r from-[#5945a3]/10 to-[#b37e91]/10 rounded-lg">
                    <p className="text-sm text-[#5945a3] font-medium">🎉 Great engagement this month!</p>
                    <p className="text-xs text-gray-600 mt-1">Your posts are inspiring the community</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="lending" className="space-y-6 animate-scale-gentle">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Lending Toggle */}
              <Card className="card-refined hover-glow animate-slide-left">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <DollarSign className="text-[#5945a3] icon-refined" size={20} />
                      Lending Status
                    </span>
                    <Switch
                      checked={lendingEnabled}
                      onCheckedChange={(checked) => {
                        setLendingEnabled(checked);
                        toast({
                          title: checked ? "Lending Enabled! 💰" : "Lending Disabled",
                          description: checked 
                            ? "You're now available to lend to your network" 
                            : "Lending requests will be paused"
                        });
                      }}
                      className="focus-refined"
                    />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`p-4 rounded-lg transition-all duration-300 ${lendingEnabled ? 'bg-green-50 border border-green-200 hover:bg-green-100' : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {lendingEnabled ? (
                        <CheckCircle className="text-green-600 animate-scale-gentle" size={20} />
                      ) : (
                        <AlertCircle className="text-gray-500" size={20} />
                      )}
                      <span className="font-medium">
                        {lendingEnabled ? 'Available to Lend' : 'Lending Disabled'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {lendingEnabled 
                        ? `You can lend up to $${profile.lending.maxAmount.toLocaleString()} at ${profile.lending.interestRate}% interest`
                        : 'Enable lending to help your network and earn interest'
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Lending Requests */}
              <div className="animate-slide-left animate-delay-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Pending Requests</h3>
                  <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white animate-scale-gentle">
                    {profile.lending.requests.length} pending
                  </Badge>
                </div>
                {profile.lending.requests.map((request, index) => (
                  <LendingRequestCard key={request.id} request={request} index={index} />
                ))}
              </div>

              {/* Lending History */}
              <div className="animate-slide-left animate-delay-2">
                <h3 className="text-lg font-semibold mb-4">Lending History</h3>
                {profile.lending.history.map((loan, index) => (
                  <LendingHistoryItem key={loan.id} loan={loan} index={index} />
                ))}
              </div>
            </div>
            
            <div>
              <Card className="card-refined hover-glow animate-slide-right animate-delay-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="text-[#5945a3] icon-refined" size={20} />
                    Lending Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div 
                    className="text-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer hover-glow"
                    onClick={() => toast({ title: "Interest Breakdown", description: "View detailed earnings history" })}
                  >
                    <p className="text-2xl font-bold text-green-600 animate-counter">$45</p>
                    <p className="text-sm text-gray-600">Total Interest Earned</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center hover-subtle p-2 rounded cursor-pointer group">
                      <span className="text-gray-600 group-hover:text-[#5945a3] transition-colors">Total Lent</span>
                      <span className="font-semibold animate-counter">$1,500</span>
                    </div>
                    <div className="flex justify-between items-center hover-subtle p-2 rounded cursor-pointer group">
                      <span className="text-gray-600 group-hover:text-[#5945a3] transition-colors">Active Loans</span>
                      <span className="font-semibold animate-counter">0</span>
                    </div>
                    <div className="flex justify-between items-center hover-subtle p-2 rounded cursor-pointer group">
                      <span className="text-gray-600 group-hover:text-[#5945a3] transition-colors">Success Rate</span>
                      <span className="font-semibold text-green-600">100%</span>
                    </div>
                    <div className="flex justify-between items-center hover-subtle p-2 rounded cursor-pointer group">
                      <span className="text-gray-600 group-hover:text-[#5945a3] transition-colors">Avg. Return Time</span>
                      <span className="font-semibold animate-counter">45 days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6 card-refined hover-glow animate-slide-right animate-delay-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="text-blue-500 icon-refined" size={20} />
                    Trust Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div 
                      className="text-3xl font-bold text-blue-600 mb-2 animate-counter cursor-pointer hover-scale-subtle"
                      onClick={() => toast({ title: "Trust Score Details", description: "Based on lending history, reviews, and verification status" })}
                    >
                      9.8
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Excellent Lender Rating</p>
                    <div className="flex justify-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={16} 
                          className="text-yellow-400 fill-current animate-scale-gentle hover-scale-subtle"
                          style={{ animationDelay: `${i * 0.1}s` }}
                        />
                      ))}
                    </div>
                    <div className="space-y-2 text-xs text-gray-500">
                      <div className="flex items-center gap-2 hover-subtle p-1 rounded">
                        <CheckCircle size={12} className="text-green-500" />
                        <span>Verified Identity</span>
                      </div>
                      <div className="flex items-center gap-2 hover-subtle p-1 rounded">
                        <CheckCircle size={12} className="text-green-500" />
                        <span>Bank Account Linked</span>
                      </div>
                      <div className="flex items-center gap-2 hover-subtle p-1 rounded">
                        <CheckCircle size={12} className="text-green-500" />
                        <span>Perfect Repayment History</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6 animate-scale-gentle">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="card-refined hover-glow animate-slide-left">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="text-[#5945a3] icon-refined" size={20} />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Display Name</label>
                  <input 
                    type="text" 
                    defaultValue={profile.name}
                    className="w-full p-2 border rounded-md input-refined focus-refined transition-all duration-300"
                    onFocus={() => toast({ title: "Editing Name", description: "Changes will be saved automatically" })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <input 
                    type="email" 
                    defaultValue={profile.email}
                    className="w-full p-2 border rounded-md input-refined focus-refined transition-all duration-300"
                    onFocus={() => toast({ title: "Email Settings", description: "Email changes require verification" })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bio</label>
                  <textarea 
                    placeholder="Tell us about yourself..."
                    className="w-full p-2 border rounded-md h-20 input-refined focus-refined transition-all duration-300"
                    onFocus={() => toast({ title: "Bio Editor", description: "Share your financial journey with the community" })}
                  />
                </div>
                <Button 
                  className="w-full bg-[#5945a3] hover:bg-[#4a3d8f] btn-refined"
                  onClick={() => toast({ title: "Settings Saved! ✅", description: "Your profile has been updated successfully" })}
                >
                  <CheckCircle size={16} className="mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>

            <Card className="card-refined hover-glow animate-slide-right animate-delay-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="text-[#5945a3] icon-refined" size={20} />
                  Privacy & Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between hover-subtle p-2 rounded group">
                  <div>
                    <p className="font-medium group-hover:text-[#5945a3] transition-colors">Profile Visibility</p>
                    <p className="text-sm text-gray-600">Who can see your profile</p>
                  </div>
                  <Switch 
                    defaultChecked 
                    className="focus-refined"
                    onCheckedChange={(checked) => toast({ 
                      title: checked ? "Profile Public" : "Profile Private", 
                      description: checked ? "Your profile is now visible to everyone" : "Only followers can see your profile" 
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between hover-subtle p-2 rounded group">
                  <div>
                    <p className="font-medium group-hover:text-[#5945a3] transition-colors">Email Notifications</p>
                    <p className="text-sm text-gray-600">Financial alerts and updates</p>
                  </div>
                  <Switch 
                    defaultChecked 
                    className="focus-refined"
                    onCheckedChange={(checked) => toast({ 
                      title: checked ? "Notifications On" : "Notifications Off", 
                      description: checked ? "You'll receive email updates" : "Email notifications disabled" 
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between hover-subtle p-2 rounded group">
                  <div>
                    <p className="font-medium group-hover:text-[#5945a3] transition-colors">Social Features</p>
                    <p className="text-sm text-gray-600">Allow others to see your activity</p>
                  </div>
                  <Switch 
                    defaultChecked 
                    className="focus-refined"
                    onCheckedChange={(checked) => toast({ 
                      title: checked ? "Social Features On" : "Social Features Off", 
                      description: checked ? "Your activity is visible to network" : "Activity is now private" 
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between hover-subtle p-2 rounded group">
                  <div>
                    <p className="font-medium group-hover:text-[#5945a3] transition-colors">AI Insights</p>
                    <p className="text-sm text-gray-600">Personalized financial advice</p>
                  </div>
                  <Switch 
                    defaultChecked 
                    className="focus-refined"
                    onCheckedChange={(checked) => toast({ 
                      title: checked ? "AI Insights Enabled 🤖" : "AI Insights Disabled", 
                      description: checked ? "Personalized recommendations active" : "AI suggestions paused" 
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between hover-subtle p-2 rounded group">
                  <div>
                    <p className="font-medium group-hover:text-[#5945a3] transition-colors">Lending Requests</p>
                    <p className="text-sm text-gray-600">Notifications for new requests</p>
                  </div>
                  <Switch 
                    checked={lendingEnabled} 
                    onCheckedChange={(checked) => {
                      setLendingEnabled(checked);
                      toast({ 
                        title: checked ? "Lending Notifications On" : "Lending Notifications Off", 
                        description: checked ? "You'll receive lending request alerts" : "Lending notifications disabled" 
                      });
                    }}
                    className="focus-refined"
                  />
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-[#5945a3]/10 to-[#b37e91]/10 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="text-[#5945a3]" size={16} />
                    <span className="font-medium text-[#5945a3]">Security Status</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2 hover-subtle p-1 rounded">
                      <CheckCircle size={12} className="text-green-500" />
                      <span>2FA Enabled</span>
                    </div>
                    <div className="flex items-center gap-2 hover-subtle p-1 rounded">
                      <CheckCircle size={12} className="text-green-500" />
                      <span>Email Verified</span>
                    </div>
                    <div className="flex items-center gap-2 hover-subtle p-1 rounded">
                      <CheckCircle size={12} className="text-green-500" />
                      <span>Account Secure</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* New Theme Settings Card */}
            <Card className="card-refined hover-glow animate-slide-left animate-delay-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="text-[#5945a3] icon-refined" size={20} />
                  Appearance & Theme
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between hover-subtle p-3 rounded-lg group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#5945a3] to-[#b37e91] rounded-lg flex items-center justify-center">
                      <Palette className="text-white" size={16} />
                    </div>
                    <div>
                      <p className="font-medium group-hover:text-[#5945a3] transition-colors">App Theme</p>
                      <p className="text-sm text-gray-600">Choose between light and dark mode</p>
                    </div>
                  </div>
                  <ThemeToggle />
                </div>

                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Sun className="text-yellow-500" size={16} />
                    <span className="font-medium text-sm">Theme Preview</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    The theme will apply to all pages including dashboard, charts, and navigation. 
                    Dark mode reduces eye strain during extended use.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between hover-subtle p-2 rounded group">
                    <div>
                      <p className="font-medium group-hover:text-[#5945a3] transition-colors">Smooth Animations</p>
                      <p className="text-sm text-gray-600">Enable premium micro-animations</p>
                    </div>
                    <Switch 
                      defaultChecked 
                      className="focus-refined"
                      onCheckedChange={(checked) => toast({ 
                        title: checked ? "Animations Enabled" : "Animations Disabled", 
                        description: checked ? "Smooth transitions and hover effects active" : "Reduced motion for better performance" 
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between hover-subtle p-2 rounded group">
                    <div>
                      <p className="font-medium group-hover:text-[#5945a3] transition-colors">High Contrast</p>
                      <p className="text-sm text-gray-600">Improve readability</p>
                    </div>
                    <Switch 
                      className="focus-refined"
                      onCheckedChange={(checked) => toast({ 
                        title: checked ? "High Contrast On" : "High Contrast Off", 
                        description: checked ? "Enhanced text contrast for better visibility" : "Standard contrast restored" 
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between hover-subtle p-2 rounded group">
                    <div>
                      <p className="font-medium group-hover:text-[#5945a3] transition-colors">Compact Mode</p>
                      <p className="text-sm text-gray-600">Reduce spacing for more content</p>
                    </div>
                    <Switch 
                      className="focus-refined"
                      onCheckedChange={(checked) => toast({ 
                        title: checked ? "Compact Mode On" : "Compact Mode Off", 
                        description: checked ? "Tighter spacing for power users" : "Comfortable spacing restored" 
                      })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;