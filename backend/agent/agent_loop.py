from backend.agent.tools import event_search_tool
from backend.services.llm_service import generate_llm_response
from backend.services.session_service import load_sessions, get_or_create_session


sessions = load_sessions()


def agent_loop(session_id: str, query: str):
    session = get_or_create_session(sessions, session_id)
    prefs = session["preferences"]
    search_result = event_search_tool(query, prefs)
    events = search_result["events"]

    if not events:
        attempts = search_result.get("attempts", [])
        attempted_keywords = ", ".join(
            f"#{attempt['attempt']}: {attempt['keyword']}"
            for attempt in attempts
        ) or "none"
        explanation = (
            "No matching Ticketmaster music events were found for this prompt yet. "
            f"Keyword attempts tried: {attempted_keywords}."
        )
        return {
            "recommendations": [],
            "explanation": explanation,
            "meta": {
                "source": search_result["source"],
                "fallback_reason": search_result.get("fallback_reason"),
                "cached": search_result.get("cached", False),
                "attempts": attempts,
            },
        }

    event_summaries = [
        f"{event['name']} ({event['category']}) at {event['venue'] or event['location']}"
        for event in events[:5]
    ]
    explain_prompt = f"""
    User request: {query}
    Saved interested events: {[event["name"] for event in prefs["interested"][:5]]}
    Saved attended events: {[event["name"] for event in prefs["attended"][:5]]}
    Saved not interested events: {[event["name"] for event in prefs["not_interested"][:5]]}
    Candidate events: {event_summaries}

    Explain briefly why these recommendations fit the user's interests.
    """

    explanation = generate_llm_response(explain_prompt)

    return {
        "recommendations": events,
        "explanation": explanation,
        "meta": {
            "source": search_result["source"],
            "fallback_reason": search_result.get("fallback_reason"),
            "cached": search_result.get("cached", False),
            "attempts": search_result.get("attempts", []),
        },
    }
