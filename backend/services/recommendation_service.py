from backend.agent.agent_loop import agent_loop

def recommend_events(user_input):
    session_id = user_input.get("session_id", "default")
    query = user_input.get("text", "")

    return agent_loop(session_id, query)