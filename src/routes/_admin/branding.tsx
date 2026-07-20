// ma-nees
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ReceiptTemplate } from "./receipts.$id.index";
import { currentSchool, payments, students } from "@/lib/mock-data";
import { Save } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_admin/branding")({
  component: BrandingPage,
  head: () => ({ meta: [{ title: "Branding & receipts — DriveSiksha" }] }),
});

function BrandingPage() {
  const p = payments[0];
  const s = students.find((x) => x.id === p.studentId) || students[0];
  return (
    <>
      <PageHeader
        title="Branding & school details"
        description="What appears on your receipts, invoices and the app itself."
        actions={
          <Button
            size="sm"
            className="bg-brand hover:bg-brand/90 text-brand-foreground"
            onClick={() => toast.success("Branding saved")}
          >
            <Save className="h-4 w-4 mr-1.5" />
            Save changes
          </Button>
        }
      />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,0.92fr)_minmax(420px,1.08fr)]">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">School identity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs mb-1 block">Logo</Label>
                <Input type="file" accept="image/*" className="h-11 cursor-pointer" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label className="text-xs mb-1 block">School name</Label>
                  <Input defaultValue={currentSchool.name} className="h-11" />
                </div>
                <div>
                  <Label className="text-xs mb-1 block">Website</Label>
                  <Input defaultValue={currentSchool.website} className="h-11" />
                </div>
                <div>
                  <Label className="text-xs mb-1 block">Phone</Label>
                  <Input defaultValue={currentSchool.phone} className="h-11" />
                </div>
                <div>
                  <Label className="text-xs mb-1 block">Email</Label>
                  <Input defaultValue={currentSchool.email} className="h-11" />
                </div>
                <div>
                  <Label className="text-xs mb-1 block">PAN / VAT</Label>
                  <Input defaultValue={currentSchool.pan} className="h-11" />
                </div>
                <div>
                  <Label className="text-xs mb-1 block">Registration no.</Label>
                  <Input defaultValue={currentSchool.registration} className="h-11" />
                </div>
              </div>
              <div>
                <Label className="text-xs mb-1 block">Address</Label>
                <Textarea defaultValue={currentSchool.address} rows={2} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Receipt customization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs mb-1 block">Receipt footer</Label>
                <Textarea
                  rows={2}
                  defaultValue="This is a computer-generated receipt. Fees once paid are non-refundable."
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label className="text-xs mb-1 block">Authorized signature label</Label>
                  <Input defaultValue="Authorized signature" className="h-11" />
                </div>
                <div>
                  <Label className="text-xs mb-1 block">Primary brand color</Label>
                  <Input type="color" defaultValue="#1a2a5c" className="h-11 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
            Live preview
          </div>
          <div className="max-h-[46dvh] overflow-auto rounded-lg border bg-muted/25 p-1.5 sm:max-h-[60dvh] sm:p-4 xl:sticky xl:top-20 xl:max-h-[calc(100dvh-7rem)]">
            <div className="mx-auto w-full min-w-0 max-w-[420px] sm:max-w-[680px]">
              <ReceiptTemplate
                school={currentSchool}
                p={p}
                s={s}
                remaining={s.courseFee - s.amountPaid}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

