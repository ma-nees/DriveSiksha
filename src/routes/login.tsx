// ma-nees
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { LogoWithName, Logo } from "@/components/Logo";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Sign in — DriveSiksha" },
      {
        name: "description",
        content: "Sign in to your DriveSiksha driving school admin dashboard.",
      },
    ],
  }),
});

import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("admin@drivesiksha.com.np");
  const [password, setPassword] = useState("demopass");
  const [rememberMe, setRememberMe] = useState(true);

  const navigate = useNavigate();
  const { signIn, loading } = useAuth();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await signIn(email, password, rememberMe);
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      // toast error is already fired in AuthContext
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
            The driving school
            <br />
            operating system for Nepal.
          </h2>
          <p className="text-brand-foreground/70 max-w-md">
            Manage students, instructors, payments, receipts, branches and subscription — all from
            one polished dashboard.
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
      <div className="flex items-center justify-center p-5 sm:p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <Logo size={40} />
            <div>
              <div className="font-bold text-lg">
                Drive<span className="text-accent-red">Siksha</span>
              </div>
              <div className="text-xs text-muted-foreground">Admin sign in</div>
            </div>
          </div>
          <Card className="p-6 sm:p-8 shadow-xl">
            <div className="mb-6">
              <h1 className="text-2xl font-bold tracking-tight">Sign in</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Welcome back. Enter your credentials to continue.
              </p>
            </div>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-medium text-brand hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={show ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 pr-10"
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
              <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                <Checkbox
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(!!checked)}
                />{" "}
                <span>Remember me</span>
              </label>
              <Button
                type="submit"
                className="w-full h-11 bg-accent-red hover:bg-accent-red/90 text-accent-red-foreground"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign in
              </Button>
              <div className="text-xs text-center text-muted-foreground pt-2 space-y-1.5">
                <div>
                  Don't have an account?{" "}
                  <Link to="/register" className="text-brand font-medium hover:underline">
                    Register driving school
                  </Link>
                </div>
                <div className="border-t border-border/60 my-2 pt-2">
                  <Link
                    to="/accept-invitation"
                    className="text-brand hover:underline text-xs"
                  >
                    Have an invitation? Accept invite
                  </Link>
                </div>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
