import os
from typing import Optional
from fastapi import HTTPException, Depends, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import jwt
import httpx
from dotenv import load_dotenv

load_dotenv()

# Clerk Configuration
# You can find your JWKS URL in the Clerk Dashboard under "API Keys" -> "Show Advanced" -> "JWKS URL"
# Or it's usually: https://clerk.<your-domain>.com/.well-known/jwks.json
CLERK_JWKS_URL = os.getenv("CLERK_JWKS_URL")

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    
    if not CLERK_JWKS_URL:
        # Fallback for development if URL isn't set yet
        print("WARNING: CLERK_JWKS_URL not set. Skipping verification for testing.")
        return {"id": "mock_user", "email": "mock@example.com"}

    try:
        # 1. Fetch JWKS
        async with httpx.AsyncClient() as client:
            response = await client.get(CLERK_JWKS_URL)
            jwks = response.json()

        # 2. Verify JWT
        payload = jwt.decode(
            token,
            jwks,
            algorithms=["RS256"],
            options={"verify_aud": False} # Adjust as needed
        )
        return payload
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail=f"Invalid authentication credentials: {str(e)}"
        )
