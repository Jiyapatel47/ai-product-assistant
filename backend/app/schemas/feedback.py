from pydantic import BaseModel


class FeedbackCreate(BaseModel):
    text: str