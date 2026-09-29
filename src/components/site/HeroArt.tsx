/* Original hero illustration: a small space traveler figure of our own design
   plus mini planet, standing in for the reference's proprietary artwork. */
export function SpaceFigure({ size = 150 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 100 115" fill="none" aria-hidden>
      <ellipse cx="50" cy="108" rx="26" ry="5" fill="rgba(255,255,255,0.08)" />
      <rect x="34" y="46" width="32" height="40" rx="14" fill="#e8e2e2" />
      <rect x="38" y="52" width="24" height="18" rx="8" fill="#c9c1c1" />
      <circle cx="50" cy="30" r="18" fill="#e8e2e2" />
      <circle cx="50" cy="30" r="13" fill="#0d1b26" />
      <path d="M42 26 q8 -6 16 0" stroke="#00beff" strokeWidth="2" fill="none" strokeLinecap="round" />
      <rect x="22" y="50" width="12" height="26" rx="6" fill="#e8e2e2" transform="rotate(18 22 50)" />
      <rect x="66" y="50" width="12" height="26" rx="6" fill="#e8e2e2" transform="rotate(-18 78 50)" />
      <rect x="38" y="84" width="10" height="24" rx="5" fill="#d5cdcd" />
      <rect x="52" y="84" width="10" height="24" rx="5" fill="#d5cdcd" />
      <rect x="44" y="62" width="12" height="8" rx="2" fill="#f55200" />
      <circle cx="30" cy="44" r="3" fill="#fff58c" />
    </svg>
  );
}

export function MiniShip({ width = 120 }: { width?: number }) {
  return (
    <svg width={width} height={width * 0.45} viewBox="0 0 120 54" fill="none" aria-hidden>
      <ellipse cx="58" cy="30" rx="46" ry="16" fill="#e8e2e2" />
      <ellipse cx="58" cy="26" rx="30" ry="12" fill="#0d1b26" />
      <ellipse cx="58" cy="24" rx="18" ry="8" fill="#00beff" opacity="0.8" />
      <rect x="98" y="24" width="16" height="6" rx="3" fill="#f55200" />
      <circle cx="34" cy="34" r="2.5" fill="#fff58c" />
      <circle cx="58" cy="38" r="2.5" fill="#fff58c" />
      <circle cx="82" cy="34" r="2.5" fill="#fff58c" />
    </svg>
  );
}
