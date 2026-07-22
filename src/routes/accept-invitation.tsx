// ma-nees
import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogoWithName } from "@/components/Logo";
import { toast } from "sonner";

export const Route = createFileRoute("/accept-invitation")({ component: Page });

import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { Loader2 } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

function Page() {
  const [token, setToken] = useState<string | null>(null);
  const [invitation, setInvitation] = useState<{ email: string; role: string; schoolName: string } | null>(null);
  const [fetching, setFetching] = useState(true);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signingUp, setSigningUp] = useState(false);

  const { signUp } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("token");
    setToken(t);

    if (!t) {
      setFetching(false);
      return;
    }

    const fetchInvite = async () => {
      try {
        const { data, error } = await supabase
          .from("invitations")
          .select("email, role, schools(school_name)")
          .eq("token", t)
          .eq("accepted", false)
          .gt("expires_at", new Date().toISOString())
          .single();

        if (error) throw error;
        if (data) {
          const schools = data.schools as any;
          setInvitation({
            email: data.email,
            role: data.role,
            schoolName: schools?.school_name || "Driving School",
          });
        }
      } catch (err) {
        console.error("Error fetching invitation:", err);
      } finally {
        setFetching(false);
      }
    };

    fetchInvite();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invitation || !token) return;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setSigningUp(true);
    try {
      // Direct supabase sign up passing invitation_token in metadata
      const { error } = await supabase.auth.signUp({
        email: invitation.email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
            invitation_token: token,
          },
        },
      });

      if (error) throw error;

      toast.success("Account created! Please check your email for verification.");
      navigate({ to: "/login" });
    } catch (err: any) {
      toast.error(err.message || "Failed to create account.");
    } finally {
      setSigningUp(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-muted/40">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-brand" />
          <p className="text-sm text-muted-foreground">Verifying invitation...</p>
        </div>
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="min-h-dvh flex items-center justify-center p-5 bg-muted/40">
        <Card className="p-6 sm:p-8 max-w-md w-full text-center">
          <h1 className="text-xl font-bold text-red-500">Invalid or Expired Invitation</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This invitation link is invalid, has already been used, or has expired. Please request a new invitation from your Driving School Admin.
          </p>
          <div className="mt-6">
            <Link to="/login" className="text-brand hover:underline font-semibold">
              Back to sign in
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex items-center justify-center p-5 bg-muted/40">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <LogoWithName size={44} />
        </div>
        <Card className="p-6 sm:p-8">
          <h1 className="text-2xl font-bold">Accept invitation</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            You are invited to join <span className="font-semibold">{invitation.schoolName}</span> as{" "}
            <span className="font-semibold text-brand">{invitation.role.replace("_", " ")}</span>.
          </p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label>Invited email address</Label>
              <Input className="h-11 bg-muted cursor-not-allowed" value={invitation.email} disabled />
            </div>
            <div className="space-y-1.5">
              <Label>Full name *</Label>
              <Input
                className="h-11"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Phone number *</Label>
              <Input
                className="h-11"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Password *</Label>
              <Input
                type="password"
                className="h-11"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Confirm Password *</Label>
              <Input
                type="password"
                className="h-11"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <Button
              className="w-full h-11 bg-accent-red hover:bg-accent-red/90 text-accent-red-foreground"
              disabled={signingUp}
            >
              {signingUp && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Accept & create account
            </Button>
            <div className="text-center text-sm">
              <Link to="/login" className="text-brand hover:underline">
                Already have an account? Sign in
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
