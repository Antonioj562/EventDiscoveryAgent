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

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      section.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add("is-visible");
          observer.unobserve(section);
        }
      },
      {
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.14,
      },
    );

    observer.observe(section);

    return () => observer.disconnect();
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
