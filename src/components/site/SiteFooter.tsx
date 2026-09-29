import Link from "next/link";
import { Logo } from "./Logo";

const cols: [string, [string, string][]][] = [
  ["Product", [["Overview", "/"], ["Pricing", "/pricing"], ["What's New", "/"]]],
  ["Company", [["About Us", "/"], ["Careers", "/"]]],
  ["Solutions", [["For Sales", "/pricing"], ["For Marketing", "/pricing"], ["For Customer Success", "/pricing"], ["For Teams", "/pricing"]]],
  ["Integrations", [["Asana", "/"], ["ChatGPT", "/"], ["Claude", "/"], ["HubSpot", "/"], ["Salesforce", "/"], ["Zapier", "/"], ["Public API & MCP", "/"], ["All Integrations", "/"]]],
  ["Competitors", [["Competitor Overview", "/"], ["vs. Fireflies", "/"], ["vs. Granola", "/"], ["vs. Gong", "/"], ["vs. Otter", "/"], ["vs. Read AI", "/"], ["vs. ZoomMate", "/"], ["vs. Built-In Solutions", "/"]]],
  ["Resources", [["Resource Hub", "/"], ["Help Center", "/"], ["Partner Program", "/"]]],
];

export function SiteFooter() {
  return (
    <footer className="bg-offblack text-offwhite">
      <div className="container-x py-14">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
          <div className="max-w-[220px]">
            <Logo />
            <Link href="/login" className="btn btn-cyan mt-8 !text-[0.8rem]">
              Try Fanthom today
            </Link>
          </div>
          <div className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
            {cols.map(([title, links]) => (
              <div key={title}>
                <div className="p-small mb-3 font-medium text-offwhite/60">{title}</div>
                <ul className="space-y-2">
                  {links.map(([label, href]) => (
                    <li key={label}>
                      <Link href={href} className="footer_link_fx p-small text-offwhite/85">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-[0.8rem] text-offwhite/50 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-5">
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
            <span>Security &amp; Compliance</span>
            <span>Status</span>
          </div>
          <div>Fanthom clone © 2026 — built by Sahil Ijaz as a 24h rebuild assignment</div>
        </div>
      </div>
    </footer>
  );
}
