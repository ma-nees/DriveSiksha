// ma-nees
import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogoWithName } from "@/components/Logo";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({ component: Page });

import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

function Page() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { updatePassword, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }
    try {
      await updatePassword(password);
      navigate({ to: "/login" });
    } catch (err) {
      // already handled
    }
  };

  return (
    <div className="min-h-dvh flex items-center justify-center p-5 bg-muted/40">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <LogoWithName size={44} />
        </div>
        <Card className="p-6 sm:p-8">
          <h1 className="text-2xl font-bold">Set a new password</h1>
          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-4"
          >
            <div className="space-y-1.5">
              <Label>New password</Label>
              <Input
                type="password"
                className="h-11"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Confirm password</Label>
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
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update password
            </Button>
            <div className="text-center text-sm">
              <Link to="/login" className="text-brand hover:underline">
                Back to sign in
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
