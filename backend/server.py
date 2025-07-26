from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import uvicorn
import asyncio
from datetime import datetime, timedelta
import json
import os
from motor.motor_asyncio import AsyncIOMotorClient
from ai_service import PecuniaAI
import uuid

# Initialize FastAPI app
app = FastAPI(title="Pecunia API", version="1.0.0", root_path="/api")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AI service
ai_service = PecuniaAI()

# Initialize MongoDB client
mongo_client = AsyncIOMotorClient(os.environ.get('MONGO_URL', 'mongodb://localhost:27017'))
db = mongo_client[os.environ.get('DB_NAME', 'pecunia_db')]

# Pydantic models for request/response
class StatusCreate(BaseModel):
    client_name: str

class StatusResponse(BaseModel):
    id: str
    client_name: str
    timestamp: str

class AIMessage(BaseModel):
    message: str
    user_context: Optional[Dict[str, Any]] = None

class FinancialAnalysisRequest(BaseModel):
    monthly_income: float
    monthly_expenses: float
    pecunia_score: int
    age: int
    risk_tolerance: str = "medium"
    goals: List[Dict[str, Any]] = []
    investments: Dict[str, Any] = {}
    location: str = "United States"
    expenses: Dict[str, Any] = {}
    assets: Dict[str, Any] = {}
    liabilities: Dict[str, Any] = {}

class SmartBudgetRequest(BaseModel):
    monthly_income: float
    expenses: Dict[str, Any] = {}
    goals: List[Dict[str, Any]] = []
    location: str = "United States"

class InvestmentStrategyRequest(BaseModel):
    investable_amount: float
    risk_tolerance: str = "medium"
    age: int
    timeline: str = "10+ years"

class TravelPlanRequest(BaseModel):
    budget: float
    destination: str = "flexible"
    duration: str = "1 week"
    interests: List[str] = []
    group_size: int = 1
    dates: str = "flexible"

class GoalStrategyRequest(BaseModel):
    title: str
    target: float
    current: float
    deadline: str
    monthly_income: float

class CompetitiveInsightsRequest(BaseModel):
    age: int
    income: float
    net_worth: float
    pecunia_score: int
    location: str = "United States"

class SpendingAnalysisRequest(BaseModel):
    spending_data: List[Dict[str, Any]]

class PortfolioOptimizationRequest(BaseModel):
    portfolio_data: Dict[str, Any]

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

# Status endpoints for testing
@app.post("/status", response_model=StatusResponse)
async def create_status(status: StatusCreate):
    try:
        status_data = {
            "id": str(uuid.uuid4()),
            "client_name": status.client_name,
            "timestamp": datetime.now().isoformat()
        }
        
        result = await db.status.insert_one(status_data)
        return StatusResponse(**status_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/status")
async def get_status():
    try:
        statuses = []
        async for status in db.status.find():
            status['_id'] = str(status['_id'])
            statuses.append(status)
        return statuses
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Enhanced AI endpoints
@app.post("/ai/comprehensive-analysis")
async def get_comprehensive_analysis(request: FinancialAnalysisRequest):
    """Get comprehensive financial analysis with AI-powered insights"""
    try:
        user_data = request.dict()
        analysis = await ai_service.get_comprehensive_financial_analysis(user_data)
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ai/smart-budget")
async def generate_smart_budget(request: SmartBudgetRequest):
    """Generate AI-optimized smart budget"""
    try:
        user_data = request.dict()
        budget = await ai_service.generate_smart_budget(user_data)
        return budget
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ai/investment-strategy")
async def generate_investment_strategy(request: InvestmentStrategyRequest):
    """Generate AI-powered investment strategy"""
    try:
        user_data = request.dict()
        strategy = await ai_service.generate_investment_strategy(user_data)
        return strategy
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ai/travel-plan")
async def generate_travel_plan(request: TravelPlanRequest):
    """Generate comprehensive AI travel plan"""
    try:
        travel_data = request.dict()
        plan = await ai_service.generate_travel_plan(travel_data)
        return plan
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ai/goal-strategy")
async def generate_goal_strategy(request: GoalStrategyRequest):
    """Generate AI-powered goal achievement strategy"""
    try:
        goal_data = request.dict()
        strategy = await ai_service.generate_goal_strategy(goal_data)
        return strategy
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ai/competitive-insights")
async def get_competitive_insights(request: CompetitiveInsightsRequest):
    """Get competitive analysis and strategies to outperform peers"""
    try:
        user_data = request.dict()
        insights = await ai_service.get_competitive_insights(user_data)
        return insights
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ai/spending-analysis")
async def analyze_spending_patterns(request: SpendingAnalysisRequest):
    """Analyze spending patterns with AI insights"""
    try:
        analysis = await ai_service.analyze_spending_patterns(request.spending_data)
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ai/portfolio-optimization")
async def optimize_portfolio(request: PortfolioOptimizationRequest):
    """Optimize investment portfolio with AI recommendations"""
    try:
        optimization = await ai_service.optimize_portfolio(request.portfolio_data)
        return optimization
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ai/chat")
async def chat_with_ai(message: AIMessage):
    """Chat with AI assistant"""
    try:
        response = await ai_service.chat_with_ai(message.message, message.user_context)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Legacy endpoints for backward compatibility
@app.post("/ai/financial-insights")
async def get_financial_insights(request: FinancialAnalysisRequest):
    """Legacy endpoint - redirect to comprehensive analysis"""
    return await get_comprehensive_analysis(request)

@app.post("/ai/analyze-spending")
async def analyze_spending(request: SpendingAnalysisRequest):
    """Legacy endpoint - redirect to spending analysis"""
    return await analyze_spending_patterns(request)

# User profile and preferences endpoints
@app.post("/user/profile")
async def update_user_profile(profile_data: Dict[str, Any]):
    """Update user profile information"""
    try:
        profile_data["updated_at"] = datetime.now().isoformat()
        profile_data["id"] = profile_data.get("id", str(uuid.uuid4()))
        
        await db.user_profiles.replace_one(
            {"id": profile_data["id"]},
            profile_data,
            upsert=True
        )
        
        return {"success": True, "message": "Profile updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/user/profile/{user_id}")
async def get_user_profile(user_id: str):
    """Get user profile information"""
    try:
        profile = await db.user_profiles.find_one({"id": user_id})
        if profile:
            profile["_id"] = str(profile["_id"])
            return profile
        else:
            raise HTTPException(status_code=404, detail="Profile not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Goals management endpoints
@app.post("/goals")
async def create_goal(goal_data: Dict[str, Any]):
    """Create a new financial goal"""
    try:
        goal_data["id"] = str(uuid.uuid4())
        goal_data["created_at"] = datetime.now().isoformat()
        goal_data["updated_at"] = datetime.now().isoformat()
        
        await db.goals.insert_one(goal_data)
        return {"success": True, "goal_id": goal_data["id"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/goals/{user_id}")
async def get_user_goals(user_id: str):
    """Get user's financial goals"""
    try:
        goals = []
        async for goal in db.goals.find({"user_id": user_id}):
            goal["_id"] = str(goal["_id"])
            goals.append(goal)
        return goals
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/goals/{goal_id}")
async def update_goal(goal_id: str, goal_data: Dict[str, Any]):
    """Update an existing goal"""
    try:
        goal_data["updated_at"] = datetime.now().isoformat()
        
        result = await db.goals.update_one(
            {"id": goal_id},
            {"$set": goal_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Goal not found")
        
        return {"success": True, "message": "Goal updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Budget management endpoints
@app.post("/budget")
async def create_budget(budget_data: Dict[str, Any]):
    """Create or update budget"""
    try:
        budget_data["id"] = budget_data.get("id", str(uuid.uuid4()))
        budget_data["updated_at"] = datetime.now().isoformat()
        
        await db.budgets.replace_one(
            {"id": budget_data["id"]},
            budget_data,
            upsert=True
        )
        
        return {"success": True, "budget_id": budget_data["id"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/budget/{user_id}")
async def get_user_budget(user_id: str):
    """Get user's budget"""
    try:
        budget = await db.budgets.find_one({"user_id": user_id})
        if budget:
            budget["_id"] = str(budget["_id"])
            return budget
        else:
            raise HTTPException(status_code=404, detail="Budget not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Travel plans management endpoints
@app.post("/travel-plans")
async def create_travel_plan(plan_data: Dict[str, Any]):
    """Create a new travel plan"""
    try:
        plan_data["id"] = str(uuid.uuid4())
        plan_data["created_at"] = datetime.now().isoformat()
        
        await db.travel_plans.insert_one(plan_data)
        return {"success": True, "plan_id": plan_data["id"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/travel-plans/{user_id}")
async def get_user_travel_plans(user_id: str):
    """Get user's travel plans"""
    try:
        plans = []
        async for plan in db.travel_plans.find({"user_id": user_id}):
            plan["_id"] = str(plan["_id"])
            plans.append(plan)
        return plans
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Analytics and insights endpoints
@app.get("/analytics/dashboard/{user_id}")
async def get_dashboard_analytics(user_id: str):
    """Get comprehensive dashboard analytics"""
    try:
        # Get user profile
        profile = await db.user_profiles.find_one({"id": user_id})
        if profile:
            profile["_id"] = str(profile["_id"])
        
        # Get goals
        goals = []
        async for goal in db.goals.find({"user_id": user_id}):
            goal["_id"] = str(goal["_id"])
            goals.append(goal)
        
        # Get budget
        budget = await db.budgets.find_one({"user_id": user_id})
        if budget:
            budget["_id"] = str(budget["_id"])
        
        # Generate AI insights based on user data
        if profile:
            profile["goals"] = goals
            if budget:
                profile["expenses"] = budget.get("expenses", {})
            
            insights = await ai_service.get_comprehensive_financial_analysis(profile)
            
            return {
                "profile": profile,
                "goals": goals,
                "budget": budget,
                "ai_insights": insights,
                "generated_at": datetime.now().isoformat()
            }
        else:
            raise HTTPException(status_code=404, detail="User profile not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Market data and competitive insights
@app.get("/market/insights")
async def get_market_insights():
    """Get current market insights and trends"""
    try:
        # This would integrate with real market data APIs
        market_data = {
            "market_summary": {
                "sp500_change": "+0.8%",
                "nasdaq_change": "+1.2%",
                "dow_change": "+0.5%",
                "vix": 18.5,
                "ten_year_treasury": "4.25%"
            },
            "trending_sectors": ["Technology", "Healthcare", "Energy"],
            "economic_indicators": {
                "inflation_rate": "3.2%",
                "unemployment_rate": "3.8%",
                "gdp_growth": "2.1%",
                "federal_funds_rate": "5.25%"
            },
            "ai_analysis": "Market conditions favor diversified portfolios with tech overweight. Bond yields attractive for income investors.",
            "last_updated": datetime.now().isoformat()
        }
        
        return market_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Smart recommendations endpoint
@app.post("/ai/smart-recommendations")
async def get_smart_recommendations(request: FinancialAnalysisRequest):
    """Get AI-powered smart recommendations for all aspects of financial life"""
    try:
        user_data = request.dict()
        
        # Get comprehensive analysis
        analysis = await ai_service.get_comprehensive_financial_analysis(user_data)
        
        # Get budget optimization
        budget = await ai_service.generate_smart_budget(user_data)
        
        # Get investment strategy
        investment_data = {
            "investable_amount": user_data.get("monthly_income", 0) * 0.2,  # 20% of income
            "risk_tolerance": user_data.get("risk_tolerance", "medium"),
            "age": user_data.get("age", 30),
            "timeline": "10+ years"
        }
        investment_strategy = await ai_service.generate_investment_strategy(investment_data)
        
        # Get competitive insights
        competitive_data = {
            "age": user_data.get("age", 30),
            "income": user_data.get("monthly_income", 0) * 12,
            "net_worth": sum(user_data.get("assets", {}).values()) - sum(user_data.get("liabilities", {}).values()),
            "pecunia_score": user_data.get("pecunia_score", 0),
            "location": user_data.get("location", "United States")
        }
        competitive_insights = await ai_service.get_competitive_insights(competitive_data)
        
        return {
            "comprehensive_analysis": analysis,
            "smart_budget": budget,
            "investment_strategy": investment_strategy,
            "competitive_insights": competitive_insights,
            "generated_at": datetime.now().isoformat(),
            "user_id": user_data.get("user_id", "anonymous")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
