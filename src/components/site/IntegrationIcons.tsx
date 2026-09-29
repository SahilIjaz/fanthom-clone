// Minimal original glyphs standing in for well-known tool marks.
const g = { width: 18, height: 18, viewBox: "0 0 24 24" } as const;

export const icons: Record<string, React.ReactNode> = {
  meet: (
    <svg {...g}><rect x="2" y="5" width="13" height="14" rx="3" fill="#ffba00" /><path d="M15 10.5 21 6v12l-6-4.5z" fill="#00ac47" /></svg>
  ),
  zoom: (
    <svg {...g}><rect x="2" y="6" width="13" height="12" rx="4" fill="#2d8cff" /><path d="M15 10.8 21 7.5v9L15 13z" fill="#2d8cff" /></svg>
  ),
  gmail: (
    <svg {...g}><rect x="2" y="5" width="20" height="14" rx="2" fill="#fff" stroke="#e3e3e3" /><path d="M3 6.5 12 13l9-6.5" stroke="#ea4335" strokeWidth="2.4" fill="none" /></svg>
  ),
  slack: (
    <svg {...g}>{[0, 90, 180, 270].map((r) => (<g key={r} transform={`rotate(${r} 12 12)`}><rect x="10.8" y="2" width="2.8" height="8" rx="1.4" fill={["#36c5f0", "#2eb67d", "#ecb22e", "#e01e5a"][r / 90]} /></g>))}</svg>
  ),
  teams: (
    <svg {...g}><rect x="3" y="6" width="12" height="12" rx="2.5" fill="#5059c9" /><text x="9" y="15.5" fontSize="9" fontFamily="Arial" fill="#fff" textAnchor="middle" fontWeight="bold">T</text><circle cx="18.5" cy="9" r="2.6" fill="#7b83eb" /><path d="M14.6 18c.4-2.8 2-4.4 3.9-4.4s3.1 1.6 3.5 4.4z" fill="#7b83eb" /></svg>
  ),
  asana: (
    <svg {...g}><circle cx="12" cy="8" r="3.4" fill="#f06a6a" /><circle cx="6.5" cy="16" r="3.4" fill="#f06a6a" /><circle cx="17.5" cy="16" r="3.4" fill="#f06a6a" /></svg>
  ),
};
