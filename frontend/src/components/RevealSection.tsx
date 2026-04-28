import { useEffect, useRef, type HTMLAttributes, type ReactNode } from "react";

interface RevealSectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
}

export function RevealSection({
  children,
  className = "",
  ...props
}: RevealSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }

    section.classList.add("is-reveal-ready");

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      section.classList.add("is-visible");
      return;
    }

    const reveal = () => {
      section.classList.add("is-visible");
    };

    const fallback = window.setTimeout(reveal, 1400);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          window.clearTimeout(fallback);
          reveal();
          observer.unobserve(section);
        }
      },
      {
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.14,
      },
    );

    observer.observe(section);

    return () => {
      window.clearTimeout(fallback);
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={["reveal-section", className].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </section>
  );
}
