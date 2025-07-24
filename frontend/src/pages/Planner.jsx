import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet';
import { MapPin, Calendar, Users, DollarSign, Sparkles, Clock, Star } from 'lucide-react';
import { mockData } from '../data/mockData';

const Planner = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const { plans } = mockData;

  const PlanCard = ({ plan }) => (
    <Card 
      className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
      onClick={() => setSelectedPlan(plan)}
    >
      <div className="relative">
        <img 
          src={plan.image} 
          alt={plan.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <Badge className="absolute top-3 right-3 bg-white/90 text-gray-700">
          {plan.vibe}
        </Badge>
      </div>
      <CardContent className="p-6">
        <h3 className="font-bold text-lg mb-2">{plan.title}</h3>
        <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign size={16} className="text-green-600" />
            <span className="font-semibold text-green-600">${plan.estimatedBudget}</span>
          </div>
          <Button size="sm" className="bg-[#5945a3] hover:bg-[#4a3d8f]">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const PlanDetails = ({ plan, onClose }) => (
    <Sheet open={!!plan} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[600px] overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl">{plan?.title}</SheetTitle>
        </SheetHeader>

        {plan && (
          <div className="space-y-6">
            <img 
              src={plan.image} 
              alt={plan.title}
              className="w-full h-64 object-cover rounded-lg"
            />

            <div className="grid grid-cols-2 gap-4">
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
                  <li>• Fits within your entertainment budget allocation</li>
                  <li>• Aligns with your recent interest in {plan.vibe.toLowerCase()} activities</li>
                  <li>• Optimal timing based on your calendar and financial goals</li>
                  <li>• Great ROI for experience vs. cost</li>
                </ul>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Itinerary Highlights</h3>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <MapPin className="text-red-500" size={20} />
                    <span className="font-medium">Location Overview</span>
                  </div>
                  <p className="text-sm text-gray-600 ml-8">
                    Interactive map view with recommended spots, restaurants, and activities 
                    tailored to your budget and interests.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar className="text-blue-500" size={20} />
                    <span className="font-medium">Smart Scheduling</span>
                  </div>
                  <p className="text-sm text-gray-600 ml-8">
                    AI-optimized schedule that maximizes your experience while staying within budget.
                    Includes travel times and backup options.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <DollarSign className="text-green-500" size={20} />
                    <span className="font-medium">Budget Breakdown</span>
                  </div>
                  <div className="ml-8 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transportation</span>
                      <span className="font-medium">${Math.round(plan.estimatedBudget * 0.3)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Accommodation</span>
                      <span className="font-medium">${Math.round(plan.estimatedBudget * 0.4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Food & Activities</span>
                      <span className="font-medium">${Math.round(plan.estimatedBudget * 0.3)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Quick Actions</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <Button className="bg-[#5945a3] hover:bg-[#4a3d8f]">
                  Book Now
                </Button>
                <Button variant="outline">
                  Save for Later
                </Button>
                <Button variant="outline" className="col-span-2">
                  <Users size={16} className="mr-2" />
                  Invite Friends
                </Button>
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
                  based on your cash flow patterns.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Neurial Grotesk, sans-serif' }}>
          AI Planner
        </h1>
        <p className="text-gray-600">Let AI plan your perfect experiences within your budget</p>
      </div>

      {/* AI Summary Banner */}
      <Card className="bg-gradient-to-r from-[#5945a3] to-[#b37e91] text-white">
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
              <Calendar size={16} />
              <span>Next 3 months</span>
            </div>
            <div className="flex items-center gap-2">
              <Star size={16} />
              <span>Matches your vibe</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter Bar */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <span className="text-sm font-medium text-gray-700">Filter by:</span>
        <div className="flex gap-2">
          {['All', 'Relaxing', 'Professional', 'Family', 'Adventure'].map((filter) => (
            <Button
              key={filter}
              variant={filter === 'All' ? 'default' : 'outline'}
              size="sm"
              className={filter === 'All' ? 'bg-[#5945a3] hover:bg-[#4a3d8f]' : ''}
            >
              {filter}
            </Button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-gray-600">Budget Range:</span>
          <Button variant="outline" size="sm">$0-1K</Button>
          <Button variant="outline" size="sm">$1K-2K</Button>
          <Button variant="outline" size="sm">$2K+</Button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>

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
            <div className="text-center p-6 border rounded-lg hover:shadow-md transition-shadow">
              <Calendar className="w-8 h-8 mx-auto mb-3 text-blue-500" />
              <h3 className="font-semibold mb-2">Sync Calendars</h3>
              <p className="text-sm text-gray-600">Find dates that work for everyone</p>
            </div>
            <div className="text-center p-6 border rounded-lg hover:shadow-md transition-shadow">
              <DollarSign className="w-8 h-8 mx-auto mb-3 text-green-500" />
              <h3 className="font-semibold mb-2">Split Costs</h3>
              <p className="text-sm text-gray-600">Smart budget allocation and payment tracking</p>
            </div>
            <div className="text-center p-6 border rounded-lg hover:shadow-md transition-shadow">
              <Sparkles className="w-8 h-8 mx-auto mb-3 text-purple-500" />
              <h3 className="font-semibold mb-2">AI Consensus</h3>
              <p className="text-sm text-gray-600">Find plans everyone will love</p>
            </div>
          </div>
          <div className="text-center mt-6">
            <Button className="bg-gradient-to-r from-[#5945a3] to-[#b37e91] hover:opacity-90">
              <Users size={16} className="mr-2" />
              Start Group Planning
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Plan Details Drawer */}
      <PlanDetails 
        plan={selectedPlan} 
        onClose={() => setSelectedPlan(null)} 
      />
    </div>
  );
};

export default Planner;