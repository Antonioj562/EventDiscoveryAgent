from fastapi import APIRouter, HTTPException
from backend.services.recommendation_service import recommend_events
from backend.agent.agent_loop import get_or_create_session, sessions


router = APIRouter(prefix="/events")

@router.post("/recommend")
def recommend(user_input: dict):
    return recommend_events(user_input)

@router.post("/feedback")
def feedback(data: dict):
    session_id = data["session_id"]
    feedback = data["feedback"]  # "interested", "not_interested", "attended"
    text = data["event_text"]

    session = get_or_create_session(session_id)

    if feedback == "interested":
        session["preferences"]["liked"].append(text)
    elif feedback == "not_interested":
        session["preferences"]["disliked"].append(text)
    elif feedback == "attended":
        session["preferences"]["attended"].append(text)
    else:
        raise HTTPException(status_code=400, detail="Invalid feedback type")

    return {"message": "Feedback saved"}


@router.get("/history/{session_id}")
def history(session_id: str):
    session = sessions.get(session_id)

    if not session:
        return {
            "session_id": session_id,
            "history": {
                "interested": [],
                "not_interested": [],
                "attended": [],
            },
        }

    return {
        "session_id": session_id,
        "history": {
            "interested": session["preferences"]["liked"],
            "not_interested": session["preferences"]["disliked"],
            "attended": session["preferences"]["attended"],
        },
    }


@router.delete("/history/{session_id}")
def remove_history_item(session_id: str, data: dict):
    session = sessions.get(session_id)

    if not session:
        raise HTTPException(status_code=404, detail="Invalid session")

    feedback = data["feedback"]
    text = data["event_text"]

    bucket_map = {
        "interested": "liked",
        "not_interested": "disliked",
        "attended": "attended",
    }
    bucket = bucket_map.get(feedback)

    if not bucket:
        raise HTTPException(status_code=400, detail="Invalid feedback type")

    items = session["preferences"][bucket]
    if text in items:
        items.remove(text)

    return {"message": "History item removed"}
