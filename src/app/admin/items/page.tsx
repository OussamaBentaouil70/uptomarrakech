"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/rich-text-editor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { listItems, upsertItem, deleteItem } from "@/lib/firebase/data";
import type { CategoryType, Item, PriceUnit } from "@/lib/types";
import { CATEGORY_TYPES } from "@/lib/types";
import { categoryLabelMap } from "@/lib/category-map";
import { ImageUpload } from "@/components/admin/image-upload";
import { toast } from "sonner";
import { Plus, Trash2, Edit2, X, Star, MessageSquare } from "lucide-react";

type ItemForm = {
  id: string | null;
  categoryType: CategoryType;
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  coverImage: string;
  gallery: string[];
  location: string;
  locationUrl: string;
  price: number;
  priceUnit: PriceUnit;
  carte: string;
  reviews: any[];
  rooms: number;
  people: number;
  published: boolean;
};

const baseItem: ItemForm = {
  id: null,
  categoryType: "activity",
  slug: "",
  title: "",
  excerpt: "",
  description: "",
  coverImage: "",
  gallery: [],
  location: "",
  locationUrl: "",
  price: 0,
  priceUnit: "day",
  carte: "",
  reviews: [],
  rooms: 0,
  people: 0,
  published: true,
};

function ItemsContent() {
  const searchParams = useSearchParams();
  const typeFilter = searchParams.get("type") as CategoryType | null;

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<ItemForm | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const refresh = async () => {
    if (!isMounted) return;
    setLoading(true);
    const filters = typeFilter ? { categoryType: typeFilter } : {};
    const data = await listItems(filters);
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    if (isMounted) {
      void refresh();
    }
  }, [typeFilter, isMounted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      const payload = {
        categoryType: editingItem.categoryType,
        slug: editingItem.slug,
        title: editingItem.title,
        excerpt: editingItem.excerpt,
        description: editingItem.description,
        coverImage: editingItem.coverImage,
        gallery: editingItem.gallery,
        location: editingItem.location,
        locationUrl:
          editingItem.categoryType === "night_club" ||
          editingItem.categoryType === "restaurant" ||
          editingItem.categoryType === "beach_club"
            ? editingItem.locationUrl
            : undefined,
        price: editingItem.price,
        priceUnit: editingItem.priceUnit,
        carte: editingItem.carte,
        reviews: editingItem.reviews,
        accommodation:
          editingItem.categoryType === "accommodation"
            ? { rooms: editingItem.rooms, people: editingItem.people }
            : undefined,
        published: editingItem.published,
      };

      await upsertItem(editingItem.id, payload as any);
      toast.success(editingItem.id ? "Item updated" : "Item created");
      setEditingItem(null);
      void refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error saving item";
      toast.error(message);
    }
  };

  const isAccommodation = editingItem?.categoryType === "accommodation";
  const supportsLocationLink =
    editingItem?.categoryType === "night_club" ||
    editingItem?.categoryType === "restaurant" ||
    editingItem?.categoryType === "beach_club";

  return (
    <div className="p-8 space-y-8" suppressHydrationWarning>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          {typeFilter ? categoryLabelMap[typeFilter] : "All Items"}
        </h1>
        {!editingItem && (
          <Button onClick={() => setEditingItem({ ...baseItem, categoryType: typeFilter || "activity" })} className="rounded-full">
            <Plus className="mr-2 h-4 w-4" /> Add Item
          </Button>
        )}
      </div>

      {editingItem ? (
        <div className="ui-surface p-6 animate-reveal">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">{editingItem.id ? "Edit Item" : "New Item"}</h2>
            <Button variant="ghost" onClick={() => setEditingItem(null)} size="icon">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold tracking-tight">{editingItem.id ? "Edit Masterpiece" : "Create New Item"}</h2>
                <p className="text-sm text-muted-foreground italic font-serif">Refine the details of your luxury offering.</p>
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="ghost" onClick={() => setEditingItem(null)} className="rounded-full">Cancel</Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 rounded-full shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5">
                  Save Changes
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Form Fields */}
              <div className="lg:col-span-2 space-y-8">
                <section className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Category Type</label>
                      <Select
                        value={editingItem.categoryType}
                        onValueChange={(v) => setEditingItem({ ...editingItem, categoryType: v as CategoryType })}
                      >
                        <SelectTrigger className="rounded-xl border-border/60 bg-white/50"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {CATEGORY_TYPES.map((t) => (
                            <SelectItem key={t} value={t}>{categoryLabelMap[t]}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Location / Neighborhood</label>
                      <Input
                        className="rounded-xl border-border/60 bg-white/50"
                        value={editingItem.location}
                        onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                        placeholder="e.g. Palmeraie, Marrakech"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Title</label>
                      <Input
                        className="text-lg font-medium rounded-xl border-border/60 bg-white/50"
                        value={editingItem.title}
                        onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                        placeholder="The Name of the Venue"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">URL Slug</label>
                      <Input
                        className="rounded-xl border-border/60 bg-white/50 font-mono text-sm"
                        value={editingItem.slug}
                        onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value })}
                        placeholder="venue-name"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Price (€)</label>
                        <Input
                          className="rounded-xl border-border/60 bg-white/50"
                          type="number"
                          value={editingItem.price}
                          onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Unit</label>
                        <Select
                          value={editingItem.priceUnit}
                          onValueChange={(v) => setEditingItem({ ...editingItem, priceUnit: v as PriceUnit })}
                        >
                          <SelectTrigger className="rounded-xl border-border/60 bg-white/50"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="night">per night</SelectItem>
                            <SelectItem value="day">per day</SelectItem>
                            <SelectItem value="person">per person</SelectItem>
                            <SelectItem value="package">per package</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {isAccommodation && (
                      <>
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total Rooms</label>
                          <Input
                            className="rounded-xl border-border/60 bg-white/50"
                            type="number"
                            value={editingItem.rooms}
                            onChange={(e) => setEditingItem({ ...editingItem, rooms: Number(e.target.value) })}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Max Guests</label>
                          <Input
                            className="rounded-xl border-border/60 bg-white/50"
                            type="number"
                            value={editingItem.people}
                            onChange={(e) => setEditingItem({ ...editingItem, people: Number(e.target.value) })}
                          />
                        </div>
                      </>
                    )}

                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Internal Menu / Carte URL</label>
                      <Input
                        className="rounded-xl border-border/60 bg-white/50"
                        value={editingItem.carte}
                        onChange={(e) => setEditingItem({ ...editingItem, carte: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>

                    {supportsLocationLink && (
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Location URL (Google Maps)</label>
                        <Input
                          className="rounded-xl border-border/60 bg-white/50"
                          value={editingItem.locationUrl}
                          onChange={(e) => setEditingItem({ ...editingItem, locationUrl: e.target.value })}
                          placeholder="https://maps.google.com/..."
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Editorial Excerpt (Teaser)</label>
                    <Textarea
                      className="rounded-2xl border-border/60 bg-white/50 resize-none"
                      value={editingItem.excerpt}
                      onChange={(e) => setEditingItem({ ...editingItem, excerpt: e.target.value })}
                      placeholder="A short punchy intro seen on card listings..."
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Professional Description</label>
                    <RichTextEditor
                      content={editingItem.description}
                      onChange={(content) => setEditingItem({ ...editingItem, description: content })}
                      placeholder="Describe the experience in detail with formatting..."
                    />
                  </div>
                </section>
              </div>

              {/* Right Column: Media & Visibility */}
              <div className="space-y-8">
                <div className="ui-surface p-6 border-primary/10">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-6">Visual Identity</h3>
                  
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-xs font-medium text-muted-foreground">Cover Masterpiece</label>
                      <div className="space-y-3">
                        {editingItem.coverImage && (
                          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border/40 shadow-sm group/img">
                            <img src={editingItem.coverImage} className="h-full w-full object-cover transition-transform duration-700 group-hover/img:scale-110" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <Button 
                                type="button" 
                                variant="destructive" 
                                size="sm" 
                                onClick={() => setEditingItem({ ...editingItem, coverImage: "" })} 
                                className="rounded-full"
                              >
                                <Trash2 className="h-4 w-4 mr-2" /> Remove
                              </Button>
                            </div>
                          </div>
                        )}
                        <ImageUpload 
                          label={editingItem.coverImage ? "Replace Image" : "Main Showcase Image"} 
                          onUploaded={(url) => {
                            const finalUrl = Array.isArray(url) ? url[0] : url;
                            setEditingItem({ ...editingItem, coverImage: finalUrl });
                          }} 
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-medium text-muted-foreground">Atmospheric Gallery ({editingItem.gallery.length})</label>
                      <ImageUpload 
                        label="Add Story Image" 
                        multiple={true}
                        onUploaded={(urls) => {
                          const newUrls = Array.isArray(urls) ? urls : [urls];
                          setEditingItem({ ...editingItem, gallery: [...editingItem.gallery, ...newUrls] });
                        }} 
                      />
                      
                      <div className="grid grid-cols-3 gap-3 mt-4">
                        {editingItem.gallery.map((img, i) => (
                          <div key={i} className="relative aspect-square w-full group overflow-hidden rounded-xl border border-border/20 shadow-sm bg-muted/10">
                            <img src={img} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                            <button 
                              type="button"
                              onClick={() => setEditingItem({ ...editingItem, gallery: editingItem.gallery.filter((_, idx) => idx !== i) })}
                              className="absolute top-1 right-1 h-6 w-6 rounded-full bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 hover:bg-red-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="ui-surface p-6 border-primary/10">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-4">Availability</h3>
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-primary/5 border border-primary/10">
                    <div>
                      <p className="text-sm font-semibold">Live on Website</p>
                      <p className="text-[10px] text-primary/60 uppercase tracking-widest">Public Visibility</p>
                    </div>
                    <input 
                      type="checkbox"
                      checked={editingItem.published}
                      onChange={(e) => setEditingItem({ ...editingItem, published: e.target.checked })}
                      className="h-6 w-6 rounded-full border-primary text-primary focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-3xl bg-card/40 border border-border/40" />
            ))
          ) : (
            items.map((item) => (
              <div key={item.id} className="ui-surface p-4 flex flex-col group">
                <div className="relative h-40 w-full overflow-hidden rounded-2xl mb-4">
                  <img src={item.coverImage} alt={item.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">
                    {categoryLabelMap[item.categoryType]}
                  </p>
                  <h3 className="font-semibold text-lg line-clamp-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{item.location}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-border/40 flex items-center justify-end gap-2">
                  <Link href={`/admin/items/${item.id}/reviews`}>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="gap-2"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Reviews ({item.reviews?.length || 0})
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setEditingItem({
                      id: item.id,
                      categoryType: item.categoryType,
                      slug: item.slug,
                      title: item.title,
                      excerpt: item.excerpt,
                      description: item.description,
                      coverImage: item.coverImage,
                      gallery: item.gallery,
                      location: item.location || "",
                      locationUrl: item.locationUrl || "",
                      price: item.price,
                      priceUnit: item.priceUnit,
                      carte: item.carte || "",
                      reviews: item.reviews || [],
                      rooms: item.accommodation?.rooms || 0,
                      people: item.accommodation?.people || 0,
                      published: item.published
                    })}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={async () => {
                      if (confirm("Delete this item?")) {
                        await deleteItem(item.id);
                        toast.success("Item deleted");
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
          {!loading && items.length === 0 && (
            <div className="md:col-span-full py-20 text-center ui-surface">
              <p className="text-muted-foreground">No items found for this category.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ItemsPage() {
  return (
    <Suspense fallback={<p className="p-8">Loading...</p>}>
      <ItemsContent />
    </Suspense>
  );
}
