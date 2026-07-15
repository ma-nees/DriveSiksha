import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, ChevronLeft, ChevronRight, Save } from "lucide-react";
import { branches, instructors } from "@/lib/mock-data";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_admin/students/new")({
  component: AddStudent,
  head: () => ({ meta: [{ title: "Add student — DriveSiksha" }] }),
});

const steps = ["Personal", "Identity & emergency", "Training", "Review"];

function AddStudent() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  return (
    <>
      <PageHeader title="Add new student" description="Register a new student in 4 steps." />
      <Card className="mb-4">
        <CardContent className="p-4 sm:p-5">
          <ol className="flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
            {steps.map((s, i) => (
              <li key={s} className="flex items-center gap-2 shrink-0">
                <div className={cn(
                  "h-8 w-8 rounded-full grid place-items-center text-sm font-semibold shrink-0",
                  i < step ? "bg-success text-success-foreground" : i === step ? "bg-brand text-brand-foreground" : "bg-muted text-muted-foreground",
                )}>
                  {i < step ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                <span className={cn("text-sm font-medium whitespace-nowrap", i === step ? "" : "text-muted-foreground")}>{s}</span>
                {i < steps.length - 1 && <div className="hidden sm:block h-px w-8 bg-border" />}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 sm:p-6">
          {step === 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" required><Input className="h-11" placeholder="e.g. Anish Sharma" /></Field>
              <Field label="Date of birth" required><Input type="date" className="h-11" /></Field>
              <Field label="Gender" required>
                <Select><SelectTrigger className="h-11"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent><SelectItem value="m">Male</SelectItem><SelectItem value="f">Female</SelectItem><SelectItem value="o">Other</SelectItem></SelectContent>
                </Select>
              </Field>
              <Field label="Phone" required><Input className="h-11" placeholder="+977 98..." /></Field>
              <Field label="Email"><Input type="email" className="h-11" /></Field>
              <Field label="Address" full><Textarea rows={2} placeholder="Street, City, Province" /></Field>
              <Field label="Profile photo" full><Input type="file" accept="image/*" className="h-11 cursor-pointer" /></Field>
            </div>
          )}
          {step === 1 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Citizenship number" required><Input className="h-11" /></Field>
              <Field label="Citizenship document"><Input type="file" className="h-11 cursor-pointer" /></Field>
              <Field label="Blood group">
                <Select><SelectTrigger className="h-11"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{["A+","A-","B+","B-","O+","O-","AB+","AB-"].map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <div className="hidden sm:block" />
              <Field label="Emergency contact name" required><Input className="h-11" /></Field>
              <Field label="Relationship"><Input className="h-11" placeholder="Father, Spouse..." /></Field>
              <Field label="Emergency contact phone" required><Input className="h-11" /></Field>
              <Field label="Emergency address" full><Textarea rows={2} /></Field>
            </div>
          )}
          {step === 2 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Branch" required>
                <Select><SelectTrigger className="h-11"><SelectValue placeholder="Select branch" /></SelectTrigger>
                  <SelectContent>{branches.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="Course" required>
                <Select><SelectTrigger className="h-11"><SelectValue placeholder="Select course" /></SelectTrigger>
                  <SelectContent><SelectItem value="b">Car (B)</SelectItem><SelectItem value="a">Motorbike (A)</SelectItem><SelectItem value="c">Heavy Vehicle (C)</SelectItem></SelectContent>
                </Select>
              </Field>
              <Field label="Vehicle category">
                <Select><SelectTrigger className="h-11"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent><SelectItem value="a">A</SelectItem><SelectItem value="b">B</SelectItem><SelectItem value="c">C</SelectItem></SelectContent>
                </Select>
              </Field>
              <Field label="Instructor">
                <Select><SelectTrigger className="h-11"><SelectValue placeholder="Assign instructor" /></SelectTrigger>
                  <SelectContent>{instructors.map(i => <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="Total lessons"><Input type="number" defaultValue={20} className="h-11" /></Field>
              <Field label="Course fee (NPR)" required><Input type="number" defaultValue={25000} className="h-11" /></Field>
              <Field label="Registration date"><Input type="date" defaultValue={new Date().toISOString().slice(0, 10)} className="h-11" /></Field>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-3">
              <h3 className="font-semibold">Review your entry</h3>
              <p className="text-sm text-muted-foreground">Confirm the details below before submitting.</p>
              <div className="rounded-lg border p-4 bg-muted/40 text-sm space-y-1.5">
                <div><span className="text-muted-foreground">Name:</span> <span className="font-medium">Anish Sharma</span></div>
                <div><span className="text-muted-foreground">Phone:</span> +977 9841234567</div>
                <div><span className="text-muted-foreground">Branch:</span> Baneshwor Main</div>
                <div><span className="text-muted-foreground">Course:</span> Car (B) · 20 lessons</div>
                <div><span className="text-muted-foreground">Fee:</span> <span className="font-semibold">NPR 25,000</span></div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="sticky bottom-16 lg:bottom-0 mt-4 -mx-3 sm:mx-0 bg-background/90 backdrop-blur-md border-t lg:border-t-0 lg:bg-transparent lg:backdrop-blur-none p-3 sm:p-0">
        <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-between">
          <Button variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="h-11 sm:h-10">
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" className="h-11 sm:h-10" onClick={() => toast.success("Draft saved")}><Save className="h-4 w-4 mr-1.5" />Save draft</Button>
            {step < steps.length - 1 ? (
              <Button className="h-11 sm:h-10 flex-1 sm:flex-none bg-brand hover:bg-brand/90 text-brand-foreground" onClick={() => setStep((s) => s + 1)}>Next <ChevronRight className="h-4 w-4 ml-1" /></Button>
            ) : (
              <Button className="h-11 sm:h-10 flex-1 sm:flex-none bg-accent-red hover:bg-accent-red/90 text-accent-red-foreground" onClick={() => { toast.success("Student registered successfully"); navigate({ to: "/students" }); }}>Submit</Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function Field({ label, required, children, full }: { label: string; required?: boolean; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={cn("space-y-1.5", full && "sm:col-span-2")}>
      <Label className="text-xs font-medium">{label}{required && <span className="text-accent-red ml-0.5">*</span>}</Label>
      {children}
    </div>
  );
}
