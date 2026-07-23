// ma-nees
import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { branches, students, payments, instructors } from "@/lib/mock-data";
import logoUrl from "@/assets/Logo.png";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
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
  const { user } = useAuth();
  const [cert, setCert] = useState<string | null>(null);
  const [certName, setCertName] = useState<string>("");
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [customTimeout, setCustomTimeout] = useState("45");
  const [exporting, setExporting] = useState(false);

  const handleExportData = async () => {
    setExporting(true);
    try {
      let activeBranches = branches;
      let activeInstructors = instructors;
      let activeStudents = students;
      let activePayments = payments.map(p => ({
        dateBS: p.dateBS,
        studentName: p.studentName,
        paymentMethod: p.paymentMethod,
        amount: p.amount
      }));

      const isPlaceholderEnv = 
        !import.meta.env.VITE_SUPABASE_URL || 
        import.meta.env.VITE_SUPABASE_URL.includes("your-project-id");
      const isMockSession = localStorage.getItem("drivesiksha_mock_session");

      if (!isPlaceholderEnv && !isMockSession && user) {
        toast.info("Fetching database records for backup...");
        const [resBranches, resInstructors, resStudents, resPayments] = await Promise.all([
          supabase.from('branches').select('*'),
          supabase.from('instructors').select('*'),
          supabase.from('students').select('*'),
          supabase.from('payments').select('*, students(name)')
        ]);

        if (resBranches.data) {
          activeBranches = resBranches.data.map((b: any) => ({
            id: b.id,
            name: b.name,
            address: b.address || '',
            phone: b.phone || ''
          }));
        }
        if (resInstructors.data) {
          activeInstructors = resInstructors.data.map((i: any) => ({
            id: i.id,
            name: i.name,
            phone: i.phone,
            license_category: i.license_category,
            status: i.status
          }));
        }
        if (resStudents.data) {
          activeStudents = resStudents.data.map((s: any) => ({
            id: s.id,
            name: s.name,
            phone: s.phone,
            license_category: s.license_category || '',
            status: s.status
          }));
        }
        if (resPayments.data) {
          activePayments = resPayments.data.map((p: any) => ({
            dateBS: new Date(p.created_at).toLocaleDateString(),
            studentName: p.students?.name || 'Unknown Student',
            paymentMethod: p.payment_method,
            amount: Number(p.amount)
          }));
        }
      }

      const exportData = {
        exportedAt: new Date().toISOString(),
        schoolName: localStorage.getItem("drivesiksha_school_name") || "DriveSiksha Driving School",
        schoolDetails: {
          email: "info@drivesiksha.com.np",
          phone: "+977 01-4567890",
          address: "Kathmandu, Nepal",
        },
        branches: activeBranches,
        instructors: activeInstructors,
        students: activeStudents,
        payments: activePayments,
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `DriveSiksha_FullDataExport_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.removeChild(downloadAnchor);
      toast.success("School database exported successfully!");
    } catch (error) {
      toast.error("Failed to export data.");
    } finally {
      setExporting(false);
    }
  };

  const handleExportDataPDF = async () => {
    setExporting(true);
    try {
      let activeBranches = branches;
      let activeInstructors = instructors;
      let activeStudents = students;
      let activePayments = payments.map(p => ({
        dateBS: p.dateBS,
        studentName: p.studentName,
        paymentMethod: p.paymentMethod,
        amount: p.amount
      }));

      const isPlaceholderEnv = 
        !import.meta.env.VITE_SUPABASE_URL || 
        import.meta.env.VITE_SUPABASE_URL.includes("your-project-id");
      const isMockSession = localStorage.getItem("drivesiksha_mock_session");

      if (!isPlaceholderEnv && !isMockSession && user) {
        toast.info("Fetching database records for PDF report...");
        const [resBranches, resInstructors, resStudents, resPayments] = await Promise.all([
          supabase.from('branches').select('*'),
          supabase.from('instructors').select('*'),
          supabase.from('students').select('*'),
          supabase.from('payments').select('*, students(name)')
        ]);

        if (resBranches.data) {
          activeBranches = resBranches.data.map((b: any) => ({
            id: b.id,
            name: b.name,
            address: b.address || '',
            phone: b.phone || ''
          }));
        }
        if (resInstructors.data) {
          activeInstructors = resInstructors.data.map((i: any) => ({
            id: i.id,
            name: i.name,
            phone: i.phone,
            license_category: i.license_category,
            status: i.status
          }));
        }
        if (resStudents.data) {
          activeStudents = resStudents.data.map((s: any) => ({
            id: s.id,
            name: s.name,
            phone: s.phone,
            license_category: s.license_category || '',
            status: s.status
          }));
        }
        if (resPayments.data) {
          activePayments = resPayments.data.map((p: any) => ({
            dateBS: new Date(p.created_at).toLocaleDateString(),
            studentName: p.students?.name || 'Unknown Student',
            paymentMethod: p.payment_method,
            amount: Number(p.amount)
          }));
        }
      }

      const schoolName = localStorage.getItem("drivesiksha_school_name") || "DriveSiksha Driving School";
      const exportDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const fullLogoUrl = logoUrl.startsWith("http") ? logoUrl : `${window.location.origin}${logoUrl}`;

      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        toast.error("Failed to open print preview. Please check your popup blocker settings.");
        return;
      }

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>DriveSiksha Backup Report - ${schoolName}</title>
          <style>
            body {
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
              color: #333;
              margin: 40px;
              font-size: 12px;
              line-height: 1.5;
            }
            .header {
              border-bottom: 2px solid #ef4444;
              padding-bottom: 20px;
              margin-bottom: 30px;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
              color: #ef4444;
              font-weight: 700;
            }
            .header-meta {
              text-align: right;
            }
            h2 {
              font-size: 16px;
              color: #111;
              margin-top: 30px;
              margin-bottom: 10px;
              border-bottom: 1px solid #ddd;
              padding-bottom: 5px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th, td {
              text-align: left;
              padding: 8px 10px;
              border-bottom: 1px solid #eee;
            }
            th {
              background-color: #f9f9f9;
              font-weight: 600;
              color: #666;
              font-size: 11px;
              text-transform: uppercase;
            }
            .badge {
              display: inline-block;
              padding: 2px 6px;
              border-radius: 4px;
              font-size: 10px;
              font-weight: 500;
              background-color: #f1f5f9;
              color: #475569;
            }
            .badge-active {
              background-color: #dcfce7;
              color: #15803d;
            }
            @media print {
              body { margin: 20px; }
              .no-print { display: none; }
              h2 { page-break-after: avoid; }
              tr { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div style="display: flex; align-items: center; gap: 12px;">
              <img src="${fullLogoUrl}" alt="DriveSiksha Logo" style="width: 40px; height: 40px; object-fit: contain;" />
              <div>
                <h1 style="margin: 0; font-size: 20px; color: #ef4444; font-weight: 700;">DriveSiksha</h1>
                <div style="font-size: 13px; font-weight: 500; margin-top: 2px; color: #666;">${schoolName}</div>
              </div>
            </div>
            <div class="header-meta">
              <div><strong>Document Type:</strong> Database Backup Report</div>
              <div><strong>Export Date:</strong> ${exportDate}</div>
            </div>
          </div>

          <h2>1. Branches</h2>
          <table>
            <thead>
              <tr>
                <th>Branch Name</th>
                <th>Address</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              ${activeBranches.map(b => `
                <tr>
                  <td><strong>${b.name}</strong></td>
                  <td>${b.address || 'N/A'}</td>
                  <td>${b.phone || 'N/A'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <h2>2. Instructors</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Category</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${activeInstructors.map(i => `
                <tr>
                  <td><strong>${i.name}</strong></td>
                  <td>${i.phone}</td>
                  <td><span class="badge">${i.license_category}</span></td>
                  <td><span class="badge ${i.status === 'active' ? 'badge-active' : ''}">${i.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <h2>3. Active Students</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Category</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${activeStudents.map(s => `
                <tr>
                  <td><strong>${s.name}</strong></td>
                  <td>${s.phone}</td>
                  <td><span class="badge">${s.license_category || 'N/A'}</span></td>
                  <td><span class="badge ${s.status === 'active' ? 'badge-active' : ''}">${s.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <h2>4. Recent Payments</h2>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Student</th>
                <th>Method</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${activePayments.map(p => `
                <tr>
                  <td>${p.dateBS}</td>
                  <td><strong>${p.studentName}</strong></td>
                  <td>${p.paymentMethod}</td>
                  <td>Rs. ${p.amount.toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();
    } catch (err: any) {
      toast.error("Failed to query database data.");
    } finally {
      setExporting(false);
    }
  };


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
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <Label className="text-xs mb-1 block">Full name</Label>
                <Input defaultValue={user?.full_name || "Suman Shrestha"} className="h-11" />
              </div>
              <div>
                <Label className="text-xs mb-1 block">Email</Label>
                <Input defaultValue={user?.email || "admin@drivesiksha.com.np"} className="h-11" />
              </div>
              <div>
                <Label className="text-xs mb-1 block">Phone</Label>
                <Input defaultValue={user?.phone || "+977 9841000001"} className="h-11" />
              </div>
              <div>
                <Label className="text-xs mb-1 block">Role</Label>
                <Input defaultValue={user?.role ? user.role.replace(/_/g, ' ') : "Driving School Admin"} className="h-11" disabled />
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
              <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
                <SelectTrigger className="h-9 w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 min</SelectItem>
                  <SelectItem value="30">30 min</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="240">4 hours</SelectItem>
                  <SelectItem value="custom">Custom...</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {sessionTimeout === "custom" && (
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/40">
                <Label className="text-xs text-muted-foreground">Custom duration (min)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="1"
                    value={customTimeout}
                    onChange={(e) => setCustomTimeout(e.target.value)}
                    className="h-8 w-20 text-xs text-right"
                  />
                  <span className="text-xs text-muted-foreground">min</span>
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Button
                variant="outline"
                className="w-full text-xs font-semibold h-10 border-brand/20 hover:bg-brand/5 hover:text-brand cursor-pointer"
                onClick={handleExportData}
                disabled={exporting}
              >
                {exporting ? "Querying JSON..." : "Export JSON (DB Backup)"}
              </Button>
              <Button
                variant="outline"
                className="w-full text-xs font-semibold h-10 border-emerald-500/20 hover:bg-emerald-50/50 hover:text-emerald-600 cursor-pointer"
                onClick={handleExportDataPDF}
                disabled={exporting}
              >
                {exporting ? "Building PDF..." : "Export PDF Report"}
              </Button>
            </div>
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
