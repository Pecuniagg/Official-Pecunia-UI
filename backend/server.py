from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import uuid
from datetime import datetime
from ai_service import pecunia_ai


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# AI Models
class ChatMessage(BaseModel):
    message: str
    user_context: Optional[Dict[str, Any]] = None

class FinancialInsightRequest(BaseModel):
    monthly_budget: Optional[float] = 5000
    monthly_income: Optional[float] = 6500
    monthly_expenses: Optional[float] = 3750
    savings_rate: Optional[float] = 23
    pecunia_score: Optional[int] = 782
    total_assets: Optional[float] = 56000
    total_liabilities: Optional[float] = 10000
    emergency_fund: Optional[float] = 8500
    age: Optional[int] = 28
    expenses: Optional[Dict[str, Any]] = {}
    goals: Optional[List[Dict[str, Any]]] = []

class GoalStrategyRequest(BaseModel):
    goal: Dict[str, Any]
    user_context: Dict[str, Any]

class TravelPlanRequest(BaseModel):
    budget: Optional[float] = 1500
    duration: Optional[str] = "3 days"
    location: Optional[str] = "flexible"
    style: Optional[str] = "balanced"
    interests: Optional[List[str]] = []
    group_size: Optional[int] = 2

class SpendingAnalysisRequest(BaseModel):
    transactions: List[Dict[str, Any]]
# Original Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
