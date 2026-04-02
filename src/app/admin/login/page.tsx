"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getClientAuth } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState(process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "");
  const [password, setPassword] = useState(process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "");
  const [loading, setLoading] = useState(false);

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle>Admin login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Admin email" />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <Button
            disabled={loading}
            className="w-full bg-amber-700 hover:bg-amber-800"
            onClick={async () => {
              try {
                setLoading(true);
                await signInWithEmailAndPassword(getClientAuth(), email, password);
                toast.success("Logged in");
                router.push("/admin");
              } catch (error) {
                console.error(error);
                toast.error("Login failed");
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
          <p className="text-xs text-zinc-500">
            First time setup: create this user in Firebase Auth manually.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

