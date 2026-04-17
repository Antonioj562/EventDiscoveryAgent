from fastapi import APIRouter
from backend.services.recommendation_service import recommend_events
from backend.agent.agent_loop import sessions


router = APIRouter(prefix="/events")

@router.post("/recommend")
def recommend(user_input: dict):
    return recommend_events(user_input)

@router.post("/feedback")
def feedback(data: dict):
    session_id = data["session_id"]
    feedback = data["feedback"]  # "interested", "not_interested", "attended"
    text = data["event_text"]

    session = sessions.get(session_id)

    if not session:
        return {"error": "Invalid session"}

    if feedback == "interested":
        session["preferences"]["liked"].append(text)
    elif feedback == "not_interested":
        session["preferences"]["disliked"].append(text)
    elif feedback == "attended":
        session["preferences"]["attended"].append(text)

    return {"message": "Feedback saved"}