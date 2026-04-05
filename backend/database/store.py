"""
MongoDB session store.

Replaces in-memory dictionary with persistent database storage.
Keeps same function signatures for clean architecture.
"""

from __future__ import annotations

import os
from typing import Any
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")

# Connect to MongoDB
client = MongoClient(MONGO_URL)

db = client["autism_db"]
collection = db["screenings"]


def save_result(session_id: str, payload: dict[str, Any]) -> None:
    """
    Save one completed analysis into MongoDB.
    """
    payload["session_id"] = session_id
    collection.insert_one(payload)


def get_result(session_id: str) -> dict[str, Any] | None:
    """
    Retrieve stored analysis from MongoDB.
    """
    result = collection.find_one({"session_id": session_id})

    if result:
        result["_id"] = str(result["_id"])  # convert ObjectId to string
        return result

    return None