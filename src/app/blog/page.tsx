import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "@/lib/blog-data";

export default function BlogPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:py-12">
      <section className="ui-shell ui-shell-ornament mb-8 bg-[linear-gradient(150deg,rgba(255,255,255,0.74),rgba(237,244,255,0.82))]">
        <p className="ui-eyebrow mb-2">Journal</p>
        <h1 className="ui-section-title">Blog</h1>
        <p className="mt-2 text-sm text-zinc-600 md:text-base">Guides, inspiration and local recommendations from Marrakech.</p>
      </section>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group overflow-hidden rounded-2xl border border-border/70 bg-white/90 shadow-[0_10px_28px_-22px_rgba(30,20,10,0.65)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_38px_-24px_rgba(30,20,10,0.55)]"
          >
            <div className="relative h-52 overflow-hidden">
              <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-linear-to-t from-black/45 to-transparent" />
            </div>
            <div className="p-5 space-y-2">
              <p className="text-xs text-zinc-500">{post.date}</p>
              <h2 className="ui-heading text-xl font-semibold">{post.title}</h2>
              <p className="line-clamp-3 text-zinc-600">{post.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

