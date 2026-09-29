// Original mark for the clone: three rounded slashes suggesting sound bars.
export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
      <rect x="5" y="6" width="17" height="5.4" rx="2.7" fill="#00beff" transform="rotate(14 5 6)" />
      <rect x="5" y="14" width="14" height="5.4" rx="2.7" fill="#0a9bd8" transform="rotate(14 5 14)" />
      <rect x="5" y="22" width="6.5" height="5.4" rx="2.7" fill="#12729e" transform="rotate(14 5 22)" />
    </svg>
  );
}

export function Logo({ light = true }: { light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <LogoMark />
      <span
        className="text-[1.35rem] font-semibold tracking-tight"
        style={{ color: light ? "var(--offwhite)" : "#000" }}
      >
        fanthom
      </span>
    </span>
  );
}
