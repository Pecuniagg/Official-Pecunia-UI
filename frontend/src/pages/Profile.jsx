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
    <Card 
      className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer ${
        isHovered ? 'transform scale-105 shadow-lg border-[#5945a3]/20' : ''
      }`}
      onMouseEnter={() => setHoveredStat(label)}
      onMouseLeave={() => setHoveredStat(null)}
    >
      <CardContent className="p-6 text-center">
        <Icon className={`${color} mx-auto mb-3 transition-transform duration-200 ${isHovered ? 'scale-110' : ''}`} size={isHovered ? 28 : 24} />
        <p className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        {isHovered && (
          <div className="mt-3">
            <Progress value={Math.random() * 100} className="h-2" />
          </div>
        )}
      </CardContent>
    </Card>
  );

  const PostCard = ({ post }) => {
    const isLiked = likedPosts.has(post.id);
    
    return (
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-11 w-11">
                <AvatarImage src={profile.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-[#5945a3] to-[#b37e91] text-white font-semibold">
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{profile.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{post.time}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <Edit size={16} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-gray-900 dark:text-white mb-4 leading-relaxed">{post.content}</p>
          <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-6">
              <button
                className={`flex items-center gap-2 text-sm transition-colors ${
                  isLiked ? 'text-red-500' : 'text-gray-500 dark:text-gray-400 hover:text-red-500'
                }`}
                onClick={() => handlePostLike(post.id)}
              >
                <Heart size={16} className={isLiked ? 'fill-current' : ''} />
                <span className="font-medium">{post.likes + (isLiked ? 1 : 0)}</span>
              </button>
              <button className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors">
                <MessageCircle size={16} />
                <span className="font-medium">{post.comments}</span>
              </button>
              <button className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-green-500 transition-colors">
                <Share2 size={16} />
                <span className="font-medium hidden lg:inline">Share</span>
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const LendingRequestCard = ({ request }) => (
    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-0 mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-11 w-11">
              <AvatarImage src={request.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-[#5945a3] to-[#b37e91] text-white font-semibold text-sm">
                {request.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{request.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ${request.amount.toLocaleString()} • {request.term}
              </p>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className="text-xs bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800"
          >
            {request.riskLevel}
          </Badge>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">{request.reason}</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            size="sm" 
            className="flex-1 bg-green-600 hover:bg-green-700 text-white shadow-sm"
            onClick={() => toast({ title: "Request Approved", description: "Lending request has been approved" })}
          >
            <CheckCircle size={16} className="mr-2" />
            Approve
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto p-4 lg:p-6">
        {/* Enhanced Profile Header */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
              <Avatar className="h-24 w-24 lg:h-28 lg:w-28">
                <AvatarImage src={profile.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-[#5945a3] to-[#b37e91] text-white text-2xl font-bold">
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {profile.name}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">{profile.title}</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-center lg:justify-start gap-2">
                    <Mail size={18} className="text-[#5945a3]" />
                    <span className="text-gray-700 dark:text-gray-300">{profile.email}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyEmail}
                      className="ml-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Copy size={14} className={copiedEmail ? 'text-green-500' : 'text-gray-400'} />
                    </Button>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start gap-6">
                    <div className="flex items-center gap-2">
                      <Star size={16} className="text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{profile.rating}/5</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy size={16} className="text-[#5945a3]" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Level {profile.level}</span>
                    </div>
                  </div>
                </div>
              </div>
              <Button className="bg-[#5945a3] hover:bg-[#4a3d8f] text-white px-6 py-3 font-medium shadow-sm w-full lg:w-auto">
                <Edit size={16} className="mr-2" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
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

        {/* Enhanced Tab Selector */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm mb-8">
          <CardContent className="p-2">
            <div className="flex gap-1">
              {[
                { id: 'posts', icon: MessageSquare, label: 'Posts' },
                { id: 'lending', icon: DollarSign, label: 'Lending' },
                { id: 'settings', icon: Settings, label: 'Settings' }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    className={`flex-1 flex items-center justify-center gap-3 px-4 py-4 rounded-lg font-medium transition-all duration-200 ${
                      selectedTab === tab.id
                        ? 'bg-gradient-to-r from-[#5945a3] to-[#6b59a8] text-white shadow-sm transform scale-[1.02]'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                    onClick={() => setSelectedTab(tab.id)}
                  >
                    <Icon size={18} />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Tab Content */}
        <div className="space-y-6">
          {selectedTab === 'posts' && (
            <div className="space-y-6">
              {profile.posts.map((post, index) => (
                <PostCard key={index} post={post} />
              ))}
            </div>
          )}

          {selectedTab === 'lending' && (
            <div className="space-y-6">
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-0">
                    <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Lending Availability</CardTitle>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Available</span>
                      <Switch 
                        checked={lendingEnabled} 
                        onCheckedChange={handleLendingToggle}
                        className="data-[state=checked]:bg-[#5945a3]"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        ${profile.lending.totalLent.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total Lent</p>
                    </div>
                    <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {profile.lending.activeLoan}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Active Loans</p>
                    </div>
                    <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {profile.lending.rating}/5
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Rating</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Lending Requests</h3>
                {profile.lending.requests.map((request, index) => (
                  <LendingRequestCard key={index} request={request} />
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'settings' && (
            <div className="space-y-6">
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Notifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {Object.entries({
                    email: { label: 'Email Notifications', desc: 'Receive updates via email', icon: Mail },
                    push: { label: 'Push Notifications', desc: 'Get notifications on your device', icon: Bell },
                    sms: { label: 'SMS Notifications', desc: 'Receive text message alerts', icon: Smartphone },
                    weekly: { label: 'Weekly Summary', desc: 'Get weekly financial reports', icon: Eye }
                  }).map(([key, config]) => {
                    const Icon = config.icon;
                    return (
                      <div key={key} className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <Icon size={20} className="text-[#5945a3]" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{config.label}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{config.desc}</p>
                          </div>
                        </div>
                        <Switch
                          checked={notifications[key]}
                          onCheckedChange={(value) => handleNotificationChange(key, value)}
                          className="data-[state=checked]:bg-[#5945a3]"
                        />
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-0 py-2">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <Shield size={20} className="text-[#5945a3]" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security</p>
                      </div>
                    </div>
                    <Button variant="outline" className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 w-full lg:w-auto">
                      Enable
                    </Button>
                  </div>
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-0 py-2">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <Globe size={20} className="text-[#5945a3]" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Profile Visibility</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Control who can see your profile</p>
                      </div>
                    </div>
                    <Button variant="outline" className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 w-full lg:w-auto">
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