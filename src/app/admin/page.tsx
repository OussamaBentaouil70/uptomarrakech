"use client";

import { useEffect, useMemo, useState } from "react";
import { signOut } from "firebase/auth";
import { getClientAuth } from "@/lib/firebase/auth";
import { AdminGuard } from "@/components/admin/admin-guard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { listCategories, listInquiries, listItems, upsertCategory, upsertItem } from "@/lib/firebase/data";
import type { Category, CategoryType, Inquiry, Item } from "@/lib/types";
import { CATEGORY_TYPES } from "@/lib/types";
import { ImageUpload } from "@/components/admin/image-upload";
import { toast } from "sonner";

type ItemForm = {
  categoryType: CategoryType;
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  coverImage: string;
  gallery: string[];
  location: string;
  price: number;
  priceUnit: "night" | "day" | "person" | "package";
  rooms: number;
  people: number;
  published: boolean;
};

const baseItem: ItemForm = {
  categoryType: "activity" as CategoryType,
  slug: "",
  title: "",
  excerpt: "",
  description: "",
  coverImage: "",
  gallery: [] as string[],
  location: "",
  price: 0,
  priceUnit: "day" as const,
  rooms: 0,
  people: 0,
  published: true,
};

export default function AdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [categoryForm, setCategoryForm] = useState({
    slug: "",
    name: "",
    type: "activity" as CategoryType,
    heroImage: "",
    sortOrder: 0,
    published: true,
  });
  const [itemForm, setItemForm] = useState<ItemForm>(baseItem);

  const refresh = async () => {
    const [cats, its, inq] = await Promise.all([
      listCategories(),
      listItems(),
      listInquiries(),
    ]);
    setCategories(cats);
    setItems(its);
    setInquiries(inq);
  };

  useEffect(() => {
    const t = setTimeout(() => {
      void refresh();
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const isAccommodation = useMemo(
    () => itemForm.categoryType === "accommodation",
    [itemForm.categoryType],
  );

  return (
    <AdminGuard>
      <main className="mx-auto max-w-7xl px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admin dashboard</h1>
          <Button variant="outline" onClick={() => signOut(getClientAuth())}>
            Log out
          </Button>
        </div>

        <Tabs defaultValue="items">
          <TabsList>
            <TabsTrigger value="items">Items</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
          </TabsList>

          <TabsContent value="categories" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-3">
              <Input
                placeholder="Name"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm((p) => ({ ...p, name: e.target.value }))}
              />
              <Input
                placeholder="Slug"
                value={categoryForm.slug}
                onChange={(e) => setCategoryForm((p) => ({ ...p, slug: e.target.value }))}
              />
              <Select
                value={categoryForm.type}
                onValueChange={(v) => setCategoryForm((p) => ({ ...p, type: v as CategoryType }))}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORY_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Sort order"
                type="number"
                value={categoryForm.sortOrder}
                onChange={(e) =>
                  setCategoryForm((p) => ({ ...p, sortOrder: Number(e.target.value) || 0 }))
                }
              />
              <Input
                placeholder="Hero image URL"
                value={categoryForm.heroImage}
                onChange={(e) => setCategoryForm((p) => ({ ...p, heroImage: e.target.value }))}
              />
            </div>
            <ImageUpload
              onUploaded={(url) => setCategoryForm((p) => ({ ...p, heroImage: url }))}
            />
            <Button
              className="bg-amber-700 hover:bg-amber-800"
              onClick={async () => {
                await upsertCategory(null, categoryForm);
                toast.success("Category created");
                setCategoryForm({
                  slug: "",
                  name: "",
                  type: "activity",
                  heroImage: "",
                  sortOrder: 0,
                  published: true,
                });
                await refresh();
              }}
            >
              Create category
            </Button>
            <div className="grid gap-2">
              {categories.map((cat) => (
                <div key={cat.id} className="border rounded-lg p-3 text-sm">
                  {cat.name} · {cat.type} · slug: {cat.slug}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="items" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-3">
              <Select
                value={itemForm.categoryType}
                onValueChange={(v) => setItemForm((p) => ({ ...p, categoryType: v as CategoryType }))}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORY_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Title"
                value={itemForm.title}
                onChange={(e) => setItemForm((p) => ({ ...p, title: e.target.value }))}
              />
              <Input
                placeholder="Slug"
                value={itemForm.slug}
                onChange={(e) => setItemForm((p) => ({ ...p, slug: e.target.value }))}
              />
              <Input
                placeholder="Cover image URL"
                value={itemForm.coverImage}
                onChange={(e) => setItemForm((p) => ({ ...p, coverImage: e.target.value }))}
              />
              <Input
                placeholder="Location"
                value={itemForm.location}
                onChange={(e) => setItemForm((p) => ({ ...p, location: e.target.value }))}
              />
              <Input
                placeholder="Price"
                type="number"
                value={itemForm.price}
                onChange={(e) => setItemForm((p) => ({ ...p, price: Number(e.target.value) || 0 }))}
              />
              <Select
                value={itemForm.priceUnit}
                onValueChange={(v) => {
                  if (!v) return;
                  setItemForm((p) => ({
                    ...p,
                    priceUnit: v as "night" | "day" | "person" | "package",
                  }));
                }}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="night">night</SelectItem>
                  <SelectItem value="day">day</SelectItem>
                  <SelectItem value="person">person</SelectItem>
                  <SelectItem value="package">package</SelectItem>
                </SelectContent>
              </Select>
              {isAccommodation && (
                <>
                  <Input
                    placeholder="Rooms"
                    type="number"
                    value={itemForm.rooms}
                    onChange={(e) =>
                      setItemForm((p) => ({ ...p, rooms: Number(e.target.value) || 0 }))
                    }
                  />
                  <Input
                    placeholder="People"
                    type="number"
                    value={itemForm.people}
                    onChange={(e) =>
                      setItemForm((p) => ({ ...p, people: Number(e.target.value) || 0 }))
                    }
                  />
                </>
              )}
            </div>
            <Textarea
              placeholder="Short excerpt"
              value={itemForm.excerpt}
              onChange={(e) => setItemForm((p) => ({ ...p, excerpt: e.target.value }))}
            />
            <Textarea
              placeholder="Description"
              rows={6}
              value={itemForm.description}
              onChange={(e) => setItemForm((p) => ({ ...p, description: e.target.value }))}
            />
            <div className="space-y-2 rounded-xl border p-3">
              <p className="text-sm font-medium">Cover image</p>
              <ImageUpload onUploaded={(url) => setItemForm((p) => ({ ...p, coverImage: url }))} />
            </div>

            <div className="space-y-3 rounded-xl border p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium">Gallery images</p>
                <p className="text-xs text-zinc-500">Upload multiple images for the item slider</p>
              </div>
              <ImageUpload
                onUploaded={(url) =>
                  setItemForm((p) => ({
                    ...p,
                    gallery: p.gallery.includes(url) ? p.gallery : [...p.gallery, url],
                  }))
                }
              />
              {!!itemForm.gallery.length && (
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {itemForm.gallery.map((img) => (
                    <div key={img} className="rounded-lg border bg-white p-2">
                      <p className="line-clamp-1 text-xs text-zinc-500">{img}</p>
                      <button
                        type="button"
                        className="mt-2 text-xs text-red-600 hover:underline"
                        onClick={() =>
                          setItemForm((p) => ({
                            ...p,
                            gallery: p.gallery.filter((g) => g !== img),
                          }))
                        }
                      >
                        Remove image
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Button
              className="bg-amber-700 hover:bg-amber-800"
              onClick={async () => {
                const payload = {
                  categoryType: itemForm.categoryType,
                  slug: itemForm.slug,
                  title: itemForm.title,
                  excerpt: itemForm.excerpt,
                  description: itemForm.description,
                  coverImage: itemForm.coverImage,
                  gallery: itemForm.gallery,
                  location: itemForm.location,
                  price: itemForm.price,
                  priceUnit: itemForm.priceUnit,
                  accommodation:
                    itemForm.categoryType === "accommodation"
                      ? { rooms: itemForm.rooms, people: itemForm.people }
                      : undefined,
                  published: itemForm.published,
                };
                await upsertItem(null, payload);
                toast.success("Item created");
                setItemForm(baseItem);
                await refresh();
              }}
            >
              Create item
            </Button>
            <div className="grid gap-2">
              {items.map((item) => (
                <div key={item.id} className="border rounded-lg p-3 text-sm">
                  {item.title} · {item.categoryType} · {item.slug}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="inquiries" className="space-y-3">
            {inquiries.map((inq) => (
              <div key={inq.id} className="border rounded-lg p-4">
                <p className="font-semibold">{inq.name}</p>
                <p className="text-sm text-zinc-600">{inq.phone} · {inq.email || "No email"}</p>
                <p className="text-sm mt-2">{inq.message}</p>
                <p className="text-xs text-zinc-500 mt-2">
                  item: {inq.itemSlug} · status: {inq.status}
                </p>
              </div>
            ))}
            {!inquiries.length && <p className="text-zinc-600">No inquiries yet.</p>}
          </TabsContent>
        </Tabs>
      </main>
    </AdminGuard>
  );
}

