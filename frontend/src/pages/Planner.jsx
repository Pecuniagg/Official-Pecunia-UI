import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Progress } from '../components/ui/progress';
import { 
  MapPin, 
  Calendar as CalendarIcon, 
  Users, 
  DollarSign, 
  Sparkles, 
  Clock, 
  Star,
  Heart,
  Share2,
  Bookmark,
  Plus,
  Filter,
  Search,
  Eye,
  Edit,
  Calculator,
  CreditCard,
  Plane,
  Hotel,
  Car,
  Coffee,
  Camera,
  Settings,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  MoreHorizontal,
  Target,
  Loader2
} from 'lucide-react';
import { mockData } from '../data/mockData';
import { useToast } from '../hooks/use-toast';
import { useAI } from '../contexts/AIContext';

const Planner = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPlanCreator, setShowPlanCreator] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(null);
  const [showBudgetTracker, setShowBudgetTracker] = useState(null);
  const [showGroupPlanning, setShowGroupPlanning] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [budgetRange, setBudgetRange] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedPlans, setSavedPlans] = useState([]);
  const [aiGeneratedPlans, setAiGeneratedPlans] = useState([]);
  const [generatingPlan, setGeneratingPlan] = useState(false);
  
  // AI integration
  const { createTravelPlan, userProfile } = useAI();
  
  // New plan state
  const [newPlan, setNewPlan] = useState({
    title: '',
    description: '',
    budget: '',
    dates: { start: null, end: null },
    category: '',
    location: '',
    participants: 1,
    priority: 'medium'
  });

  // Booking state
  const [bookingDetails, setBookingDetails] = useState({
    dates: { start: null, end: null },
    participants: 1,
    preferences: {
      accommodation: '',
      transportation: '',
      activities: []
    }
  });

  const { plans } = mockData;
  const { toast } = useToast();

  const handlePlanAction = (action, planId, planTitle) => {
    switch(action) {
      case 'save':
        setSavedPlans([...savedPlans, planId]);
        toast({
          title: "Plan Saved! 💾",
          description: `${planTitle} added to your saved plans`,
        });
        break;
      case 'like':
        toast({
          title: "Plan Liked! ❤️",
          description: `${planTitle} added to your favorites`,
        });
        break;
      case 'share':
        toast({
          title: "Plan Shared! 📤",
          description: `${planTitle} shared with your network`,
        });
        break;
      case 'book':
        setShowBookingModal(planId);
        break;
      case 'budget':
        setShowBudgetTracker(planId);
        break;
      default:
        toast({
          title: "Action Complete",
          description: "Your request has been processed",
        });
    }
  };

  const handleCreatePlan = async () => {
    if (!newPlan.title || !newPlan.budget || !newPlan.dates.start) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setGeneratingPlan(true);
    
    try {
      // Generate AI travel plan
      const aiPlan = await createTravelPlan({
        budget: parseFloat(newPlan.budget),
        duration: newPlan.dates.end ? 
          Math.ceil((newPlan.dates.end - newPlan.dates.start) / (1000 * 60 * 60 * 24)) + ' days' : 
          '3 days',
        location: newPlan.location || 'flexible',
        style: newPlan.category?.toLowerCase() || 'balanced',
        interests: [newPlan.category],
        group_size: newPlan.participants
      });

      if (aiPlan) {
        const customPlan = {
          id: Date.now(),
          title: aiPlan.title || newPlan.title,
          description: aiPlan.description || newPlan.description,
          estimatedBudget: parseFloat(newPlan.budget),
          vibe: newPlan.category || 'Custom',
          image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?crop=entropy&cs=srgb&fm=jpg&w=400&h=300',
          aiGenerated: true,
          aiPlan: aiPlan
        };

        setAiGeneratedPlans(prev => [customPlan, ...prev]);
        
        toast({
          title: "AI Plan Created! 🎯",
          description: `${aiPlan.title} has been generated with detailed itinerary`,
        });
      } else {
        toast({
          title: "Plan Created! 🎯",
          description: `${newPlan.title} has been added to your plans`,
        });
      }
    } catch (error) {
      console.error('Error creating AI plan:', error);
      toast({
        title: "Plan Created! 🎯",
        description: `${newPlan.title} has been added to your plans (AI enhancement unavailable)`,
      });
    }

    setNewPlan({
      title: '',
      description: '',
      budget: '',
      dates: { start: null, end: null },
      category: '',
      location: '',
      participants: 1,
      priority: 'medium'
    });
    setShowPlanCreator(false);
    setGeneratingPlan(false);
  };

  const generateMoreAIPlans = async () => {
    setGeneratingPlan(true);
    
    try {
      // Generate multiple AI plans based on user preferences
      const preferences = [
        { budget: 800, style: 'relaxing', location: 'beach destination' },
        { budget: 1200, style: 'adventure', location: 'mountain destination' },
        { budget: 600, style: 'cultural', location: 'historic city' }
      ];

      for (const pref of preferences) {
        const aiPlan = await createTravelPlan(pref);
        if (aiPlan) {
          const generatedPlan = {
            id: Date.now() + Math.random(),
            title: aiPlan.title,
            description: aiPlan.description,
            estimatedBudget: pref.budget,
            vibe: pref.style.charAt(0).toUpperCase() + pref.style.slice(1),
            image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?crop=entropy&cs=srgb&fm=jpg&w=400&h=300',
            aiGenerated: true,
            aiPlan: aiPlan
          };
          
          setAiGeneratedPlans(prev => [...prev, generatedPlan]);
        }
      }

      toast({
        title: "New AI Plans Generated! ✨",
        description: "Fresh travel ideas based on your preferences",
      });
    } catch (error) {
      console.error('Error generating AI plans:', error);
      toast({
        title: "Generation Complete",
        description: "Some plans may not have AI enhancements",
      });
    }
    
    setGeneratingPlan(false);
  };

  const handleBooking = (planId) => {
    toast({
      title: "Booking Initiated! ✈️",
      description: "Redirecting to booking partners...",
    });
    setShowBookingModal(null);
  };

  const filteredPlans = plans.filter(plan => {
    const matchesFilter = activeFilter === 'All' || plan.vibe === activeFilter;
    const matchesBudget = budgetRange === 'all' || 
      (budgetRange === '$0-1K' && plan.estimatedBudget <= 1000) ||
      (budgetRange === '$1K-2K' && plan.estimatedBudget > 1000 && plan.estimatedBudget <= 2000) ||
      (budgetRange === '$2K+' && plan.estimatedBudget > 2000);
    const matchesSearch = plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesBudget && matchesSearch;
  });

  const PlanCreatorModal = () => (
    <Dialog open={showPlanCreator} onOpenChange={setShowPlanCreator}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="text-[#5945a3]" size={20} />
            Create Custom Plan
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Plan Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Weekend in Paris"
                value={newPlan.title}
                onChange={(e) => setNewPlan({...newPlan, title: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="budget">Budget *</Label>
              <Input
                id="budget"
                type="number"
                placeholder="1500"
                value={newPlan.budget}
                onChange={(e) => setNewPlan({...newPlan, budget: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newPlan.dates.start ? newPlan.dates.start.toLocaleDateString() : "Pick start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={newPlan.dates.start}
                    onSelect={(date) => setNewPlan({...newPlan, dates: {...newPlan.dates, start: date}})}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newPlan.dates.end ? newPlan.dates.end.toLocaleDateString() : "Pick end date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={newPlan.dates.end}
                    onSelect={(date) => setNewPlan({...newPlan, dates: {...newPlan.dates, end: date}})}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g., San Francisco, CA"
                value={newPlan.location}
                onChange={(e) => setNewPlan({...newPlan, location: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={newPlan.category} onValueChange={(value) => setNewPlan({...newPlan, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Relaxing">Relaxing</SelectItem>
                  <SelectItem value="Professional">Professional</SelectItem>
                  <SelectItem value="Family">Family</SelectItem>
                  <SelectItem value="Adventure">Adventure</SelectItem>
                  <SelectItem value="Cultural">Cultural</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="participants">Participants</Label>
              <Input
                id="participants"
                type="number"
                min="1"
                value={newPlan.participants}
                onChange={(e) => setNewPlan({...newPlan, participants: parseInt(e.target.value)})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your ideal experience..."
              value={newPlan.description}
              onChange={(e) => setNewPlan({...newPlan, description: e.target.value})}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowPlanCreator(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePlan} className="bg-[#5945a3] hover:bg-[#4a3d8f]">
              Create Plan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const BookingModal = () => (
    <Dialog open={!!showBookingModal} onOpenChange={() => setShowBookingModal(null)}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plane className="text-[#5945a3]" size={20} />
            Book Your Experience
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Check-in Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {bookingDetails.dates.start ? bookingDetails.dates.start.toLocaleDateString() : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={bookingDetails.dates.start}
                    onSelect={(date) => setBookingDetails({...bookingDetails, dates: {...bookingDetails.dates, start: date}})}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Check-out Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {bookingDetails.dates.end ? bookingDetails.dates.end.toLocaleDateString() : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={bookingDetails.dates.end}
                    onSelect={(date) => setBookingDetails({...bookingDetails, dates: {...bookingDetails.dates, end: date}})}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Booking Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                <Hotel className="w-8 h-8 mb-2 text-[#5945a3]" />
                <h4 className="font-medium">Accommodation</h4>
                <p className="text-sm text-gray-600">Hotels & stays</p>
              </Card>
              
              <Card className="p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                <Car className="w-8 h-8 mb-2 text-[#5945a3]" />
                <h4 className="font-medium">Transportation</h4>
                <p className="text-sm text-gray-600">Flights & rentals</p>
              </Card>
              
              <Card className="p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                <Camera className="w-8 h-8 mb-2 text-[#5945a3]" />
                <h4 className="font-medium">Activities</h4>
                <p className="text-sm text-gray-600">Tours & experiences</p>
              </Card>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowBookingModal(null)}>
              Cancel
            </Button>
            <Button onClick={() => handleBooking(showBookingModal)} className="bg-[#5945a3] hover:bg-[#4a3d8f]">
              Book Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const BudgetTrackerModal = () => (
    <Dialog open={!!showBudgetTracker} onOpenChange={() => setShowBudgetTracker(null)}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="text-[#5945a3]" size={20} />
            Budget Tracker
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <p className="text-2xl font-bold">$850</p>
                <p className="text-sm text-gray-600">Estimated Budget</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <CreditCard className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <p className="text-2xl font-bold">$0</p>
                <p className="text-sm text-gray-600">Spent So Far</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Budget Breakdown</h3>
            <div className="space-y-3">
              {[
                { category: 'Transportation', amount: 255, budget: 300, color: 'bg-blue-500' },
                { category: 'Accommodation', amount: 0, budget: 340, color: 'bg-green-500' },
                { category: 'Food & Dining', amount: 0, budget: 210, color: 'bg-yellow-500' }
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{item.category}</span>
                    <span>${item.amount} / ${item.budget}</span>
                  </div>
                  <Progress value={(item.amount / item.budget) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline">
              <Plus size={16} className="mr-2" />
              Add Expense
            </Button>
            <Button className="bg-[#5945a3] hover:bg-[#4a3d8f]">
              <TrendingUp size={16} className="mr-2" />
              Set Savings Goal
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const PlanCard = ({ plan }) => {
    const isSaved = savedPlans.includes(plan.id);
    
    return (
      <Card className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group overflow-hidden">
        <div className="relative">
          <img 
            src={plan.image} 
            alt={plan.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-3 right-3 flex gap-2">
            <Badge className="bg-white/90 text-gray-700">
              {plan.vibe}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              className={`bg-white/80 hover:bg-white ${isSaved ? 'text-red-500' : 'text-gray-600'} opacity-0 group-hover:opacity-100 transition-all`}
              onClick={() => handlePlanAction('like', plan.id, plan.title)}
            >
              <Heart size={16} fill={isSaved ? 'currentColor' : 'none'} />
            </Button>
          </div>
          <div className="absolute bottom-3 left-3">
            <Badge className="bg-green-600 text-white">
              ${plan.estimatedBudget}
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-6">
          <h3 className="font-bold text-lg mb-2">{plan.title}</h3>
          <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-gray-500" />
              <span className="text-sm text-gray-600">Location varies</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-gray-500" />
              <span className="text-sm text-gray-600">2-3 days</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              className="flex-1 bg-[#5945a3] hover:bg-[#4a3d8f]"
              onClick={() => setSelectedPlan(plan)}
            >
              <Eye size={14} className="mr-1" />
              View Details
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handlePlanAction('save', plan.id, plan.title)}
              className={isSaved ? 'bg-blue-50 border-blue-200' : ''}
            >
              <Bookmark size={14} fill={isSaved ? 'currentColor' : 'none'} />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handlePlanAction('share', plan.id, plan.title)}
            >
              <Share2 size={14} />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const PlanDetails = ({ plan, onClose }) => (
    <Dialog open={!!plan} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl">{plan?.title}</DialogTitle>
        </DialogHeader>

        {plan && (
          <div className="space-y-6">
            <img 
              src={plan.image} 
              alt={plan.title}
              className="w-full h-64 object-cover rounded-lg shadow-md"
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <DollarSign className="w-6 h-6 mx-auto mb-2 text-green-600" />
                  <p className="text-sm text-gray-600">Estimated Budget</p>
                  <p className="font-bold text-lg">${plan.estimatedBudget}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <Star className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
                  <p className="text-sm text-gray-600">Vibe</p>
                  <p className="font-bold text-lg">{plan.vibe}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                  <p className="text-sm text-gray-600">Best For</p>
                  <p className="font-bold text-lg">1-4 people</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Clock className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-bold text-lg">2-3 days</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="text-[#5945a3]" size={20} />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-4">
                  Based on your spending patterns and preferences, this plan is perfect for you because:
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                    Fits within your entertainment budget allocation
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                    Aligns with your recent interest in {plan.vibe.toLowerCase()} activities
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                    Optimal timing based on your calendar and financial goals
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                    Great ROI for experience vs. cost
                  </li>
                </ul>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">What's Included</h3>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <MapPin className="text-red-500" size={20} />
                      <span className="font-medium">Interactive Itinerary</span>
                    </div>
                    <p className="text-sm text-gray-600 ml-8">
                      AI-curated locations, restaurants, and activities with real-time updates
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <CalendarIcon className="text-blue-500" size={20} />
                      <span className="font-medium">Smart Scheduling</span>
                    </div>
                    <p className="text-sm text-gray-600 ml-8">
                      Optimized timeline with travel times and weather considerations
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <DollarSign className="text-green-500" size={20} />
                      <span className="font-medium">Budget Integration</span>
                    </div>
                    <p className="text-sm text-gray-600 ml-8">
                      Automatic expense tracking and goal-based savings recommendations
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Quick Actions</h3>
                
                <div className="space-y-2">
                  <Button 
                    className="w-full bg-[#5945a3] hover:bg-[#4a3d8f]"
                    onClick={() => handlePlanAction('book', plan.id, plan.title)}
                  >
                    <Plane size={16} className="mr-2" />
                    Book Experience
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handlePlanAction('budget', plan.id, plan.title)}
                  >
                    <Calculator size={16} className="mr-2" />
                    Track Budget
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setShowGroupPlanning(true)}
                  >
                    <Users size={16} className="mr-2" />
                    Plan with Friends
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => toast({ title: "Goal Created", description: "Savings goal created for this experience" })}
                  >
                    <Target size={16} className="mr-2" />
                    Create Savings Goal
                  </Button>
                </div>
              </div>
            </div>

            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="text-yellow-600" size={16} />
                  <span className="font-medium text-yellow-800">Smart Budget Integration</span>
                </div>
                <p className="text-sm text-yellow-700">
                  This plan will automatically create a savings goal and suggest optimal payment timing 
                  based on your cash flow patterns. Estimated monthly savings needed: ${Math.round(plan.estimatedBudget / 6)}.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-[#0a0a0f] mb-2" style={{ fontFamily: 'Neurial Grotesk, sans-serif' }}>
            AI Planner
          </h1>
          <p className="text-[#3b345b]">Let AI plan your perfect experiences within your budget</p>
        </div>
        
        <Button 
          className="bg-gradient-to-r from-[#5945a3] to-[#b37e91] hover:opacity-90"
          onClick={() => setShowPlanCreator(true)}
        >
          <Plus size={16} className="mr-2" />
          Create Custom Plan
        </Button>
      </div>

      {/* AI Summary Banner */}
      <Card className="bg-gradient-to-r from-[#5945a3] via-[#b37e91] to-[#3b345b] text-white">
        <CardContent className="p-8">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles size={24} />
            <h2 className="text-xl font-semibold">Personalized for You</h2>
          </div>
          <p className="text-lg opacity-90 mb-4">
            Based on your spending patterns, current goals, and preferences, I've curated these experiences 
            that fit perfectly within your lifestyle budget.
          </p>
          <div className="flex items-center gap-6 text-sm opacity-80">
            <div className="flex items-center gap-2">
              <DollarSign size={16} />
              <span>Budget: $500-1,500</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon size={16} />
              <span>Next 3 months</span>
            </div>
            <div className="flex items-center gap-2">
              <Star size={16} />
              <span>Matches your vibe</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input
              placeholder="Search plans, destinations, activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Filter by:</span>
            <div className="flex gap-2">
              {['All', 'Relaxing', 'Professional', 'Family', 'Adventure'].map((filter) => (
                <Button
                  key={filter}
                  variant={activeFilter === filter ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveFilter(filter)}
                  className={activeFilter === filter ? 'bg-[#5945a3] hover:bg-[#4a3d8f]' : ''}
                >
                  {filter}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Budget:</span>
            <Select value={budgetRange} onValueChange={setBudgetRange}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="$0-1K">$0-1K</SelectItem>
                <SelectItem value="$1K-2K">$1K-2K</SelectItem>
                <SelectItem value="$2K+">$2K+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredPlans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>

      {filteredPlans.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Search className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No plans found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your filters or search terms</p>
            <Button onClick={() => setShowPlanCreator(true)} className="bg-[#5945a3] hover:bg-[#4a3d8f]">
              Create Custom Plan
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline" size="lg" className="px-8">
          <Sparkles size={16} className="mr-2" />
          Generate More Plans
        </Button>
      </div>

      {/* Group Planning Section */}
      <Card className="mt-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="text-[#5945a3]" size={24} />
            Group Planning
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <CalendarIcon className="w-8 h-8 mx-auto mb-3 text-blue-500" />
              <h3 className="font-semibold mb-2">Sync Calendars</h3>
              <p className="text-sm text-gray-600">Find dates that work for everyone</p>
            </div>
            <div className="text-center p-6 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <DollarSign className="w-8 h-8 mx-auto mb-3 text-green-500" />
              <h3 className="font-semibold mb-2">Split Costs</h3>
              <p className="text-sm text-gray-600">Smart budget allocation and payment tracking</p>
            </div>
            <div className="text-center p-6 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <Sparkles className="w-8 h-8 mx-auto mb-3 text-purple-500" />
              <h3 className="font-semibold mb-2">AI Consensus</h3>
              <p className="text-sm text-gray-600">Find plans everyone will love</p>
            </div>
          </div>
          <div className="text-center mt-6">
            <Button 
              className="bg-gradient-to-r from-[#5945a3] to-[#b37e91] hover:opacity-90"
              onClick={() => setShowGroupPlanning(true)}
            >
              <Users size={16} className="mr-2" />
              Start Group Planning
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <PlanCreatorModal />
      <BookingModal />
      <BudgetTrackerModal />
      <PlanDetails 
        plan={selectedPlan} 
        onClose={() => setSelectedPlan(null)} 
      />
    </div>
  );
};

export default Planner;