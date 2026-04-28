import { RevealSection } from "./RevealSection";

const featureCards = [
  {
    icon: "01",
    label: "Unified Interface",
    title: "Plan, compare, save feedback, and review history in one place.",
    copy: "The core recommendation loop stays together, so users do not need to jump between tools.",
  },
  {
    icon: "02",
    label: "Smart Automation",
    title: "Plain-language prompts become ranked event suggestions.",
    copy: "The agent handles the search and ranking work while keeping the workflow easy to start.",
  },
  {
    icon: "03",
    label: "Real-time Data",
    title: "Recommendations use the current catalog and latest saved signals.",
    copy: "Feedback updates the recommendation context so the next shortlist can become more relevant.",
  },
  {
    icon: "04",
    label: "Scalable Infrastructure",
    title: "Ready for richer data, stronger auth, and larger event sets.",
    copy: "The interface stays simple while leaving room for the product to grow.",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Describe",
    copy: "Tell the agent what kind of event you want, from city and genre to crowd size and mood.",
  },
  {
    step: "02",
    title: "Get recommendations",
    copy: "Review a focused shortlist with a clear explanation of why each suggestion fits.",
  },
  {
    step: "03",
    title: "Save feedback",
    copy: "Mark events as interested, not interested, or attended so the agent learns your signals.",
  },
  {
    step: "04",
    title: "Improve results",
    copy: "Use your history to refine future searches and remove signals that no longer match your taste.",
  },
];

const useCases = [
  {
    title: "Students",
    copy: "Find affordable, social events around campus without scanning every local listing.",
  },
  {
    title: "Travelers",
    copy: "Quickly discover things to do in a new city based on the kind of night you want.",
  },
  {
    title: "Conference attendees",
    copy: "Plan useful evening options near your venue, hotel, or work schedule.",
  },
  {
    title: "Weekend planners",
    copy: "Turn a loose idea into a shortlist for Friday or Saturday without overthinking it.",
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
      <RevealSection className="how-section" id="how-it-works" aria-labelledby="how-title">
        <div className="section-heading how-heading">
          <p className="eyebrow">How it works</p>
          <h2 id="how-title">From prompt to better recommendations in four steps.</h2>
        </div>

        <div className="how-grid">
          {howItWorks.map((item) => (
            <article className="how-card" key={item.title}>
              <div className="how-marker">
                <span className="how-icon" aria-hidden="true">
                  {item.step}
                </span>
              </div>
              <div className="how-copy-card">
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </RevealSection>

      <RevealSection className="feature-section" id="features" aria-labelledby="features-title">
        <div className="section-heading feature-heading">
          <p className="eyebrow">Features</p>
          <h2 id="features-title">
            The practical pieces that make the agent{" "}
            <span className="gradient-text">useful.</span>
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

      <RevealSection className="use-section" id="use-cases" aria-labelledby="use-title">
        <div className="section-heading use-heading">
          <p className="eyebrow">Use cases</p>
          <h2 id="use-title">Designed for different ways people plan events.</h2>
        </div>

        <div className="use-grid">
          {useCases.map((item) => (
            <article className="use-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
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
