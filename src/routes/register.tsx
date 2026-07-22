// ma-nees
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Eye,
  EyeOff,
  Loader2,
  School,
  User,
  Mail,
  Phone,
  Lock,
  UploadCloud,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { LogoWithName, Logo } from "@/components/Logo";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
  head: () => ({
    meta: [
      { title: "Register — DriveSiksha" },
      {
        name: "description",
        content: "Register your driving school on DriveSiksha and start managing today.",
      },
    ],
  }),
});

function RegisterPage() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [fullName, setFullName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [certificate, setCertificate] = useState<string | null>(null);
  const [certificateName, setCertificateName] = useState("");

  const navigate = useNavigate();

  const handleCertificateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCertificateName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCertificate(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!agreed) {
      toast.error("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }
    if (!certificate) {
      toast.error("Please upload your school's verified certificate.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("drivesiksha_certificate", certificate);
      localStorage.setItem("drivesiksha_certificate_name", certificateName);
      localStorage.setItem("drivesiksha_school_name", schoolName);

      toast.success("Registration successful! Welcome to DriveSiksha.");
      // Trigger a storage event so other open pages know the cert has been set
      window.dispatchEvent(new Event("storage"));
      navigate({ to: "/dashboard" });
    }, 1200);
  }

  return (
    <div className="min-h-dvh grid lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between bg-brand text-brand-foreground p-10 overflow-hidden">
        <div className="absolute inset-0 opacity-20 [background:radial-gradient(circle_at_20%_20%,var(--sky)_0,transparent_40%),radial-gradient(circle_at_80%_70%,var(--accent-red)_0,transparent_40%)]" />
        <div className="relative">
          <LogoWithName size={44} />
        </div>
        <div className="relative space-y-4">
          <h2 className="text-3xl xl:text-4xl font-bold tracking-tight leading-tight">
            Empower your driving
            <br />
            school operations.
          </h2>
          <p className="text-brand-foreground/70 max-w-md">
            Join the leading Nepalese driving school network. Easily schedule lessons, manage
            multi-branch operations, keep track of payments, and generate automatic bills.
          </p>
          <div className="flex flex-wrap gap-2 pt-4">
            {["Multi-branch", "eSewa payments", "4-up A4 receipts", "Audit logs"].map((t) => (
              <span
                key={t}
                className="rounded-full border border-brand-foreground/20 px-3 py-1 text-xs font-medium"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="relative text-xs text-brand-foreground/60">
          © {new Date().getFullYear()} DriveSiksha
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-5 sm:p-8 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <Logo size={40} />
            <div>
              <div className="font-bold text-lg">
                Drive<span className="text-accent-red">Siksha</span>
              </div>
              <div className="text-xs text-muted-foreground">Admin Registration</div>
            </div>
          </div>
          <Card className="p-6 sm:p-8 shadow-xl">
            <div className="mb-6">
              <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Set up your driving school admin workspace in seconds.
              </p>
            </div>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="fullName">Full Name *</Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    type="text"
                    required
                    placeholder="Suman Shrestha"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-11 pl-10"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="schoolName">Driving School Name *</Label>
                <div className="relative">
                  <School className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="schoolName"
                    type="text"
                    required
                    placeholder="DriveSiksha Kathmandu"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="h-11 pl-10"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="admin@drivesiksha.com.np"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 pl-10"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    required
                    placeholder="98XXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-11 pl-10"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="certificate">Verified School Certificate *</Label>
                <div className="relative border-2 border-dashed rounded-lg p-3.5 hover:bg-muted/50 transition-colors cursor-pointer text-center bg-card">
                  <Input
                    id="certificate"
                    type="file"
                    required
                    accept="image/*,.pdf"
                    onChange={handleCertificateChange}
                    className="hidden"
                  />
                  <label htmlFor="certificate" className="cursor-pointer space-y-1 block">
                    <UploadCloud className="mx-auto h-6 w-6 text-muted-foreground animate-pulse" />
                    <span className="text-xs text-muted-foreground block font-medium">
                      {certificateName ? (
                        <span className="text-brand flex items-center justify-center gap-1">
                          <FileText className="h-4 w-4 shrink-0 text-emerald-500" />
                          <span className="truncate max-w-[200px]">{certificateName}</span>
                        </span>
                      ) : (
                        "Upload registration certificate (PNG, JPG, or PDF)"
                      )}
                    </span>
                  </label>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={show ? "text" : "password"}
                    required
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground p-1"
                    aria-label={show ? "Hide password" : "Show password"}
                  >
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <label className="flex items-start gap-2.5 text-sm cursor-pointer select-none pt-1">
                <Checkbox
                  id="agreed"
                  checked={agreed}
                  onCheckedChange={(checked) => setAgreed(!!checked)}
                  className="mt-0.5"
                />
                <span className="text-xs text-muted-foreground leading-snug">
                  I agree to the{" "}
                  <a href="#" className="text-brand hover:underline font-medium">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-brand hover:underline font-medium">
                    Privacy Policy
                  </a>
                  .
                </span>
              </label>

              <Button
                type="submit"
                className="w-full h-11 bg-accent-red hover:bg-accent-red/90 text-accent-red-foreground mt-2"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Register Account
              </Button>

              <div className="text-xs text-center text-muted-foreground pt-2">
                Already have an account?{" "}
                <Link to="/login" className="text-brand font-medium hover:underline">
                  Sign in
                </Link>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
