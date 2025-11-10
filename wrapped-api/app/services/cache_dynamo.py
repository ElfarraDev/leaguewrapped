import os, json, time
import boto3
from botocore.exceptions import ClientError

TABLE_NAME = os.getenv("DDB_TABLE", "lolwrapped_cache")
REGION = os.getenv("AWS_REGION", "us-east-1")

dynamodb = boto3.resource("dynamodb", region_name=REGION)
table = dynamodb.Table(TABLE_NAME)

def get_cached_wrapped(puuid: str, season: str = "2025"):
    """Fetch wrapped data if cached."""
    try:
        res = table.get_item(Key={"puuid": puuid, "season": season})
        if "Item" in res:
            print(f"[CACHE:DDB] ✅ Found cached wrapped for {puuid}")
            return json.loads(res["Item"]["data"])
    except ClientError as e:
        print(f"[CACHE:DDB] ⚠️ Error fetching cache: {e}")
    return None

def put_cached_wrapped(puuid: str, data: dict, season: str = "2025", region: str = None, roast_summary: dict = None):
    """Store wrapped data result, optionally with roast summary."""
    try:
        item = {
            "puuid": puuid,
            "season": season,
            "region": region,
            "data": json.dumps(data),
            "updated_at": int(time.time())
        }

        if roast_summary:
            item["roast_summary"] = json.dumps(roast_summary)

        table.put_item(Item=item)
        print(f"[CACHE:DDB] 💾 Stored wrapped for {puuid} (roast_summary={'yes' if roast_summary else 'no'})")

    except ClientError as e:
        print(f"[CACHE:DDB] ❌ Error saving cache: {e}")

def get_roast_summary(puuid: str, season: str = "2025"):
    try:
        res = table.get_item(Key={"puuid": puuid, "season": season})
        if "Item" in res and "roast_summary" in res["Item"]:
            return json.loads(res["Item"]["roast_summary"])
    except ClientError as e:
        print(f"[CACHE:DDB] ⚠️ Error fetching roast summary: {e}")
    return None
