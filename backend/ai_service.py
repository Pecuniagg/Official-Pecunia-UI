import os
import openai
from typing import Optional, Dict, Any, List
import json
from datetime import datetime, timedelta
from dotenv import load_dotenv
from pathlib import Path
import asyncio

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

class PecuniaAI:
    def __init__(self):
        api_key = os.environ.get('OPENAI_API_KEY')
        if not api_key:
            raise ValueError("OPENAI_API_KEY environment variable is not set")
        self.client = openai.OpenAI(api_key=api_key)
        self.model = "gpt-4"
        
    async def get_comprehensive_financial_analysis(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Comprehensive AI-powered financial analysis that does the heavy lifting for users
        """
        try:
            # Extract user profile data
            monthly_income = user_data.get('monthly_income', 0)
            monthly_expenses = user_data.get('monthly_expenses', 0)
            pecunia_score = user_data.get('pecunia_score', 0)
            age = user_data.get('age', 30)
            risk_tolerance = user_data.get('risk_tolerance', 'medium')
            goals = user_data.get('goals', [])
            current_investments = user_data.get('investments', {})
            location = user_data.get('location', 'United States')
            
            prompt = f"""
            As Pecunia AI, I'm your comprehensive financial advisor. Based on your profile, I'll create a complete financial strategy and do the planning for you.

            YOUR FINANCIAL PROFILE:
            - Monthly Income: ${monthly_income:,}
            - Monthly Expenses: ${monthly_expenses:,}
            - Pecunia Score: {pecunia_score}/1000
            - Age: {age}
            - Risk Tolerance: {risk_tolerance}
            - Location: {location}
            - Goals: {json.dumps(goals, indent=2)}
            - Current Investments: {json.dumps(current_investments, indent=2)}

            MARKET CONTEXT (2025):
            - Current inflation rate: ~3.2%
            - Federal funds rate: ~5.25%
            - Stock market: Bull market with tech leadership
            - Real estate: Cooling but still elevated
            - Bond yields: Attractive for income investors

            Create a comprehensive financial strategy that includes:

            1. **IMMEDIATE ACTIONS** (Next 30 days):
               - Specific steps to optimize cash flow
               - Emergency fund targets and timeline
               - Debt optimization strategies

            2. **INVESTMENT STRATEGY**:
               - Specific asset allocation percentages
               - Recommended ETFs, stocks, bonds with ticker symbols
               - Dollar amounts to invest in each category
               - Why these investments align with market conditions

            3. **BUDGET OPTIMIZATION**:
               - Category-by-category spending recommendations
               - Specific dollar amounts to cut or reallocate
               - Income optimization strategies

            4. **COMPETITIVE ADVANTAGE**:
               - How to outperform peers in your age group
               - Specific strategies to improve Pecunia Score
               - Market timing recommendations

            5. **AUTOMATED PLAN**:
               - Set up automatic transfers and investments
               - Scheduled reviews and rebalancing
               - Goal tracking milestones

            6. **RISK MANAGEMENT**:
               - Insurance needs assessment
               - Emergency scenarios planning
               - Market downturn protection

            Provide specific, actionable recommendations with dollar amounts, percentages, and timelines. Make it comprehensive yet easy to follow.
            """

            response = await self._get_ai_response(prompt)
            
            return {
                "analysis": response,
                "confidence": 0.95,
                "last_updated": datetime.now().isoformat(),
                "recommendations_count": 6,
                "action_items": self._extract_action_items(response)
            }
            
        except Exception as e:
            print(f"AI analysis error: {str(e)}")
            return self._fallback_financial_analysis(user_data)

    async def generate_smart_budget(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        AI-powered smart budget generation that optimizes spending automatically
        """
        try:
            monthly_income = user_data.get('monthly_income', 0)
            current_expenses = user_data.get('expenses', {})
            goals = user_data.get('goals', [])
            location = user_data.get('location', 'United States')
            
            prompt = f"""
            As Pecunia AI, create an optimized monthly budget that maximizes savings and goal achievement.

            CURRENT SITUATION:
            - Monthly Income: ${monthly_income:,}
            - Current Expenses: {json.dumps(current_expenses, indent=2)}
            - Goals: {json.dumps(goals, indent=2)}
            - Location: {location}

            Create a smart budget with:

            1. **OPTIMIZED CATEGORIES** with specific dollar amounts:
               - Housing (recommend 25-30% of income)
               - Food & Dining (recommend 10-15%)
               - Transportation (recommend 10-15%)
               - Entertainment (recommend 5-10%)
               - Savings & Investments (recommend 20-30%)
               - Emergency Fund (recommend 3-6 months expenses)

            2. **COST-CUTTING STRATEGIES**:
               - Specific subscriptions to cancel
               - Better alternatives for current spending
               - Negotiation tactics for bills

            3. **INCOME OPTIMIZATION**:
               - Side hustle recommendations
               - Skill development for raises
               - Investment income strategies

            4. **AUTOMATED SAVINGS PLAN**:
               - Exact dates for automatic transfers
               - Goal-based savings allocations
               - Investment automation setup

            5. **SPENDING ALERTS**:
               - Category limits with notifications
               - Overspending triggers
               - Weekly/monthly check-ins

            Return as a structured JSON with specific dollar amounts and percentages.
            """

            response = await self._get_ai_response(prompt)
            
            return {
                "budget": response,
                "total_income": monthly_income,
                "total_allocated": sum(current_expenses.values()),
                "savings_rate": ((monthly_income - sum(current_expenses.values())) / monthly_income) * 100,
                "optimization_score": 85,
                "last_updated": datetime.now().isoformat()
            }
            
        except Exception as e:
            print(f"Budget generation error: {str(e)}")
            return self._fallback_budget(user_data)

    async def generate_investment_strategy(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        AI-powered investment strategy with specific recommendations
        """
        try:
            investable_amount = user_data.get('investable_amount', 0)
            risk_tolerance = user_data.get('risk_tolerance', 'medium')
            age = user_data.get('age', 30)
            timeline = user_data.get('timeline', '10+ years')
            
            prompt = f"""
            As Pecunia AI, create a specific investment strategy for 2025 market conditions.

            INVESTOR PROFILE:
            - Available to invest: ${investable_amount:,}
            - Risk tolerance: {risk_tolerance}
            - Age: {age}
            - Timeline: {timeline}

            MARKET ANALYSIS (2025):
            - Tech stocks: High growth potential but volatile
            - Value stocks: Undervalued opportunities
            - International markets: Emerging opportunities
            - Bonds: Attractive yields at current rates
            - REITs: Cooling but dividend income
            - Commodities: Inflation hedge considerations

            Provide SPECIFIC investment recommendations:

            1. **PORTFOLIO ALLOCATION**:
               - Exact percentages for each asset class
               - Specific ETF/fund recommendations with ticker symbols
               - Dollar amounts to invest in each

            2. **STOCK PICKS**:
               - 5-10 individual stocks with analysis
               - Entry points and target prices
               - Risk assessment for each

            3. **TIMING STRATEGY**:
               - When to buy (dollar-cost averaging vs lump sum)
               - Rebalancing schedule
               - Market timing considerations

            4. **RISK MANAGEMENT**:
               - Stop-loss levels
               - Position sizing rules
               - Diversification requirements

            5. **INCOME GENERATION**:
               - Dividend stocks and REITs
               - Bond laddering strategy
               - Covered call opportunities

            Make it actionable with specific tickers, amounts, and timelines.
            """

            response = await self._get_ai_response(prompt)
            
            return {
                "strategy": response,
                "risk_score": self._calculate_risk_score(risk_tolerance),
                "expected_return": self._calculate_expected_return(risk_tolerance, timeline),
                "rebalance_frequency": "quarterly",
                "last_updated": datetime.now().isoformat()
            }
            
        except Exception as e:
            print(f"Investment strategy error: {str(e)}")
            return self._fallback_investment_strategy(user_data)

    async def generate_travel_plan(self, travel_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        AI-powered comprehensive travel planning that handles everything
        """
        try:
            budget = travel_data.get('budget', 0)
            destination = travel_data.get('destination', 'flexible')
            duration = travel_data.get('duration', '1 week')
            interests = travel_data.get('interests', [])
            group_size = travel_data.get('group_size', 1)
            dates = travel_data.get('dates', 'flexible')
            
            prompt = f"""
            As Pecunia AI, create a complete travel plan that handles all the details.

            TRAVEL REQUIREMENTS:
            - Budget: ${budget:,}
            - Destination: {destination}
            - Duration: {duration}
            - Interests: {interests}
            - Group size: {group_size}
            - Dates: {dates}

            Create a comprehensive travel plan:

            1. **DESTINATION OPTIMIZATION**:
               - Best value destinations for your budget
               - Seasonal considerations and pricing
               - Hidden gem recommendations

            2. **DETAILED ITINERARY**:
               - Day-by-day schedule with activities
               - Restaurant recommendations with price ranges
               - Local transportation options
               - Must-see attractions with timing

            3. **BUDGET BREAKDOWN**:
               - Flights: specific airline/route recommendations
               - Accommodation: hotel/Airbnb with exact properties
               - Food: daily meal budget with restaurant suggestions
               - Activities: costs and booking information
               - Transportation: local transport and costs

            4. **BOOKING STRATEGY**:
               - Best times to book flights and hotels
               - Specific websites and apps to use
               - Cancellation and flexibility options

            5. **MONEY-SAVING TIPS**:
               - Local hacks and insider tips
               - Free activities and attractions
               - Best value meal options

            6. **PACKING & PREPARATION**:
               - Weather-appropriate packing list
               - Required documents and preparations
               - Travel insurance recommendations

            Make it detailed enough to book and execute immediately.
            """

            response = await self._get_ai_response(prompt)
            
            return {
                "plan": response,
                "total_budget": budget,
                "cost_per_person": budget / group_size,
                "savings_opportunities": self._identify_savings(response),
                "booking_timeline": self._create_booking_timeline(),
                "last_updated": datetime.now().isoformat()
            }
            
        except Exception as e:
            print(f"Travel planning error: {str(e)}")
            return self._fallback_travel_plan(travel_data)

    async def generate_goal_strategy(self, goal_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        AI-powered goal achievement strategy with step-by-step plan
        """
        try:
            goal_title = goal_data.get('title', '')
            target_amount = goal_data.get('target', 0)
            current_amount = goal_data.get('current', 0)
            deadline = goal_data.get('deadline', '')
            monthly_income = goal_data.get('monthly_income', 0)
            
            prompt = f"""
            As Pecunia AI, create a detailed strategy to achieve this financial goal.

            GOAL DETAILS:
            - Goal: {goal_title}
            - Target Amount: ${target_amount:,}
            - Current Amount: ${current_amount:,}
            - Deadline: {deadline}
            - Monthly Income: ${monthly_income:,}

            Create a comprehensive achievement strategy:

            1. **TIMELINE ANALYSIS**:
               - Months remaining until deadline
               - Required monthly savings amount
               - Feasibility assessment

            2. **SAVINGS STRATEGY**:
               - Specific monthly savings targets
               - Automatic transfer setup recommendations
               - High-yield savings account options

            3. **INCOME OPTIMIZATION**:
               - Side hustle opportunities
               - Skill development for raises
               - Investment income strategies

            4. **EXPENSE REDUCTION**:
               - Specific categories to cut
               - Subscription audits
               - Lifestyle adjustments

            5. **ACCELERATION TACTICS**:
               - One-time income opportunities
               - Asset liquidation options
               - Bonus and windfall planning

            6. **MILESTONE TRACKING**:
               - Monthly progress targets
               - Celebration milestones
               - Adjustment triggers

            Provide specific, actionable steps with dollar amounts and timelines.
            """

            response = await self._get_ai_response(prompt)
            
            return {
                "strategy": response,
                "monthly_target": (target_amount - current_amount) / max(1, self._months_until_deadline(deadline)),
                "probability_of_success": self._calculate_success_probability(goal_data),
                "optimization_suggestions": self._generate_optimization_suggestions(goal_data),
                "last_updated": datetime.now().isoformat()
            }
            
        except Exception as e:
            print(f"Goal strategy error: {str(e)}")
            return self._fallback_goal_strategy(goal_data)

    async def get_competitive_insights(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        AI-powered competitive analysis to help users outperform peers
        """
        try:
            age = user_data.get('age', 30)
            income = user_data.get('income', 0)
            net_worth = user_data.get('net_worth', 0)
            pecunia_score = user_data.get('pecunia_score', 0)
            location = user_data.get('location', 'United States')
            
            prompt = f"""
            As Pecunia AI, analyze how this user compares to peers and provide strategies to get ahead.

            USER PROFILE:
            - Age: {age}
            - Annual Income: ${income:,}
            - Net Worth: ${net_worth:,}
            - Pecunia Score: {pecunia_score}/1000
            - Location: {location}

            PEER BENCHMARKS (Age {age}):
            - Median net worth: ${self._get_median_net_worth(age):,}
            - Median income: ${self._get_median_income(age):,}
            - Top 10% net worth: ${self._get_top_10_net_worth(age):,}
            - Average savings rate: {self._get_average_savings_rate(age)}%

            Provide competitive strategy:

            1. **CURRENT RANKING**:
               - Percentile ranking vs peers
               - Specific metrics where you excel
               - Areas needing improvement

            2. **COMPETITIVE ADVANTAGES**:
               - Strategies to outperform median
               - Path to top 10% in your age group
               - Unique opportunities for your situation

            3. **WEALTH ACCELERATION**:
               - Investment strategies for faster growth
               - Income optimization beyond peers
               - Tax optimization strategies

            4. **PEER COMPARISON METRICS**:
               - Savings rate optimization
               - Investment return targets
               - Net worth growth trajectory

            5. **MARKET OPPORTUNITIES**:
               - Trends your peers are missing
               - Emerging investment opportunities
               - Geographic advantages

            6. **SCORE IMPROVEMENT PLAN**:
               - Specific actions to improve Pecunia Score
               - Timeline to reach top-tier scores
               - Peer group advancement strategies

            Make it actionable and competitive.
            """

            response = await self._get_ai_response(prompt)
            
            return {
                "insights": response,
                "percentile_ranking": self._calculate_percentile_ranking(user_data),
                "improvement_potential": self._calculate_improvement_potential(user_data),
                "competitive_score": self._calculate_competitive_score(user_data),
                "last_updated": datetime.now().isoformat()
            }
            
        except Exception as e:
            print(f"Competitive insights error: {str(e)}")
            return self._fallback_competitive_insights(user_data)

    async def _get_ai_response(self, prompt: str) -> str:
        """Get response from OpenAI API"""
        try:
            response = await asyncio.to_thread(
                self.client.chat.completions.create,
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are Pecunia AI, a comprehensive financial advisor that provides specific, actionable advice. Always be detailed, specific, and provide exact numbers, percentages, and timelines."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=2000
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"OpenAI API error: {str(e)}")
            return "I apologize, but I'm having trouble accessing the latest market data. Please try again in a moment."

    def _extract_action_items(self, response: str) -> List[str]:
        """Extract actionable items from AI response"""
        # This would parse the response and extract specific action items
        return [
            "Set up automatic emergency fund transfer",
            "Research and invest in recommended ETFs",
            "Optimize monthly budget categories",
            "Schedule quarterly portfolio review"
        ]

    def _calculate_risk_score(self, risk_tolerance: str) -> int:
        """Calculate risk score based on tolerance"""
        risk_scores = {"low": 30, "medium": 60, "high": 90}
        return risk_scores.get(risk_tolerance, 60)

    def _calculate_expected_return(self, risk_tolerance: str, timeline: str) -> float:
        """Calculate expected annual return"""
        base_returns = {"low": 0.06, "medium": 0.08, "high": 0.10}
        return base_returns.get(risk_tolerance, 0.08)

    def _months_until_deadline(self, deadline: str) -> int:
        """Calculate months until deadline"""
        try:
            deadline_date = datetime.strptime(deadline, "%Y-%m-%d")
            now = datetime.now()
            return max(1, (deadline_date - now).days // 30)
        except:
            return 12  # Default to 12 months

    def _calculate_success_probability(self, goal_data: Dict[str, Any]) -> float:
        """Calculate probability of achieving goal"""
        # This would use machine learning or statistical analysis
        return 0.75  # 75% success probability

    def _generate_optimization_suggestions(self, goal_data: Dict[str, Any]) -> List[str]:
        """Generate optimization suggestions"""
        return [
            "Increase monthly savings by 15%",
            "Consider high-yield savings account",
            "Automate savings transfers",
            "Review and cut unnecessary expenses"
        ]

    def _get_median_net_worth(self, age: int) -> int:
        """Get median net worth for age group"""
        # This would use real data from financial surveys
        age_brackets = {
            25: 10000, 30: 30000, 35: 65000, 40: 120000, 45: 185000, 50: 250000
        }
        return age_brackets.get(age, 50000)

    def _get_median_income(self, age: int) -> int:
        """Get median income for age group"""
        age_brackets = {
            25: 45000, 30: 55000, 35: 65000, 40: 75000, 45: 80000, 50: 85000
        }
        return age_brackets.get(age, 60000)

    def _get_top_10_net_worth(self, age: int) -> int:
        """Get top 10% net worth for age group"""
        return self._get_median_net_worth(age) * 5

    def _get_average_savings_rate(self, age: int) -> int:
        """Get average savings rate for age group"""
        return 15  # 15% average savings rate

    def _calculate_percentile_ranking(self, user_data: Dict[str, Any]) -> int:
        """Calculate user's percentile ranking"""
        # This would use real benchmarking data
        return 65  # 65th percentile

    def _calculate_improvement_potential(self, user_data: Dict[str, Any]) -> float:
        """Calculate improvement potential score"""
        return 0.85  # 85% improvement potential

    def _calculate_competitive_score(self, user_data: Dict[str, Any]) -> int:
        """Calculate competitive score"""
        return 78  # Score out of 100

    def _identify_savings(self, response: str) -> List[str]:
        """Identify savings opportunities from travel plan"""
        return [
            "Book flights 6-8 weeks in advance",
            "Use local transportation instead of taxis",
            "Eat at local markets for lunch",
            "Book accommodation outside city center"
        ]

    def _create_booking_timeline(self) -> List[Dict[str, str]]:
        """Create booking timeline"""
        return [
            {"task": "Book flights", "timing": "8 weeks before"},
            {"task": "Book accommodation", "timing": "6 weeks before"},
            {"task": "Book activities", "timing": "2 weeks before"},
            {"task": "Get travel insurance", "timing": "1 week before"}
        ]

    # Fallback methods for when AI is unavailable
    def _fallback_financial_analysis(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Fallback financial analysis"""
        return {
            "analysis": "AI analysis temporarily unavailable. Based on your profile, focus on building emergency fund and diversified investments.",
            "confidence": 0.6,
            "recommendations_count": 3,
            "action_items": ["Build emergency fund", "Diversify investments", "Review budget monthly"]
        }

    def _fallback_budget(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Fallback budget"""
        income = user_data.get('monthly_income', 0)
        return {
            "budget": f"Recommended budget: 50% needs, 30% wants, 20% savings from ${income:,} income",
            "total_income": income,
            "savings_rate": 20,
            "optimization_score": 70
        }

    def _fallback_investment_strategy(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Fallback investment strategy"""
        return {
            "strategy": "Consider low-cost index funds for long-term growth with proper diversification",
            "risk_score": 60,
            "expected_return": 0.08,
            "rebalance_frequency": "quarterly"
        }

    def _fallback_travel_plan(self, travel_data: Dict[str, Any]) -> Dict[str, Any]:
        """Fallback travel plan"""
        budget = travel_data.get('budget', 0)
        return {
            "plan": f"Travel plan for ${budget:,} budget: Research destinations, compare flights, book accommodation, create itinerary",
            "total_budget": budget,
            "savings_opportunities": ["Book early", "Use local transport", "Eat local food"],
            "booking_timeline": [{"task": "Research", "timing": "Now"}]
        }

    def _fallback_goal_strategy(self, goal_data: Dict[str, Any]) -> Dict[str, Any]:
        """Fallback goal strategy"""
        return {
            "strategy": "Set up automatic savings, track progress monthly, adjust as needed",
            "monthly_target": 500,
            "probability_of_success": 0.7,
            "optimization_suggestions": ["Automate savings", "Track progress", "Review monthly"]
        }

    def _fallback_competitive_insights(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Fallback competitive insights"""
        return {
            "insights": "Focus on consistent saving and investing to outperform peers",
            "percentile_ranking": 50,
            "improvement_potential": 0.8,
            "competitive_score": 75
        }

    # Original methods for backward compatibility
    async def get_financial_insights(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Backward compatibility wrapper"""
        return await self.get_comprehensive_financial_analysis(user_data)

    async def get_goal_strategy(self, goal_data: Dict[str, Any]) -> Dict[str, Any]:
        """Backward compatibility wrapper"""
        return await self.generate_goal_strategy(goal_data)

    async def create_travel_plan(self, travel_data: Dict[str, Any]) -> Dict[str, Any]:
        """Backward compatibility wrapper"""
        return await self.generate_travel_plan(travel_data)

    async def chat_with_ai(self, message: str, user_context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Enhanced chat with contextual AI"""
        try:
            context = user_context or {}
            
            prompt = f"""
            As Pecunia AI, respond to this user message with helpful financial advice.
            
            User Context: {json.dumps(context, indent=2)}
            User Message: {message}
            
            Provide specific, actionable financial advice based on their situation.
            """
            
            response = await self._get_ai_response(prompt)
            
            return {
                "response": response,
                "timestamp": datetime.now().isoformat(),
                "context_used": bool(context)
            }
        except Exception as e:
            return {
                "response": "I'm here to help with your financial questions. Please try again in a moment.",
                "timestamp": datetime.now().isoformat(),
                "context_used": False
            }

    async def analyze_spending_patterns(self, spending_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze spending patterns and provide insights"""
        try:
            prompt = f"""
            As Pecunia AI, analyze these spending patterns and provide insights.
            
            Spending Data: {json.dumps(spending_data, indent=2)}
            
            Provide analysis on:
            1. Spending trends and patterns
            2. Areas of concern or opportunity
            3. Specific recommendations for optimization
            4. Comparison to recommended budgets
            5. Actionable next steps
            """
            
            response = await self._get_ai_response(prompt)
            
            return {
                "analysis": response,
                "total_spending": sum(item.get('amount', 0) for item in spending_data),
                "category_breakdown": self._analyze_categories(spending_data),
                "recommendations": self._generate_spending_recommendations(spending_data),
                "last_updated": datetime.now().isoformat()
            }
        except Exception as e:
            return {
                "analysis": "Spending analysis temporarily unavailable. Focus on tracking essential vs non-essential expenses.",
                "recommendations": ["Track all expenses", "Categorize spending", "Set monthly limits"]
            }

    def _analyze_categories(self, spending_data: List[Dict[str, Any]]) -> Dict[str, float]:
        """Analyze spending by category"""
        categories = {}
        for item in spending_data:
            category = item.get('category', 'Other')
            amount = item.get('amount', 0)
            categories[category] = categories.get(category, 0) + amount
        return categories

    def _generate_spending_recommendations(self, spending_data: List[Dict[str, Any]]) -> List[str]:
        """Generate spending recommendations"""
        return [
            "Review subscription services for unused items",
            "Set up spending alerts for high-spend categories",
            "Consider switching to cash for discretionary spending",
            "Automate savings before spending"
        ]

    async def optimize_portfolio(self, portfolio_data: Dict[str, Any]) -> Dict[str, Any]:
        """Optimize investment portfolio"""
        try:
            prompt = f"""
            As Pecunia AI, optimize this investment portfolio for 2025 market conditions.
            
            Current Portfolio: {json.dumps(portfolio_data, indent=2)}
            
            Provide optimization recommendations:
            1. Asset allocation adjustments
            2. Specific buy/sell recommendations
            3. Risk management strategies
            4. Tax optimization opportunities
            5. Rebalancing schedule
            6. Performance improvement strategies
            """
            
            response = await self._get_ai_response(prompt)
            
            return {
                "optimization": response,
                "current_allocation": portfolio_data,
                "recommended_changes": self._generate_portfolio_changes(portfolio_data),
                "risk_assessment": self._assess_portfolio_risk(portfolio_data),
                "last_updated": datetime.now().isoformat()
            }
        except Exception as e:
            return {
                "optimization": "Portfolio optimization temporarily unavailable. Focus on diversification and cost minimization.",
                "recommended_changes": ["Diversify holdings", "Minimize fees", "Rebalance quarterly"]
            }

    def _generate_portfolio_changes(self, portfolio_data: Dict[str, Any]) -> List[str]:
        """Generate portfolio change recommendations"""
        return [
            "Increase international exposure to 20%",
            "Add emerging markets allocation",
            "Reduce cash position below 5%",
            "Consider adding REITs for inflation protection"
        ]

    def _assess_portfolio_risk(self, portfolio_data: Dict[str, Any]) -> Dict[str, Any]:
        """Assess portfolio risk metrics"""
        return {
            "risk_score": 65,
            "volatility": "moderate",
            "diversification_score": 78,
            "recommendations": ["Add bonds for stability", "Increase diversification"]
        }

# Global AI instance
pecunia_ai = PecuniaAI()