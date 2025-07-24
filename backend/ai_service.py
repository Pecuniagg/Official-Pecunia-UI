import os
import openai
from typing import Optional, Dict, Any, List
import json
from datetime import datetime

class PecuniaAI:
    def __init__(self):
        self.client = openai.OpenAI(
            api_key=os.environ.get('OPENAI_API_KEY')
        )
        self.model = "gpt-4"
        
    async def get_financial_insights(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate personalized financial insights based on user data"""
        
        prompt = f"""
        As Pecunia AI, a sophisticated financial advisor, analyze this user's financial data and provide actionable insights:

        Financial Data:
        - Monthly Budget: ${user_data.get('monthly_budget', 5000)}
        - Monthly Income: ${user_data.get('monthly_income', 6500)}
        - Monthly Expenses: ${user_data.get('monthly_expenses', 3750)}
        - Savings Rate: {user_data.get('savings_rate', 23)}%
        - Pecunia Score: {user_data.get('pecunia_score', 782)}
        - Total Assets: ${user_data.get('total_assets', 56000)}
        - Total Liabilities: ${user_data.get('total_liabilities', 10000)}
        - Emergency Fund: ${user_data.get('emergency_fund', 8500)}
        - Age: {user_data.get('age', 28)}

        Expense Breakdown: {json.dumps(user_data.get('expenses', {}))}
        Current Goals: {json.dumps(user_data.get('goals', []))}

        Provide insights in JSON format with these sections:
        {{
            "summary": "Brief financial health summary",
            "insights": [
                {{
                    "type": "success|warning|info",
                    "title": "Insight title",
                    "description": "Detailed insight",
                    "action": "Recommended action",
                    "impact": "Expected impact"
                }}
            ],
            "recommendations": [
                {{
                    "category": "budgeting|saving|investing|debt",
                    "priority": "high|medium|low",
                    "title": "Recommendation title",
                    "description": "Detailed recommendation",
                    "steps": ["Step 1", "Step 2", "Step 3"]
                }}
            ],
            "predictions": {{
                "net_worth_1_year": "Predicted net worth in 1 year",
                "emergency_fund_completion": "When emergency fund will be complete",
                "retirement_readiness": "Assessment of retirement savings progress"
            }}
        }}

        Focus on being practical, encouraging, and specific with actionable advice.
        """
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are Pecunia AI, an expert financial advisor focused on helping users achieve their financial goals through personalized insights and recommendations."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=1500
            )
            
            content = response.choices[0].message.content
            return json.loads(content)
            
        except Exception as e:
            print(f"Error generating financial insights: {e}")
            return self._get_fallback_insights()
    
    async def analyze_spending_patterns(self, spending_data: List[Dict]) -> Dict[str, Any]:
        """Analyze spending patterns and provide insights"""
        
        prompt = f"""
        Analyze these spending patterns and provide insights:
        
        Recent Transactions: {json.dumps(spending_data)}
        
        Provide analysis in JSON format:
        {{
            "trends": [
                {{
                    "category": "Category name",
                    "trend": "increasing|decreasing|stable",
                    "percentage_change": "% change from last month",
                    "insight": "What this means for the user"
                }}
            ],
            "alerts": [
                {{
                    "type": "overspending|unusual_activity|opportunity",
                    "message": "Alert message",
                    "suggestion": "What to do about it"
                }}
            ],
            "optimization": [
                {{
                    "category": "Category to optimize",
                    "potential_savings": "Amount that could be saved",
                    "method": "How to achieve the savings"
                }}
            ]
        }}
        """
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a financial analyst specializing in spending pattern analysis."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.5,
                max_tokens=1000
            )
            
            return json.loads(response.choices[0].message.content)
            
        except Exception as e:
            print(f"Error analyzing spending patterns: {e}")
            return {"trends": [], "alerts": [], "optimization": []}
    
    async def generate_goal_strategy(self, goal_data: Dict[str, Any], user_context: Dict[str, Any]) -> Dict[str, Any]:
        """Generate strategy for achieving financial goals"""
        
        prompt = f"""
        Create a personalized strategy for this financial goal:
        
        Goal: {goal_data.get('title')}
        Target Amount: ${goal_data.get('target', 0)}
        Current Amount: ${goal_data.get('current', 0)}
        Deadline: {goal_data.get('deadline')}
        
        User Context:
        - Monthly Income: ${user_context.get('monthly_income', 6500)}
        - Monthly Expenses: ${user_context.get('monthly_expenses', 3750)}
        - Current Savings Rate: {user_context.get('savings_rate', 23)}%
        
        Provide strategy in JSON format:
        {{
            "feasibility": "achievable|challenging|needs_adjustment",
            "monthly_required": "Amount needed per month",
            "strategy": {{
                "primary_approach": "Main strategy description",
                "milestones": ["Month 1 milestone", "Month 3 milestone", "Month 6 milestone"],
                "optimization_tips": ["Tip 1", "Tip 2", "Tip 3"],
                "risk_factors": ["Risk 1", "Risk 2"]
            }},
            "alternatives": [
                {{
                    "title": "Alternative approach",
                    "description": "How this could work",
                    "trade_offs": "What you'd give up"
                }}
            ],
            "timeline_adjustment": "Recommended timeline if current is unrealistic"
        }}
        """
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a goal-setting expert who helps people achieve their financial objectives."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.6,
                max_tokens=1200
            )
            
            return json.loads(response.choices[0].message.content)
            
        except Exception as e:
            print(f"Error generating goal strategy: {e}")
            return {"feasibility": "achievable", "monthly_required": "0", "strategy": {}}
    
    async def create_travel_plan(self, preferences: Dict[str, Any]) -> Dict[str, Any]:
        """Generate personalized travel plans"""
        
        prompt = f"""
        Create a personalized travel plan based on these preferences:
        
        Budget: ${preferences.get('budget', 1500)}
        Duration: {preferences.get('duration', '3 days')}
        Location: {preferences.get('location', 'flexible')}
        Travel Style: {preferences.get('style', 'balanced')}
        Interests: {preferences.get('interests', [])}
        Group Size: {preferences.get('group_size', 2)}
        
        Provide plan in JSON format:
        {{
            "title": "Plan title",
            "description": "Brief description",
            "budget_breakdown": {{
                "transportation": "amount",
                "accommodation": "amount", 
                "food": "amount",
                "activities": "amount",
                "miscellaneous": "amount"
            }},
            "itinerary": [
                {{
                    "day": 1,
                    "activities": ["Activity 1", "Activity 2"],
                    "estimated_cost": "Daily cost",
                    "highlights": ["Key highlight 1", "Key highlight 2"]
                }}
            ],
            "tips": ["Tip 1", "Tip 2", "Tip 3"],
            "alternatives": ["Alternative option 1", "Alternative option 2"],
            "best_time_to_visit": "Seasonal recommendation",
            "local_insights": ["Local insight 1", "Local insight 2"]
        }}
        """
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a travel planning expert who creates detailed, budget-conscious travel experiences."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.8,
                max_tokens=1500
            )
            
            return json.loads(response.choices[0].message.content)
            
        except Exception as e:
            print(f"Error creating travel plan: {e}")
            return {"title": "Custom Plan", "description": "AI-generated travel plan"}
    
    async def generate_chat_response(self, message: str, user_context: Dict[str, Any] = None) -> str:
        """Generate conversational AI responses for the chat assistant"""
        
        context_info = ""
        if user_context:
            context_info = f"""
            User Context:
            - Pecunia Score: {user_context.get('pecunia_score', 'N/A')}
            - Monthly Budget: ${user_context.get('monthly_budget', 'N/A')}
            - Savings Rate: {user_context.get('savings_rate', 'N/A')}%
            - Current Goals: {user_context.get('active_goals', 'None set')}
            """
        
        prompt = f"""
        {context_info}
        
        User Message: {message}
        
        As Pecunia AI, provide a helpful, personalized response about personal finance, budgeting, savings, investments, or financial planning. 
        Be conversational, encouraging, and provide specific actionable advice when possible.
        Keep responses concise but informative (2-3 sentences max unless the user asks for detailed explanation).
        """
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are Pecunia AI, a friendly and knowledgeable financial advisor. You help users with budgeting, saving, investing, and achieving their financial goals. Always be encouraging and provide practical advice."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=300
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            print(f"Error generating chat response: {e}")
            return "I'm having trouble processing your request right now. Please try again in a moment!"
    
    def _get_fallback_insights(self) -> Dict[str, Any]:
        """Fallback insights when AI is unavailable"""
        return {
            "summary": "Your financial health looks good overall. Keep up the great work!",
            "insights": [
                {
                    "type": "success",
                    "title": "Strong Savings Rate",
                    "description": "Your savings rate is above average",
                    "action": "Continue maintaining this discipline",
                    "impact": "You're building wealth effectively"
                }
            ],
            "recommendations": [
                {
                    "category": "saving",
                    "priority": "medium",
                    "title": "Emergency Fund",
                    "description": "Continue building your emergency fund",
                    "steps": ["Set up automatic transfers", "Track progress monthly", "Celebrate milestones"]
                }
            ],
            "predictions": {
                "net_worth_1_year": "Expected to grow by 15-20%",
                "emergency_fund_completion": "On track for completion",
                "retirement_readiness": "Good progress for your age"
            }
        }

# Global AI instance
pecunia_ai = PecuniaAI()