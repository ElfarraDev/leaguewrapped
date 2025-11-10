async def get_latest_patch(session):
    url = "https://ddragon.leagueoflegends.com/api/versions.json"
    async with session.get(url) as r:
        r.raise_for_status()
        versions = await r.json()
    return versions[0]

async def get_champions(session, patch: str, lang: str = "en_US"):
    url = f"https://ddragon.leagueoflegends.com/cdn/{patch}/data/{lang}/champion.json"
    async with session.get(url) as r:
        r.raise_for_status()
        data = await r.json()

    by_name = {}
    key_to_name = {}
    for name, info in data["data"].items():
        by_name[name] = info  # includes "tags", "key" (numeric string), etc.
        key_to_name[info["key"]] = name
    return by_name, key_to_name
