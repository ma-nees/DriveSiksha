// ma-nees
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/_admin/settings")({
  component: SettingsPage,
  head: () => ({ meta: [{ title: "Settings — DriveSiksha" }] }),
});

function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" description="Account, security, notifications and app preferences." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Profile</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs mb-1 block">Full name</Label><Input defaultValue="Suman Shrestha" className="h-11" /></div>
              <div><Label className="text-xs mb-1 block">Email</Label><Input defaultValue="admin@drivesiksha.com.np" className="h-11" /></div>
              <div><Label className="text-xs mb-1 block">Phone</Label><Input defaultValue="+977 9841000001" className="h-11" /></div>
              <div><Label className="text-xs mb-1 block">Role</Label><Input defaultValue="Driving School Admin" className="h-11" disabled /></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Password & security</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div><Label className="text-xs mb-1 block">Current password</Label><Input type="password" className="h-11" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs mb-1 block">New password</Label><Input type="password" className="h-11" /></div>
              <div><Label className="text-xs mb-1 block">Confirm password</Label><Input type="password" className="h-11" /></div>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div><div className="text-sm font-medium">Two-factor authentication</div><div className="text-xs text-muted-foreground">Add extra security to your account</div></div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Notifications</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {["Payment received", "Leave request", "New student registration", "Instructor absence", "Subscription expiry"].map((n) => (
              <div key={n} className="flex items-center justify-between"><span className="text-sm">{n}</span><Switch defaultChecked /></div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Receipt numbering</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs mb-1 block">Prefix</Label><Input defaultValue="RCP" className="h-11" /></div>
              <div><Label className="text-xs mb-1 block">Next number</Label><Input defaultValue="5099" className="h-11" /></div>
              <div><Label className="text-xs mb-1 block">Fiscal year</Label><Input defaultValue="2081" className="h-11" /></div>
              <div><Label className="text-xs mb-1 block">Reset each year</Label>
                <Select defaultValue="yes"><SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Session & data</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between"><span className="text-sm">Session timeout</span>
              <Select defaultValue="30"><SelectTrigger className="h-9 w-32"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="15">15 min</SelectItem><SelectItem value="30">30 min</SelectItem><SelectItem value="60">1 hour</SelectItem><SelectItem value="240">4 hours</SelectItem></SelectContent>
              </Select>
            </div>
            <Button variant="outline" className="w-full" onClick={() => toast.success("Export started. We'll email you when ready.")}>Export all data</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Roles & permissions</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {[["Admin", "Full access to everything"], ["Branch Manager", "Manage own branch data"], ["Receptionist", "Add students & record payments"], ["Instructor", "View schedule & students"]].map(([r, d]) => (
              <div key={r} className="flex items-center justify-between rounded-lg border p-3">
                <div><div className="font-medium">{r}</div><div className="text-xs text-muted-foreground">{d}</div></div>
                <Button variant="ghost" size="sm">Configure</Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

