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
  Star,
  Sun,
  Moon,
  Palette,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Target,
  PiggyBank
} from 'lucide-react';
import { mockData } from '../data/mockData';

const Profile = () => {
  const [lendingEnabled, setLendingEnabled] = useState(mockData.profile.lending.available);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [hoveredStat, setHoveredStat] = useState(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [selectedTab, setSelectedTab] = useState('posts');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    weekly: true
  });
  const { profile } = mockData;
  const { toast } = useToast();

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

  const handleLendingToggle = (enabled) => {
    setLendingEnabled(enabled);
    toast({
      title: enabled ? "Lending Enabled" : "Lending Disabled",
      description: enabled ? "You're now available for lending" : "You're no longer available for lending",
    });
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
      toast({
        title: "Email Copied",
        description: "Email address copied to clipboard",
      });
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  const handleNotificationChange = (type, value) => {
    setNotifications(prev => ({
      ...prev,
      [type]: value
    }));
    toast({
      title: "Settings Updated",
      description: `${type.charAt(0).toUpperCase() + type.slice(1)} notifications ${value ? 'enabled' : 'disabled'}`,
    });
  };

  const StatCard = ({ icon: Icon, label, value, color = "text-[#5945a3]", isHovered }) => (
    <Card 
      className={`card-professional hover-professional cursor-pointer transition-all duration-200 ${
        isHovered ? 'ring-2 ring-[#5945a3] ring-opacity-20' : ''
      }`}
      onMouseEnter={() => setHoveredStat(label)}
      onMouseLeave={() => setHoveredStat(null)}
    >
      <CardContent className="p-6 text-center">
        <Icon className={`mx-auto mb-4 ${color} transition-transform duration-200 ${isHovered ? 'scale-110' : ''}`} size={32} />
        <div className="text-2xl font-bold text-professional-title mb-2">{value}</div>
        <div className="text-professional-body text-sm">{label}</div>
      </CardContent>
    </Card>
  );

  const LendingRequestCard = ({ request }) => (
    <Card className="card-professional hover-professional">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-transparent hover:ring-[#5945a3] transition-all">
              <AvatarImage src={request.avatar} />
              <AvatarFallback className="bg-[#5945a3] text-white">
                {request.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-professional-subtitle font-medium">{request.name}</p>
              <p className="text-professional-body text-sm">{request.duration}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-professional-title font-bold">${request.amount.toLocaleString()}</p>
            <p className="text-professional-body text-sm">{request.interest}% interest</p>
          </div>
        </div>
        <p className="text-professional-body mb-4">{request.reason}</p>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            className="flex-1 btn-professional profile-lending-button"
            onClick={() => toast({ title: "Request Approved", description: "Lending request has been approved" })}
          >
            <CheckCircle size={16} className="mr-2" />
            Approve
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1 btn-professional profile-lending-button"
            onClick={() => toast({ title: "Request Declined", description: "Lending request has been declined" })}
          >
            <AlertCircle size={16} className="mr-2" />
            Decline
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const PostCard = ({ post }) => (
    <Card className="card-professional hover-professional">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-[#5945a3]">
              <AvatarImage src={post.avatar} />
              <AvatarFallback className="bg-[#5945a3] text-white">
                {post.author.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-professional-subtitle font-medium">{post.author}</p>
              <p className="text-professional-body text-sm">{post.time}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="btn-professional">
            <Edit size={16} />
          </Button>
        </div>
        <p className="text-professional-body mb-4">{post.content}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className={`btn-professional gap-2 ${likedPosts.has(post.id) ? 'text-red-500' : 'text-gray-500'}`}
              onClick={() => handleLike(post.id)}
            >
              <Heart size={16} className={likedPosts.has(post.id) ? 'fill-current' : ''} />
              <span>{post.likes + (likedPosts.has(post.id) ? 1 : 0)}</span>
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
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
      <div className="mb-8">
        <h1 className="text-professional-hero">My Profile</h1>
        <p className="text-professional-body mt-2">Manage your financial profile and community presence</p>
      </div>

      {/* Profile Header */}
      <Card className="card-professional mb-8">
        <CardContent className="p-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24 ring-4 ring-[#5945a3] ring-opacity-20">
                <AvatarImage src="/api/placeholder/96/96" />
                <AvatarFallback className="bg-[#5945a3] text-white text-2xl">JD</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2">
                <CheckCircle className="text-white" size={16} />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-professional-hero text-2xl">John Doe</h2>
                <Badge variant="outline" className="text-xs">
                  <Award size={12} className="mr-1" />
                  Premium Member
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-professional-body">
                <div className="flex items-center gap-1">
                  <Mail size={16} className="text-[#5945a3]" />
                  <span>{profile.email}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyEmail}
                    className="btn-professional p-1"
                  >
                    <Copy size={14} className={copiedEmail ? 'text-green-500' : 'text-gray-400'} />
                  </Button>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={16} className="text-[#5945a3]" />
                  <span>Member since Jan 2024</span>
                </div>
              </div>
            </div>
            <Button className="btn-professional">
              <Edit size={16} className="mr-2" />
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard 
          icon={DollarSign} 
          label="Total Savings" 
          value="$47,500" 
          color="text-green-600"
          isHovered={hoveredStat === 'Total Savings'}
        />
        <StatCard 
          icon={TrendingUp} 
          label="Investment Returns" 
          value="+12.5%" 
          color="text-blue-600"
          isHovered={hoveredStat === 'Investment Returns'}
        />
        <StatCard 
          icon={Target} 
          label="Goals Achieved" 
          value="8/12" 
          color="text-purple-600"
          isHovered={hoveredStat === 'Goals Achieved'}
        />
        <StatCard 
          icon={Users} 
          label="Network Size" 
          value="247" 
          color="text-orange-600"
          isHovered={hoveredStat === 'Network Size'}
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="tabs-professional mb-8">
          <TabsTrigger value="posts" className="tab-professional">
            <MessageSquare className="h-4 w-4 mr-2" />
            Posts
          </TabsTrigger>
          <TabsTrigger value="lending" className="tab-professional">
            <DollarSign className="h-4 w-4 mr-2" />
            Lending
          </TabsTrigger>
          <TabsTrigger value="settings" className="tab-professional">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-6">
          {profile.posts.map((post, index) => (
            <PostCard key={index} post={post} />
          ))}
        </TabsContent>

        <TabsContent value="lending" className="space-y-6">
          <Card className="card-professional">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-professional-title">Lending Availability</CardTitle>
                <div className="flex items-center gap-2">
                  <span className="text-professional-body text-sm">Available</span>
                  <Switch 
                    checked={lendingEnabled} 
                    onCheckedChange={handleLendingToggle}
                    className="focus-professional"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-professional-subtitle font-semibold">${profile.lending.totalLent.toLocaleString()}</p>
                  <p className="text-professional-body text-sm">Total Lent</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-professional-subtitle font-semibold">{profile.lending.activeLoan}</p>
                  <p className="text-professional-body text-sm">Active Loans</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-professional-subtitle font-semibold">{profile.lending.rating}/5</p>
                  <p className="text-professional-body text-sm">Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="text-professional-title">Lending Requests</h3>
            {profile.lending.requests.map((request, index) => (
              <LendingRequestCard key={index} request={request} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="card-professional">
            <CardHeader>
              <CardTitle className="text-professional-title">Appearance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Palette className="text-[#5945a3]" size={20} />
                  <div>
                    <p className="text-professional-subtitle font-medium">Theme</p>
                    <p className="text-professional-body text-sm">Choose your preferred theme</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-professional">
            <CardHeader>
              <CardTitle className="text-professional-title">Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="text-[#5945a3]" size={20} />
                  <div>
                    <p className="text-professional-subtitle font-medium">Email Notifications</p>
                    <p className="text-professional-body text-sm">Receive updates via email</p>
                  </div>
                </div>
                <Switch 
                  checked={notifications.email} 
                  onCheckedChange={(value) => handleNotificationChange('email', value)}
                  className="focus-professional"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageCircle className="text-[#5945a3]" size={20} />
                  <div>
                    <p className="text-professional-subtitle font-medium">Push Notifications</p>
                    <p className="text-professional-body text-sm">Receive push notifications</p>
                  </div>
                </div>
                <Switch 
                  checked={notifications.push} 
                  onCheckedChange={(value) => handleNotificationChange('push', value)}
                  className="focus-professional"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Phone className="text-[#5945a3]" size={20} />
                  <div>
                    <p className="text-professional-subtitle font-medium">SMS Notifications</p>
                    <p className="text-professional-body text-sm">Receive text messages</p>
                  </div>
                </div>
                <Switch 
                  checked={notifications.sms} 
                  onCheckedChange={(value) => handleNotificationChange('sms', value)}
                  className="focus-professional"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="card-professional">
            <CardHeader>
              <CardTitle className="text-professional-title">Privacy & Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="text-[#5945a3]" size={20} />
                  <div>
                    <p className="text-professional-subtitle font-medium">Two-Factor Authentication</p>
                    <p className="text-professional-body text-sm">Add an extra layer of security</p>
                  </div>
                </div>
                <Button variant="outline" className="btn-professional">
                  Enable
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Eye className="text-[#5945a3]" size={20} />
                  <div>
                    <p className="text-professional-subtitle font-medium">Profile Visibility</p>
                    <p className="text-professional-body text-sm">Control who can see your profile</p>
                  </div>
                </div>
                <Button variant="outline" className="btn-professional">
                  Public
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
};

export default Profile;