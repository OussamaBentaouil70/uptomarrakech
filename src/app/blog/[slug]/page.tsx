import Image from "next/image";
import { notFound } from "next/navigation";
import { blogPosts } from "@/lib/blog-data";

export default async function BlogDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return notFound();

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:py-12">
      <section className="ui-shell ui-shell-ornament mb-6">
        <p className="ui-eyebrow mb-2">Journal</p>
        <h1 className="ui-section-title">{post.title}</h1>
        <p className="mt-2 text-sm text-zinc-500">{post.date}</p>
      </section>
      <div className="relative mb-8 h-72 overflow-hidden rounded-3xl border border-border/70 sm:h-80">
        <Image src={post.image} alt={post.title} fill className="object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-black/35 to-transparent" />
      </div>
      <article className="ui-surface prose prose-zinc max-w-none p-5 sm:p-7">
        <p>{post.content}</p>
      </article>
      <div className="ui-divider mt-10" />
    </main>
  );
}

