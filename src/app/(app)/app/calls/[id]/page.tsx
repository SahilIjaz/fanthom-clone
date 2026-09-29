import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getMeeting, MEETINGS } from "@/lib/data";
import { CallView } from "@/components/app/CallView";

export function generateStaticParams() {
  return MEETINGS.map((m) => ({ id: m.id }));
}

export default async function CallPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const meeting = getMeeting(id);
  if (!meeting) notFound();
  return <Suspense><CallView meeting={meeting} /></Suspense>;
}
