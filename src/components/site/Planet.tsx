// Original decorative planet: layered gradients + swirl strokes.
export function Planet({ size = 380, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" className={className} aria-hidden>
      <defs>
        <radialGradient id="pl-g" cx="38%" cy="34%" r="80%">
          <stop offset="0%" stopColor="#ffc7d4" />
          <stop offset="45%" stopColor="#b44dff" />
          <stop offset="100%" stopColor="#5b00a8" />
        </radialGradient>
        <clipPath id="pl-c"><circle cx="100" cy="100" r="96" /></clipPath>
      </defs>
      <circle cx="100" cy="100" r="96" fill="url(#pl-g)" />
      <g clipPath="url(#pl-c)" stroke="#2d0057" strokeOpacity="0.55" fill="none" strokeWidth="2.4">
        {Array.from({ length: 9 }).map((_, i) => (
          <ellipse key={i} cx={100 - i * 4} cy={100 + i * 3} rx={92 - i * 9} ry={(92 - i * 9) * 0.62} transform={`rotate(${-18 - i * 3} 100 100)`} />
        ))}
      </g>
      <g clipPath="url(#pl-c)" stroke="#ffd9e2" strokeOpacity="0.5" fill="none" strokeWidth="1.6">
        {Array.from({ length: 6 }).map((_, i) => (
          <ellipse key={i} cx={104 + i * 3} cy={96 - i * 2} rx={80 - i * 11} ry={(80 - i * 11) * 0.6} transform={`rotate(${-14 - i * 4} 100 100)`} />
        ))}
      </g>
    </svg>
  );
}
