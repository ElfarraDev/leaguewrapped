from fastapi import APIRouter, HTTPException
from app.services.account_api import get_account_by_riot_id

router = APIRouter(prefix="/account", tags=["Account"])

@router.get("/{name}/{tag}")
async def get_account(name: str, tag: str):
    """
    Get Riot account info (including PUUID) from Riot ID.
    Example: /account/Faker/KR1
    """
    try:
        account = await get_account_by_riot_id(name, tag)
        return {
            "gameName": account.get("gameName"),
            "tagLine": account.get("tagLine"),
            "puuid": account.get("puuid"),
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
