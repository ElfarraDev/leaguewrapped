import os
import asyncio
from fastapi import FastAPI
from dotenv import load_dotenv

# ---------------------------------------------------------------------
# Load environment and verify keys
# ---------------------------------------------------------------------
load_dotenv()

if not os.getenv("RIOT_API_KEY"):
    raise RuntimeError("❌ RIOT_API_KEY not found. Check your .env file in the project root.")

# ---------------------------------------------------------------------
# Imports AFTER env check
# ---------------------------------------------------------------------
from app.routes import health, wrapped, account, verification, admin
from app.services.riot_fetcher import cache


# ---------------------------------------------------------------------
# Initialize FastAPI app
# ---------------------------------------------------------------------
app = FastAPI(
    title="LOL Wrapped API",
    version="1.0.1",
    description="League of Legends year-end summary API powered by Riot Games API",
)

# ---------------------------------------------------------------------
# Include all routers
# ---------------------------------------------------------------------
app.include_router(health.router)
app.include_router(wrapped.router)
app.include_router(account.router)
app.include_router(verification.router)
app.include_router(admin.router)

# ---------------------------------------------------------------------
# Periodic cache cleanup (runs in background)
# ---------------------------------------------------------------------
async def periodic_cache_cleanup():
    """Runs hourly to clear old cache entries."""
    while True:
        try:
            cache.cleanup_expired()
        except Exception as e:
            print(f"[CACHE] ⚠️ Cleanup failed: {e}")
        await asyncio.sleep(3600)  # every hour

@app.on_event("startup")
async def on_startup():
    print("🚀 LOL Wrapped API starting up...")
    asyncio.create_task(periodic_cache_cleanup())

@app.on_event("shutdown")
async def on_shutdown():
    print("🛑 LOL Wrapped API shutting down...")

# ---------------------------------------------------------------------
# Root route
# ---------------------------------------------------------------------
@app.get("/")
def root():
    return {
        "message": "LOL Wrapped API is running 🚀",
        "docs": "/docs",
        "health": "/health",
        "example_wrapped": "/wrapped/na1/{puuid}?start=2025-01-01",
    }
