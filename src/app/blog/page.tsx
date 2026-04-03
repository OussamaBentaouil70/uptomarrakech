"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { listBlogs } from "@/lib/firebase/data";
import type { BlogPost } from "@/lib/types";

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await listBlogs(true);
      setBlogs(data);
      setLoading(false);
    }
    void load();
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:py-12">
      <section className="ui-shell ui-shell-ornament mb-8 bg-primary/5">
        <p className="ui-eyebrow mb-2">Journal</p>
        <h1 className="ui-section-title">Blog</h1>
        <p className="mt-2 text-sm text-zinc-600 md:text-base">Guides, inspiration and local recommendations from Marrakech.</p>
      </section>

      {loading ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-72 animate-pulse rounded-2xl bg-card/40 border border-border/40" />
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-muted-foreground italic font-serif text-xl">D'autres histoires arrivent bientôt...</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm border border-border/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="relative h-64 overflow-hidden">
                <Image 
                  src={post.coverImage} 
                  alt={post.title} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent" />
              </div>
              <div className="p-6 space-y-3 flex-1 flex flex-col">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary">{post.date}</p>
                <h2 className="ui-heading text-xl font-bold leading-tight group-hover:text-primary transition-colors">{post.title}</h2>
                <p className="line-clamp-3 text-muted-foreground text-sm leading-relaxed flex-1">{post.excerpt}</p>
                <div className="pt-4 flex items-center text-xs font-bold uppercase tracking-widest text-primary">
                  Read Article →
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

