from backend.agent.prompt import AGENT_PROMPT
from backend.agent.tools import event_search_tool
from backend.services.llm_service import generate_llm_response

import json
import re

# Simple in-memory session store
sessions = {}

def safe_parse_json(text):
    try:
        return json.loads(text)
    except:
        # Try to extract JSON from messy response
        match = re.search(r'\{.*\}', text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group())
            except:
                return None
        return None


def get_or_create_session(session_id: str):
    if session_id not in sessions:
        sessions[session_id] = {
            "preferences": {
                "liked": [],
                "disliked": [],
                "attended": []
            },
            "history": []
        }
    return sessions[session_id]

def agent_loop(session_id: str, query: str):
    session = get_or_create_session(session_id)
    prefs = session["preferences"]

    # ALWAYS search
    events = event_search_tool(query, prefs)

    # Only use LLM for explanation (cheaper)
    explain_prompt = f"""
    User: {query}
    Events: {events}

    Explain briefly why these match.
    """

    explanation = generate_llm_response(explain_prompt)

    return {
        "recommendations": events,
        "explanation": explanation
    }