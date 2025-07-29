import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { 
  Globe, 
  Briefcase, 
  Heart, 
  Target, 
  MessageSquare, 
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Check
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const OnboardingPage = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    country: '',
    financial_status: '',
    interests: [],
    usage_purpose: '',
    referral_source: '',
    expectations: ''
  });
  const [errors, setErrors] = useState({});
  const { completeOnboarding, bypassOnboarding, user } = useAuth();

  const countries = [
    'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 
    'France', 'Netherlands', 'Sweden', 'Norway', 'Switzerland', 'Japan',
    'Singapore', 'India', 'Brazil', 'Mexico', 'Other'
  ];

  const financialStatusOptions = [
    { value: 'student', label: 'Student' },
    { value: 'employed', label: 'Employed' },
    { value: 'self-employed', label: 'Self-employed' },
    { value: 'retired', label: 'Retired' },
    { value: 'unemployed', label: 'Unemployed' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say' }
  ];

  const interestOptions = [
    'Travelling', 'Dining', 'Tech', 'Fitness', 'Fashion', 'Music', 'Art',
    'Sports', 'Reading', 'Photography', 'Cooking', 'Gaming', 'Movies',
    'Investing', 'Real Estate', 'Entrepreneurship'
  ];

  const referralSources = [
    { value: 'instagram', label: 'Instagram' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'friend', label: 'From a friend' },
    { value: 'google', label: 'Google Search' },
    { value: 'other', label: 'Other' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.country) {
      newErrors.country = 'Please select your country';
    }

    if (!formData.financial_status) {
      newErrors.financial_status = 'Please select your financial status';
    }

    if (formData.interests.length === 0) {
      newErrors.interests = 'Please select at least one interest';
    }

    if (!formData.usage_purpose || formData.usage_purpose.trim().length < 10) {
      newErrors.usage_purpose = 'Please provide at least 10 characters describing how you\'ll use Pecunia';
    }

    if (!formData.referral_source) {
      newErrors.referral_source = 'Please select how you heard about Pecunia';
    }

    if (!formData.expectations || formData.expectations.trim().length < 10) {
      newErrors.expectations = 'Please provide at least 10 characters describing your expectations';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInterestToggle = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
    
    if (errors.interests) {
      setErrors(prev => ({ ...prev, interests: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await completeOnboarding(formData);
      if (result.success) {
        // Navigation will be handled by the main App component
      }
    } catch (error) {
      console.error('Onboarding error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBypassOnboarding = async () => {
    setLoading(true);
    try {
      await bypassOnboarding();
      // The App.js will automatically redirect to dashboard since onboardingComplete becomes true
    } catch (error) {
      console.error('Bypass onboarding error:', error);
    } finally {
      setLoading(false);
    }
  };

  const progressPercentage = (() => {
    let completed = 0;
    if (formData.country) completed++;
    if (formData.financial_status) completed++;
    if (formData.interests.length > 0) completed++;
    if (formData.usage_purpose.length >= 10) completed++;
    if (formData.referral_source) completed++;
    if (formData.expectations.length >= 10) completed++;
    return (completed / 6) * 100;
  })();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-[#5945a3] to-[#b37e91] rounded-2xl">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome, {user?.name}!</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Let's personalize your Pecunia experience</p>
            </div>
          </div>
          
          {/* Progress Indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>Getting to know you</span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-[#5945a3] to-[#b37e91] h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Onboarding Form */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Country Selection */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-[#5945a3]" />
                  <Label className="text-lg font-semibold text-gray-900 dark:text-white">
                    Where are you located?
                  </Label>
                </div>
                <select
                  value={formData.country}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, country: e.target.value }));
                    if (errors.country) setErrors(prev => ({ ...prev, country: '' }));
                  }}
                  className={`w-full h-12 px-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-[#5945a3] focus:ring-[#5945a3] text-gray-900 dark:text-white ${
                    errors.country ? 'border-red-500' : ''
                  }`}
                  disabled={loading}
                >
                  <option value="">Select your country</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
                {errors.country && (
                  <p className="text-sm text-red-500">{errors.country}</p>
                )}
              </div>

              {/* Financial Status */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-[#5945a3]" />
                  <Label className="text-lg font-semibold text-gray-900 dark:text-white">
                    What's your current financial status?
                  </Label>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {financialStatusOptions.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, financial_status: option.value }));
                        if (errors.financial_status) setErrors(prev => ({ ...prev, financial_status: '' }));
                      }}
                      className={`p-4 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${
                        formData.financial_status === option.value
                          ? 'border-[#5945a3] bg-purple-50 dark:bg-purple-900/20 text-[#5945a3]'
                          : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-[#5945a3]/50'
                      }`}
                      disabled={loading}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                {errors.financial_status && (
                  <p className="text-sm text-red-500">{errors.financial_status}</p>
                )}
              </div>

              {/* Interests */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-[#5945a3]" />
                  <Label className="text-lg font-semibold text-gray-900 dark:text-white">
                    What are your interests and hobbies?
                  </Label>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Select all that apply. This helps us provide personalized financial advice.
                </p>
                <div className="flex flex-wrap gap-2">
                  {interestOptions.map(interest => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => handleInterestToggle(interest)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        formData.interests.includes(interest)
                          ? 'bg-[#5945a3] text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30'
                      }`}
                      disabled={loading}
                    >
                      {formData.interests.includes(interest) && (
                        <Check className="inline h-3 w-3 mr-1" />
                      )}
                      {interest}
                    </button>
                  ))}
                </div>
                {errors.interests && (
                  <p className="text-sm text-red-500">{errors.interests}</p>
                )}
              </div>

              {/* Usage Purpose */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-[#5945a3]" />
                  <Label className="text-lg font-semibold text-gray-900 dark:text-white">
                    What will you primarily use Pecunia for?
                  </Label>
                </div>
                <Textarea
                  placeholder="E.g., Track my spending, plan for retirement, manage investments, save for a house..."
                  value={formData.usage_purpose}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, usage_purpose: e.target.value }));
                    if (errors.usage_purpose) setErrors(prev => ({ ...prev, usage_purpose: '' }));
                  }}
                  className={`min-h-24 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-[#5945a3] focus:ring-[#5945a3] ${
                    errors.usage_purpose ? 'border-red-500' : ''
                  }`}
                  disabled={loading}
                />
                {errors.usage_purpose && (
                  <p className="text-sm text-red-500">{errors.usage_purpose}</p>
                )}
              </div>

              {/* Referral Source */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-[#5945a3]" />
                  <Label className="text-lg font-semibold text-gray-900 dark:text-white">
                    How did you hear about Pecunia?
                  </Label>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {referralSources.map(source => (
                    <button
                      key={source.value}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, referral_source: source.value }));
                        if (errors.referral_source) setErrors(prev => ({ ...prev, referral_source: '' }));
                      }}
                      className={`p-4 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${
                        formData.referral_source === source.value
                          ? 'border-[#5945a3] bg-purple-50 dark:bg-purple-900/20 text-[#5945a3]'
                          : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-[#5945a3]/50'
                      }`}
                      disabled={loading}
                    >
                      {source.label}
                    </button>
                  ))}
                </div>
                {errors.referral_source && (
                  <p className="text-sm text-red-500">{errors.referral_source}</p>
                )}
              </div>

              {/* Expectations */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-[#5945a3]" />
                  <Label className="text-lg font-semibold text-gray-900 dark:text-white">
                    What do you expect from Pecunia?
                  </Label>
                </div>
                <Textarea
                  placeholder="E.g., Better budgeting insights, AI-powered financial advice, goal tracking, investment recommendations..."
                  value={formData.expectations}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, expectations: e.target.value }));
                    if (errors.expectations) setErrors(prev => ({ ...prev, expectations: '' }));
                  }}
                  className={`min-h-24 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-[#5945a3] focus:ring-[#5945a3] ${
                    errors.expectations ? 'border-red-500' : ''
                  }`}
                  disabled={loading}
                />
                {errors.expectations && (
                  <p className="text-sm text-red-500">{errors.expectations}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={loading || progressPercentage < 100}
                  className="w-full h-12 bg-gradient-to-r from-[#5945a3] to-[#6b59a8] hover:from-[#4a3d8f] hover:to-[#5945a3] text-white font-medium shadow-sm hover:shadow-md transition-all duration-200"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Completing Setup...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>Complete Setup & Enter Pecunia</span>
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  )}
                </Button>
                
                {progressPercentage < 100 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-3">
                    Please complete all sections to continue
                  </p>
                )}

                {/* Bypass Onboarding Button */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-6">
                  <Button
                    type="button"
                    onClick={handleBypassOnboarding}
                    disabled={loading}
                    className="w-full h-12 bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:from-[#d97706] hover:to-[#b45309] text-white font-medium shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Bypassing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        <span>Skip Onboarding & Go to Dashboard</span>
                      </div>
                    )}
                  </Button>
                  <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
                    Skip onboarding and go directly to your dashboard
                  </p>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Your responses help us provide personalized financial insights and recommendations
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;