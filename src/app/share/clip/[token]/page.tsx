import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { decodeClip, getMeeting, fmtClock } from "@/lib/data";
import { CallView } from "@/components/app/CallView";
import { LogoMark } from "@/components/site/Logo";

export default async function ClipPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const clip = decodeClip(token);
  const meeting = clip ? getMeeting(clip.callId) : undefined;
  if (!clip || !meeting) notFound();
  return (
    <div className="min-h-screen bg-[#0a0a0b] text-offwhite">
      <div className="flex items-center justify-between border-b border-white/8 px-5 py-3">
        <Link href="/" className="flex items-center gap-2"><LogoMark size={22} /><b>fanthom</b></Link>
        <div className="flex items-center gap-3">
          <span className="hidden text-[0.75rem] text-brand-yellow sm:block">
            Clip · {fmtClock(clip.start)}–{fmtClock(clip.end)} of the full call
          </span>
          <Link href="/login" className="btn btn-cyan !py-2 !text-[0.7rem]">Try Fanthom free</Link>
        </div>
      </div>
      <Suspense><CallView meeting={meeting} readOnly clipOnly={[clip.start, clip.end]} /></Suspense>
    </div>
  );
}
