import type { PortfolioPayload } from "@/lib/portfolio";
import "@/styles/Home.css";

type Props = {
  profile?: PortfolioPayload["profile"] | null;
  stats?: PortfolioPayload["aboutStats"] | null;
};

const FALLBACK_PORTRAIT = "/Images/subin_abraham_home_screen.png";

function splitLines(value: string | null | undefined) {
  return (value ?? "")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

const AboutSection = ({ profile, stats }: Props) => {
  const displayName = profile?.displayName?.trim() || "Subin";
  const portraitSrc = profile?.portraitUrl || FALLBACK_PORTRAIT;
  const portraitAlt = profile?.portraitAlt || displayName;
  const aboutTag = profile?.aboutTag?.trim() || "";
  const titleStrong = splitLines(profile?.aboutTitleStrong);
  const titleMuted = splitLines(profile?.aboutTitleMuted);
  const bio = profile?.bio?.trim() || "";
  const aboutStats = stats ?? [];

  if (
    !aboutTag &&
    titleStrong.length === 0 &&
    titleMuted.length === 0 &&
    !bio &&
    aboutStats.length === 0
  ) {
    return null;
  }

  return (
    <section id="about" className="about-impact" aria-labelledby="about-heading">
      <div className="about-impact__grid">
        <div className="about-impact__intro">
          {aboutTag ? (
            <p className="about-impact__tag">
              <span aria-hidden className="about-impact__asterisk">
                ✦
              </span>
              {aboutTag}
            </p>
          ) : null}

          {titleStrong.length > 0 || titleMuted.length > 0 ? (
            <h2 id="about-heading" className="about-impact__title">
              {titleStrong.map((line, index) => (
                <span
                  key={`strong-${index}`}
                  className="about-impact__title-line about-impact__title-strong"
                >
                  {line}
                </span>
              ))}
              {titleMuted.map((line, index) => (
                <span
                  key={`muted-${index}`}
                  className="about-impact__title-line about-impact__title-muted"
                >
                  {line}
                </span>
              ))}
            </h2>
          ) : (
            <h2 id="about-heading" className="sr-only">
              About
            </h2>
          )}
        </div>

        <figure className="about-impact__photo about-impact__photo--sm">
          <img src={portraitSrc} alt={portraitAlt} loading="lazy" decoding="async" />
        </figure>

        <div className="about-impact__photo-frame about-impact__photo-frame--lg">
          <span aria-hidden className="about-impact__corner about-impact__corner--tl">
            +
          </span>
          <span aria-hidden className="about-impact__corner about-impact__corner--tr">
            +
          </span>
          <span aria-hidden className="about-impact__corner about-impact__corner--bl">
            +
          </span>
          <span aria-hidden className="about-impact__corner about-impact__corner--br">
            +
          </span>
          <figure className="about-impact__photo about-impact__photo--lg">
            <img src={portraitSrc} alt="" loading="lazy" decoding="async" />
          </figure>
        </div>

        <div className="about-impact__content">
          <span aria-hidden className="about-impact__spark">
            ✦
          </span>

          {bio ? <p className="about-impact__lede">{bio}</p> : null}

          {aboutStats.length > 0 ? (
            <ul className="about-impact__stats">
              {aboutStats.map((stat) => (
                <li key={stat.id} className="about-impact__stat">
                  <p className="about-impact__stat-value">{stat.value}</p>
                  <div className="about-impact__stat-body">
                    <p className="about-impact__stat-title">
                      <span aria-hidden className="about-impact__asterisk">
                        ✦
                      </span>
                      {stat.title}
                    </p>
                    {stat.detail ? (
                      <p className="about-impact__stat-detail">{stat.detail}</p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
