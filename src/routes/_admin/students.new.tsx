// ma-nees
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
import { branches, instructors, students } from "@/lib/mock-data";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { NepaliDatePicker } from "@/components/NepaliDatePicker";

export const Route = createFileRoute("/_admin/students/new")({
  component: AddStudent,
  head: () => ({ meta: [{ title: "Add student — DriveSiksha" }] }),
});

const steps = ["Personal", "Identity & emergency", "Training", "Review"];

function AddStudent() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  // Form State
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("2060-01-01");
  const [gender, setGender] = useState("m");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [citizenshipNo, setCitizenshipNo] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyRelation, setEmergencyRelation] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [emergencyAddress, setEmergencyAddress] = useState("");
  const [branchId, setBranchId] = useState("b1");
  const [course, setCourse] = useState("Car (B)");
  const [instructorId, setInstructorId] = useState("i1");
  const [totalLessons, setTotalLessons] = useState(20);
  const [courseFee, setCourseFee] = useState(25000);
  const [registrationDate, setRegistrationDate] = useState("2081-04-01");

  const handleSubmit = () => {
    if (!fullName || !phone) {
      toast.error("Please fill in all required fields (Name, Phone)");
      setStep(0);
      return;
    }

    const branchObj = branches.find((b) => b.id === branchId) || branches[0];
    const instObj = instructors.find((i) => i.id === instructorId) || instructors[0];

    students.unshift({
      id: `s${students.length + 1}`,
      studentId: `DS-2081-${(1000 + students.length + 1).toString()}`,
      name: fullName,
      phone: phone,
      branchId: branchId,
      branch: branchObj.name,
      instructorId: instructorId,
      instructor: instObj.name,
      course: course,
      completedLessons: 0,
      totalLessons: Number(totalLessons),
      courseFee: Number(courseFee),
      amountPaid: 0,
      paymentStatus: "unpaid",
      status: "active",
      registeredAt: registrationDate,
    });

    toast.success("Student registered successfully");
    navigate({ to: "/students" });
  };

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
              <Field label="Full name" required>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="h-11" placeholder="e.g. Anish Sharma" />
              </Field>
              <Field label="Date of birth" required>
                <NepaliDatePicker value={dob} onChange={setDob} />
              </Field>
              <Field label="Gender" required>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger className="h-11"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="m">Male</SelectItem>
                    <SelectItem value="f">Female</SelectItem>
                    <SelectItem value="o">Other</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Phone" required>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9+]/g, ""))}
                  className="h-11"
                  placeholder="+977 98..."
                />
              </Field>
              <Field label="Email">
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11" />
              </Field>
              <Field label="Address" full>
                <Textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={2} placeholder="Street, City, Province" />
              </Field>
              <Field label="Profile photo" full>
                <Input type="file" accept="image/*" className="h-11 cursor-pointer" />
              </Field>
            </div>
          )}
          {step === 1 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Citizenship number" required>
                <Input value={citizenshipNo} onChange={(e) => setCitizenshipNo(e.target.value)} className="h-11" />
              </Field>
              <Field label="Citizenship document">
                <Input type="file" className="h-11 cursor-pointer" />
              </Field>
              <Field label="Blood group">
                <Select value={bloodGroup} onValueChange={setBloodGroup}>
                  <SelectTrigger className="h-11"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <div className="hidden sm:block" />
              <Field label="Emergency contact name" required>
                <Input value={emergencyName} onChange={(e) => setEmergencyName(e.target.value)} className="h-11" />
              </Field>
              <Field label="Relationship">
                <Input value={emergencyRelation} onChange={(e) => setEmergencyRelation(e.target.value)} className="h-11" placeholder="Father, Spouse..." />
              </Field>
              <Field label="Emergency contact phone" required>
                <Input
                  type="tel"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value.replace(/[^0-9+]/g, ""))}
                  className="h-11"
                />
              </Field>
              <Field label="Emergency address" full>
                <Textarea value={emergencyAddress} onChange={(e) => setEmergencyAddress(e.target.value)} rows={2} />
              </Field>
            </div>
          )}
          {step === 2 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Branch" required>
                <Select value={branchId} onValueChange={setBranchId}>
                  <SelectTrigger className="h-11"><SelectValue placeholder="Select branch" /></SelectTrigger>
                  <SelectContent>
                    {branches.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Course" required>
                <Select value={course} onValueChange={setCourse}>
                  <SelectTrigger className="h-11"><SelectValue placeholder="Select course" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Car (B)">Car (B)</SelectItem>
                    <SelectItem value="Motorbike (A)">Motorbike (A)</SelectItem>
                    <SelectItem value="Heavy Vehicle (C)">Heavy Vehicle (C)</SelectItem>
                    <SelectItem value="Scooter (A)">Scooter (A)</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Instructor" required>
                <Select value={instructorId} onValueChange={setInstructorId}>
                  <SelectTrigger className="h-11"><SelectValue placeholder="Assign instructor" /></SelectTrigger>
                  <SelectContent>
                    {instructors.map(i => <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Total lessons">
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={totalLessons === 0 ? "" : totalLessons}
                  onChange={(e) => {
                    const clean = e.target.value.replace(/[^0-9]/g, "");
                    setTotalLessons(clean === "" ? 0 : Number(clean));
                  }}
                  className="h-11"
                />
              </Field>
              <Field label="Course fee (NPR)" required>
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={courseFee === 0 ? "" : courseFee}
                  onChange={(e) => {
                    const clean = e.target.value.replace(/[^0-9]/g, "");
                    setCourseFee(clean === "" ? 0 : Number(clean));
                  }}
                  className="h-11"
                />
              </Field>
              <Field label="Registration date">
                <NepaliDatePicker value={registrationDate} onChange={setRegistrationDate} />
              </Field>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-3">
              <h3 className="font-semibold">Review your entry</h3>
              <p className="text-sm text-muted-foreground">Confirm the details below before submitting.</p>
              <div className="rounded-lg border p-4 bg-muted/40 text-sm space-y-1.5">
                <div><span className="text-muted-foreground">Name:</span> <span className="font-medium">{fullName || "Not specified"}</span></div>
                <div><span className="text-muted-foreground">Phone:</span> {phone || "Not specified"}</div>
                <div><span className="text-muted-foreground">Branch:</span> {branches.find(b => b.id === branchId)?.name || "Not specified"}</div>
                <div><span className="text-muted-foreground">Course:</span> {course} · {totalLessons} lessons</div>
                <div><span className="text-muted-foreground">Fee:</span> <span className="font-semibold">NPR {courseFee.toLocaleString()}</span></div>
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
              <Button className="h-11 sm:h-10 flex-1 sm:flex-none bg-accent-red hover:bg-accent-red/90 text-accent-red-foreground" onClick={handleSubmit}>Submit</Button>
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

