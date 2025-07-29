import logging
import traceback
from fastapi import FastAPI, HTTPException, Depends, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import json
from datetime import datetime, timedelta
import uuid
import asyncio
import httpx
import os
from dotenv import load_dotenv

# Import authentication service
from auth_service import (
    AuthService, 
    UserRegister, 
    UserLogin, 
    OnboardingData,
    Token,
    UserResponse,
    get_current_user,
    verify_token
)

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(title="Pecunia API", version="1.0.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# ================================
# AUTHENTICATION ENDPOINTS
# ================================

@app.post("/api/auth/register", response_model=Dict[str, Any])
async def register(user_data: UserRegister):
    """Register a new user"""
    try:
        result = AuthService.register_user(user_data)
        logger.info(f"User registered successfully: {user_data.email}")
        return result
    except HTTPException as e:
        logger.error(f"Registration failed: {e.detail}")
        raise e
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed"
        )

@app.post("/api/auth/login", response_model=Dict[str, Any])
async def login(login_data: UserLogin):
    """Login user"""
    try:
        result = AuthService.login_user(login_data)
        logger.info(f"User logged in successfully: {login_data.email}")
        return result
    except HTTPException as e:
        logger.error(f"Login failed: {e.detail}")
        raise e
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed"
        )

@app.post("/api/auth/onboarding")
async def complete_onboarding(
    onboarding_data: OnboardingData,
    current_user: dict = Depends(get_current_user)
):
    """Complete user onboarding"""
    try:
        result = AuthService.complete_onboarding(onboarding_data, current_user)
        logger.info(f"Onboarding completed for user: {current_user['email']}")
        return result
    except Exception as e:
        logger.error(f"Onboarding error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Onboarding failed"
        )

@app.get("/api/auth/profile", response_model=Dict[str, Any])
async def get_profile(current_user: dict = Depends(get_current_user)):
    """Get user profile"""
    try:
        result = AuthService.get_user_profile(current_user)
        return result
    except Exception as e:
        logger.error(f"Profile fetch error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch profile"
        )

@app.get("/api/auth/verify")
async def verify_auth(current_user: dict = Depends(get_current_user)):
    """Verify authentication status"""
    return {
        "is_authenticated": True,
        "onboarding_complete": current_user.get("onboarding_complete", False),
        "user": {
            "id": current_user["id"],
            "name": current_user["name"],
            "email": current_user["email"]
        }
    }

# ================================
# EXISTING AI ENDPOINTS
# ================================

# User context storage
user_contexts = {}

class UserContext(BaseModel):
    monthly_income: Optional[float] = None
    monthly_expenses: Optional[float] = None
    expenses: Optional[Dict[str, float]] = None
    assets: Optional[Dict[str, float]] = None
    liabilities: Optional[Dict[str, float]] = None

class UserProfile(BaseModel):
    monthly_budget: Optional[float] = None
    emergency_fund: Optional[float] = None
    
class FinancialQuery(BaseModel):
    query: str
    context: Optional[str] = None

class TravelRequest(BaseModel):
    destination: str = "flexible"
    budget: float = 2000
    duration: str = "1 week"
    interests: List[str] = Field(default_factory=lambda: ["sightseeing", "food"])
    group_size: int = 1

class GoalRequest(BaseModel):
    title: str
    target: float
    current: float = 0
    deadline: str = "2025-12-31"
    monthly_income: Optional[float] = None

# Mock AI responses
def get_mock_comprehensive_analysis():
    return {
        "analysis": "Your financial health shows strong fundamentals with a good savings rate of 23% and well-diversified portfolio. Your emergency fund at 85% completion is excellent progress. Consider focusing on debt reduction to improve your overall score.",
        "score": 782,
        "strengths": [
            "High savings rate compared to peers",
            "Diversified investment portfolio",
            "Strong emergency fund progress"
        ],
        "recommendations": [
            "Reduce high-interest debt by $200/month",
            "Complete emergency fund in next 2 months",
            "Consider increasing 401k contribution by 2%"
        ],
        "action_items": [
            "Set up automatic debt payment",
            "Review and optimize monthly subscriptions",
            "Schedule financial review quarterly"
        ]
    }

def get_mock_budget_optimization():
    return {
        "budget": "Based on your $6,500 monthly income, I recommend allocating: Housing 30% ($1,950), Food 15% ($975), Transportation 12% ($780), Savings 23% ($1,495), Entertainment 8% ($520), Other 12% ($780).",
        "savings_rate": 23,
        "optimization_score": 85,
        "recommendations": [
            "Reduce dining out by $150/month",
            "Switch to high-yield savings account",
            "Consider generic brands for groceries"
        ]
    }

def get_mock_investment_strategy():
    return {
        "strategy": "For your risk profile and timeline, I recommend a balanced approach: 60% stock index funds (mix of domestic and international), 30% bonds, 10% REITs. Start with low-cost ETFs like VTI and BND.",
        "expected_return": 0.078,
        "risk_score": 65,
        "asset_allocation": {
            "stocks": 60,
            "bonds": 30,
            "reits": 10
        }
    }

def get_mock_competitive_insights():
    return {
        "insights": "You're performing better than 75% of peers in your age group. Your savings rate of 23% exceeds the national average of 13%. Focus on investment diversification to reach top 10%.",
        "percentile_ranking": 75,
        "competitive_score": 78,
        "peer_comparison": {
            "savings_rate": "Above average",
            "investment_return": "Good",
            "debt_ratio": "Excellent"
        }
    }

def get_mock_travel_plan(request: TravelRequest):
    return {
        "plan": f"Perfect {request.duration} trip to {request.destination}! Day 1-2: Explore historic downtown and local cuisine ($200/day). Day 3-4: Museum visits and shopping ($150/day). Day 5-7: Relaxation and scenic tours ($180/day). Includes accommodation, meals, and activities.",
        "total_budget": request.budget,
        "daily_breakdown": request.budget / 7,
        "savings_goal": f"Save ${request.budget/6:.0f} monthly for 6 months"
    }

def get_mock_goal_strategy(request: GoalRequest):
    months_to_deadline = 12
    monthly_target = (request.target - request.current) / months_to_deadline
    
    return {
        "strategy": f"To reach your ${request.target:,.0f} goal by {request.deadline}, save ${monthly_target:,.0f} monthly. Set up automatic transfers and track progress weekly. Consider high-yield savings for this goal.",
        "monthly_target": monthly_target,
        "timeline": f"{months_to_deadline} months",
        "progress_percentage": (request.current / request.target) * 100
    }

@app.post("/api/context")
async def update_context(context: UserContext):
    user_contexts['default'] = context.dict()
    return {"status": "success", "message": "Context updated successfully"}

@app.post("/api/profile")  
async def update_profile(profile: UserProfile):
    if 'default' not in user_contexts:
        user_contexts['default'] = {}
    user_contexts['default'].update(profile.dict(exclude_none=True))
    return {"status": "success", "message": "Profile updated successfully"}

@app.post("/api/ai/comprehensive-analysis")
async def comprehensive_analysis(request: Dict[str, Any]):
    await asyncio.sleep(1)  # Simulate processing time
    return get_mock_comprehensive_analysis()

@app.post("/api/ai/smart-budget")
async def smart_budget(request: Dict[str, Any]):
    await asyncio.sleep(1)
    return get_mock_budget_optimization()

@app.post("/api/ai/investment-strategy")
async def investment_strategy(request: Dict[str, Any]):
    await asyncio.sleep(1)
    return get_mock_investment_strategy()

@app.post("/api/ai/competitive-insights")
async def competitive_insights(request: Dict[str, Any]):
    await asyncio.sleep(1)
    return get_mock_competitive_insights()

@app.post("/api/ai/portfolio-optimization")
async def portfolio_optimization(request: Dict[str, Any]):
    await asyncio.sleep(1)
    return {
        "optimization": "Your portfolio shows good diversification. Consider rebalancing: reduce tech stocks by 5%, increase international exposure by 8%. Add 3% REITs for stability.",
        "rebalancing_score": 88,
        "suggested_changes": [
            "Reduce AAPL position by 2%",
            "Add VTIAX for international exposure", 
            "Consider VNQ for REIT exposure"
        ]
    }

@app.post("/api/ai/recommendations")
async def smart_recommendations(request: Dict[str, Any]):
    await asyncio.sleep(1)
    return {
        "recommendations": "Based on your profile: 1) Switch to Ally Bank for 4.5% savings rate (+$180/year), 2) Use Chase Sapphire for travel rewards, 3) Consider I-bonds for inflation protection, 4) Automate investments to avoid timing mistakes.",
        "priority_score": 92,
        "estimated_savings": 1800,
        "actions": [
            {"type": "banking", "priority": "high", "savings": 180},
            {"type": "credit_card", "priority": "medium", "rewards": 500},
            {"type": "investments", "priority": "high", "return": 1200}
        ]
    }

@app.post("/api/ai/travel-plan")
async def travel_plan(request: TravelRequest):
    await asyncio.sleep(1)
    return get_mock_travel_plan(request)

@app.post("/api/ai/goal-strategy") 
async def goal_strategy(request: GoalRequest):
    await asyncio.sleep(1)
    return get_mock_goal_strategy(request)

@app.post("/api/ai/chat")
async def ai_chat(query: FinancialQuery):
    await asyncio.sleep(1)
    
    # Simple response based on query content
    query_lower = query.query.lower()
    
    if "budget" in query_lower:
        response = "Based on your income, I recommend the 50/30/20 rule: 50% needs, 30% wants, 20% savings. Would you like me to create a detailed budget plan?"
    elif "invest" in query_lower or "portfolio" in query_lower:
        response = "For long-term wealth building, consider a diversified portfolio of low-cost index funds. Start with 70% stocks, 30% bonds, and adjust based on your risk tolerance."
    elif "save" in query_lower or "emergency" in query_lower:
        response = "Build an emergency fund of 3-6 months expenses first. Use a high-yield savings account that earns 4-5% APY. This should be your financial foundation."
    elif "debt" in query_lower:
        response = "Focus on high-interest debt first (credit cards). Consider the avalanche method: minimum payments on all debts, extra money on highest interest rate debt."
    else:
        response = "I'm here to help with your financial questions! I can assist with budgeting, investing, saving strategies, debt management, and goal planning. What specific area would you like guidance on?"
    
    return {
        "response": response,
        "timestamp": datetime.utcnow().isoformat(),
        "context": query.context
    }

# Health check endpoints
@app.get("/")
async def root():
    return {"message": "Pecunia API is running", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unexpected error: {str(exc)}")
    logger.error(traceback.format_exc())
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)