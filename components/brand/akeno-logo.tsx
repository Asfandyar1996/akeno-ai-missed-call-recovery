type AkenoLogoProps = {
  className?: string;
  markClassName?: string;
  textClassName?: string;
  showText?: boolean;
};

export function AkenoLogo({ className = "", markClassName = "", textClassName = "", showText = true }: AkenoLogoProps) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <span
        className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-300 via-teal-400 to-slate-950 text-slate-950 shadow-lg shadow-cyan-950/30 ${markClassName}`}
        aria-hidden="true"
      >
        <svg viewBox="0 0 40 40" className="h-7 w-7" fill="none">
          <path d="M20 6 33 32h-7.2l-2.2-5H15.8l-2.2 5H6.8L20 6Z" fill="currentColor" />
          <path d="M18.1 21.8h3.8L20 17.2l-1.9 4.6Z" fill="white" />
          <path d="M9 31.5 31.5 9" stroke="white" strokeLinecap="round" strokeWidth="3" />
          <circle cx="31.5" cy="9" r="3" fill="#f59e0b" />
        </svg>
      </span>
      {showText ? <span className={`font-semibold tracking-normal ${textClassName}`}>Akeno</span> : null}
    </span>
  );
}
