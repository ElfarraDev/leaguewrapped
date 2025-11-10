from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# ---------------------------------------------------------------------
# Import routers
# ---------------------------------------------------------------------
from app.routes import health, bedrock

# ---------------------------------------------------------------------
# Initialize FastAPI app
# ---------------------------------------------------------------------
app = FastAPI(
    title="Bedrock LLM API",
    version="1.0.0",
    description="AWS Bedrock LLM API wrapper for generating content with context",
)

# ---------------------------------------------------------------------
# CORS middleware
# ---------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------
# Include all routers
# ---------------------------------------------------------------------
app.include_router(health.router)
app.include_router(bedrock.router)

# ---------------------------------------------------------------------
# Startup event
# ---------------------------------------------------------------------
@app.on_event("startup")
async def on_startup():
    print("🚀 Bedrock LLM API starting up...")

@app.on_event("shutdown")
async def on_shutdown():
    print("🛑 Bedrock LLM API shutting down...")

# ---------------------------------------------------------------------
# Root route
# ---------------------------------------------------------------------
@app.get("/")
def root():
    return {
        "message": "Bedrock LLM API is running 🚀",
        "docs": "/docs",
        "health": "/health",
        "generate": "/bedrock/generate",
    }

