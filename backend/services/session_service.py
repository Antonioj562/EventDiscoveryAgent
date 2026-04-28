import json
from pathlib import Path
from threading import RLock


ROOT_DIR = Path(__file__).resolve().parents[2]
SESSIONS_PATH = ROOT_DIR / "data" / "user_sessions.json"
SESSION_LOCK = RLock()


def _default_session():
    return {
        "preferences": {
            "interested": [],
            "not_interested": [],
            "attended": [],
        }
    }


def _normalize_saved_event(event: dict):
    return {
        "id": str(event.get("id", "")),
        "name": event.get("name", "Untitled event"),
        "category": event.get("category", "event"),
        "location": event.get("location", "Unknown"),
        "description": event.get("description", "No description available."),
        "venue": event.get("venue", ""),
        "start": event.get("start", ""),
        "localDate": event.get("localDate", ""),
        "localTime": event.get("localTime", ""),
        "timezone": event.get("timezone", ""),
        "url": event.get("url", ""),
        "imageUrl": event.get("imageUrl", ""),
        "source": event.get("source", ""),
    }


def load_sessions():
    if not SESSIONS_PATH.exists():
        return {}

    with SESSIONS_PATH.open(encoding="utf-8") as file:
        raw_sessions = json.load(file)

    sessions = {}
    for session_id, session_data in raw_sessions.items():
        session = _default_session()
        session_prefs = session_data.get("preferences", {})
        for key in session["preferences"]:
            session["preferences"][key] = [
                _normalize_saved_event(event)
                for event in session_prefs.get(key, [])
                if isinstance(event, dict)
            ]
        sessions[session_id] = session

    return sessions


def save_sessions(sessions: dict):
    SESSIONS_PATH.parent.mkdir(parents=True, exist_ok=True)
    with SESSIONS_PATH.open("w", encoding="utf-8") as file:
        json.dump(sessions, file, indent=2)


def get_or_create_session(sessions: dict, session_id: str):
    with SESSION_LOCK:
        if session_id not in sessions:
            sessions[session_id] = _default_session()
            save_sessions(sessions)
        return sessions[session_id]


def add_feedback_item(sessions: dict, session_id: str, feedback_type: str, event: dict):
    with SESSION_LOCK:
        session = get_or_create_session(sessions, session_id)
        preferences = session["preferences"]
        normalized_event = _normalize_saved_event(event)

        for bucket_name, items in preferences.items():
            preferences[bucket_name] = [
                item for item in items if item.get("id") != normalized_event["id"]
            ]

        preferences[feedback_type].append(normalized_event)
        save_sessions(sessions)
        return normalized_event


def remove_feedback_item(sessions: dict, session_id: str, feedback_type: str, event_id: str):
    with SESSION_LOCK:
        session = sessions.get(session_id)
        if not session:
            return False

        items = session["preferences"][feedback_type]
        next_items = [item for item in items if item.get("id") != str(event_id)]
        removed = len(next_items) != len(items)
        session["preferences"][feedback_type] = next_items

        if removed:
            save_sessions(sessions)

        return removed
