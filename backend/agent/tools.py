import math
from backend.services.event_service import get_events
from backend.services.llm_service import embed_text

# cosine similarity
def cosine_similarity(a, b):
    dot = sum(x*y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x*x for x in a))
    norm_b = math.sqrt(sum(x*x for x in b))

    if norm_a == 0 or norm_b == 0:
        return 0

    return dot / (norm_a * norm_b)


# Precompute embeddings once (important)
event_cache = []

def load_event_embeddings():
    global event_cache
    events = get_events()

    event_cache = []
    for e in events:
        text = f"{e['name']} {e['description']} {e['category']}"
        embedding = embed_text(text)

        event_cache.append({
            "event": e,
            "embedding": embedding
        })


def event_search_tool(query: str, user_prefs: dict):
    if not event_cache:
        load_event_embeddings()

    query_embedding = embed_text(query)

    results = []

    for item in event_cache:
        score = cosine_similarity(query_embedding, item["embedding"])

        event_text = item["event"]["description"].lower()

        # preference boost
        for a in user_prefs.get("attended", []):
            if a.lower() in event_text:
                score += 0.2

        for l in user_prefs.get("liked", []):
            if l.lower() in event_text:
                score += 0.1

        # skip disliked
        if any(d.lower() in event_text for d in user_prefs.get("disliked", [])):
            continue

        results.append((score, item["event"]))

    results.sort(key=lambda x: x[0], reverse=True)

    return [r[1] for r in results[:5]]