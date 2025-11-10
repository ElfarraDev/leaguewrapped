from fastapi import APIRouter, HTTPException
from app.utils.models import BedrockRequest, BedrockResponse
from app.services.bedrock_client import bedrock_client

router = APIRouter(tags=["bedrock"], prefix="/bedrock")


@router.post("/generate", response_model=BedrockResponse)
async def generate_with_bedrock(request: BedrockRequest):
    """
    Generate content using AWS Bedrock Claude 3 Haiku.
    
    Args:
        request: BedrockRequest containing prompt and optional stats
        
    Returns:
        BedrockResponse with generated content, model used, and timestamp
    """
    try:
        result = await bedrock_client.generate(
            prompt=request.prompt,
            stats=request.stats
        )
        return BedrockResponse(**result)
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

