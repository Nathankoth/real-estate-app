from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, timedelta
import jwt
import hashlib
import secrets

router = APIRouter(prefix="/api/auth", tags=["authentication"])
security = HTTPBearer()

# TODO: Move to environment variables
SECRET_KEY = "your-secret-key-here"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    company: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    expires_in: int

class UserProfile(BaseModel):
    id: str
    email: str
    full_name: str
    company: Optional[str]
    created_at: datetime
    subscription_tier: str

# In-memory user storage (TODO: Replace with database)
users_db = {}
user_sessions = {}

def hash_password(password: str) -> str:
    """Hash password using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password: str, hashed: str) -> bool:
    """Verify password against hash"""
    return hash_password(password) == hashed

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token"""
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
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None or user_id not in users_db:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user_id
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

@router.post("/register", response_model=UserProfile)
async def register_user(user: UserRegister):
    """Register a new user"""
    try:
        # Check if user already exists
        if user.email in [u["email"] for u in users_db.values()]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create new user
        user_id = secrets.token_urlsafe(16)
        hashed_password = hash_password(user.password)
        
        new_user = {
            "id": user_id,
            "email": user.email,
            "password": hashed_password,
            "full_name": user.full_name,
            "company": user.company,
            "created_at": datetime.utcnow(),
            "subscription_tier": "free"
        }
        
        users_db[user_id] = new_user
        
        return UserProfile(
            id=new_user["id"],
            email=new_user["email"],
            full_name=new_user["full_name"],
            company=new_user["company"],
            created_at=new_user["created_at"],
            subscription_tier=new_user["subscription_tier"]
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/login", response_model=Token)
async def login_user(user: UserLogin):
    """Authenticate user and return access token"""
    try:
        # Find user by email
        user_record = None
        for user_data in users_db.values():
            if user_data["email"] == user.email:
                user_record = user_data
                break
        
        if not user_record or not verify_password(user.password, user_record["password"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Create access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user_record["id"]}, expires_delta=access_token_expires
        )
        
        return Token(
            access_token=access_token,
            token_type="bearer",
            expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/profile", response_model=UserProfile)
async def get_user_profile(current_user_id: str = Depends(verify_token)):
    """Get current user profile"""
    try:
        user = users_db.get(current_user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return UserProfile(
            id=user["id"],
            email=user["email"],
            full_name=user["full_name"],
            company=user["company"],
            created_at=user["created_at"],
            subscription_tier=user["subscription_tier"]
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/logout")
async def logout_user(current_user_id: str = Depends(verify_token)):
    """Logout user (invalidate token)"""
    try:
        # In a real implementation, you would blacklist the token
        # For now, we'll just return success
        return {"message": "Successfully logged out"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/refresh")
async def refresh_token(current_user_id: str = Depends(verify_token)):
    """Refresh access token"""
    try:
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": current_user_id}, expires_delta=access_token_expires
        )
        
        return Token(
            access_token=access_token,
            token_type="bearer",
            expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
