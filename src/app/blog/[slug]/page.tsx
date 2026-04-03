import Image from "next/image";
import { notFound } from "next/navigation";
import { getBlogBySlug } from "@/lib/firebase/data";
import { GallerySlider } from "@/components/gallery-slider";
import { Calendar, User, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function BlogDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  
  if (!post) return notFound();

  return (
    <main className="bg-background min-h-screen">
      {/* Header Section */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        <Image 
          src={post.coverImage} 
          alt={post.title} 
          fill 
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <div className="absolute inset-0 flex items-end justify-center pb-20 px-6">
          <div className="max-w-4xl w-full text-center space-y-6 animate-reveal">
            <Link 
              href="/blog" 
              className="inline-flex items-center gap-2 text-primary text-[10px] font-bold uppercase tracking-[0.4em] mb-4 hover:opacity-70 transition-opacity"
            >
              <ArrowLeft className="h-3 w-3" /> Back to Journal
            </Link>
            <h1 className="ui-display text-4xl md:text-6xl font-bold tracking-tight leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center justify-center gap-8 text-muted-foreground text-xs font-bold uppercase tracking-widest pt-4">
              <span className="flex items-center gap-2"><Calendar className="h-3 w-3" /> {post.date}</span>
              <span className="flex items-center gap-2"><User className="h-3 w-3" /> By UpToMarrakech</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-20">
        <article className="space-y-16">
          {/* Excerpt/Intro */}
          <p className="text-2xl font-serif italic text-primary leading-relaxed border-l-4 border-primary pl-8">
            {post.excerpt}
          </p>

          {/* Main Content */}
          <div className="prose prose-zinc max-w-none prose-lg leading-relaxed text-muted-foreground">
            {post.content.split('\n').map((p, i) => (
              p.trim() ? <p key={i}>{p}</p> : <br key={i} />
            ))}
          </div>

          {/* Gallery Slider */}
          {post.gallery && post.gallery.length > 0 && (
            <div className="space-y-8 pt-8">
              <div className="text-center space-y-2">
                <h2 className="ui-heading text-3xl font-semibold">Visual Journey</h2>
                <div className="h-1 w-20 bg-primary mx-auto" />
              </div>
              <GallerySlider coverImage={post.coverImage} gallery={post.gallery} alt={post.title} />
            </div>
          )}

          {/* Footer */}
          <div className="pt-16 border-t border-border/40 flex flex-col items-center gap-8">
            <p className="text-center text-muted-foreground italic max-w-md">
              "Marrakech is not just a destination, it's a feeling that lingers in the soul long after you've left."
            </p>
            <Link 
              href="/blog" 
              className="rounded-full border border-primary px-8 py-3 text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-all"
            >
              Discover More Stories
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}

