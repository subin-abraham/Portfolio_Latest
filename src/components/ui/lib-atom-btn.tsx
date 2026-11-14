import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";

type ClassValue = string | false | null | undefined | 0 | ClassValue[];

function cn(...values: ClassValue[]) {
  const out: string[] = [];
  for (const value of values) {
    if (!value) continue;
    if (Array.isArray(value)) {
      out.push(cn(...value));
      continue;
    }
    out.push(value);
  }
  return out.filter(Boolean).join(" ");
}

export type LibAtomBtnVariant = "solid" | "outline" | "ghost" | "soft" | "link";
export type LibAtomBtnSize = "sm" | "md" | "lg" | "icon" | "icon-sm";
export type LibAtomBtnTone = "theme" | "white" | "black" | "inverse";

type LibAtomBtnSharedProps = {
  variant?: LibAtomBtnVariant;
  size?: LibAtomBtnSize;
  tone?: LibAtomBtnTone;
  fullWidth?: boolean;
  loading?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  className?: string;
  children?: ReactNode;
};

type LibAtomBtnAsButton = LibAtomBtnSharedProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof LibAtomBtnSharedProps> & {
    as?: "button";
    href?: never;
  };

type LibAtomBtnAsAnchor = LibAtomBtnSharedProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LibAtomBtnSharedProps> & {
    as: "a";
    href: string;
  };

export type LibAtomBtnProps = LibAtomBtnAsButton | LibAtomBtnAsAnchor;

const sizeClasses: Record<LibAtomBtnSize, string> = {
  sm: "h-9 gap-1.5 px-3.5 text-[0.7rem] tracking-[0.14em]",
  md: "h-11 gap-2 px-5 text-xs tracking-[0.16em]",
  lg: "h-12 gap-2.5 px-7 text-[0.8rem] tracking-[0.18em]",
  icon: "h-10 w-10 gap-0 p-0",
  "icon-sm": "h-8 w-8 gap-0 p-0",
};

const toneSolid: Record<LibAtomBtnTone, string> = {
  theme:
    "bg-theme text-white hover:brightness-110 active:brightness-95 focus-visible:ring-theme/40",
  white:
    "bg-white text-black hover:bg-white/90 active:bg-white/80 focus-visible:ring-white/40",
  black:
    "bg-black text-white hover:bg-black/90 active:bg-black/80 focus-visible:ring-black/30",
  inverse:
    "bg-white text-theme hover:bg-white/90 active:bg-white/80 focus-visible:ring-white/40",
};

const toneOutline: Record<LibAtomBtnTone, string> = {
  theme:
    "border-theme text-theme hover:bg-theme/10 focus-visible:ring-theme/30",
  white:
    "border-white/80 text-white hover:bg-white/10 focus-visible:ring-white/30",
  black:
    "border-black/80 text-black hover:bg-black/5 focus-visible:ring-black/20",
  inverse:
    "border-white text-white hover:bg-white/10 focus-visible:ring-white/30",
};

const toneGhost: Record<LibAtomBtnTone, string> = {
  theme: "text-theme hover:bg-theme/10 focus-visible:ring-theme/30",
  white: "text-white hover:bg-white/10 focus-visible:ring-white/30",
  black: "text-black hover:bg-black/5 focus-visible:ring-black/20",
  inverse: "text-white hover:bg-white/10 focus-visible:ring-white/30",
};

const toneSoft: Record<LibAtomBtnTone, string> = {
  theme:
    "bg-theme/15 text-theme hover:bg-theme/25 focus-visible:ring-theme/30",
  white:
    "bg-white/15 text-white hover:bg-white/25 focus-visible:ring-white/30",
  black:
    "bg-black/10 text-black hover:bg-black/15 focus-visible:ring-black/20",
  inverse:
    "bg-white/15 text-white hover:bg-white/25 focus-visible:ring-white/30",
};

const toneLink: Record<LibAtomBtnTone, string> = {
  theme: "text-theme hover:text-theme/80 focus-visible:ring-theme/30",
  white: "text-white hover:text-white/80 focus-visible:ring-white/30",
  black: "text-black hover:text-black/70 focus-visible:ring-black/20",
  inverse: "text-white hover:text-white/80 focus-visible:ring-white/30",
};

function variantClasses(variant: LibAtomBtnVariant, tone: LibAtomBtnTone) {
  switch (variant) {
    case "solid":
      return toneSolid[tone];
    case "outline":
      return cn("border bg-transparent", toneOutline[tone]);
    case "ghost":
      return toneGhost[tone];
    case "soft":
      return toneSoft[tone];
    case "link":
      return cn("h-auto px-0 underline-offset-4 hover:underline", toneLink[tone]);
    default:
      return toneSolid[tone];
  }
}

const LibAtomBtn = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  LibAtomBtnProps
>(function LibAtomBtn(props, ref) {
  const {
    variant = "solid",
    size = "md",
    tone = "theme",
    fullWidth = false,
    loading = false,
    startIcon,
    endIcon,
    className,
    children,
    as = "button",
    ...rest
  } = props;

  const classes = cn(
    "inline-flex items-center justify-center font-body font-medium uppercase",
    "rounded-none transition-[color,background-color,border-color,filter,opacity,transform]",
    "duration-200 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
    "disabled:pointer-events-none disabled:opacity-45",
    "active:scale-[0.98]",
    sizeClasses[size],
    variantClasses(variant, tone),
    fullWidth && "w-full",
    loading && "pointer-events-none opacity-70",
    className,
  );

  const isIcon = size === "icon" || size === "icon-sm";

  const content = (
    <>
      {loading ? (
        <span
          aria-hidden
          className="h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent"
        />
      ) : (
        startIcon
      )}
      {children ? (
        <span className={isIcon ? "contents" : "min-w-0"}>{children}</span>
      ) : null}
      {!loading ? endIcon : null}
    </>
  );

  if (as === "a") {
    const { href, ...anchorRest } = rest as Omit<
      LibAtomBtnAsAnchor,
      keyof LibAtomBtnSharedProps | "as"
    > & { href: string };

    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={classes}
        aria-busy={loading || undefined}
        {...anchorRest}
      >
        {content}
      </a>
    );
  }

  const buttonRest = rest as Omit<
    LibAtomBtnAsButton,
    keyof LibAtomBtnSharedProps | "as"
  >;

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={buttonRest.type ?? "button"}
      className={classes}
      disabled={buttonRest.disabled || loading}
      aria-busy={loading || undefined}
      {...buttonRest}
    >
      {content}
    </button>
  );
});

export default LibAtomBtn;
