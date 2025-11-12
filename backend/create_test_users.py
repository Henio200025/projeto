#!/usr/bin/env python3
"""
Script para criar usuários de teste no banco de dados MongoDB
"""
import asyncio
import uuid
from datetime import datetime, timezone
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
import os
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

async def create_test_users():
    """Create test users in MongoDB"""
    # Connect to MongoDB
    mongo_url = os.environ.get('MONGO_URL')
    db_name = os.environ.get('DB_NAME', 'freelance_hub')
    
    if not mongo_url:
        print("ERROR: MONGO_URL not set in .env file")
        return
    
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    # Test users to create
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
    
    try:
        # Drop existing users collection (optional - remove this if you want to keep existing data)
        await db.users.delete_many({})
        print("✓ Limpou coleção de usuários existentes")
        
        # Insert test users
        result = await db.users.insert_many(test_users)
        print(f"✓ Criados {len(result.inserted_ids)} usuários de teste:")
        
        for user in test_users:
            print(f"  - {user['email']} (role: {user['role']})")
            print(f"    Senha: 123456")
        
        # Create unique index on email
        await db.users.create_index("email", unique=True)
        print("\n✓ Índice de email criado com sucesso")
        
        # List all users
        all_users = await db.users.find({}, {"_id": 0, "password": 0}).to_list(10)
        print(f"\n✓ Total de usuários no banco: {len(all_users)}")
        
    except Exception as e:
        print(f"✗ Erro ao criar usuários: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(create_test_users())
