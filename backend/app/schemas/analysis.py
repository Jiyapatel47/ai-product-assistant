from pydantic import BaseModel


class AnalysisRequest(BaseModel):
    workspace_id: str