// ma-nees
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/StatusBadge";
import { Edit, Phone, MapPin, ArrowLeft, Wallet } from "lucide-react";
import { students, payments } from "@/lib/mock-data";
import { formatNPR, formatDate } from "@/lib/format";

export const Route = createFileRoute("/_admin/students/$id")({
  component: StudentProfile,
  loader: ({ params }) => {
    const student = students.find((s) => s.id === params.id);
    if (!student) throw notFound();
    return { student };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: (loaderData?.student.name ?? "Student") + " — DriveSiksha" },
      {
        name: "description",
        content: "Student profile with lesson progress, payments, receipts and documents.",
      },
    ],
  }),
  notFoundComponent: () => (
    <div className="p-8 text-center text-muted-foreground">Student not found.</div>
  ),
  errorComponent: ({ error }) => (
    <div className="p-8 text-center text-destructive">{error.message}</div>
  ),
});

function StudentProfile() {
  const { student: s } = Route.useLoaderData();
  const progress = Math.round((s.completedLessons / s.totalLessons) * 100);
  const studentPayments = payments.filter((p) => p.studentId === s.id);
  const remaining = s.courseFee - s.amountPaid;

  return (
    <>
      <Button variant="ghost" size="sm" asChild className="mb-3 -ml-2">
        <Link to="/students">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to students
        </Link>
      </Button>

      <Card className="mb-4 overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-brand via-brand to-sky" />
        <CardContent className="p-4 sm:p-6 -mt-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="h-24 w-24 rounded-2xl bg-card border-4 border-card text-brand grid place-items-center text-2xl font-bold shadow-lg shrink-0">
                {s.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div className="min-w-0">
                <h2 className="text-xl sm:text-2xl font-bold truncate">{s.name}</h2>
                <div className="text-sm text-muted-foreground">
                  {s.studentId} · {s.course}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <StatusBadge tone={s.status === "active" ? "success" : "neutral"}>
                    {s.status.replace("_", " ")}
                  </StatusBadge>
                  <StatusBadge tone={s.paymentStatus === "paid" ? "success" : "warning"}>
                    {s.paymentStatus}
                  </StatusBadge>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-1.5" />
                Edit
              </Button>
              <Button
                size="sm"
                className="bg-accent-red hover:bg-accent-red/90 text-accent-red-foreground"
                asChild
              >
                <Link to="/payments/new">
                  <Wallet className="h-4 w-4 mr-1.5" />
                  Record payment
                </Link>
              </Button>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div>
              <div className="text-xs text-muted-foreground">Phone</div>
              <div className="font-medium flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" />
                {s.phone}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Branch</div>
              <div className="font-medium flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {s.branch}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Instructor</div>
              <div className="font-medium truncate">{s.instructor}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Registered</div>
              <div className="font-medium">{formatDate(s.registeredAt)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview">
        <div className="overflow-x-auto no-scrollbar -mx-3 px-3 sm:mx-0 sm:px-0">
          <TabsList className="w-max">
            {[
              "overview",
              "personal",
              "emergency",
              "lessons",
              "payments",
              "receipts",
              "leave",
              "documents",
              "license",
              "feedback",
              "activity",
            ].map((t) => (
              <TabsTrigger key={t} value={t} className="capitalize">
                {t === "license" ? "Licence" : t}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="overview" className="mt-4 space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <StatCard label="Course fee" value={formatNPR(s.courseFee)} />
            <StatCard label="Amount paid" value={formatNPR(s.amountPaid)} tone="success" />
            <StatCard label="Remaining" value={formatNPR(remaining)} tone="danger" />
            <StatCard label="Progress" value={progress + "%"} tone="brand" />
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Training progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-sm mb-2">
                <span>
                  {s.completedLessons} of {s.totalLessons} lessons completed
                </span>
                <span className="text-muted-foreground">
                  {s.totalLessons - s.completedLessons} remaining
                </span>
              </div>
              <Progress value={progress} className="h-3" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Payment history</CardTitle>
            </CardHeader>
            <CardContent className="divide-y">
              {studentPayments.length === 0 && (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No payments yet.
                </div>
              )}
              {studentPayments.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <Link
                      to="/receipts/$id"
                      params={{ id: p.receiptNo }}
                      className="font-medium text-sm hover:underline"
                    >
                      {p.receiptNo}
                    </Link>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(p.date)} · {p.method}
                    </div>
                  </div>
                  <div className="font-semibold">{formatNPR(p.amount)}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {[
          "personal",
          "emergency",
          "lessons",
          "receipts",
          "leave",
          "documents",
          "license",
          "feedback",
          "activity",
        ].map((t) => (
          <TabsContent key={t} value={t} className="mt-4">
            <Card>
              <CardContent className="p-8 text-center text-sm text-muted-foreground">
                Detailed {t} view coming soon. Data model is ready.
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
}

function StatCard({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "success" | "danger" | "brand";
}) {
  const t: Record<string, string> = {
    neutral: "",
    success: "text-success",
    danger: "text-accent-red",
    brand: "text-brand",
  };
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className={"mt-1 text-lg font-bold " + t[tone]}>{value}</div>
      </CardContent>
    </Card>
  );
}
