import type {
  EventRecommendation,
  FeedbackType,
  HistoryResponse,
  RecommendationResponse,
} from "../types";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL?.trim() || "http://127.0.0.1:8000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Request failed");
  }

  return response.json() as Promise<T>;
}

export function getApiBaseUrl() {
  return API_BASE;
}

export function fetchRecommendations(sessionId: string, text: string) {
  return request<RecommendationResponse>("/events/recommend", {
    method: "POST",
    body: JSON.stringify({ session_id: sessionId, text }),
  });
}

export function submitFeedback(
  sessionId: string,
  event: EventRecommendation,
  feedback: FeedbackType,
) {
  return request<{ message: string }>("/events/feedback", {
    method: "POST",
    body: JSON.stringify({
      session_id: sessionId,
      event,
      feedback,
    }),
  });
}

export function fetchHistory(sessionId: string) {
  return request<HistoryResponse>(`/events/history/${sessionId}`);
}

export function removeHistoryItem(
  sessionId: string,
  eventId: string,
  feedback: FeedbackType,
) {
  return request<{ message: string }>(`/events/history/${sessionId}`, {
    method: "DELETE",
    body: JSON.stringify({
      event_id: eventId,
      feedback,
    }),
  });
}
