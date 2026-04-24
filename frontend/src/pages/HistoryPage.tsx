import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchHistory, removeHistoryItem } from "../lib/api";
import type { FeedbackType } from "../types";

interface HistoryItem {
  type: FeedbackType;
  text: string;
}

const filters: Array<{ label: string; value: "all" | FeedbackType }> = [
  { label: "All activity", value: "all" },
  { label: "Interested", value: "interested" },
  { label: "Not interested", value: "not_interested" },
  { label: "Attended", value: "attended" },
];

export function HistoryPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [filter, setFilter] = useState<"all" | FeedbackType>("all");
  const [status, setStatus] = useState("Loading history...");

  useEffect(() => {
    async function loadHistory() {
      if (!user) {
        return;
      }

      try {
        const response = await fetchHistory(user.sessionId);
        const nextItems: HistoryItem[] = [
          ...response.history.interested.map((text) => ({
            type: "interested" as const,
            text,
          })),
          ...response.history.not_interested.map((text) => ({
            type: "not_interested" as const,
            text,
          })),
          ...response.history.attended.map((text) => ({
            type: "attended" as const,
            text,
          })),
        ];

        setItems(nextItems);
        setStatus(nextItems.length ? "" : "No history yet. Give feedback on recommendations.");
      } catch (error) {
        setStatus(error instanceof Error ? error.message : "Unable to load history.");
      }
    }

    void loadHistory();
  }, [user]);

  const filteredItems =
    filter === "all" ? items : items.filter((item) => item.type === filter);

  async function handleRemove(item: HistoryItem) {
    if (!user) {
      return;
    }

    try {
      await removeHistoryItem(user.sessionId, item.text, item.type);
      setItems((current) =>
        current.filter(
          (entry) => !(entry.text === item.text && entry.type === item.type),
        ),
      );
      setStatus("");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to remove item.");
    }
  }

  return (
    <div className="history-layout">
      <section className="history-header">
        <div className="section-heading">
          <p className="eyebrow">Feedback History</p>
          <h2>Inspect and edit what the agent has learned.</h2>
        </div>

        <label className="filter-field">
          Filter
          <select value={filter} onChange={(event) => setFilter(event.target.value as typeof filter)}>
            {filters.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section className="history-list-card">
        {status ? <p className="muted-copy">{status}</p> : null}

        {filteredItems.length ? (
          <div className="history-list">
            {filteredItems.map((item) => (
              <article key={`${item.type}-${item.text}`} className="history-item">
                <div>
                  <span className={`history-tag history-tag-${item.type}`}>
                    {item.type.replace("_", " ")}
                  </span>
                  <p>{item.text}</p>
                </div>

                <button className="ghost-button" onClick={() => handleRemove(item)}>
                  Remove
                </button>
              </article>
            ))}
          </div>
        ) : (
          !status && (
            <div className="empty-state">
              <p>No items match the selected filter.</p>
            </div>
          )
        )}
      </section>
    </div>
  );
}
