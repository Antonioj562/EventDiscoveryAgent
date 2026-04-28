import { RevealSection } from "./RevealSection";

const featureCards = [
  {
    icon: "01",
    label: "Taste memory",
    title: "Recommendations shaped by previous feedback.",
    copy: "Interested, attended, and skipped events all become visible context for the next shortlist.",
  },
  {
    icon: "02",
    label: "Transparent ranking",
    title: "The agent explains why each set belongs.",
    copy: "Short summaries keep the reasoning close to the results, so the list feels curated instead of random.",
  },
  {
    icon: "03",
    label: "Mixed intent",
    title: "Useful for students, nightlife plans, and travel days.",
    copy: "Prompts can stay social and loose, or become practical around location, schedule, and crowd size.",
  },
  {
    icon: "04",
    label: "Fast iteration",
    title: "Scroll, refine, save, and remove signals.",
    copy: "The feedback history stays editable, which keeps the recommendation loop from drifting.",
  },
];

const agentPros = [
  {
    title: "Unified Interface",
    copy: "Plan, compare, save feedback, and review history without jumping between tools.",
  },
  {
    title: "Smart Automation",
    copy: "The agent turns plain-language prompts into ranked event suggestions.",
  },
  {
    title: "Real-time Data",
    copy: "Recommendations are built from the current catalog and your latest saved signals.",
  },
  {
    title: "Scalable Infrastructure",
    copy: "The interface is ready for stronger auth, richer data sources, and larger event sets.",
  },
];

const faqs = [
  {
    question: "What should I type into the recommendation prompt?",
    answer:
      "Describe the kind of night you want in plain language. Include details like city, music style, crowd size, mood, budget, or whether you want something low-key or high-energy.",
  },
  {
    question: "Why do I need to mark events as interested or not interested?",
    answer:
      "Those actions teach the agent what fits your taste. Future recommendations use that feedback to avoid weak matches and surface events closer to what you actually want.",
  },
  {
    question: "Where can I see or remove saved feedback?",
    answer:
      "Open the History page to review interested, not interested, and attended signals. You can remove anything that no longer reflects your preferences.",
  },
  {
    question: "What if the recommendations feel too broad?",
    answer:
      "Make the prompt more specific. Add constraints like neighborhood, date range, genre, venue type, energy level, or examples of events you liked or disliked.",
  },
];

export function AuthScrollSections() {
  return (
    <>
      <RevealSection className="feature-section" id="features" aria-labelledby="features-title">
        <div className="section-heading feature-heading">
          <p className="eyebrow">Discovery Loop</p>
          <h2 id="features-title">
            A quick look at what the agent helps{" "}
            <span className="gradient-text">coordinate.</span>
          </h2>
        </div>

        <div className="feature-rail" aria-label="Product features">
          {featureCards.map((feature) => (
            <article className="feature-card" key={feature.title}>
              <span className="feature-icon">{feature.icon}</span>
              <p className="feature-label">{feature.label}</p>
              <h3>{feature.title}</h3>
              <p>{feature.copy}</p>
            </article>
          ))}
        </div>
      </RevealSection>

      <RevealSection className="about-section" id="about" aria-labelledby="about-title">
        <div className="about-content">
          <div className="section-heading">
            <p className="eyebrow">About</p>
            <h2 id="about-title">Built for fast, low-friction event decisions.</h2>
          </div>
          <p>
            Event Discovery keeps the recommendation loop simple: describe the kind of
            night you want, review a short explanation, and use feedback to improve what
            the agent remembers next time.
          </p>
        </div>

        <div className="about-pros" aria-label="Agent advantages">
          {agentPros.map((item) => (
            <article className="about-pro-card" key={item.title}>
              <span className="about-check" aria-hidden="true">
                &#10003;
              </span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </RevealSection>

      <RevealSection className="faq-section" id="faq" aria-labelledby="faq-title">
        <div className="section-heading faq-heading">
          <p className="eyebrow">FAQ</p>
          <h2 id="faq-title">Common questions before you start.</h2>
        </div>

        <div className="faq-list">
          {faqs.map((item) => (
            <details className="faq-item" key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </RevealSection>
    </>
  );
}
