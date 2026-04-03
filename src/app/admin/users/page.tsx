"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { UserPlus, Trash2, ShieldCheck, Mail, X } from "lucide-react";

type AdminUser = {
  id: string;
  email: string;
  addedAt: any;
};

export default function UsersPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  const refreshAdmins = async () => {
    setLoading(true);
    const snap = await getDocs(collection(db, "admins"));
    setAdmins(snap.docs.map(d => ({ id: d.id, ...d.data() } as AdminUser)));
    setLoading(false);
  };

  useEffect(() => {
    void refreshAdmins();
  }, []);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;

    try {
      // Check if already exists
      const q = query(collection(db, "admins"), where("email", "==", newEmail));
      const existing = await getDocs(q);
      if (!existing.empty) {
        toast.error("User is already an admin");
        return;
      }

      await addDoc(collection(db, "admins"), {
        email: newEmail.toLowerCase().trim(),
        addedAt: new Date().toISOString(),
      });
      toast.success("Admin added successfully");
      setNewEmail("");
      setIsAdding(false);
      void refreshAdmins();
    } catch (err) {
      toast.error("Error adding admin");
    }
  };

  const handleRemoveAdmin = async (id: string, email: string) => {
    if (!confirm(`Remove admin access for ${email}?`)) return;
    try {
      await deleteDoc(doc(db, "admins", id));
      toast.success("Admin removed");
      void refreshAdmins();
    } catch (err) {
      toast.error("Error removing admin");
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Admin Management</h1>
          <p className="text-muted-foreground text-sm">Authorized users with dashboard access.</p>
        </div>
        <Button onClick={() => setIsAdding(true)} className="rounded-full">
          <UserPlus className="mr-2 h-4 w-4" /> Add Admin
        </Button>
      </div>

      {isAdding && (
        <div className="ui-surface p-6 border-primary/20 animate-reveal max-w-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" /> Authority Access
            </h2>
            <Button variant="ghost" size="icon" onClick={() => setIsAdding(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <form onSubmit={handleAddAdmin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">User Email Address</label>
              <Input 
                type="email" 
                value={newEmail} 
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="admin@uptomarrakech.com"
                required
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">Grant Access</Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4 max-w-3xl">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-card/40 border border-border/40" />
          ))
        ) : admins.length === 0 ? (
          <div className="py-20 text-center ui-surface">
            <p className="text-muted-foreground">No authorized admins found. (Check Firebase rules if this is unexpected)</p>
          </div>
        ) : (
          admins.map((admin) => (
            <div key={admin.id} className="ui-surface p-4 flex items-center justify-between group hover:border-primary/40 transition-colors">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium">{admin.email}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3 w-3" /> Access granted on {new Date(admin.addedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemoveAdmin(admin.id, admin.email)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>
      
      <div className="max-w-3xl p-6 bg-primary/5 rounded-3xl border border-primary/10">
        <h3 className="font-semibold text-primary mb-2 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4" /> Security Note
        </h3>
        <p className="text-xs text-primary/70 leading-relaxed">
          Adding an email here grants dashboard access to that user in combination with Firebase Authentication. Ensure the email belongs to a trusted team member.
        </p>
      </div>
    </div>
  );
}
