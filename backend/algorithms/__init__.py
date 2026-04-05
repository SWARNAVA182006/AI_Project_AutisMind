"""
Classical AI building blocks used in the screening pipeline:

- Rule-based reasoning (knowledge-based systems / expert systems in AI syllabi)
- BFS (uninformed search: breadth-first search)
- A* (informed search: optimal path with admissible heuristic)
- CSP (constraint satisfaction: backtracking)
"""

from .a_star_therapy import recommend_therapy_plan
from .bfs_symptom import analyze_symptoms_bfs
from .csp_schedule import schedule_therapies_csp
from .rule_based import compute_risk_and_modules

__all__ = [
    "compute_risk_and_modules",
    "analyze_symptoms_bfs",
    "recommend_therapy_plan",
    "schedule_therapies_csp",
]
