"""
Rule-based autism risk scoring (expert / knowledge-based layer).

What this module does
---------------------
Turns five observable scores into:
1) Per-module alignment scores (0–100, higher = fewer concerns in that area).
2) A single overall risk_score (0–100, higher = more screening concern).
3) A discrete risk_band for reporting.

Why rule-based logic fits this project
--------------------------------------
In many AI courses, "knowledge-based systems" appear before machine learning.
Rules (if-then, weighted sums) are interpretable—important for screening tools
where clinicians and viva examiners can trace *why* a score changed.

How this connects to a typical AI syllabus
------------------------------------------
- Production systems (RBS): rules + uncertainty (here we use simple weights).
- Comparison point for ML: same inputs could later train a classifier; rules give a baseline.
- Explainability: each module_score is tied to named observables.

No external rule engines are used: all logic is plain Python so it is easy to read in a viva.
"""

from __future__ import annotations

from typing import TypedDict


class RuleBasedResult(TypedDict):
    risk_score: float
    risk_band: str
    module_scores: dict[str, float]


def _clamp(value: float, low: float, high: float) -> float:
    """Keep numeric inputs inside a safe range for scoring."""
    return max(low, min(high, value))


def _scale_observation(raw: float) -> float:
    """
    Map a questionnaire value into [0, 10].

    If the UI already uses 0–10, this mostly passes through.
    If someone sends 0–100 by mistake, we gently compress it.
    """
    raw = _clamp(raw, 0.0, 100.0)
    if raw <= 10.0:
        return raw
    return raw / 10.0


def compute_risk_and_modules(
    eye_contact: float,
    name_response: float,
    vocalization: float,
    gestures: float,
    repetitive_behavior: float,
) -> RuleBasedResult:
    """
    Apply weighted rules to derive module scores and overall risk.

    Rule sketch (all manual—no ML libraries):
    - Social attention blends eye contact + response to name.
    - Communication blends vocalization + name response.
    - Motor expression focuses on gesture use.
    - Behavioral regulation treats *high* repetitive_behavior as lower alignment.

    The overall risk_score is a weighted concern index derived from (100 - alignment)
    per module, so higher risk means more areas look atypical on this screening snapshot.
    """
    ec = _scale_observation(eye_contact)
    nr = _scale_observation(name_response)
    vo = _scale_observation(vocalization)
    ge = _scale_observation(gestures)
    rb = _scale_observation(repetitive_behavior)

    # Alignment 0–100: higher is "more typical / stronger skill" on that construct.
    social_attention = ((ec + nr) / 2.0) * 10.0
    communication = ((vo + nr) / 2.0) * 10.0
    motor_expression = ge * 10.0
    # Repetitive behavior: higher score on the form means *more* repetition → lower regulation alignment.
    behavioral_regulation = (10.0 - rb) * 10.0

    module_scores = {
        "social_attention": round(_clamp(social_attention, 0.0, 100.0), 2),
        "communication": round(_clamp(communication, 0.0, 100.0), 2),
        "motor_expression": round(_clamp(motor_expression, 0.0, 100.0), 2),
        "behavioral_regulation": round(_clamp(behavioral_regulation, 0.0, 100.0), 2),
    }

    # Concern per module = gap from ideal alignment (100).
    concerns = [100.0 - v for v in module_scores.values()]
    # Slightly emphasize communication + social attention (common screening focus).
    weights = [0.30, 0.30, 0.20, 0.20]
    risk_score = sum(c * w for c, w in zip(concerns, weights, strict=True))
    risk_score = round(_clamp(risk_score, 0.0, 100.0), 2)

    if risk_score < 35.0:
        band = "low"
    elif risk_score < 65.0:
        band = "moderate"
    else:
        band = "high"

    return {
        "risk_score": risk_score,
        "risk_band": band,
        "module_scores": module_scores,
    }
