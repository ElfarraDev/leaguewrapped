from fastapi import APIRouter
from fastapi.responses import FileResponse
import os

router = APIRouter()

@router.get("/riot.txt", include_in_schema=False)
async def riot_verification():
    file_path = os.path.join(os.path.dirname(__file__), "../../extras/riot.txt")
    return FileResponse(file_path, media_type="text/plain")
