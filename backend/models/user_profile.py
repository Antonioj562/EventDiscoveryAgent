from pydantic import BaseModel
from typing import List

class UserProfile(BaseModel):
    interests: List[str]
    attended_events: List[int]
    feedback: dict  # {event_id: "interested/not_interested/attended"}