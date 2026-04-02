"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ThumbsUp, HandCoins, PhoneCall, Ticket, Sparkles, Plane, MapPin, ArrowRight } from "lucide-react";
import { listItems } from "@/lib/firebase/data";
import { categoryLabelMap, categoryPathMap } from "@/lib/category-map";
import type { CategoryType, Item } from "@/lib/types";
import { blogPosts } from "@/lib/blog-data";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

const categoryOrder: CategoryType[] = [
  "accommodation",
  "night_club",
  "activity",
  "beach_club",
  "car_rental",
  "tourist_transport",
  "spa",
];

const testimonials = [
  {
    name: "Sofia K.",
    role: "Paris, France",
    description: "Booked our villa and transfers through UpToMarrakech. Everything felt premium and perfectly organized.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "Adam R.",
    role: "London, UK",
    description: "Great communication, amazing recommendations, and smooth reservations for activities and nightlife.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "Leila M.",
    role: "Casablanca, Morocco",
    description: "Professional team with real local expertise. The whole experience was elegant and stress-free.",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "Yassine T.",
    role: "Rabat, Morocco",
    description: "Fast support and quality partners. I highly recommend for anyone who wants a polished Marrakech stay.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
  },
];

const partners = [
  "Atlas Privilege",
  "Riad Collection",
  "Nikki Experience",
  "Sahara Motion",
  "M Avenue Club",
  "Palm Wellness",
  "Royal Transfers",
  "Kech Signature",
];

function CategorySlider({ title, items }: { title: string; items: Item[] }) {
  return (
    <section className="space-y-5 section-fade">
      <div className="flex items-center justify-between gap-3">
        <h3 className="ui-heading text-2xl font-semibold md:text-3xl">{title}</h3>
        <div className="hidden items-center gap-2 text-xs uppercase tracking-[0.16em] text-zinc-500 md:flex">
          <Sparkles className="h-3.5 w-3.5" /> Curated picks
        </div>
      </div>
      <Swiper
        modules={[Autoplay, Navigation]}
        spaceBetween={20}
        slidesPerView={1.1}
        breakpoints={{
          640: { slidesPerView: 2.1 },
          1024: { slidesPerView: 3.2 },
        }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        navigation
        className="pb-10"
      >
        {items.map((item) => (
          <SwiperSlide key={item.id}>
            <Link
              href={`/${categoryPathMap[item.categoryType]}/${item.slug}`}
              className="group block overflow-hidden rounded-2xl border border-border/70 bg-white/90 shadow-[0_14px_30px_-24px_rgba(30,20,10,0.7)] transition-all duration-400 hover:-translate-y-1 hover:shadow-[0_30px_45px_-28px_rgba(30,20,10,0.55)]"
            >
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={item.coverImage}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/25 to-transparent opacity-90" />
                <div className="absolute left-4 right-4 top-4 flex items-start justify-between">
                  <span className="rounded-full bg-white/88 px-3 py-1 text-[11px] font-medium text-zinc-800 backdrop-blur">
                    {categoryLabelMap[item.categoryType]}
                  </span>
                  <span className="rounded-full bg-black/35 p-2 text-white backdrop-blur transition-transform duration-300 group-hover:translate-x-0.5">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="line-clamp-1 text-lg font-semibold tracking-tight">{item.title}</p>
                  {item.location && <p className="mt-1 text-sm text-white/90">{item.location}</p>}
                </div>
              </div>
              <div className="space-y-2 p-4">
                <p className="line-clamp-2 text-sm leading-relaxed text-zinc-700">{item.excerpt}</p>
                <p className="inline-flex items-center gap-1 text-xs font-medium uppercase tracking-[0.14em] text-amber-800">
                  Explore now
                  <ArrowRight className="h-3.5 w-3.5" />
                </p>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export function HomePage() {
  const router = useRouter();
  const [itemsByCategory, setItemsByCategory] = useState<Record<string, Item[]>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const run = async () => {
      const entries = await Promise.all(
        categoryOrder.map(async (type) => {
          const data = await listItems({ categoryType: type, publishedOnly: true });
          return [type, data] as const;
        }),
      );
      setItemsByCategory(Object.fromEntries(entries));
    };
    void run();
  }, []);

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll(".reveal-on-scroll"));
    if (!elements.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -6% 0px" },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [itemsByCategory]);

  const sliders = useMemo(
    () =>
      categoryOrder
        .map((type) => ({
          type,
          title: categoryLabelMap[type],
          items: (itemsByCategory[type] ?? []).slice(0, 10),
        }))
        .filter((s) => s.items.length > 0),
    [itemsByCategory],
  );

  const allItems = useMemo(
    () => categoryOrder.flatMap((type) => itemsByCategory[type] ?? []),
    [itemsByCategory],
  );

  const suggestions = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return [];
    return allItems
      .filter((item) => {
        const categoryLabel = categoryLabelMap[item.categoryType].toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.excerpt.toLowerCase().includes(q) ||
          (item.location ?? "").toLowerCase().includes(q) ||
          categoryLabel.includes(q)
        );
      })
      .slice(0, 8);
  }, [allItems, searchTerm]);

  const matchingCategories = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return [];
    return categoryOrder
      .filter((type) => categoryLabelMap[type].toLowerCase().includes(q))
      .slice(0, 3);
  }, [searchTerm]);

  const goToBestMatch = () => {
    if (suggestions[0]) {
      const item = suggestions[0];
      router.push(`/${categoryPathMap[item.categoryType]}/${item.slug}`);
      return;
    }
    if (matchingCategories[0]) {
      router.push(`/${categoryPathMap[matchingCategories[0]]}`);
      return;
    }
  };

  return (
    <main>
      <section className="relative min-h-[76vh] overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="https://videos.pexels.com/video-files/4954871/4954871-uhd_2560_1440_30fps.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,12,0.46),rgba(15,16,12,0.6))]" />
        <div className="pointer-events-none absolute -left-16 top-20 h-56 w-56 rounded-full bg-amber-300/25 blur-3xl" />
        <div className="pointer-events-none absolute bottom-16 right-12 h-48 w-48 rounded-full bg-orange-300/20 blur-3xl" />
        <div className="relative z-10 mx-auto flex min-h-[76vh] max-w-7xl flex-col items-center justify-center gap-8 px-4 py-16 text-white">
          <div className="animate-reveal rounded-full border border-white/40 bg-white/15 px-4 py-1 text-xs uppercase tracking-[0.16em] backdrop-blur">
            New in Marrakech 2026
          </div>
          <h1 className="ui-heading animate-fade-up text-center text-4xl font-semibold text-white sm:text-5xl md:text-6xl">
            Discover Marrakech
            <span className="block text-amber-200">in Modern Elegance</span>
          </h1>
          <p className="animate-reveal max-w-3xl text-center text-base text-white/90 sm:text-lg" style={{ animationDelay: "120ms" }}>
            Premium accommodations, activities, beach clubs and transport, all in one smooth booking experience.
          </p>
          <div className="relative w-full max-w-4xl animate-reveal rounded-2xl border border-white/40 bg-white/95 p-2 shadow-2xl" style={{ animationDelay: "220ms" }}>
            <div className="flex items-center">
              <input
                className="h-12 flex-1 rounded-xl px-4 text-zinc-900 outline-none"
                placeholder="Rechercher un endroit ou une activité"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    goToBestMatch();
                    setShowSuggestions(false);
                  }
                }}
              />
              <button
                className="grid h-12 w-12 place-items-center rounded-xl bg-primary text-primary-foreground transition-all hover:brightness-110"
                onClick={() => {
                  goToBestMatch();
                  setShowSuggestions(false);
                }}
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
            {showSuggestions && (suggestions.length > 0 || matchingCategories.length > 0) && (
              <div className="absolute top-full left-0 right-0 mt-2 rounded-lg border bg-white shadow-xl overflow-hidden z-20">
                {suggestions.map((item) => (
                  <button
                    key={item.id}
                    className="block w-full px-4 py-3 text-left transition-colors hover:bg-zinc-100"
                    onClick={() => {
                      router.push(`/${categoryPathMap[item.categoryType]}/${item.slug}`);
                      setShowSuggestions(false);
                    }}
                  >
                    <p className="font-medium text-zinc-900">{item.title}</p>
                    <p className="text-xs text-zinc-500">
                      {categoryLabelMap[item.categoryType]}
                      {item.location ? ` · ${item.location}` : ""}
                    </p>
                  </button>
                ))}
                {matchingCategories.map((type) => (
                  <button
                    key={type}
                    className="block w-full border-t px-4 py-3 text-left transition-colors hover:bg-zinc-100"
                    onClick={() => {
                      router.push(`/${categoryPathMap[type]}`);
                      setShowSuggestions(false);
                    }}
                  >
                    <p className="font-medium text-zinc-900">Browse category: {categoryLabelMap[type]}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="reveal-on-scroll -mt-8 pb-12 pt-8">
        <div className="mx-auto max-w-7xl px-4">
          <div className="ui-surface animate-reveal grid gap-5 p-6 md:grid-cols-4 md:items-center" style={{ animationDelay: "280ms" }}>
            <p className="text-sm font-medium text-zinc-700 md:col-span-4 md:text-center">
              Planifiez et réservez en ligne avec une assistance locale premium.
            </p>
            <p className="inline-flex items-center gap-2 text-sm text-zinc-700"><ThumbsUp className="h-4 w-4 text-emerald-700" /> Annulation gratuite*</p>
            <p className="inline-flex items-center gap-2 text-sm text-zinc-700"><HandCoins className="h-4 w-4 text-emerald-700" /> Paiement sur place*</p>
            <p className="inline-flex items-center gap-2 text-sm text-zinc-700"><PhoneCall className="h-4 w-4 text-emerald-700" /> Assistance 7j/7j</p>
            <p className="inline-flex items-center gap-2 text-sm text-zinc-700"><Ticket className="h-4 w-4 text-emerald-700" /> Concierge premium</p>
          </div>
        </div>
      </section>

      <section className="reveal-on-scroll mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-2">
        <div className="relative h-80 overflow-hidden rounded-3xl border border-border/70 animate-soft-pulse">
          <Image
            src="https://uptomarrakech.com/wp-content/uploads/2024/11/IMG-20240913-WA0028.jpg"
            alt="About UpToMarrakech"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/35 to-transparent" />
        </div>
        <div className="space-y-5">
          <p className="ui-eyebrow">Who We Are</p>
          <h2 className="ui-section-title">About us</h2>
          <p className="ui-prose">
            UpToMarrakech is your premium local partner to discover the best of Marrakech:
            accommodation, activities, beach clubs, transport and wellness. We curate elegant
            experiences with trusted partners and personal support.
          </p>
          <Link href="/contact" className="btn-luxe inline-flex items-center gap-2">
            Contact us <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4">
        <div className="ui-divider" />
      </div>

      <section className="reveal-on-scroll mx-auto max-w-7xl px-4 pb-14">
        <div className="ui-shell ui-shell-ornament">
          <p className="ui-eyebrow mb-2">Our Process</p>
          <h2 className="ui-section-title mb-7">A seamless journey from idea to experience</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                n: "01",
                title: "Discover",
                text: "We understand your style, dates, preferences and travel priorities.",
              },
              {
                n: "02",
                title: "Curate",
                text: "Our team selects premium stays, activities and logistics tailored to you.",
              },
              {
                n: "03",
                title: "Enjoy",
                text: "You experience Marrakech with smooth coordination and local support.",
              },
            ].map((step) => (
              <article key={step.n} className="rounded-2xl border border-border/70 bg-white/75 p-5">
                <p className="ui-eyebrow text-zinc-400">{step.n}</p>
                <h3 className="ui-heading mt-1 text-xl font-semibold">{step.title}</h3>
                <p className="ui-prose mt-2 text-sm">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4">
        <div className="ui-divider" />
      </div>

      <section className="reveal-on-scroll mx-auto max-w-7xl px-4 pb-12">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: Sparkles, title: "Premium concierge", text: "Dedicated support for your stay." },
            { icon: Plane, title: "Airport transfer", text: "Book private transfers in one click." },
            { icon: MapPin, title: "Local expertise", text: "Trusted curated places in Marrakech." },
          ].map((f, index) => (
            <article
              key={f.title}
              className={`ui-surface-soft reveal-on-scroll p-6 transition-all duration-300 hover:-translate-y-1 stagger-${index + 1}`}
              style={{ animationDelay: `${140 * index}ms` }}
            >
              <f.icon className="h-6 w-6 text-emerald-700" />
              <h3 className="mt-3 text-xl font-semibold">{f.title}</h3>
              <p className="mt-1 text-zinc-600">{f.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="reveal-on-scroll mx-auto max-w-7xl px-4 py-8 space-y-10">
        {sliders.map((slider) => (
          <CategorySlider key={slider.type} title={slider.title} items={slider.items} />
        ))}
      </section>

      <section className="reveal-on-scroll mx-auto max-w-7xl px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="ui-heading text-3xl font-semibold">From our blog</h2>
          <Link href="/blog" className="font-medium text-emerald-700 hover:underline">
            View all articles
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {blogPosts.slice(0, 3).map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group reveal-on-scroll overflow-hidden rounded-2xl border border-border/70 bg-white/90 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="relative h-52">
                <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <p className="text-xs text-zinc-500">{post.date}</p>
                <h3 className="font-semibold text-xl mt-1">{post.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="reveal-on-scroll bg-[linear-gradient(170deg,rgba(255,250,242,0.7),rgba(235,224,199,0.52))] py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="ui-heading mb-8 text-center text-3xl font-semibold">Testimonials</h2>
          <Swiper
            modules={[Autoplay, Navigation]}
            spaceBetween={18}
            slidesPerView={1.05}
            breakpoints={{
              640: { slidesPerView: 1.4 },
              1024: { slidesPerView: 2.2 },
            }}
            autoplay={{ delay: 3200, disableOnInteraction: false }}
            navigation
            className="pb-8"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.name}>
                <article className="ui-surface-soft h-full p-6">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full border border-border/70">
                      <Image src={testimonial.avatar} alt={testimonial.name} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="ui-heading text-base font-semibold">{testimonial.name}</p>
                      <p className="text-xs text-zinc-500">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-zinc-700 leading-relaxed">{testimonial.description}</p>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      <section className="reveal-on-scroll mx-auto max-w-7xl px-4 py-14">
        <div className="mb-5 text-center">
          <p className="ui-eyebrow">Trusted Partners</p>
          <h2 className="ui-heading mt-2 text-3xl font-semibold">Our Partner Network</h2>
        </div>
        <Swiper
          modules={[Autoplay]}
          spaceBetween={14}
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 3.2 },
            1024: { slidesPerView: 5.4 },
          }}
          autoplay={{ delay: 1800, disableOnInteraction: false }}
          loop
          className="py-2"
        >
          {partners.map((partner) => (
            <SwiperSlide key={partner}>
              <div className="flex h-20 items-center justify-center rounded-2xl border border-border/70 bg-white/90 px-4 text-center text-sm font-semibold text-zinc-700 shadow-[0_8px_20px_-20px_rgba(30,20,10,0.7)]">
                {partner}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <section className="reveal-on-scroll mx-auto max-w-3xl px-4 py-16">
        <h2 className="ui-heading mb-8 text-center text-3xl font-semibold">Contact us</h2>
        <form className="ui-surface space-y-3 p-6">
          <input className="w-full rounded-xl border border-border bg-white/90 p-3" placeholder="Name" />
          <input className="w-full rounded-xl border border-border bg-white/90 p-3" placeholder="Email" />
          <textarea className="min-h-32 w-full rounded-xl border border-border bg-white/90 p-3" placeholder="Message" />
          <button className="btn-luxe">
            Send message
          </button>
        </form>
      </section>
    </main>
  );
}

