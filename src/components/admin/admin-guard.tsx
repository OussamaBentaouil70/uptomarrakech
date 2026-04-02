"use client";

import { onAuthStateChanged, type User } from "firebase/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getClientAuth } from "@/lib/firebase/auth";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(getClientAuth(), (u) => {
      setUser(u);
      setLoading(false);
      if (!u) router.replace("/admin/login");
    });
    return () => unsub();
  }, [router]);

  if (loading) return <p className="p-6">Checking session...</p>;
  if (!user) return null;
  return <>{children}</>;
}

