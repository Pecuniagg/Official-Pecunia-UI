import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Switch } from '../components/ui/switch';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { useToast } from '../hooks/use-toast';
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
  Star
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
      className="text-center card-refined hover-glow cursor-pointer group relative overflow-hidden animate-entrance"
      style={{ animationDelay: `${index * 0.1}s` }}
      onMouseEnter={() => setHoveredStat(index)}
      onMouseLeave={() => setHoveredStat(null)}
      onClick={() => toast({ title: `${label} Details`, description: `View detailed ${label.toLowerCase()} analytics` })}
    >
      <CardContent className="p-6 relative z-10">
        <div className="relative">
          <Icon className={`w-8 h-8 mx-auto mb-3 icon-refined transition-all duration-300 ${color} ${hoveredStat === index ? 'scale-110' : ''}`} />
          <div className={`absolute inset-0 bg-gradient-to-r from-[#5945a3]/10 to-[#b37e91]/10 rounded-full opacity-0 transition-opacity duration-300 ${hoveredStat === index ? 'opacity-100' : ''}`}></div>
        </div>
        <p className={`text-2xl font-bold animate-counter transition-all duration-300 ${hoveredStat === index ? 'scale-105' : ''}`}>
          {value}
        </p>
        <p className="text-sm text-gray-600 transition-colors duration-300">{label}</p>
        {hoveredStat === index && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#5945a3]/5 to-[#b37e91]/5 animate-scale-gentle"></div>
        )}
      </CardContent>
      <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${color.includes('blue') ? 'from-blue-400 to-blue-600' : color.includes('green') ? 'from-green-400 to-green-600' : color.includes('purple') ? 'from-purple-400 to-purple-600' : 'from-orange-400 to-orange-600'} transform scale-x-0 transition-transform duration-300 ${hoveredStat === index ? 'scale-x-100' : ''}`}></div>
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
    <div className="space-y-8">
      {/* Profile Header */}
      <Card className="bg-gradient-to-r from-[#5945a3] via-[#b37e91] to-[#3b345b] text-white">
        <CardContent className="p-8">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20 border-4 border-white/20">
              <AvatarImage src="/api/placeholder/80/80" />
              <AvatarFallback className="text-2xl bg-[#1e1b24] text-white">JD</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
              <p className="text-lg opacity-90 mb-1">{profile.email}</p>
              <p className="opacity-75">Member since {profile.joinDate}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{profile.pecuniaScore}</div>
              <p className="opacity-90">Pecunia Score</p>
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
        />
        <StatCard
          icon={Users}
          label="Followers"
          value={profile.followers}
          color="text-green-500"
        />
        <StatCard
          icon={User}
          label="Following"
          value={profile.following}
          color="text-purple-500"
        />
        <StatCard
          icon={TrendingUp}
          label="Score Rank"
          value="Top 15%"
          color="text-orange-500"
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="posts" className="flex items-center gap-2">
            <MessageSquare size={16} />
            Posts
          </TabsTrigger>
          <TabsTrigger value="lending" className="flex items-center gap-2">
            <DollarSign size={16} />
            Lending
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings size={16} />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Recent Posts</h2>
              <PostItem />
              <PostItem />
              <PostItem />
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Activity Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Posts this month</span>
                    <span className="font-semibold">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg. likes per post</span>
                    <span className="font-semibold">18</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Comments received</span>
                    <span className="font-semibold">94</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">New followers</span>
                    <span className="font-semibold text-green-600">+23</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="lending" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Lending Toggle */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Lending Status</span>
                    <Switch
                      checked={lendingEnabled}
                      onCheckedChange={setLendingEnabled}
                    />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`p-4 rounded-lg ${lendingEnabled ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {lendingEnabled ? (
                        <CheckCircle className="text-green-600" size={20} />
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
              <div>
                <h3 className="text-lg font-semibold mb-4">Pending Requests</h3>
                {profile.lending.requests.map((request) => (
                  <LendingRequestCard key={request.id} request={request} />
                ))}
              </div>

              {/* Lending History */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Lending History</h3>
                {profile.lending.history.map((loan) => (
                  <LendingHistoryItem key={loan.id} loan={loan} />
                ))}
              </div>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Lending Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">$45</p>
                    <p className="text-sm text-gray-600">Total Interest Earned</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Lent</span>
                      <span className="font-semibold">$1,500</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Active Loans</span>
                      <span className="font-semibold">0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Success Rate</span>
                      <span className="font-semibold text-green-600">100%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Avg. Return Time</span>
                      <span className="font-semibold">45 days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="text-blue-500" size={20} />
                    Trust Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">9.8</div>
                    <p className="text-sm text-gray-600">Excellent Lender Rating</p>
                    <div className="mt-4 space-y-2 text-xs text-gray-500">
                      <p>✓ Verified Identity</p>
                      <p>✓ Bank Account Linked</p>
                      <p>✓ Perfect Repayment History</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Display Name</label>
                  <input 
                    type="text" 
                    defaultValue={profile.name}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <input 
                    type="email" 
                    defaultValue={profile.email}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bio</label>
                  <textarea 
                    placeholder="Tell us about yourself..."
                    className="w-full p-2 border rounded-md h-20"
                  />
                </div>
                <Button className="w-full bg-[#5945a3] hover:bg-[#4a3d8f]">
                  Save Changes
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Privacy & Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Profile Visibility</p>
                    <p className="text-sm text-gray-600">Who can see your profile</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-600">Financial alerts and updates</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Social Features</p>
                    <p className="text-sm text-gray-600">Allow others to see your activity</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">AI Insights</p>
                    <p className="text-sm text-gray-600">Personalized financial advice</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Lending Requests</p>
                    <p className="text-sm text-gray-600">Notifications for new requests</p>
                  </div>
                  <Switch checked={lendingEnabled} onCheckedChange={setLendingEnabled} />
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