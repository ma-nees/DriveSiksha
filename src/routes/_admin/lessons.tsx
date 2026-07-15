import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { CalendarClock, Car } from "lucide-react";
import { students, instructors } from "@/lib/mock-data";

export const Route = createFileRoute("/_admin/lessons")({
  component: LessonsPage,
  head: () => ({ meta: [{ title: "Lessons — DriveSiksha" }] }),
});

const times = ["07:00", "08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];

function LessonsPage() {
  const today = new Date();
  const dates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today); d.setDate(today.getDate() + i); return d;
  });
  return (
    <>
      <PageHeader title="Lessons" description="Schedule and monitor driving lessons across instructors."
        actions={<Button size="sm" className="bg-accent-red hover:bg-accent-red/90 text-accent-red-foreground"><CalendarClock className="h-4 w-4 mr-1.5" />Schedule lesson</Button>}
      />

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">This week</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
            {dates.map((d, i) => (
              <div key={i} className={"rounded-lg border p-3 " + (i === 0 ? "bg-brand text-brand-foreground border-brand" : "")}>
                <div className="text-[11px] uppercase opacity-80">{d.toLocaleDateString("en-GB", { weekday: "short" })}</div>
                <div className="text-lg font-bold">{d.getDate()}</div>
                <div className="text-xs opacity-80">{d.toLocaleDateString("en-GB", { month: "short" })}</div>
                <div className="mt-2 text-[11px]">{Math.floor(Math.random() * 12) + 4} lessons</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader className="pb-3"><CardTitle className="text-base">Today's schedule</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {times.slice(0, 6).map((t, i) => {
            const s = students[i]; const inst = instructors[i % instructors.length];
            return (
              <div key={t} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                <div className="text-sm font-semibold w-14 shrink-0">{t}</div>
                <div className="h-9 w-9 rounded-lg bg-sky/15 text-sky grid place-items-center shrink-0"><Car className="h-4 w-4" /></div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{s.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{inst.name} · {s.course}</div>
                </div>
                <StatusBadge tone={i < 2 ? "success" : i < 4 ? "info" : "neutral"}>{i < 2 ? "completed" : i < 4 ? "ongoing" : "scheduled"}</StatusBadge>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </>
  );
}
