const cols = ["Free", "Premium", "Team", "Business", "Enterprise"];
type Row = [string, ...(boolean | string)[]] | { section: string };

const rows: Row[] = [
  { section: "Capturing & managing content" },
  ["Choice of bot-free and bot capture types", true, true, true, true, true],
  ["Recordings & call storage (unlimited)", true, true, true, true, true],
  ["Transcription (unlimited)", true, true, true, true, true],
  ["Call downloads and clips (unlimited)", true, true, true, true, true],
  ["Playlists of clips & highlights for your meetings", true, true, true, true, true],
  ["Playlists for all team meetings", false, false, true, true, true],
  { section: "Insights" },
  ["Automated summaries", true, true, true, true, true],
  ["Advanced summaries (15+ expert templates)", "Limited use", true, true, true, true],
  ["AI action items", false, true, true, true, true],
  ["AI follow-up emails", false, true, true, true, true],
  ["Coaching metrics", false, false, false, true, true],
  ["Custom summaries", false, false, false, true, true],
  { section: "Search, discovery & alerts" },
  ["Attendee and keyword search in your meetings", true, true, true, true, true],
  ["Ask Fanthom: AI within a single call", true, true, true, true, true],
  ["Account-wide Ask Fanthom: AI for all calls", false, "My calls", "My calls +", true, true],
  ["AI search alerts", false, false, true, true, true],
  ["Keyword alerts", false, false, true, true, true],
  { section: "Team workspace" },
  ["Team members", false, false, true, true, true],
  ["Team recordings view", false, false, true, true, true],
  ["Team folders", false, false, true, true, true],
  ["Comments & mentions", false, false, true, true, true],
  ["Customer view", false, false, false, true, true],
  ["Deal view", false, false, false, true, true],
  { section: "Admin, integrations & security" },
  ["Claude & ChatGPT integrations", true, true, true, true, true],
  ["Zapier, Make & other automation integrations", true, true, true, true, true],
  ["Slack integration", false, false, true, true, true],
  ["Public API & MCP", false, false, true, true, true],
  ["CRM syncs", "Max 3 users/domain", true, true, true, true],
  ["CRM field sync", false, false, false, true, true],
  ["Custom data retention policies", false, false, false, false, true],
  ["Single sign-on integration", false, false, false, false, true],
  ["Okta SCIM provisioning", false, false, false, false, true],
  ["HIPAA: signed BAA", false, false, false, false, true],
];

export function FeatureMatrix() {
  return (
    <div className="thin-scroll mt-10 overflow-x-auto rounded-3xl border border-white/12">
      <table className="w-full min-w-[820px] border-collapse text-left">
        <thead>
          <tr className="bg-[#0b0b0c]">
            <th className="p-small px-5 py-4 font-medium text-offwhite/60">Feature</th>
            {cols.map((c) => (
              <th key={c} className="p-small px-4 py-4 text-center font-medium">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) =>
            "section" in r ? (
              <tr key={i} className="bg-white/[0.04]">
                <td colSpan={6} className="disp px-5 py-3 text-[0.72rem] tracking-[0.16em] text-brand-cyan">{r.section}</td>
              </tr>
            ) : (
              <tr key={i} className="border-t border-white/5">
                <td className="p-small px-5 py-3 text-offwhite/85">{r[0]}</td>
                {r.slice(1).map((v, j) => (
                  <td key={j} className="p-small px-4 py-3 text-center">
                    {v === true ? <span className="text-brand-cyan">✓</span> : v === false ? <span className="text-offwhite/25">—</span> : <span className="text-offwhite/70">{v}</span>}
                  </td>
                ))}
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
