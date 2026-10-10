import { useNavigate } from 'react-router-dom';
import { Zap } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section
      id="home"
      className="hero-portfolio relative min-h-[100svh] overflow-hidden"
      aria-label="Portfolio introduction"
    >
      <div className="hero-portfolio__grain pointer-events-none absolute inset-0 z-[1]" aria-hidden="true" />

      {/* Outlined PORTFOLIO — 90% width / 5% sides from 13" (1280px)+ */}
      <div
        className="pointer-events-none absolute left-[4%] right-[4%] top-[50%] z-[2] -translate-y-1/2 select-none min-[1280px]:left-[5%] min-[1280px]:right-[5%]"
        aria-hidden="true"
      >
        <svg
          className="hero-portfolio__outline-svg w-full overflow-visible"
          viewBox="0 0 1000 260"
          preserveAspectRatio="xMidYMid meet"
        >
          <text
            x="500"
            y="195"
            textAnchor="middle"
            fill="none"
            stroke="rgba(155, 195, 255, 0.4)"
            strokeWidth="2.5"
            strokeLinejoin="round"
            fontFamily="Anton, Impact, sans-serif"
            fontSize="165"
            textLength="980"
            lengthAdjust="spacingAndGlyphs"
          >
            PORTFOLIO
          </text>
        </svg>
      </div>

      {/* Name */}
      <div className="absolute left-0 right-0 top-[max(5.25rem,10%)] z-30 flex flex-col items-center px-4">
        <p className="hero-portfolio__intro font-body text-[0.65rem] font-medium uppercase tracking-[0.38em] text-white/95 sm:text-xs">
          My name is
        </p>
        <h1 className="hero-portfolio__name mt-2 flex items-center gap-2 font-heading text-xl font-bold uppercase tracking-[0.12em] text-white sm:gap-3 sm:text-3xl md:text-4xl">
          <Zap
            className="h-4 w-4 shrink-0 fill-[#FFE566] text-[#FFE566] sm:h-5 sm:w-5"
            aria-hidden="true"
          />
          <span>
            Subin <span className="text-[#FFE566]">Abraham</span>
          </span>
        </h1>
      </div>

      {/* Solid PORT-FOLIO — 90% width / 5% sides from 13"+ */}
      <div
        className="pointer-events-none absolute left-[4%] right-[4%] top-[52%] z-[10] -translate-y-1/2 select-none min-[1280px]:left-[5%] min-[1280px]:right-[5%]"
        aria-hidden="true"
      >
        <svg
          className="hero-portfolio__wordmark-svg w-full overflow-visible"
          viewBox="0 0 1000 260"
          preserveAspectRatio="xMidYMid meet"
        >
          <text
            x="500"
            y="195"
            textAnchor="middle"
            fill="#ffffff"
            fontFamily="Anton, Impact, sans-serif"
            fontSize="155"
            textLength="960"
            lengthAdjust="spacingAndGlyphs"
          >
            PORT-FOLIO
          </text>
        </svg>
      </div>
      <h2 className="sr-only">Portfolio</h2>

      {/* Avatar — larger on 13"+ */}
      <div className="absolute inset-x-0 bottom-0 top-[20%] z-20 flex items-end justify-center min-[1280px]:top-[12%]">
        <div className="absolute bottom-0 left-1/2 w-[min(72vw,480px)] -translate-x-1/2 min-[1280px]:w-[min(46vw,720px)] min-[1536px]:w-[min(44vw,780px)]">
          <div className="hero-portfolio__avatar">
            <img
              src="/Images/waving-avatar.png"
              alt="3D avatar of Subin Abraham waving"
              className="h-auto w-full object-contain object-bottom drop-shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
              draggable={false}
            />
          </div>
        </div>
      </div>

      {/* Arrows */}
      <svg
        className="hero-portfolio__arrow hero-portfolio__arrow--top pointer-events-none absolute left-[3%] top-[15%] z-[25] hidden h-[16vh] w-[20vw] max-w-56 text-[#FFE566] sm:block"
        viewBox="0 0 220 180"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M28 18 C 48 70, 70 105, 155 145"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeDasharray="7 6"
          strokeLinecap="round"
        />
        <path
          d="M142 132 L155 145 L135 148"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <svg
        className="hero-portfolio__arrow hero-portfolio__arrow--bottom pointer-events-none absolute bottom-[14%] right-[3%] z-[25] h-[12vh] w-[22vw] max-h-36 max-w-64 text-[#F5E6A8] sm:right-[5%]"
        viewBox="0 0 220 100"
        fill="none"
        aria-hidden="true"
      >
        {/* Dashed shaft + open chevron tip (tip = line end) */}
        <path
          d="M14 20 L155 68"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeDasharray="9 7"
          strokeLinecap="round"
        />
        <path
          d="M142 54 L162 70 L138 76"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* CTA */}
      <div className="hero-portfolio__cta absolute bottom-[6%] right-[4%] z-30 sm:bottom-[8%] sm:right-[6%]">
        <button
          type="button"
          onClick={() => navigate('/about')}
          className="-rotate-[12deg] rounded-full bg-[#FFE566] px-5 py-2.5 font-heading text-sm font-bold text-[#0a1a4a] shadow-[0_0_28px_rgba(255,229,102,0.55)] transition-transform duration-300 hover:-rotate-[8deg] hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFE566] sm:px-7 sm:py-3 sm:text-base"
        >
          More <span className="uppercase">About</span> me
        </button>
      </div>
    </section>
  );
};

export default Hero;
