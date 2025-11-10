from pydantic import BaseModel, Field
from typing import Dict, Any, Optional


class BedrockRequest(BaseModel):
    """Request model for Bedrock LLM generation."""
    prompt: str = Field(..., description="The text prompt to send to the LLM")
    stats: Dict[str, Any] = Field(default_factory=dict, description="JSON context data to include with the prompt")
    
    class Config:
        json_schema_extra = {
            "example": {
                "prompt": "Analyze this player's performance and provide insights",
                "stats": {
                    "wins": 45,
                    "losses": 30,
                    "kda": 3.2,
                    "favorite_champion": "Ahri"
                }
            }
        }


class BedrockResponse(BaseModel):
    """Response model for Bedrock LLM generation."""
    response: str = Field(..., description="Generated text from the LLM")
    model_used: str = Field(..., description="The model that was used")
    timestamp: str = Field(..., description="ISO timestamp of the response")
    
    class Config:
        json_schema_extra = {
            "example": {
                "response": "Based on the stats provided...",
                "model_used": "anthropic.claude-v2",
                "timestamp": "2025-11-10T12:00:00Z"
            }
        }

