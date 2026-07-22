// ma-nees
import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogoWithName } from "@/components/Logo";
import { toast } from "sonner";

export const Route = createFileRoute("/forgot-password")({ component: Page });

import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { Loader2 } from "lucide-react";

function Page() {
  const [email, setEmail] = useState("");
  const { resetPassword, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await resetPassword(email);
    } catch (err) {
      // toast error is already handled
    }
  };

  return (
    <div className="min-h-dvh flex items-center justify-center p-5 bg-muted/40">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <LogoWithName size={44} />
        </div>
        <Card className="p-6 sm:p-8">
          <h1 className="text-2xl font-bold">Reset your password</h1>
          <p className="mt-1 text-sm text-muted-foreground">We'll email you a secure reset link.</p>
          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-4"
          >
            <div className="space-y-1.5">
              <Label htmlFor="e">Email</Label>
              <Input
                id="e"
                type="email"
                placeholder="you@school.com"
                className="h-11"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button
              className="w-full h-11 bg-accent-red hover:bg-accent-red/90 text-accent-red-foreground"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send reset link
            </Button>
            <div className="text-center text-sm text-muted-foreground">
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
