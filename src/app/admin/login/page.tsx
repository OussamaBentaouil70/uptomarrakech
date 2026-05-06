"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getClientAuth } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Lock, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await signInWithEmailAndPassword(getClientAuth(), email, password);
      toast.success("Welcome back, Explorer.");
      router.push("/admin");
    } catch (error) {
      console.error(error);
      toast.error("Authentication failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen bg-background">
      {/* Visual Side */}
      <div className="relative hidden w-1/2 lg:block">
        <img
          src="https://images.pexels.com/photos/17649841/pexels-photo-17649841.jpeg"
          alt="Marrakech Architecture"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-charcoal/30 backdrop-contrast-[1.1]" />
        <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">
          <Link href="/" className="relative h-24 w-56 overflow-hidden transition-transform duration-500 hover:scale-105">
            <Image 
              src="https://res.cloudinary.com/dj-events101/image/upload/v1778106321/logo_mymarrakechtrip_f79qyw.png" 
              alt="MyMarrakechTrip" 
              fill 
              className="object-contain object-left brightness-0 invert drop-shadow-lg" 
            />
          </Link>
          <div className="space-y-4 max-w-md">
            <h2 className="ui-display text-4xl font-bold leading-tight">
              L'excellence à l'état pur, <br /> au cœur de la ville rouge.
            </h2>
            <p className="text-white/80 font-serif italic text-lg">
              Manage your premium collection with ease and elegance.
            </p>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-24">
        <div className="mx-auto w-full max-w-md space-y-8 animate-reveal">
          <div className="space-y-2">
            <h1 className="ui-heading text-3xl font-bold tracking-tight">Admin Portal</h1>
            <p className="text-muted-foreground">Please enter your credentials to access the console.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-primary">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@mymarrakechtrip.com"
                    className="pl-10 h-10 border-border/40 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-widest text-primary">Password</label>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 h-10 border-border/40 focus:ring-primary"
                    required
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          <footer className="pt-8 border-t border-border/40">
            <p className="text-xs text-center text-muted-foreground">
              MyMarrakechTrip Admin Portal • 2026
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}

