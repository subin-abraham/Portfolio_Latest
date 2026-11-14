import LibAtomBtn from "@/components/ui/lib-atom-btn";

type NavLink = {
  label: string;
  href: string;
  active?: boolean;
};

const navLinks: NavLink[] = [
  { label: "Home", href: "#home", active: true },
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Experience", href: "#experience" },
  { label: "Expertise", href: "#expertise" },
  { label: "Contact", href: "#contact" },
];

const Header = () => {
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-50">
      <div className="pointer-events-auto mx-auto flex h-[clamp(4rem,5.5vw,5.5rem)] w-full items-center justify-between px-[clamp(1.25rem,3.3vw,3rem)]">
        <a
          href="#home"
          className="font-heading text-[clamp(1.125rem,1.25vw,2rem)] font-semibold tracking-tight text-white"
        >
          Subin<span className="align-super text-[0.55em]">®</span>
        </a>

        <nav
          aria-label="Primary"
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 md:flex lg:gap-9"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`relative font-body text-[0.7rem] font-medium uppercase tracking-[0.18em] text-white/90 transition-colors hover:text-white lg:text-xs ${
                link.active ? "text-white" : ""
              }`}
            >
              {link.label}
              {link.active ? (
                <span
                  aria-hidden
                  className="absolute -bottom-1.5 left-0 h-px w-full bg-white"
                />
              ) : null}
            </a>
          ))}
        </nav>

        <LibAtomBtn
          variant="ghost"
          tone="white"
          size="icon"
          aria-label="Open menu"
          className="flex-col items-end justify-center gap-[7px] hover:bg-transparent active:scale-100"
        >
          <span aria-hidden className="block h-px w-7 bg-current" />
          <span aria-hidden className="block h-px w-5 bg-current" />
        </LibAtomBtn>
      </div>
    </header>
  );
};

export default Header;
