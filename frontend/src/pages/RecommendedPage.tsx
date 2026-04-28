import { FormEvent, useEffect, useState } from "react";
import { AgentPulse } from "../components/AgentPulse";
import { useAuth } from "../context/AuthContext";
import { fetchRecommendations, submitFeedback } from "../lib/api";
import type { EventRecommendation, FeedbackType } from "../types";

const starterPrompts = [
  "I like intimate indie concerts in Los Angeles.",
  "Find mellow acoustic sets and singer-songwriter nights.",
  "I want underground live music with smaller crowds.",
];

interface StoredRecommendations {
  prompt: string;
  events: EventRecommendation[];
  summary: string;
  meta?: {
    source: string;
    fallback_reason?: string | null;
    cached: boolean;
    attempts?: Array<{
      keyword: string;
      city: string;
      classificationName: string;
      attempt: number;
    }>;
  };
}

export function RecommendedPage() {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState(starterPrompts[0]);
  const [events, setEvents] = useState<EventRecommendation[]>([]);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [meta, setMeta] = useState<StoredRecommendations["meta"]>();

  const resultCountLabel = !events.length
    ? "No recommendations yet"
    : `${events.length} suggested event${events.length > 1 ? "s" : ""}`;

  useEffect(() => {
    if (!user) {
      return;
    }

    const raw = window.localStorage.getItem(`eda.recommendations.${user.sessionId}`);
    if (!raw) {
      return;
    }

    try {
      const stored = JSON.parse(raw) as StoredRecommendations;
      setPrompt(stored.prompt || starterPrompts[0]);
      setEvents(stored.events || []);
      setSummary(stored.summary || "");
      setMeta(stored.meta);
    } catch {
      window.localStorage.removeItem(`eda.recommendations.${user.sessionId}`);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const payload: StoredRecommendations = {
      prompt,
      events,
      summary,
      meta,
    };

    window.localStorage.setItem(
      `eda.recommendations.${user.sessionId}`,
      JSON.stringify(payload),
    );
  }, [events, meta, prompt, summary, user]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) {
      return;
    }

    setLoading(true);
    setError("");
    setFeedbackMessage("");

    try {
      const response = await fetchRecommendations(user.sessionId, prompt);
      setEvents(response.recommendations);
      setSummary(response.explanation);
      setMeta(response.meta);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to generate recommendations.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleFeedback(item: EventRecommendation, feedback: FeedbackType) {
    if (!user) {
      return;
    }

    try {
      await submitFeedback(user.sessionId, item, feedback);
      setFeedbackMessage(`Saved "${item.name}" as ${feedback.replace("_", " ")}.`);
    } catch (requestError) {
      setFeedbackMessage(
        requestError instanceof Error
          ? requestError.message
          : "Could not save feedback.",
      );
    }
  }

  return (
    <div className="page-grid">
      <section className="hero-card">
        <div className="section-heading">
          <p className="eyebrow">Recommendation Studio</p>
          <h2>Prompt the concert agent like a curator, not a search bar.</h2>
        </div>

        <form onSubmit={handleSubmit} className="prompt-form">
          <label>
            Describe the kind of night you want
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              rows={4}
              placeholder="Small indie sets, late evening, low-key atmosphere..."
            />
          </label>

          <div className="starter-row">
            {starterPrompts.map((item) => (
              <button
                key={item}
                type="button"
                className="chip-button"
                onClick={() => setPrompt(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="form-actions">
            <button type="submit" className="primary-button" disabled={loading}>
              {loading ? "Generating..." : "Generate summary and suggestions"}
            </button>
            <p className="muted-copy">{resultCountLabel}</p>
          </div>
        </form>
      </section>

      <AgentPulse isLoading={loading} hasResults={events.length > 0 || !!summary} />

      <section className="summary-card">
        <div className="section-heading">
          <p className="eyebrow">Summary</p>
          <h3>Why these suggestions match</h3>
        </div>

        <p className="summary-copy">
          {summary ||
            "Run a recommendation prompt to generate a short explanation from the agent."}
        </p>

        {meta ? (
          <p className="muted-copy">
            Data source: {meta.source}
            {meta.cached ? " | cached" : ""}
            {meta.fallback_reason ? ` | ${meta.fallback_reason}` : ""}
          </p>
        ) : null}

        {meta?.attempts?.length ? (
          <p className="muted-copy">
            Attempts:{" "}
            {meta.attempts
              .map((attempt) =>
                `${attempt.attempt}. ${attempt.keyword}${attempt.city ? ` in ${attempt.city}` : ""}`,
              )
              .join(" | ")}
          </p>
        ) : null}

        {error ? <p className="form-error">{error}</p> : null}
        {feedbackMessage ? <p className="success-copy">{feedbackMessage}</p> : null}
      </section>

      <section className="results-card">
        <div className="section-heading">
          <p className="eyebrow">Suggested Events</p>
          <h3>Events worth a closer look</h3>
        </div>

        <div className="event-list">
          {events.length ? (
            events.map((item) => (
              <article key={item.id} className="event-card">
                <div className="event-meta">
                  <span>{item.category}</span>
                  <span>{item.location}</span>
                </div>
                <div className="event-detail-row">
                  <span>{item.venue || "Venue TBA"}</span>
                  <span>
                    {[item.localDate, item.localTime].filter(Boolean).join(" | ") || "Time TBA"}
                  </span>
                </div>
                <h4>{item.name}</h4>
                <p>{item.description}</p>

                {item.url ? (
                  <a
                    className="event-link"
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View listing
                  </a>
                ) : null}

                <div className="feedback-row">
                  <button onClick={() => handleFeedback(item, "interested")}>
                    Interested
                  </button>
                  <button onClick={() => handleFeedback(item, "not_interested")}>
                    Not interested
                  </button>
                  <button onClick={() => handleFeedback(item, "attended")}>
                    Attended
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="empty-state">
              <p>No event cards yet. Start with a prompt above.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
