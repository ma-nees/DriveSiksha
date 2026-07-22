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

import { useAuth } from "../context/AuthContext";

function RegisterPage() {
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [fullName, setFullName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const { signUp, loading } = useAuth();

  // Nepal phone helper
  const cleanAndValidateNepalPhone = (num: string): boolean => {
    const clean = num.replace(/[\s\-()]/g, '').replace(/^\+977|^977/, '');
    return /^(98|97|96)\d{8}$/.test(clean) || /^0\d{8}$/.test(clean);
  };

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/\d/.test(pass)) score++;
    if (/[@$!%*?&#^()_\-+=]/.test(pass)) score++;

    switch (score) {
      case 0:
      case 1:
      case 2:
        return { label: "Weak", color: "bg-red-500", text: "text-red-500", score };
      case 3:
      case 4:
        return { label: "Medium", color: "bg-yellow-500", text: "text-yellow-500", score };
      case 5:
        return { label: "Strong", color: "bg-emerald-500", text: "text-emerald-500", score };
      default:
        return { label: "Weak", color: "bg-red-500", text: "text-red-500", score };
    }
  };

  const strength = getPasswordStrength(password);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!agreed) {
      toast.error("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    // Phone validation
    if (!cleanAndValidateNepalPhone(phone)) {
      toast.error("Invalid Nepal phone number. Please enter a valid 10-digit mobile number.");
      return;
    }

    // Password strength check
    if (strength.score < 5) {
      toast.error("Password must be at least 8 characters long and contain uppercase, lowercase, a number, and a special character.");
      return;
    }

    try {
      await signUp(fullName, schoolName, email, phone, password);
      navigate({ to: "/login" });
    } catch (err: any) {
      // toast is already fired inside AuthContext
    }
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
                {password.length > 0 && (
                  <div className="mt-1.5 space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Password strength:</span>
                      <span className={`font-semibold ${strength.text}`}>{strength.label}</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${strength.color} transition-all duration-300`}
                        style={{ width: `${(strength.score / 5) * 100}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-muted-foreground leading-tight space-y-0.5">
                      <p className={password.length >= 8 ? "text-emerald-500" : ""}>✓ At least 8 characters</p>
                      <p className={/[A-Z]/.test(password) ? "text-emerald-500" : ""}>✓ At least one uppercase letter</p>
                      <p className={/[a-z]/.test(password) ? "text-emerald-500" : ""}>✓ At least one lowercase letter</p>
                      <p className={/\d/.test(password) ? "text-emerald-500" : ""}>✓ At least one number</p>
                      <p className={/[@$!%*?&#^()_\-+=]/.test(password) ? "text-emerald-500" : ""}>✓ At least one special character</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    required
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-11 pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((s) => !s)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground p-1"
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
