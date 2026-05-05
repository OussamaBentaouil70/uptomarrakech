"use client";

import { onAuthStateChanged, getIdTokenResult, type User } from "firebase/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getClientAuth } from "@/lib/firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(getClientAuth(), async (u) => {
      const isLoginPath = window.location.pathname === "/admin/login";
      
      if (!u) {
        setUser(null);
        setIsAuthorized(false);
        setLoading(false);
        if (!isLoginPath) {
          router.replace("/admin/login");
        }
        return;
      }

      // Check id token claims and authorized email
      try {
        const email = u.email?.toLowerCase();

        // Check ID token for an `admin` custom claim first
        let isAdminClaim = false;
        try {
          const idToken = await getIdTokenResult(u);
          isAdminClaim = !!idToken.claims?.admin;
        } catch (claimErr) {
          console.warn("Failed to verify ID token claims", claimErr);
        }

        // Fallback: check admins collection by email
        const q = query(collection(db, "admins"), where("email", "==", email));
        const snap = await getDocs(q);

        // TEMPORARY: Allow master admin if DB is empty or if it's the owner's email
        const isMaster = email === "bentaouiloussama@gmail.com";
        const authorized = isAdminClaim || !snap.empty || isMaster;

        setUser(u);
        setIsAuthorized(authorized);
        setLoading(false);
      } catch (err) {
        console.error("Auth check failed", err);
        setLoading(false);
      }
    });
    return () => unsub();
  }, [router]);

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-muted-foreground font-medium animate-pulse">Authenticating...</p>
      </div>
    </div>
  );

  if (!user) return null;

  if (!isAuthorized) return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="max-w-md w-full ui-surface p-8 text-center space-y-6 border-red-200">
        <div className="h-20 w-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
          <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground italic font-serif">
            L'accès à ce tableau de bord est réservé aux administrateurs autorisés.
          </p>
          <p className="text-sm text-zinc-500">
            Current account: <span className="font-semibold">{user.email}</span>
          </p>
        </div>
        <div className="pt-4 border-t border-border/40">
          <button 
            onClick={() => getClientAuth().signOut()}
            className="text-primary hover:underline font-medium"
          >
            Sign out and try another account
          </button>
        </div>
      </div>
    </div>
  );

  return <>{children}</>;
}

