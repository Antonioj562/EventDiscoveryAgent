import math
import re
from collections import Counter

from backend.services.event_service import search_events
from backend.services.llm_service import embed_text


WORD_RE = re.compile(r"[a-z0-9]+")


def cosine_similarity(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(x * x for x in b))

    if norm_a == 0 or norm_b == 0:
        return 0

    return dot / (norm_a * norm_b)


def tokenize(text: str):
    return WORD_RE.findall((text or "").lower())


def lexical_similarity(left: str, right: str):
    left_tokens = Counter(tokenize(left))
    right_tokens = Counter(tokenize(right))
    overlap = sum(min(left_tokens[token], right_tokens[token]) for token in left_tokens)
    total = sum(left_tokens.values()) + sum(right_tokens.values())
    if total == 0:
        return 0
    return (2 * overlap) / total


def build_event_text(event: dict):
    return " ".join(
        part
        for part in [
            event.get("name", ""),
            event.get("description", ""),
            event.get("category", ""),
            event.get("venue", ""),
            event.get("location", ""),
        ]
        if part
    )


def preference_overlap_score(candidate_text: str, saved_events: list[dict]):
    return sum(lexical_similarity(candidate_text, build_event_text(event)) for event in saved_events)


def event_search_tool(query: str, user_prefs: dict):
    search_result = search_events(query)
    candidates = search_result["events"]

    use_embeddings = True
    try:
        query_embedding = embed_text(query)
    except Exception:
        use_embeddings = False
        query_embedding = None

    results = []

    disliked_ids = {event.get("id") for event in user_prefs.get("not_interested", [])}

    for event in candidates:
        candidate_text = build_event_text(event)
        score = lexical_similarity(query, candidate_text)

        if use_embeddings and query_embedding:
            try:
                score += cosine_similarity(query_embedding, embed_text(candidate_text))
            except Exception:
                pass

        if event.get("id") in disliked_ids:
            continue

        score += 0.18 * preference_overlap_score(candidate_text, user_prefs.get("attended", []))
        score += 0.1 * preference_overlap_score(candidate_text, user_prefs.get("interested", []))
        score -= 0.08 * preference_overlap_score(candidate_text, user_prefs.get("not_interested", []))

        results.append((score, event))

    results.sort(key=lambda item: item[0], reverse=True)

    return {
        "events": [event for _, event in results[:5]],
        "source": search_result["source"],
        "fallback_reason": search_result.get("fallback_reason"),
        "cached": search_result.get("cached", False),
        "attempts": search_result.get("attempts", []),
    }
