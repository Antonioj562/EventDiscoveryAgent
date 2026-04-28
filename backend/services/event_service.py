import json
import re
from datetime import datetime, timezone
from pathlib import Path
from threading import Lock
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import urlopen
from backend.config import get_env
from backend.services.llm_service import generate_llm_response


ROOT_DIR = Path(__file__).resolve().parents[2]
SAMPLE_EVENTS_PATH = ROOT_DIR / "data" / "sample_events.json"
TICKETMASTER_BASE_URL = "https://app.ticketmaster.com/discovery/v2/events.json"
EVENT_CACHE_TTL_SECONDS = 300
CACHED_EVENT_SEARCHES = {}
CACHE_LOCK = Lock()
STOPWORDS = {
    "a",
    "an",
    "and",
    "at",
    "for",
    "i",
    "im",
    "i'm",
    "in",
    "into",
    "like",
    "looking",
    "me",
    "my",
    "near",
    "of",
    "on",
    "show",
    "shows",
    "some",
    "that",
    "the",
    "to",
    "want",
    "with",
}
RELATED_TERMS = {
    "indie": ["alternative", "rock"],
    "indie rock": ["alternative rock", "live music"],
    "underground": ["alternative", "rock"],
    "acoustic": ["singer songwriter", "folk"],
    "singer songwriter": ["acoustic", "folk"],
    "mellow": ["acoustic", "soft rock"],
    "pop": ["dance pop", "live music"],
    "hip hop": ["rap", "urban"],
    "rap": ["hip hop", "urban"],
    "electronic": ["dance", "edm"],
    "edm": ["electronic", "dance"],
    "metal": ["hard rock", "rock"],
    "punk": ["rock", "alternative"],
    "country": ["americana", "folk"],
    "jazz": ["blues", "live music"],
    "blues": ["jazz", "live music"],
    "latin": ["reggaeton", "live music"],
}
KNOWN_CITIES = [
    "Los Angeles",
    "San Diego",
    "San Francisco",
    "Seattle",
    "Portland",
    "Austin",
    "Chicago",
    "New York",
    "Boston",
    "Nashville",
    "Las Vegas",
    "Denver",
    "Phoenix",
    "Atlanta",
    "Miami",
    "Philadelphia",
]


def get_sample_events():
    with SAMPLE_EVENTS_PATH.open(encoding="utf-8") as file:
        events = json.load(file)

    return [normalize_sample_event(event) for event in events]


def normalize_sample_event(event: dict):
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
        "source": event.get("source", "sample"),
    }


def extract_city(query: str):
    normalized_query = (query or "").strip()
    lowered = normalized_query.lower()

    for known_city in KNOWN_CITIES:
        if known_city.lower() in lowered:
            return known_city

    return ""


def extract_keywords(query: str):
    lowered = (query or "").lower()
    city = extract_city(query)
    if city:
        lowered = lowered.replace(city.lower(), " ")

    tokens = [
        token
        for token in re.findall(r"[a-z0-9]+", lowered)
        if token not in STOPWORDS
    ]

    if not tokens:
        return ["live music"]

    phrases = []
    for size in range(3, 0, -1):
        for index in range(len(tokens) - size + 1):
            phrase = " ".join(tokens[index:index + size])
            if phrase not in phrases:
                phrases.append(phrase)

    return phrases


def llm_keyword_attempts(query: str):
    prompt = f"""
    Extract up to 3 short Ticketmaster search keyword phrases for this music event request.
    Use plain phrases only, no numbering, no punctuation-heavy text, one per line.
    Prefer artist/genre/style keywords and omit filler words.
    Request: {query}
    """

    try:
        response = generate_llm_response(prompt)
    except Exception:
        return []

    attempts = []
    for line in response.splitlines():
        cleaned = re.sub(r"^[\-\d\.\)\s]+", "", line).strip().lower()
        cleaned = re.sub(r"[^a-z0-9\s]", " ", cleaned)
        cleaned = re.sub(r"\s+", " ", cleaned).strip()
        if cleaned and cleaned not in attempts:
            attempts.append(cleaned)

    return attempts[:3]


def build_keyword_attempts(query: str):
    attempts = []

    for phrase in llm_keyword_attempts(query):
        if phrase not in attempts:
            attempts.append(phrase)

    extracted = extract_keywords(query)
    if extracted:
        direct = " ".join(extracted[:4]).strip()
        if direct and direct not in attempts:
            attempts.append(direct)

    for phrase in extracted:
        related = RELATED_TERMS.get(phrase)
        if related:
            for option in related:
                if option not in attempts:
                    attempts.append(option)

    for token in extracted:
        related = RELATED_TERMS.get(token)
        if related:
            for option in related:
                if option not in attempts:
                    attempts.append(option)

    if "live music" not in attempts:
        attempts.append("live music")

    return attempts[:3]


def build_ticketmaster_params(keyword: str, city: str, size: int):
    cleaned_keyword = keyword.strip() or "live music"

    params = {
        "apikey": get_env("TICKETMASTER_API_KEY"),
        "classificationName": "music",
        "keyword": cleaned_keyword,
        "countryCode": "US",
        "size": size,
        "sort": "relevance,desc",
        "startDateTime": datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z"),
    }

    if city:
        params["city"] = city

    return params


def fetch_ticketmaster_events(params: dict):
    url = f"{TICKETMASTER_BASE_URL}?{urlencode(params)}"

    try:
        with urlopen(url, timeout=10) as response:
            payload = json.load(response)
    except HTTPError as error:
        return {
            "events": [],
            "error": f"Ticketmaster request failed with HTTP {error.code}.",
        }
    except (URLError, TimeoutError, json.JSONDecodeError):
        return {
            "events": [],
            "error": "Ticketmaster request failed before a valid response was returned.",
        }

    events = payload.get("_embedded", {}).get("events", [])
    return {
        "events": [normalize_ticketmaster_event(event) for event in events],
        "error": None,
    }


def _cache_key(query: str, size: int):
    return ((query or "events").strip().lower(), size)


def _get_cached_events(query: str, size: int):
    key = _cache_key(query, size)
    now = datetime.now(timezone.utc).timestamp()

    with CACHE_LOCK:
        cached = CACHED_EVENT_SEARCHES.get(key)
        if not cached:
            return None

        if now - cached["created_at"] > EVENT_CACHE_TTL_SECONDS:
            CACHED_EVENT_SEARCHES.pop(key, None)
            return None

        return cached


def _store_cached_events(query: str, size: int, payload: dict):
    key = _cache_key(query, size)
    now = datetime.now(timezone.utc).timestamp()

    with CACHE_LOCK:
        CACHED_EVENT_SEARCHES[key] = {
            "created_at": now,
            **payload,
        }


def search_events(query: str, size: int = 20):
    cached_payload = _get_cached_events(query, size)
    if cached_payload is not None:
        return {
            "events": cached_payload["events"],
            "source": cached_payload["source"],
            "fallback_reason": cached_payload.get("fallback_reason"),
            "attempts": cached_payload.get("attempts", []),
            "cached": True,
        }

    api_key = get_env("TICKETMASTER_API_KEY")
    if not api_key:
        events = get_sample_events()
        payload = {
            "events": events,
            "source": "sample",
            "fallback_reason": "TICKETMASTER_API_KEY is not configured.",
        }
        _store_cached_events(query, size, payload)
        return {
            **payload,
            "cached": False,
        }

    city = extract_city(query)
    attempts = build_keyword_attempts(query)
    last_error = None

    for attempt_index, keyword in enumerate(attempts[:3], start=1):
        params = build_ticketmaster_params(keyword, city, size)
        result = fetch_ticketmaster_events(params)

        if result["events"]:
            payload = {
                "events": result["events"],
                "source": "ticketmaster",
                "fallback_reason": None,
                "attempts": [
                    {
                        "keyword": keyword,
                        "city": city,
                        "classificationName": "music",
                        "attempt": attempt_index,
                    }
                ],
            }
            _store_cached_events(query, size, payload)
            return {
                **payload,
                "cached": False,
            }

        if result["error"]:
            last_error = result["error"]
            break

    if last_error:
        payload = {
            "events": [],
            "source": "ticketmaster",
            "fallback_reason": last_error,
            "attempts": [
                {
                    "keyword": keyword,
                    "city": city,
                    "classificationName": "music",
                    "attempt": index + 1,
                }
                for index, keyword in enumerate(attempts[:3])
            ],
        }
        _store_cached_events(query, size, payload)
        return {
            **payload,
            "cached": False,
        }

    payload = {
        "events": [],
        "source": "ticketmaster",
        "fallback_reason": "Ticketmaster returned no events for the keyword attempts generated from this prompt.",
        "attempts": [
            {
                "keyword": keyword,
                "city": city,
                "classificationName": "music",
                "attempt": index + 1,
            }
            for index, keyword in enumerate(attempts[:3])
        ],
    }
    _store_cached_events(query, size, payload)
    return {
        **payload,
        "cached": False,
    }


def normalize_ticketmaster_event(event: dict):
    classifications = event.get("classifications") or []
    classification = classifications[0] if classifications else {}
    segment = classification.get("segment", {}).get("name", "")
    genre = classification.get("genre", {}).get("name", "")
    subgenre = classification.get("subGenre", {}).get("name", "")

    venue_data = ((event.get("_embedded") or {}).get("venues") or [{}])[0]
    city = venue_data.get("city", {}).get("name", "")
    state = venue_data.get("state", {}).get("stateCode", "") or venue_data.get("state", {}).get("name", "")
    country = venue_data.get("country", {}).get("countryCode", "")
    venue_name = venue_data.get("name", "")
    location_parts = [part for part in [city, state or country] if part]

    dates = event.get("dates", {}).get("start", {})
    local_date = dates.get("localDate", "")
    local_time = dates.get("localTime", "")

    images = event.get("images") or []
    image_url = images[0].get("url", "") if images else ""

    description = (
        event.get("info")
        or event.get("pleaseNote")
        or f"{segment or 'Event'} featuring {genre.lower()}" if genre else ""
    )
    if not description:
        description = "Ticketmaster event listing."

    category = " / ".join(part for part in [segment, genre, subgenre] if part) or "event"

    return {
        "id": str(event.get("id", "")),
        "name": event.get("name", "Untitled event"),
        "category": category,
        "location": ", ".join(location_parts) or "Unknown",
        "description": description,
        "venue": venue_name,
        "start": dates.get("dateTime", ""),
        "localDate": local_date,
        "localTime": local_time,
        "timezone": event.get("dates", {}).get("timezone", ""),
        "url": event.get("url", ""),
        "imageUrl": image_url,
        "source": "ticketmaster",
    }
