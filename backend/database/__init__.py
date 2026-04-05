"""Simple persistence layer for screening sessions (in-memory for demos / viva)."""

from .store import get_result, save_result

__all__ = ["get_result", "save_result"]
