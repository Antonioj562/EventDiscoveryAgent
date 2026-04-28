from backend.config import get_env

try:
    from google import genai
except ImportError:  # pragma: no cover - defensive for local envs
    genai = None

GOOGLE_API_KEY = get_env("GOOGLE_API_KEY")
client = genai.Client(api_key=GOOGLE_API_KEY) if genai and GOOGLE_API_KEY else None

def generate_llm_response(prompt: str):
    if not client:
        return "Recommendations were ranked using Ticketmaster search results and your saved feedback history."

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
    except Exception:
        return "Recommendations were ranked using Ticketmaster search results and your saved feedback history."

    return getattr(response, "output_text", None) or getattr(response, "text", "")


def embed_text(text: str):
    if not client:
        raise RuntimeError("Gemini embeddings are unavailable because GOOGLE_API_KEY is not configured.")

    response = client.models.embed_content(
        model="gemini-embedding-001",
        contents=text
    )

    return response.embeddings[0].values
