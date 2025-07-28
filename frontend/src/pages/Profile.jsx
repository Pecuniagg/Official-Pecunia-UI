import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Switch } from '../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Progress } from '../components/ui/progress';
import { 
  Star, 
  Edit, 
  Mail, 
  Copy, 
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
  Trophy,
  Target,
  MessageSquare,
  Eye,
  Bell,
  Smartphone,
  Globe,
  PiggyBank
} from 'lucide-react';
import { mockData } from '../data/mockData';
import { useToast } from '../hooks/use-toast';

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

  const handleLendingToggle = (enabled) => {
    setLendingEnabled(enabled);
    toast({
      title: enabled ? "Lending Enabled" : "Lending Disabled",
      description: enabled ? "You're now available for lending" : "Lending has been disabled"
    });
  };

  const handlePostLike = (postId) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
    toast({ title: "Post liked!", description: "Your interaction has been recorded" });
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopiedEmail(true);
    toast({ title: "Email copied!", description: "Email address copied to clipboard" });
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleNotificationChange = (key, value) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
    toast({ 
      title: "Settings updated", 
      description: `${key} notifications ${value ? 'enabled' : 'disabled'}` 
    });
  };

  const StatCard = ({ icon: Icon, label, value, color, isHovered }) => (
    <div 
      className={`mobile-card lg:card-professional p-3 lg:p-4 text-center transition-all duration-200 cursor-pointer ${
        isHovered ? 'transform scale-105 shadow-lg' : ''
      }`}
      onMouseEnter={() => setHoveredStat(label)}
      onMouseLeave={() => setHoveredStat(null)}
    >
      <Icon className={`${color} mx-auto mb-2 transition-transform duration-200 ${isHovered ? 'scale-110' : ''}`} size={isHovered ? 28 : 24} />
      <p className="mobile-subtitle lg:text-lg lg:font-bold">{value}</p>
      <p className="mobile-caption text-gray-500">{label}</p>
      {isHovered && (
        <div className="mt-2">
          <Progress value={Math.random() * 100} className="h-1" />
        </div>
      )}
    </div>
  );

  const PostCard = ({ post }) => {
    const isLiked = likedPosts.has(post.id);
    
    return (
      <Card className="mobile-card lg:card-professional">
        <CardHeader className="mobile-card-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 lg:h-10 lg:w-10">
                <AvatarImage src={profile.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-[#5945a3] to-[#b37e91] text-white">
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="mobile-subtitle lg:font-medium">{profile.name}</p>
                <p className="mobile-caption text-gray-500">{post.time}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="btn-professional profile-post-button">
              <Edit size={16} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="mobile-card-content">
          <p className="mobile-body mb-4">{post.content}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className={`btn-professional gap-2 profile-post-button ${isLiked ? 'text-red-500' : 'text-gray-500'}`}
                onClick={() => handlePostLike(post.id)}
              >
                <Heart size={16} className={isLiked ? 'fill-current' : ''} />
                <span>{post.likes + (isLiked ? 1 : 0)}</span>
              </Button>
              <Button variant="ghost" size="sm" className="btn-professional gap-2 text-gray-500 profile-post-button">
                <MessageCircle size={16} />
                <span>{post.comments}</span>
              </Button>
              <Button variant="ghost" size="sm" className="btn-professional gap-2 text-gray-500 profile-post-button">
                <Share2 size={16} />
                <span className="hidden lg:inline">Share</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const LendingRequestCard = ({ request }) => (
    <Card className="mobile-card lg:card-professional">
      <CardContent className="mobile-card-content">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 lg:gap-0 mb-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 lg:h-10 lg:w-10">
              <AvatarImage src={request.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-[#5945a3] to-[#b37e91] text-white text-sm">
                {request.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="mobile-subtitle lg:font-medium">{request.name}</p>
              <p className="mobile-caption text-gray-500">${request.amount.toLocaleString()} • {request.term}</p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {request.riskLevel}
          </Badge>
        </div>
        <p className="mobile-body mb-4">{request.reason}</p>
        <div className="flex flex-col sm:flex-row gap-2">
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

  return (
    <div className="mobile-layout" style={{ 
      background: 'var(--color-bg-primary)', 
      color: 'var(--color-text-white)',
      minHeight: '100vh'
    }}>
      <div className="mobile-container lg:max-w-6xl lg:mx-auto lg:p-6">
        {/* Profile Header */}
        <Card className="mobile-card lg:card-professional mb-4 lg:mb-8">
          <CardContent className="mobile-card-content">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 lg:gap-6">
              <Avatar className="h-20 w-20 lg:h-24 lg:w-24">
                <AvatarImage src={profile.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-[#5945a3] to-[#b37e91] text-white text-xl">
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center lg:text-left">
                <h1 className="mobile-title lg:text-2xl lg:font-bold lg:mb-2">{profile.name}</h1>
                <p className="mobile-body text-gray-500 mb-3 lg:mb-4">{profile.title}</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-center lg:justify-start gap-1">
                    <Mail size={16} className="text-[#5945a3]" />
                    <span className="mobile-body">{profile.email}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyEmail}
                      className="ml-2 p-1"
                    >
                      <Copy size={14} className={copiedEmail ? 'text-green-500' : 'text-gray-400'} />
                    </Button>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start gap-4">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-yellow-500 fill-current" />
                      <span className="mobile-caption">{profile.rating}/5</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Trophy size={14} className="text-[#5945a3]" />
                      <span className="mobile-caption">Level {profile.level}</span>
                    </div>
                  </div>
                </div>
              </div>
              <Button className="btn-professional profile-settings-button w-full lg:w-auto">
                <Edit size={16} className="mr-2" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="mobile-grid-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-4 lg:mb-8">
          <StatCard 
            icon={DollarSign} 
            label="Net Worth" 
            value={`$${profile.netWorth.toLocaleString()}`} 
            color="text-green-600"
            isHovered={hoveredStat === 'Net Worth'}
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

        {/* Enhanced Tab Selector with Unified Structure */}
        <div className="profile-tabs-container">
          <button
            className={`profile-tab-trigger ${selectedTab === 'posts' ? 'active' : ''}`}
            data-state={selectedTab === 'posts' ? 'active' : 'inactive'}
            onClick={() => setSelectedTab('posts')}
          >
            <MessageSquare className="tab-icon h-3 w-3 lg:h-4 lg:w-4" />
            <span className="profile-tab-text text-xs lg:text-sm">Posts</span>
          </button>
          <button
            className={`profile-tab-trigger ${selectedTab === 'lending' ? 'active' : ''}`}
            data-state={selectedTab === 'lending' ? 'active' : 'inactive'}
            onClick={() => setSelectedTab('lending')}
          >
            <DollarSign className="tab-icon h-3 w-3 lg:h-4 lg:w-4" />
            <span className="profile-tab-text text-xs lg:text-sm">Lending</span>
          </button>
          <button
            className={`profile-tab-trigger ${selectedTab === 'settings' ? 'active' : ''}`}
            data-state={selectedTab === 'settings' ? 'active' : 'inactive'}
            onClick={() => setSelectedTab('settings')}
          >
            <Settings className="tab-icon h-3 w-3 lg:h-4 lg:w-4" />
            <span className="profile-tab-text text-xs lg:text-sm">Settings</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {selectedTab === 'posts' && (
            <div className="space-y-4 lg:space-y-6">
              {profile.posts.map((post, index) => (
                <PostCard key={index} post={post} />
              ))}
            </div>
          )}

          {selectedTab === 'lending' && (
            <div className="space-y-4 lg:space-y-6">
              <Card className="mobile-card lg:card-professional">
                <CardHeader className="mobile-card-header">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-0">
                    <CardTitle className="mobile-subtitle lg:text-lg">Lending Availability</CardTitle>
                    <div className="flex items-center gap-2">
                      <span className="mobile-caption text-sm">Available</span>
                      <Switch 
                        checked={lendingEnabled} 
                        onCheckedChange={handleLendingToggle}
                        className="focus-professional"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="mobile-card-content">
                  <div className="mobile-grid-1 lg:grid-cols-3 gap-3 lg:gap-4">
                    <div className="text-center p-3 lg:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="mobile-subtitle lg:font-semibold">${profile.lending.totalLent.toLocaleString()}</p>
                      <p className="mobile-caption text-gray-500">Total Lent</p>
                    </div>
                    <div className="text-center p-3 lg:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="mobile-subtitle lg:font-semibold">{profile.lending.activeLoan}</p>
                      <p className="mobile-caption text-gray-500">Active Loans</p>
                    </div>
                    <div className="text-center p-3 lg:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="mobile-subtitle lg:font-semibold">{profile.lending.rating}/5</p>
                      <p className="mobile-caption text-gray-500">Rating</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3 lg:space-y-4">
                <h3 className="mobile-subtitle lg:text-lg">Lending Requests</h3>
                {profile.lending.requests.map((request, index) => (
                  <LendingRequestCard key={index} request={request} />
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'settings' && (
            <div className="space-y-4 lg:space-y-6">
              <Card className="mobile-card lg:card-professional">
                <CardHeader className="mobile-card-header">
                  <CardTitle className="mobile-subtitle lg:text-lg">Notifications</CardTitle>
                </CardHeader>
                <CardContent className="mobile-card-content space-y-4 lg:space-y-6">
                  {Object.entries({
                    email: { label: 'Email Notifications', desc: 'Receive updates via email', icon: Mail },
                    push: { label: 'Push Notifications', desc: 'Get notifications on your device', icon: Bell },
                    sms: { label: 'SMS Notifications', desc: 'Receive text message alerts', icon: Smartphone },
                    weekly: { label: 'Weekly Summary', desc: 'Get weekly financial reports', icon: Eye }
                  }).map(([key, config]) => {
                    const Icon = config.icon;
                    return (
                      <div key={key} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon size={20} className="text-[#5945a3]" />
                          <div>
                            <p className="mobile-subtitle lg:font-medium">{config.label}</p>
                            <p className="mobile-caption text-gray-500">{config.desc}</p>
                          </div>
                        </div>
                        <Switch
                          checked={notifications[key]}
                          onCheckedChange={(value) => handleNotificationChange(key, value)}
                          className="focus-professional"
                        />
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <Card className="mobile-card lg:card-professional">
                <CardHeader className="mobile-card-header">
                  <CardTitle className="mobile-subtitle lg:text-lg">Security</CardTitle>
                </CardHeader>
                <CardContent className="mobile-card-content space-y-4 lg:space-y-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-0">
                    <div className="flex items-center gap-3">
                      <Shield size={20} className="text-[#5945a3]" />
                      <div>
                        <p className="mobile-subtitle lg:font-medium">Two-Factor Authentication</p>
                        <p className="mobile-caption text-gray-500">Add an extra layer of security</p>
                      </div>
                    </div>
                    <Button variant="outline" className="btn-professional profile-settings-button w-full lg:w-auto">
                      Enable
                    </Button>
                  </div>
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-0">
                    <div className="flex items-center gap-3">
                      <Globe size={20} className="text-[#5945a3]" />
                      <div>
                        <p className="mobile-subtitle lg:font-medium">Profile Visibility</p>
                        <p className="mobile-caption text-gray-500">Control who can see your profile</p>
                      </div>
                    </div>
                    <Button variant="outline" className="btn-professional profile-settings-button w-full lg:w-auto">
                      Public
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;