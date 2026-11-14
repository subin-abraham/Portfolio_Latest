import { useEffect, useRef, type CSSProperties } from "react";
import type { PortfolioPayload } from "@/lib/portfolio";
import "@/styles/Home.css";

type Props = {
  experiences?: PortfolioPayload["experiences"] | null;
  education?: PortfolioPayload["education"] | null;
};

const ACCENTS = [
  "linear-gradient(155deg, #ff8a4c 0%, #f63e04 48%, #b91c00 100%)",
  "linear-gradient(155deg, #ffb07a 0%, #ff6a2b 45%, #d92a00 100%)",
  "linear-gradient(155deg, #f5c4a8 0%, #e86b3a 50%, #a61f00 100%)",
  "linear-gradient(155deg, #ffd0b8 0%, #f63e04 55%, #8f1600 100%)",
] as const;

const STACK_TOP_PX = 88;

function formatPeriod(
  startDate: string,
  endDate: string | null | undefined,
  isCurrent?: boolean
) {
  const start = startDate.trim();
  if (!start) return "";
  const end = isCurrent ? "Present" : (endDate ?? "").trim();
  return end ? `${start} – ${end}` : start;
}

function parseTags(value: string | null | undefined) {
  return (value ?? "")
    .split(/[\n,]+/)
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function monogramFrom(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function padIndex(index: number) {
  return String(index + 1).padStart(3, "0");
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function supportsViewTimeline() {
  return (
    typeof CSS !== "undefined" &&
    typeof CSS.supports === "function" &&
    CSS.supports("animation-timeline", "view()")
  );
}

function useStackRecede(enabled: boolean) {
  const stackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const root = stackRef.current;
    if (!root) return;
    if (supportsViewTimeline()) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cards = Array.from(
      root.querySelectorAll<HTMLElement>("[data-stack-card]")
    );

    let frame = 0;
    const update = () => {
      frame = 0;
      const range = Math.max(160, window.innerHeight * 0.45);

      cards.forEach((card, index) => {
        if (index >= cards.length - 1) {
          card.style.setProperty("--recede", "0");
          return;
        }

        const next = cards[index + 1];
        const nextTop = next.getBoundingClientRect().top;
        const progress = clamp(1 - (nextTop - STACK_TOP_PX) / range, 0, 1);
        card.style.setProperty("--recede", progress.toFixed(3));
      });
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [enabled]);

  return stackRef;
}

type EntryCardProps = {
  index: number;
  title: string;
  meta: string;
  summary: string;
  tags: string[];
  monogram: string;
  accent: string;
  stacked?: boolean;
  stackIndex?: number;
  stackCount?: number;
};

const EntryCard = ({
  index,
  title,
  meta,
  summary,
  tags,
  monogram,
  accent,
  stacked = false,
  stackIndex = 0,
  stackCount = 1,
}: EntryCardProps) => {
  const card = (
    <article
      className={`career-entry${stacked ? " career-entry--stack" : ""}`}
      data-stack-card={stacked ? "" : undefined}
      style={
        stacked
          ? ({
              "--stack-index": stackIndex,
              "--stack-count": stackCount,
            } as CSSProperties)
          : undefined
      }
    >
      <div className="career-entry__copy">
        <p className="career-entry__index">
          <span aria-hidden className="about-impact__asterisk">
            ✦
          </span>
          /{padIndex(index)}
        </p>

        <div className="career-entry__body">
          <h3 className="career-entry__title">{title}</h3>
          {meta ? <p className="career-entry__meta">{meta}</p> : null}
          {summary ? <p className="career-entry__summary">{summary}</p> : null}

          {tags.length > 0 ? (
            <ul className="career-entry__tags">
              {tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      <div className="career-entry__visual" style={{ background: accent }}>
        <span className="career-entry__monogram" aria-hidden>
          {monogram}
        </span>
        <div className="career-entry__dots" aria-hidden>
          <span />
          <span />
          <span />
        </div>
      </div>
    </article>
  );

  if (!stacked) return card;

  return (
    <div
      className="career-stack__slot"
      style={
        {
          "--stack-index": stackIndex,
          zIndex: stackIndex + 1,
        } as CSSProperties
      }
    >
      {card}
    </div>
  );
};

const ExperienceEducationSection = ({ experiences, education }: Props) => {
  const experienceItems = experiences ?? [];
  const educationItems = education ?? [];
  const stackEnabled = experienceItems.length > 1;
  const stackRef = useStackRecede(stackEnabled);

  if (experienceItems.length === 0 && educationItems.length === 0) {
    return null;
  }

  return (
    <section
      id="experience"
      className="career-board"
      aria-labelledby="experience-heading"
    >
      <div className="career-board__inner">
        {experienceItems.length > 0 ? (
          <>
            <header className="career-board__header">
              <p className="about-impact__tag">
                <span aria-hidden className="about-impact__asterisk">
                  ✦
                </span>
                Experience
              </p>
              <h2 id="experience-heading" className="career-board__title">
                <span className="about-impact__title-strong">Career Path</span>
                <span className="about-impact__title-muted">
                  Built In Production
                </span>
              </h2>
            </header>

            <div
              ref={stackRef}
              className={
                stackEnabled ? "career-board__stack" : "career-board__list"
              }
              style={
                stackEnabled
                  ? ({ "--stack-count": experienceItems.length } as CSSProperties)
                  : undefined
              }
            >
              {experienceItems.map((item, index) => (
                <EntryCard
                  key={item.id}
                  index={index}
                  title={item.role}
                  meta={[
                    item.company,
                    formatPeriod(item.startDate, item.endDate, item.isCurrent),
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                  summary={item.summary}
                  tags={parseTags(item.tags)}
                  monogram={monogramFrom(item.company)}
                  accent={ACCENTS[index % ACCENTS.length]}
                  stacked={stackEnabled}
                  stackIndex={index}
                  stackCount={experienceItems.length}
                />
              ))}
            </div>
          </>
        ) : null}

        {educationItems.length > 0 ? (
          <>
            <header
              className={`career-board__header${
                experienceItems.length > 0
                  ? " career-board__header--education"
                  : ""
              }`}
            >
              <p className="about-impact__tag">
                <span aria-hidden className="about-impact__asterisk">
                  ✦
                </span>
                Education
              </p>
              <h2 id="education-heading" className="career-board__title">
                <span className="about-impact__title-strong">Academic</span>
                <span className="about-impact__title-muted">Foundation</span>
              </h2>
            </header>

            <div
              className="career-board__list"
              aria-labelledby="education-heading"
            >
              {educationItems.map((item, index) => (
                <EntryCard
                  key={item.id}
                  index={index}
                  title={
                    item.field ? `${item.degree} — ${item.field}` : item.degree
                  }
                  meta={[
                    item.institution,
                    formatPeriod(item.startDate, item.endDate),
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                  summary={item.summary}
                  tags={parseTags(item.tags)}
                  monogram={monogramFrom(item.institution)}
                  accent={ACCENTS[(index + 3) % ACCENTS.length]}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
};

export default ExperienceEducationSection;
