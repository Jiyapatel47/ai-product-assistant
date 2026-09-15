from pydantic import BaseModel

from typing import List


class Theme(BaseModel):

    theme: str

    description: str

    feedback_count: int

    supporting_feedback: list[str]


class PainPoint(BaseModel):

    title: str

    description: str


class FeatureRequest(BaseModel):

    feature: str

    description: str

    request_count: int

    original_requests: list[str]


class Recommendation(BaseModel):

    recommendation: str

    reason: str


class FeedbackItem(BaseModel):

    content: str

    source: str = ""

    date: str | None = None


class AnalysisRequest(BaseModel):

    feedback: List[FeedbackItem]


class AnalysisResult(BaseModel):

    summary: str

    themes: List[Theme]

    pain_points: List[PainPoint]

    feature_requests: List[FeatureRequest]

    recommendations: List[Recommendation]