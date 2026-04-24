import { FormEvent, useState } from "react";
import { AgentPulse } from "../components/AgentPulse";
import { useAuth } from "../context/AuthContext";
import { fetchRecommendations, submitFeedback } from "../lib/api";
import type { EventRecommendation, FeedbackType } from "../types";

const starterPrompts = [
  "I like intimate indie concerts in Los Angeles.",
  "Find mellow acoustic sets and singer-songwriter nights.",
  "I want underground live music with smaller crowds.",
];

export function RecommendedPage() {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState(starterPrompts[0]);
  const [events, setEvents] = useState<EventRecommendation[]>([]);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const resultCountLabel = !events.length
    ? "No recommendations yet"
    : `${events.length} suggested event${events.length > 1 ? "s" : ""}`;

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
      await submitFeedback(user.sessionId, item.description, feedback);
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

        {error ? <p className="form-error">{error}</p> : null}
        {feedbackMessage ? <p className="success-copy">{feedbackMessage}</p> : null}
      </section>

      <section className="results-card">
        <div className="section-heading">
          <p className="eyebrow">Suggested Events</p>
          <h3>Concerts worth a closer look</h3>
        </div>

        <div className="event-list">
          {events.length ? (
            events.map((item) => (
              <article key={item.id} className="event-card">
                <div className="event-meta">
                  <span>{item.category}</span>
                  <span>{item.location}</span>
                </div>
                <h4>{item.name}</h4>
                <p>{item.description}</p>

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
