// The Mama's Cookies "MC" mark, recreated as an inline SVG:
// a heart split into a red "M" half and a cookie-textured "C" half,
// with little hearts + crumbs spilling from a bite at the top.

export function LogoMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label="Mama's Cookies logo"
    >
      <defs>
        <clipPath id="heartClip">
          <path d="M50 86C28 71 14 59 14 42a17 17 0 0 1 36-9 17 17 0 0 1 36 9c0 17-14 29-36 44Z" />
        </clipPath>
      </defs>

      {/* left red half */}
      <g clipPath="url(#heartClip)">
        <rect x="0" y="0" width="50" height="100" fill="#E11D29" />
        {/* right cookie half */}
        <rect x="50" y="0" width="50" height="100" fill="#D9A86A" />
        {/* chocolate chips on the cookie half */}
        <circle cx="64" cy="34" r="3.2" fill="#5A3A21" />
        <circle cx="80" cy="44" r="3" fill="#5A3A21" />
        <circle cx="70" cy="58" r="3.4" fill="#5A3A21" />
        <circle cx="60" cy="68" r="2.6" fill="#5A3A21" />
        <circle cx="82" cy="62" r="2.4" fill="#5A3A21" />
      </g>

      {/* heart outline */}
      <path
        d="M50 86C28 71 14 59 14 42a17 17 0 0 1 36-9 17 17 0 0 1 36 9c0 17-14 29-36 44Z"
        fill="none"
        stroke="#1A1208"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* letters */}
      <text
        x="32"
        y="62"
        textAnchor="middle"
        fontFamily="Anton, sans-serif"
        fontSize="34"
        fill="#FBF6EC"
      >
        M
      </text>
      <text
        x="68"
        y="62"
        textAnchor="middle"
        fontFamily="Anton, sans-serif"
        fontSize="34"
        fill="#7A4B22"
      >
        C
      </text>

      {/* crumbs + mini hearts spilling from the bite */}
      <circle cx="58" cy="16" r="2" fill="#5A3A21" />
      <circle cx="66" cy="11" r="2.6" fill="#7A4B22" />
      <path d="M48 14c-1.6-2.6-5-1-4 1.6.7 1.8 4 3.4 4 3.4s3.3-1.6 4-3.4c1-2.6-2.4-4.2-4-1.6Z" fill="#E11D29" />
    </svg>
  );
}

export function Logo({ stacked = false }: { stacked?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark className="h-10 w-10 shrink-0" />
      <span className={stacked ? "flex flex-col leading-none" : "flex items-baseline gap-1.5"}>
        <span className="font-script text-2xl text-brand-red">mama's</span>
        <span className="font-display text-2xl tracking-wide text-brand-ink">
          COOKIES
        </span>
      </span>
    </span>
  );
}
