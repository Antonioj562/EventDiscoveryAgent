import { RevealSection } from "./RevealSection";

interface AgentPulseProps {
  isLoading: boolean;
  hasResults: boolean;
}

const steps = [
  "Reading your taste and venue preferences",
  "Scanning the event catalog for matching signals",
  "Ranking concert fits against your feedback history",
  "Generating a concise summary of why these picks work",
];

export function AgentPulse({ isLoading, hasResults }: AgentPulseProps) {
  return (
    <RevealSection className="agent-panel">
      <div className="section-heading">
        <p className="eyebrow">Agent Activity</p>
        <h3>Show the intelligence, not just the result.</h3>
      </div>

      <div className="agent-steps">
        {steps.map((step, index) => {
          const activeIndex = isLoading ? index === 1 || index === 2 : false;
          const complete = hasResults && !isLoading;

          return (
            <div className="agent-step" key={step}>
              <div
                className={
                  activeIndex
                    ? "step-dot is-active"
                    : complete
                      ? "step-dot is-complete"
                      : "step-dot"
                }
              />
              <p>{step}</p>
            </div>
          );
        })}
      </div>

      <p className="agent-note">
        {isLoading
          ? "Scanning the catalog and weighing your saved feedback."
          : hasResults
            ? "Recommendation logic is ready for another prompt."
            : "Run a prompt to start the recommendation loop."}
      </p>
    </RevealSection>
  );
}
