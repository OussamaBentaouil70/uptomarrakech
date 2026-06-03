"use client";

import { useEffect, useState } from "react";
import { listBlogs, upsertBlog, deleteBlog } from "@/lib/firebase/data";
import type { BlogPost } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/admin/image-upload";
import { toast } from "sonner";
import { Plus, Trash2, Edit2, X, Newspaper, Calendar, Eye } from "lucide-react";
import Link from "next/link";
import { RichTextEditor } from "@/components/rich-text-editor";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState<Partial<BlogPost> | null>(null);

  const refresh = async () => {
    setLoading(true);
    const data = await listBlogs();
    setBlogs(data);
    setLoading(false);
  };

  useEffect(() => {
    void refresh();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog || !editingBlog.title || !editingBlog.slug) return;

    try {
      const payload = {
        title: editingBlog.title,
        titleFr: editingBlog.titleFr || "",
        slug: editingBlog.slug,
        content: editingBlog.content || "",
        contentFr: editingBlog.contentFr || "",
        excerpt: editingBlog.excerpt || "",
        excerptFr: editingBlog.excerptFr || "",
        coverImage: editingBlog.coverImage || "",
        gallery: editingBlog.gallery || [],
        date: editingBlog.date || new Date().toISOString().split('T')[0],
        published: editingBlog.published ?? true,
      };

      await upsertBlog(editingBlog.id || null, payload);
      toast.success(editingBlog.id ? "Blog post updated" : "Blog post created");
      setEditingBlog(null);
      void refresh();
    } catch (err) {
      toast.error("Error saving blog post");
    }
  };

  return (
    <div className="p-8 space-y-8 animate-reveal">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Journal Management</h1>
          <p className="text-muted-foreground text-sm">Write and manage your luxury travel stories.</p>
        </div>
        <Button onClick={() => setEditingBlog({ published: true, date: new Date().toISOString().split('T')[0], gallery: [] })} className="rounded-full">
          <Plus className="mr-2 h-4 w-4" /> New Article
        </Button>
      </div>

      {editingBlog ? (
        <div className="ui-surface p-8 animate-reveal">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/40">
            <h2 className="text-2xl font-serif italic text-primary">{editingBlog.id ? "Edit Article" : "Compose Article"}</h2>
            <Button variant="ghost" size="icon" onClick={() => setEditingBlog(null)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-3 gap-12">
            <div className="xl:col-span-2 space-y-10">
              {/* English Version */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">English</span>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Article Title</label>
                  <Input 
                    value={editingBlog.title || ""} 
                    onChange={(e) => setEditingBlog({...editingBlog, title: e.target.value})}
                    className="text-2xl font-serif bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-auto placeholder:opacity-40"
                    placeholder="The soul of the Medina..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Short Excerpt</label>
                  <Textarea 
                    value={editingBlog.excerpt || ""} 
                    onChange={(e) => setEditingBlog({...editingBlog, excerpt: e.target.value})}
                    placeholder="A brief introduction to catch the reader's eye..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Content</label>
                  <RichTextEditor
                    content={editingBlog.content || ""}
                    onChange={(content) => setEditingBlog({...editingBlog, content})}
                    placeholder="Tell your story..."
                  />
                </div>
              </div>

              {/* French Version */}
              <div className="space-y-6 p-6 rounded-3xl bg-primary/5 border border-primary/10 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">French Translation</span>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Titre de l'article</label>
                  <Input 
                    value={editingBlog.titleFr || ""} 
                    onChange={(e) => setEditingBlog({...editingBlog, titleFr: e.target.value})}
                    className="text-2xl font-serif bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-auto placeholder:opacity-40"
                    placeholder="L'âme de la Médina..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Résumé court</label>
                  <Textarea 
                    value={editingBlog.excerptFr || ""} 
                    onChange={(e) => setEditingBlog({...editingBlog, excerptFr: e.target.value})}
                    placeholder="Une brève introduction pour attirer l'œil du lecteur..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Contenu</label>
                  <RichTextEditor
                    content={editingBlog.contentFr || ""}
                    onChange={(content) => setEditingBlog({...editingBlog, contentFr: content})}
                    placeholder="Racontez votre histoire en français..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-border/40">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-primary">URL Slug</label>
                  <Input 
                    value={editingBlog.slug || ""} 
                    onChange={(e) => setEditingBlog({...editingBlog, slug: e.target.value})}
                    placeholder="medina-soul-marrakech"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-primary">Publish Date</label>
                  <Input 
                    type="date"
                    value={editingBlog.date || ""} 
                    onChange={(e) => setEditingBlog({...editingBlog, date: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-widest text-primary">Cover Image</label>
                {editingBlog.coverImage ? (
                  <div className="relative h-64 w-full group overflow-hidden rounded-3xl border border-border/40">
                    <img src={editingBlog.coverImage} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                    <Button 
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => setEditingBlog({...editingBlog, coverImage: ""})}
                      className="absolute top-4 right-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="ui-surface h-64 w-full flex items-center justify-center border-dashed bg-muted/20">
                    <ImageUpload onUploaded={(url) => {
                      const finalUrl = Array.isArray(url) ? url[0] : url;
                      setEditingBlog({...editingBlog, coverImage: finalUrl});
                    }} />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-widest text-primary">Interior Gallery</label>
                <div className="flex flex-col gap-4">
                  <ImageUpload 
                    multiple={true}
                    onUploaded={(urls) => {
                      const newUrls = Array.isArray(urls) ? urls : [urls];
                      setEditingBlog({...editingBlog, gallery: [...(editingBlog.gallery || []), ...newUrls]});
                    }} 
                  />
                  <div className="grid grid-cols-3 gap-2">
                    {editingBlog.gallery?.map((img, i) => (
                      <div key={i} className="relative h-20 group overflow-hidden rounded-xl border">
                        <img src={img} className="h-full w-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => setEditingBlog({...editingBlog, gallery: editingBlog.gallery?.filter((_, idx) => idx !== i)})}
                          className="absolute inset-0 flex items-center justify-center bg-red-600/60 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-border/40 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Published Status</label>
                  <input 
                    type="checkbox" 
                    checked={editingBlog.published} 
                    onChange={(e) => setEditingBlog({...editingBlog, published: e.target.checked})}
                    className="h-5 w-5 accent-primary"
                  />
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 rounded-2xl shadow-xl shadow-primary/10">
                  Save Article
                </Button>
                <Button type="button" variant="ghost" onClick={() => setEditingBlog(null)} className="w-full rounded-2xl">
                  Cancel Draft
                </Button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-80 animate-pulse rounded-3xl bg-muted/20 border border-border/40" />
            ))
          ) : (
            blogs.map((blog) => (
              <div key={blog.id} className="ui-surface flex flex-col group overflow-hidden border-border/20 hover:border-primary/40 transition-all duration-300">
                <div className="relative h-48 w-full overflow-hidden">
                  <img src={blog.coverImage} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute top-4 left-4 bg-background/80 backdrop-blur px-3 py-1 rounded-full flex items-center gap-2 text-[10px] font-bold tracking-widest text-primary">
                    <Calendar className="h-3 w-3" /> {blog.date}
                  </div>
                  {!blog.published && (
                    <div className="absolute inset-0 bg-charcoal/40 flex items-center justify-center">
                      <span className="bg-white text-charcoal px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Draft</span>
                    </div>
                  )}
                </div>
                <div className="p-6 flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-primary">EN</span>
                    <h3 className="ui-heading text-xl font-bold line-clamp-1">{blog.title}</h3>
                  </div>
                  <div className="flex items-center gap-2 opacity-60">
                    <span className="text-[10px] font-bold text-primary">FR</span>
                    <h3 className="ui-heading text-xl font-bold line-clamp-1">{blog.titleFr || "—"}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mt-2 italic">
                    {blog.excerpt}
                  </p>
                </div>
                <div className="p-4 bg-muted/10 border-t border-border/30 flex items-center justify-between">
                  <Button variant="ghost" size="sm">
                    <Link href={`/blog/${blog.slug}`} target="_blank" className="text-primary flex items-center gap-2">
                      <Eye className="h-4 w-4" /> View live
                    </Link>
                  </Button>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => setEditingBlog(blog)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-500"
                      onClick={async () => {
                        if (confirm("Delete this article permanently?")) {
                          await deleteBlog(blog.id);
                          toast.success("Article deleted");
                          void refresh();
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
          {!loading && blogs.length === 0 && (
            <div className="col-span-full py-20 text-center ui-surface">
              <Newspaper className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground italic font-serif">No stories written yet. Start your first journey.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
