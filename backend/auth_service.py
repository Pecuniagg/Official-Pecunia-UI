from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr, Field, validator
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional, List
import bcrypt
import hashlib

# Security configuration
SECRET_KEY = "pecunia-secret-key-2025-secure"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30 * 24 * 60  # 30 days

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# Mock database for users
users_db = {}
onboarding_db = {}

# Pydantic Models
class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=8)
    
    @validator('name')
    def validate_name(cls, v):
        if not v.strip():
            raise ValueError('Name cannot be empty')
        return v.strip()
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one digit')
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain at least one uppercase letter')
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class OnboardingData(BaseModel):
    country: str = Field(..., min_length=2, max_length=50)
    financial_status: str = Field(..., min_length=1)
    interests: List[str] = Field(..., min_items=1, max_items=10)
    usage_purpose: str = Field(..., min_length=10, max_length=500)
    referral_source: str = Field(..., min_length=1)
    expectations: str = Field(..., min_length=10, max_length=1000)

class Token(BaseModel):
    access_token: str
    token_type: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    is_authenticated: bool
    onboarding_complete: bool

# Utility functions
def verify_password(plain_password, hashed_password):
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    """Hash a password"""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify JWT token"""
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return email
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

def get_current_user(email: str = Depends(verify_token)):
    """Get current authenticated user"""
    user = users_db.get(email)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    return user

def authenticate_user(email: str, password: str):
    """Authenticate user with email and password"""
    user = users_db.get(email)
    if not user:
        return False
    if not verify_password(password, user["hashed_password"]):
        return False
    return user

# Mock user data for testing
def init_mock_users():
    """Initialize mock users for testing"""
    global users_db, onboarding_db
    
    # Create mock users
    mock_users = [
        {
            "name": "John Doe",
            "email": "john@example.com",
            "password": "Password123"
        },
        {
            "name": "Jane Smith", 
            "email": "jane@example.com",
            "password": "SecurePass456"
        },
        {
            "name": "Demo User",
            "email": "demo@pecunia.com", 
            "password": "DemoPass789"
        }
    ]
    
    for user in mock_users:
        user_id = hashlib.md5(user["email"].encode()).hexdigest()
        users_db[user["email"]] = {
            "id": user_id,
            "name": user["name"],
            "email": user["email"],
            "hashed_password": get_password_hash(user["password"]),
            "is_authenticated": True,
            "onboarding_complete": False,
            "created_at": datetime.utcnow()
        }
    
    print(f"✅ Initialized {len(mock_users)} mock users for authentication")
    print("📝 Test credentials:")
    for user in mock_users:
        print(f"  - Email: {user['email']}, Password: {user['password']}")

# Auth service functions
class AuthService:
    @staticmethod
    def register_user(user_data: UserRegister):
        """Register a new user"""
        if user_data.email in users_db:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        user_id = hashlib.md5(user_data.email.encode()).hexdigest()
        hashed_password = get_password_hash(user_data.password)
        
        users_db[user_data.email] = {
            "id": user_id,
            "name": user_data.name,
            "email": user_data.email,
            "hashed_password": hashed_password,
            "is_authenticated": True,
            "onboarding_complete": False,
            "created_at": datetime.utcnow()
        }
        
        # Create access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user_data.email}, expires_delta=access_token_expires
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user_id,
                "name": user_data.name,
                "email": user_data.email,
                "is_authenticated": True,
                "onboarding_complete": False
            }
        }
    
    @staticmethod
    def login_user(login_data: UserLogin):
        """Login user"""
        user = authenticate_user(login_data.email, login_data.password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": login_data.email}, expires_delta=access_token_expires
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer", 
            "user": {
                "id": user["id"],
                "name": user["name"],
                "email": user["email"],
                "is_authenticated": True,
                "onboarding_complete": user.get("onboarding_complete", False)
            }
        }
    
    @staticmethod
    def complete_onboarding(onboarding_data: OnboardingData, current_user):
        """Complete user onboarding"""
        user_email = current_user["email"]
        
        # Update user onboarding status
        users_db[user_email]["onboarding_complete"] = True
        
        # Store onboarding data
        onboarding_db[user_email] = {
            "country": onboarding_data.country,
            "financial_status": onboarding_data.financial_status,
            "interests": onboarding_data.interests,
            "usage_purpose": onboarding_data.usage_purpose,
            "referral_source": onboarding_data.referral_source,
            "expectations": onboarding_data.expectations,
            "completed_at": datetime.utcnow()
        }
        
        return {
            "message": "Onboarding completed successfully",
            "user": {
                "id": current_user["id"],
                "name": current_user["name"],
                "email": current_user["email"],
                "is_authenticated": True,
                "onboarding_complete": True
            }
        }
    
    @staticmethod
    def get_user_profile(current_user):
        """Get user profile"""
        return {
            "id": current_user["id"],
            "name": current_user["name"],
            "email": current_user["email"],
            "is_authenticated": True,
            "onboarding_complete": current_user.get("onboarding_complete", False),
            "onboarding_data": onboarding_db.get(current_user["email"])
        }

# Initialize mock users on module import
init_mock_users()