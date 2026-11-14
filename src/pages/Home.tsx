import "@/styles/Home.css";
import type { PortfolioPayload } from "@/lib/portfolio";

type Props = {
  profile: PortfolioPayload["profile"] | null;
};

const FALLBACK_TAGLINE =
  "I design user-centered digital experiences that are simple smart and impactful";
const FALLBACK_PORTRAIT = "/Images/subin_abraham_home_screen.png";

const Home = ({ profile }: Props) => {
  const displayName = profile?.displayName?.trim() || "Subin";
  const tagline = profile?.tagline?.trim() || FALLBACK_TAGLINE;
  const portraitSrc = profile?.portraitUrl || FALLBACK_PORTRAIT;
  const portraitAlt = profile?.portraitAlt || displayName;

  return (
    <section
      id="home"
      className="home-hero relative min-h-[100svh] overflow-hidden text-white"
    >
      <div aria-hidden className="home-grid pointer-events-none absolute inset-0" />
      <div aria-hidden className="home-crosses pointer-events-none absolute inset-0" />

      <p
        aria-hidden
        className="home-bg-name anim-rise pointer-events-none absolute inset-x-0 top-[4%] z-[1] select-none text-center font-heading font-semibold uppercase leading-none tracking-[-0.07em]"
      >
        {displayName.split(/\s+/)[0] || displayName}
      </p>

      <div className="anim-fade-up-delayed pointer-events-none absolute inset-x-0 bottom-0 z-[2] flex justify-center">
        <div className="home-portrait-frame relative">
          <img
            src={portraitSrc}
            alt={portraitAlt}
            className="home-portrait-img absolute inset-0 h-full w-full object-contain object-bottom"
          />
          <img
            aria-hidden
            src={portraitSrc}
            alt=""
            className="home-portrait-blur absolute inset-0 h-full w-full object-contain object-bottom"
          />
          <div
            aria-hidden
            className="home-portrait-tint pointer-events-none absolute inset-0"
          />
          <div
            aria-hidden
            className="home-portrait-fade pointer-events-none absolute inset-x-0 bottom-0"
          />
        </div>
      </div>

      <p className="anim-fade-in absolute left-[clamp(1.25rem,3.3vw,3rem)] top-[clamp(5.5rem,8vw,8rem)] z-[3] max-w-[15rem] font-body text-[clamp(0.65rem,0.75vw,0.8rem)] font-medium uppercase leading-[1.6] tracking-[0.16em] text-white/95">
        {tagline}
      </p>

      <div className="anim-fade-up-late absolute bottom-[clamp(1.25rem,2.5vw,2.5rem)] left-[clamp(1.25rem,3.3vw,3rem)] z-[3]">
        <p className="mb-1 font-body text-[clamp(0.65rem,0.8vw,0.85rem)] font-medium tracking-[0.22em] text-white/80">
          ©{new Date().getFullYear()}
        </p>
        <h1 className="font-heading text-[clamp(3rem,11vw,18rem)] font-semibold uppercase leading-[0.82] tracking-[-0.045em] text-white">
          {displayName.split(/\s+/)[0] || displayName}
        </h1>
      </div>
    </section>
  );
};

export default Home;
