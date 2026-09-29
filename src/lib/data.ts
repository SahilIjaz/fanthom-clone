import raw from "@/data/meetings.json";

export type Person = {
  id: string; name: string; email: string; color: string; initials: string;
  role?: string; team?: string; company?: string;
};
export type Segment = { id: string; speaker: string; start: number; end: number; text: string };
export type ActionItem = { id: string; text: string; owner: string; due: string; done: boolean; at: number };
export type Highlight = { id: string; at: number; label: string; by: string };
export type SummaryBlock = [string, string];
export type Summary = { label: string; blocks: SummaryBlock[] };
export type Meeting = {
  id: string; title: string; kind: string; platform: string; start: string;
  durationSec: number; attendees: string[]; host: string; external: boolean;
  account: string | null; summaries: Record<string, Summary>; actionItems: ActionItem[];
  highlights: Highlight[]; topics: { name: string; hits: number[] }[];
  transcript: Segment[]; shareToken: string;
};

export const ME = raw.me as Person;
export const PEOPLE: Record<string, Person> = Object.fromEntries(
  Object.values(raw.people as Record<string, Person>).map((p) => [p.id, p])
);
export const MEETINGS = raw.meetings as unknown as Meeting[];

export const getMeeting = (id: string) => MEETINGS.find((m) => m.id === id);
export const byToken = (token: string) => MEETINGS.find((m) => m.shareToken === token);

export function fmtClock(sec: number) {
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = Math.floor(sec % 60);
  return h ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${m}:${String(s).padStart(2, "0")}`;
}
export function fmtDur(sec: number) {
  const m = Math.round(sec / 60);
  return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m} min`;
}
export function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });
}
export function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "UTC" });
}

export const platformLabel: Record<string, string> = { zoom: "Zoom", meet: "Google Meet", teams: "Microsoft Teams" };

// clip tokens are stateless: base64url of "callId:start:end"
export function encodeClip(callId: string, start: number, end: number) {
  return Buffer.from(`${callId}:${Math.round(start)}:${Math.round(end)}`).toString("base64url");
}
export function decodeClip(token: string): { callId: string; start: number; end: number } | null {
  try {
    const [callId, s, e] = Buffer.from(token, "base64url").toString().split(":");
    if (!callId || isNaN(+s) || isNaN(+e)) return null;
    return { callId, start: +s, end: +e };
  } catch {
    return null;
  }
}
