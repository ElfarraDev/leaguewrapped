import os
import aiohttp

RIOT_API_KEY = os.getenv("RIOT_API_KEY")
BASE_URL = "https://americas.api.riotgames.com"

async def get_account_by_riot_id(name: str, tag: str):
    """Fetch Riot account info (puuid, gameName, tagLine) from Riot ID."""
    url = f"{BASE_URL}/riot/account/v1/accounts/by-riot-id/{name}/{tag}"
    print(url)
    headers = {"X-Riot-Token": RIOT_API_KEY}

    async with aiohttp.ClientSession() as session:
        async with session.get(url, headers=headers) as resp:
            if resp.status != 200:
                print(resp.status)
                raise RuntimeError(f"Error {resp.status} fetching Riot account for {name}#{tag}")
            return await resp.json()
