from fastapi import APIRouter, HTTPException
from backend.services.recommendation_service import recommend_events
from backend.agent.agent_loop import sessions
from backend.services.session_service import (
    add_feedback_item,
    get_or_create_session,
    remove_feedback_item,
)


router = APIRouter(prefix="/events")

@router.post("/recommend")
def recommend(user_input: dict):
    return recommend_events(user_input)

@router.post("/feedback")
def feedback(data: dict):
    session_id = data["session_id"]
    feedback_type = data["feedback"]  # "interested", "not_interested", "attended"
    event = data.get("event")

    if not event and data.get("event_text"):
        event = {
            "id": data["event_text"],
            "name": data["event_text"],
            "description": data["event_text"],
        }

    if feedback_type not in {"interested", "not_interested", "attended"}:
        raise HTTPException(status_code=400, detail="Invalid feedback type")

    if not event:
        raise HTTPException(status_code=400, detail="Event payload is required")

    add_feedback_item(sessions, session_id, feedback_type, event)
    return {"message": "Feedback saved", "saved": True}


@router.get("/history/{session_id}")
def history(session_id: str):
    session = get_or_create_session(sessions, session_id)

    return {
        "session_id": session_id,
        "history": {
            "interested": session["preferences"]["interested"],
            "not_interested": session["preferences"]["not_interested"],
            "attended": session["preferences"]["attended"],
        },
    }


@router.delete("/history/{session_id}")
def remove_history_item(session_id: str, data: dict):
    session = sessions.get(session_id)

    if not session:
        raise HTTPException(status_code=404, detail="Invalid session")

    feedback_type = data["feedback"]
    event_id = str(data.get("event_id") or data.get("event_text") or "")

    if feedback_type not in {"interested", "not_interested", "attended"}:
        raise HTTPException(status_code=400, detail="Invalid feedback type")

    if not event_id:
        raise HTTPException(status_code=400, detail="Event identifier is required")

    remove_feedback_item(sessions, session_id, feedback_type, event_id)
    return {"message": "History item removed"}
