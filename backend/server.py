from fastapi import FastAPI, APIRouter, HTTPException, status
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Dict
import uuid
from datetime import datetime, timezone, timedelta
import jwt
from passlib.context import CryptContext

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# JWT Configuration
SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key-change-in-production')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# In-memory storage for development (simulates MongoDB)
in_memory_users: Dict[str, dict] = {}
in_memory_status_checks: List[dict] = []

# For now, use in-memory storage (MongoDB support can be added later)
use_mongodb = False
db = None
logger.info("✓ Using in-memory storage for user data")

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Authentication Models
class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    email: str
    password: str
    role: str = "user"  # Default role is 'user'

class UserModel(BaseModel):
    id: str
    email: str
    role: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserModel

class User(BaseModel):
    id: str
    email: str
    password: str  # Hashed
    role: str
    created_at: datetime

# Helper functions
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(user_id: str, email: str, role: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "role": role,
        "exp": datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    }
    encoded_jwt = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    if use_mongodb and db:
        # MongoDB path
        doc = status_obj.model_dump()
        doc['timestamp'] = doc['timestamp'].isoformat()
        await db.status_checks.insert_one(doc)
    else:
        # In-memory path
        doc = status_obj.model_dump()
        in_memory_status_checks.append(doc)
    
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    if use_mongodb and db:
        # MongoDB path
        status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
        
        # Convert ISO string timestamps back to datetime objects
        for check in status_checks:
            if isinstance(check.get('timestamp'), str):
                check['timestamp'] = datetime.fromisoformat(check['timestamp'])
        
        return status_checks
    else:
        # In-memory path
        return in_memory_status_checks

# Authentication endpoints
@api_router.post("/login", response_model=LoginResponse)
async def login(credentials: LoginRequest):
    """
    Login endpoint - validate email and password, return JWT token
    """
    # Find user in database
    if use_mongodb and db:
        user_doc = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    else:
        user_doc = None
        for user in in_memory_users.values():
            if user["email"] == credentials.email:
                user_doc = user
                break
    
    if not user_doc or not verify_password(credentials.password, user_doc.get("password", "")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha inválidos"
        )
    
    # Create JWT token
    access_token = create_access_token(
        user_id=user_doc["id"],
        email=user_doc["email"],
        role=user_doc["role"]
    )
    
    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserModel(
            id=user_doc["id"],
            email=user_doc["email"],
            role=user_doc["role"]
        )
    )

@api_router.post("/register", response_model=LoginResponse)
async def register(data: RegisterRequest):
    """
    Register endpoint - create new user and return JWT token
    """
    # Validate role
    if data.role not in ["user", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Role deve ser 'user' ou 'admin'"
        )
    
    # Check if email already exists
    if use_mongodb and db:
        existing_user = await db.users.find_one({"email": data.email})
    else:
        existing_user = None
        for user in in_memory_users.values():
            if user["email"] == data.email:
                existing_user = user
                break
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="E-mail já está registrado"
        )
    
    # Validate password length
    if len(data.password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Senha deve ter no mínimo 6 caracteres"
        )
    
    # Create new user
    user_id = str(uuid.uuid4())
    hashed_password = hash_password(data.password)
    
    user_doc = {
        "id": user_id,
        "email": data.email,
        "password": hashed_password,
        "role": data.role,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    if use_mongodb and db:
        # Insert user into MongoDB
        await db.users.insert_one(user_doc)
    else:
        # Store in memory
        in_memory_users[user_id] = user_doc
    
    # Create JWT token
    access_token = create_access_token(
        user_id=user_id,
        email=data.email,
        role=data.role
    )
    
    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserModel(
            id=user_id,
            email=data.email,
            role=data.role
        )
    )

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_db_client():
    """Initialize on startup"""
    try:
        if use_mongodb and db:
            # Create index for unique email in MongoDB
            await db.users.create_index("email", unique=True)
            logger.info("✓ Database indexes created successfully")
        else:
            # Pre-populate in-memory users for development
            logger.info("✓ Pre-populating in-memory users for development...")
            
            # Create test users
            test_users = [
                {
                    "id": str(uuid.uuid4()),
                    "email": "user@example.com",
                    "password": hash_password("123456"),
                    "role": "user",
                    "created_at": datetime.now(timezone.utc).isoformat()
                },
                {
                    "id": str(uuid.uuid4()),
                    "email": "admin@example.com",
                    "password": hash_password("123456"),
                    "role": "admin",
                    "created_at": datetime.now(timezone.utc).isoformat()
                },
                {
                    "id": str(uuid.uuid4()),
                    "email": "freelancer@example.com",
                    "password": hash_password("123456"),
                    "role": "user",
                    "created_at": datetime.now(timezone.utc).isoformat()
                }
            ]
            
            for user in test_users:
                in_memory_users[user["id"]] = user
                logger.info(f"  - Created user: {user['email']} (role: {user['role']})")
            
            logger.info(f"✓ Total users created: {len(in_memory_users)}")
    except Exception as e:
        logger.error(f"Error during startup: {e}")


@app.on_event("shutdown")
async def shutdown_db_client():
    """Cleanup on shutdown"""
    # No resources to clean up for in-memory storage
    pass