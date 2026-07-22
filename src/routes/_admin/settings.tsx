// ma-nees
import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CheckCircle2, AlertCircle, UploadCloud, FileText, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/_admin/settings")({
  component: SettingsPage,
  head: () => ({ meta: [{ title: "Settings — DriveSiksha" }] }),
});

function SettingsPage() {
  const [cert, setCert] = useState<string | null>(null);
  const [certName, setCertName] = useState<string>("");

  useEffect(() => {
    const savedCert = localStorage.getItem("drivesiksha_certificate");
    const savedName = localStorage.getItem("drivesiksha_certificate_name");
    if (savedCert) {
      setCert(savedCert);
    }
    if (savedName) {
      setCertName(savedName);
    }
  }, []);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCertName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setCert(dataUrl);
        localStorage.setItem("drivesiksha_certificate", dataUrl);
        localStorage.setItem("drivesiksha_certificate_name", file.name);
        toast.success("Certificate uploaded successfully!");
        window.dispatchEvent(new Event("storage"));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    setCert(null);
    setCertName("");
    localStorage.removeItem("drivesiksha_certificate");
    localStorage.removeItem("drivesiksha_certificate_name");
    toast.success("Certificate removed.");
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <>
      <PageHeader
        title="Settings"
        description="Account, security, notifications and app preferences."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs mb-1 block">Full name</Label>
                <Input defaultValue="Suman Shrestha" className="h-11" />
              </div>
              <div>
                <Label className="text-xs mb-1 block">Email</Label>
                <Input defaultValue="admin@drivesiksha.com.np" className="h-11" />
              </div>
              <div>
                <Label className="text-xs mb-1 block">Phone</Label>
                <Input defaultValue="+977 9841000001" className="h-11" />
              </div>
              <div>
                <Label className="text-xs mb-1 block">Role</Label>
                <Input defaultValue="Driving School Admin" className="h-11" disabled />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">School Verification</CardTitle>
            {cert ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <CheckCircle2 className="h-3.5 w-3.5" /> Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <AlertCircle className="h-3.5 w-3.5" /> Pending
              </span>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {cert ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="h-8 w-8 text-brand shrink-0 text-emerald-500" />
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">
                        {certName || "verified_school_certificate.png"}
                      </div>
                      <div className="text-xs text-muted-foreground">Uploaded & Approved</div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRemove}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {cert.startsWith("data:image/") && (
                  <div className="relative rounded-lg border overflow-hidden aspect-video bg-muted flex items-center justify-center p-2">
                    <img
                      src={cert}
                      alt="School Certificate"
                      className="object-contain max-h-full max-w-full rounded-md shadow-sm"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-xs text-muted-foreground">
                  Upload your government-registered driving school certificate to complete
                  verification.
                </div>
                <div className="relative border-2 border-dashed rounded-lg p-6 hover:bg-muted/50 transition-colors cursor-pointer text-center bg-card">
                  <Input
                    id="settings-cert"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleUpload}
                    className="hidden"
                  />
                  <label htmlFor="settings-cert" className="cursor-pointer space-y-2 block">
                    <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground animate-pulse" />
                    <div className="space-y-0.5">
                      <span className="text-sm font-medium text-brand block hover:underline">
                        Click to upload
                      </span>
                      <span className="text-xs text-muted-foreground block">
                        PNG, JPG, or PDF (max 5MB)
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Password & security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-xs mb-1 block">Current password</Label>
              <Input type="password" className="h-11" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs mb-1 block">New password</Label>
                <Input type="password" className="h-11" />
              </div>
              <div>
                <Label className="text-xs mb-1 block">Confirm password</Label>
                <Input type="password" className="h-11" />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <div className="text-sm font-medium">Two-factor authentication</div>
                <div className="text-xs text-muted-foreground">
                  Add extra security to your account
                </div>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              "Payment received",
              "Leave request",
              "New student registration",
              "Instructor absence",
              "Subscription expiry",
            ].map((n) => (
              <div key={n} className="flex items-center justify-between">
                <span className="text-sm">{n}</span>
                <Switch defaultChecked />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Receipt numbering</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs mb-1 block">Prefix</Label>
                <Input defaultValue="RCP" className="h-11" />
              </div>
              <div>
                <Label className="text-xs mb-1 block">Next number</Label>
                <Input defaultValue="5099" className="h-11" />
              </div>
              <div>
                <Label className="text-xs mb-1 block">Fiscal year</Label>
                <Input defaultValue="2081" className="h-11" />
              </div>
              <div>
                <Label className="text-xs mb-1 block">Reset each year</Label>
                <Select defaultValue="yes">
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Session & data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Session timeout</span>
              <Select defaultValue="30">
                <SelectTrigger className="h-9 w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 min</SelectItem>
                  <SelectItem value="30">30 min</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="240">4 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => toast.success("Export started. We'll email you when ready.")}
            >
              Export all data
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Roles & permissions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {[
              ["Admin", "Full access to everything"],
              ["Branch Manager", "Manage own branch data"],
              ["Receptionist", "Add students & record payments"],
              ["Instructor", "View schedule & students"],
            ].map(([r, d]) => (
              <div key={r} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <div className="font-medium">{r}</div>
                  <div className="text-xs text-muted-foreground">{d}</div>
                </div>
                <Button variant="ghost" size="sm">
                  Configure
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
