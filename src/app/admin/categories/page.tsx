"use client";

import { useEffect, useState } from "react";
import { listCategories, upsertCategory, deleteCategory } from "@/lib/firebase/data";
import type { Category, CategoryType } from "@/lib/types";
import { CATEGORY_TYPES } from "@/lib/types";
import { categoryLabelMap } from "@/lib/category-map";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUpload } from "@/components/admin/image-upload";
import { toast } from "sonner";
import { Layers, Plus, Trash2, Edit2, X, MoveHorizontal } from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCat, setEditingCat] = useState<Partial<Category> | null>(null);

  const refresh = async () => {
    setLoading(true);
    const data = await listCategories();
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    void refresh();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCat || !editingCat.name || !editingCat.slug) return;

    try {
      const payload = {
        name: editingCat.name,
        slug: editingCat.slug,
        type: editingCat.type || "activity",
        heroImage: editingCat.heroImage || "",
        sortOrder: Number(editingCat.sortOrder) || 0,
        published: editingCat.published ?? true,
      };

      await upsertCategory(editingCat.id || null, payload);
      toast.success(editingCat.id ? "Category updated" : "Category created");
      setEditingCat(null);
      void refresh();
    } catch (err) {
      toast.error("Error saving category");
    }
  };

  return (
    <div className="p-8 space-y-8 animate-reveal">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Category management</h1>
          <p className="text-muted-foreground text-sm">Organize public service pages and their order.</p>
        </div>
        <Button onClick={() => setEditingCat({ type: "activity", sortOrder: 0, published: true })} className="rounded-full">
          <Plus className="mr-2 h-4 w-4" /> New Category
        </Button>
      </div>

      {editingCat && (
        <div className="ui-surface p-6 border-primary/20 animate-reveal max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">{editingCat.id ? "Edit Category" : "New Category"}</h2>
            <Button variant="ghost" size="icon" onClick={() => setEditingCat(null)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Display Name</label>
                <Input 
                  value={editingCat.name || ""} 
                  onChange={(e) => setEditingCat({...editingCat, name: e.target.value})}
                  placeholder="e.g. Exotic Night Clubs"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">URL Slug</label>
                <Input 
                  value={editingCat.slug || ""} 
                  onChange={(e) => setEditingCat({...editingCat, slug: e.target.value})}
                  placeholder="exotic-night-clubs"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Internal Type</label>
                <Select
                  value={editingCat.type}
                  onValueChange={(v) => setEditingCat({...editingCat, type: v as CategoryType})}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORY_TYPES.map(t => (
                      <SelectItem key={t} value={t}>{categoryLabelMap[t]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Sort Order</label>
                <Input 
                  type="number"
                  value={editingCat.sortOrder ?? 0} 
                  onChange={(e) => setEditingCat({...editingCat, sortOrder: Number(e.target.value)})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Hero Image URL</label>
              <div className="flex gap-2">
                <Input value={editingCat.heroImage || ""} readOnly className="bg-muted" />
                <ImageUpload onUploaded={(url) => setEditingCat({...editingCat, heroImage: url})} />
              </div>
              {editingCat.heroImage && (
                <div className="mt-2 h-32 w-full rounded-2xl overflow-hidden border">
                  <img src={editingCat.heroImage} className="h-full w-full object-cover" />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border/40">
              <Button type="button" variant="ghost" onClick={() => setEditingCat(null)}>Cancel</Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">Save Category</Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4 max-w-4xl">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-card/40 border border-border/40" />
          ))
        ) : (
          categories.map((cat) => (
            <div key={cat.id} className="ui-surface p-4 flex items-center gap-4 group hover:border-primary/40 transition-colors">
              <div className="h-12 w-12 rounded-xl border border-border/40 overflow-hidden shrink-0 bg-muted">
                {cat.heroImage && <img src={cat.heroImage} className="h-full w-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold truncate">{cat.name}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">{cat.type}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate italic">/{cat.slug}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <div className="hidden sm:flex items-center gap-1 mr-4 px-2 py-1 bg-muted rounded text-[10px] font-bold">
                  <MoveHorizontal className="h-3 w-3" /> Order: {cat.sortOrder}
                </div>
                <Button variant="ghost" size="icon" onClick={() => setEditingCat(cat)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-red-500 hover:bg-red-50"
                  onClick={async () => {
                    if (confirm("Delete this category?")) {
                      await deleteCategory(cat.id);
                      toast.success("Category deleted");
                      void refresh();
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
