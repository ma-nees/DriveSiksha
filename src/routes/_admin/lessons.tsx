// ma-nees
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { CalendarClock, Car, Clock, User, CheckCircle2, PlayCircle, MoreVertical, Calendar } from "lucide-react";
import { students, instructors } from "@/lib/mock-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_admin/lessons")({
  component: LessonsPage,
  head: () => ({ meta: [{ title: "Lessons — DriveSiksha" }] }),
});

const times = ["07:00", "08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];

interface ScheduledLesson {
  id: string;
  time: string;
  studentName: string;
  instructorName: string;
  course: string;
  status: "completed" | "ongoing" | "scheduled";
}

const fixedDayLessonCounts = [6, 8, 12, 10, 6, 9, 7];

function LessonsPage() {
  const today = new Date();
  const dates = useMemo(() => Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  }), []);

  const [selectedDateIndex, setSelectedDateIndex] = useState(0);

  // State
  const [scheduledLessons, setScheduledLessons] = useState<ScheduledLesson[]>(() => {
    return times.slice(0, 6).map((t, i) => {
      const s = students[i] || students[0];
      const inst = instructors[i % instructors.length] || instructors[0];
      return {
        id: `l-${i}`,
        time: t,
        studentName: s.name,
        instructorName: inst.name,
        course: s.course,
        status: i < 2 ? "completed" : i < 4 ? "ongoing" : "scheduled",
      };
    });
  });

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [studentId, setStudentId] = useState(students[0]?.id || "");
  const [instructorId, setInstructorId] = useState(instructors[0]?.id || "");
  const [timeSlot, setTimeSlot] = useState(times[0]);

  const handleScheduleLesson = () => {
    if (!studentId || !instructorId || !timeSlot) {
      toast.error("Please select a student, instructor, and time slot.");
      return;
    }

    const sObj = students.find((s) => s.id === studentId) || students[0];
    const instObj = instructors.find((i) => i.id === instructorId) || instructors[0];

    const newLesson: ScheduledLesson = {
      id: `l-${Date.now()}`,
      time: timeSlot,
      studentName: sObj.name,
      instructorName: instObj.name,
      course: sObj.course,
      status: "scheduled",
    };

    setScheduledLessons((prev) => {
      const updated = [newLesson, ...prev];
      return updated.sort((a, b) => a.time.localeCompare(b.time));
    });

    toast.success(`Lesson successfully scheduled for ${sObj.name} at ${timeSlot}!`);
    setIsAddOpen(false);
  };

  const updateLessonStatus = (id: string, newStatus: ScheduledLesson["status"]) => {
    setScheduledLessons((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
    );
    toast.success(`Lesson status updated to ${newStatus}`);
  };

  const statusTone = {
    completed: "success" as const,
    ongoing: "info" as const,
    scheduled: "neutral" as const,
  };

  const selectedDateObj = dates[selectedDateIndex];
  const isSelectedToday = selectedDateIndex === 0;

  const currentLessonsList = isSelectedToday ? scheduledLessons : scheduledLessons.slice(0, Math.min(scheduledLessons.length, fixedDayLessonCounts[selectedDateIndex] || 5));

  const stats = useMemo(() => {
    const completed = currentLessonsList.filter((l) => l.status === "completed").length;
    const ongoing = currentLessonsList.filter((l) => l.status === "ongoing").length;
    const scheduled = currentLessonsList.filter((l) => l.status === "scheduled").length;
    return { completed, ongoing, scheduled, total: currentLessonsList.length };
  }, [currentLessonsList]);

  return (
    <>
      <PageHeader
        title="Lessons"
        description="Schedule and monitor driving lessons across instructors."
        actions={
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-accent-red hover:bg-accent-red/90 text-accent-red-foreground">
                <CalendarClock className="h-4 w-4 mr-1.5" />Schedule lesson
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Schedule Driving Lesson</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="student" className="text-xs font-semibold">Student *</Label>
                  <Select value={studentId} onValueChange={setStudentId}>
                    <SelectTrigger className="h-10"><SelectValue placeholder="Select student" /></SelectTrigger>
                    <SelectContent>
                      {students.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name} ({s.course})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="instructor" className="text-xs font-semibold">Instructor *</Label>
                  <Select value={instructorId} onValueChange={setInstructorId}>
                    <SelectTrigger className="h-10"><SelectValue placeholder="Select instructor" /></SelectTrigger>
                    <SelectContent>
                      {instructors.map((i) => (
                        <SelectItem key={i.id} value={i.id}>
                          {i.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="time" className="text-xs font-semibold">Time Slot *</Label>
                  <Select value={timeSlot} onValueChange={setTimeSlot}>
                    <SelectTrigger className="h-10"><SelectValue placeholder="Select time slot" /></SelectTrigger>
                    <SelectContent>
                      {times.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddOpen(false)} className="h-10">Cancel</Button>
                <Button onClick={handleScheduleLesson} className="h-10 bg-accent-red hover:bg-accent-red/90 text-accent-red-foreground">Schedule Lesson</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Week Day Boxes Strip */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4 text-brand" />
            Select Day
          </CardTitle>
          <span className="text-xs text-muted-foreground">Click any day to view schedule</span>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {dates.map((d, i) => {
              const isToday = i === 0;
              const isSelected = selectedDateIndex === i;
              const count = isToday ? scheduledLessons.length : fixedDayLessonCounts[i];

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedDateIndex(i)}
                  className={cn(
                    "flex flex-col justify-between p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer relative overflow-hidden group",
                    isSelected
                      ? "bg-brand text-brand-foreground border-brand shadow-md ring-2 ring-brand/30 scale-[1.02]"
                      : "bg-card hover:bg-accent/40 hover:border-brand/40 text-card-foreground border-border"
                  )}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className={cn("text-xs font-semibold uppercase tracking-wider", isSelected ? "text-brand-foreground/80" : "text-muted-foreground")}>
                      {d.toLocaleDateString("en-GB", { weekday: "short" })}
                    </span>
                    {isToday && (
                      <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase", isSelected ? "bg-white/20 text-white" : "bg-brand/10 text-brand")}>
                        Today
                      </span>
                    )}
                  </div>

                  <div className="my-1.5 flex items-baseline gap-1">
                    <span className="text-2xl font-bold tracking-tight">{d.getDate()}</span>
                    <span className={cn("text-xs font-medium", isSelected ? "text-brand-foreground/80" : "text-muted-foreground")}>
                      {d.toLocaleDateString("en-GB", { month: "short" })}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 mt-1 text-xs">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full font-medium text-[11px]",
                      isSelected ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                    )}>
                      {count} lessons
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected Day Schedule Boxes */}
      <Card className="mt-4">
        <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b">
          <div>
            <CardTitle className="text-base">
              {isSelectedToday ? "Today's Schedule" : `Schedule for ${selectedDateObj.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short" })}`}
            </CardTitle>
            <div className="text-xs text-muted-foreground mt-0.5">
              Showing {currentLessonsList.length} driving lessons
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs px-2.5 py-1 rounded-full bg-success/10 text-success font-medium">Completed: {stats.completed}</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-sky/10 text-sky font-medium">Ongoing: {stats.ongoing}</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground font-medium">Scheduled: {stats.scheduled}</span>
          </div>
        </CardHeader>

        <CardContent className="pt-4 space-y-3">
          {currentLessonsList.map((l) => (
            <div
              key={l.id}
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 p-4 rounded-xl border border-border bg-card hover:bg-accent/30 hover:border-brand/30 transition-all duration-200 shadow-xs hover:shadow-md"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Time Pill */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/70 text-foreground font-mono text-xs font-semibold shrink-0 border border-border/50">
                  <Clock className="h-3.5 w-3.5 text-brand" />
                  <span>{l.time}</span>
                </div>

                {/* Vehicle Icon */}
                <div className="h-10 w-10 rounded-xl bg-brand/10 text-brand grid place-items-center shrink-0 group-hover:scale-105 transition-transform">
                  <Car className="h-5 w-5" />
                </div>

                {/* Student & Instructor details */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-semibold text-sm text-foreground truncate">{l.studentName}</span>
                    <span className="text-[11px] font-medium bg-muted px-2 py-0.5 rounded text-muted-foreground shrink-0">{l.course}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5 truncate">
                    <User className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">Instructor: <strong className="font-medium text-foreground">{l.instructorName}</strong></span>
                  </div>
                </div>
              </div>

              {/* Status & Quick Actions */}
              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40 shrink-0">
                <StatusBadge tone={statusTone[l.status]}>{l.status}</StatusBadge>

                <div className="flex items-center gap-1">
                  {l.status === "scheduled" && (
                    <Button size="sm" variant="outline" className="h-8 text-xs gap-1" onClick={() => updateLessonStatus(l.id, "ongoing")}>
                      <PlayCircle className="h-3.5 w-3.5 text-sky" /> Start
                    </Button>
                  )}
                  {l.status === "ongoing" && (
                    <Button size="sm" variant="outline" className="h-8 text-xs gap-1 text-success border-success/30 hover:bg-success/10" onClick={() => updateLessonStatus(l.id, "completed")}>
                      <CheckCircle2 className="h-3.5 w-3.5" /> Complete
                    </Button>
                  )}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => updateLessonStatus(l.id, "completed")}><CheckCircle2 className="h-4 w-4 mr-2 text-success" />Mark completed</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateLessonStatus(l.id, "ongoing")}><PlayCircle className="h-4 w-4 mr-2 text-sky" />Mark ongoing</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateLessonStatus(l.id, "scheduled")}><Clock className="h-4 w-4 mr-2" />Mark scheduled</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))}

          {currentLessonsList.length === 0 && (
            <div className="text-center p-8 text-sm text-muted-foreground">No lessons scheduled for this date.</div>
          )}
        </CardContent>
      </Card>
    </>
  );
}


