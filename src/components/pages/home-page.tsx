"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ThumbsUp, HandCoins, PhoneCall, Ticket, Sparkles, Plane, MapPin, ArrowRight } from "lucide-react";
import { listBlogs, listItems } from "@/lib/firebase/data";
import { categoryLabelMap, categoryPathMap } from "@/lib/category-map";
import type { BlogPost, CategoryType, Item } from "@/lib/types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

const categoryOrder: CategoryType[] = [
  "accommodation",
  "night_club",
  "activity",
  "beach_club",
  "restaurant",
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
  {
    name: "Nikki Beach",
    logo: "https://uptomarrakech.com/wp-content/uploads/2024/11/327071122_871349574141810_3340338956395480122_n-removebg-preview.png.webp",
  },
  {
    name: "Theatro",
    logo: "https://uptomarrakech.com/wp-content/uploads/2024/11/theatro-logo.png.webp",
  },
  {
    name: "Square",
    logo: "https://uptomarrakech.com/wp-content/uploads/2024/11/square-removebg-preview.png.webp",
  },
  {
    name: "Epicurien",
    logo: "https://uptomarrakech.com/wp-content/uploads/2024/11/epucrioen-logo-tr.png.webp",
  },
  { name: "Atlas Privilege", logo: "https://p7.hiclipart.com/preview/1014/899/581/partnership-organization-business-corporation-leadership-business.jpg" },
  { name: "Riad Collection", logo: "https://www.clipartmax.com/png/middle/246-2465396_hairdressing-hairdressers-logo.png" },
];
function CategorySlider({ title, items }: { title: string; items: Item[] }) {
  return (
    <section className="space-y-6 section-fade">
      <div className="flex items-end justify-between gap-4 border-b border-border/40 pb-4">
        <h3 className="ui-heading text-3xl font-semibold md:text-4xl text-foreground">{title}</h3>
        <Link
          href={`/${categoryPathMap[items[0]?.categoryType] || ""}`}
          className="group flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          View all <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
      <div className="relative group/slider">
        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={24}
          slidesPerView={1.1}
          breakpoints={{
            640: { slidesPerView: 2.1 },
            1024: { slidesPerView: 3.2 },
          }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          className="pb-12"
        >
          {items.map((item) => (
            <SwiperSlide key={item.id}>
              <Link
                href={`/${categoryPathMap[item.categoryType]}/${item.slug}`}
                className="group/card block relative h-[420px] overflow-hidden rounded-3xl bg-secondary/30 transition-all duration-500 hover:shadow-2xl"
              >
                <Image
                  src={item.coverImage}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover/card:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity group-hover/card:opacity-90" />

                <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                  <div className="translate-y-4 transition-transform duration-500 group-hover/card:translate-y-0">
                    <span className="mb-3 inline-block rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[10px] uppercase tracking-widest backdrop-blur-md">
                      {categoryLabelMap[item.categoryType]}
                    </span>
                    <h4 className="text-2xl font-semibold tracking-tight leading-tight mb-2">
                      {item.title}
                    </h4>
                    {item.location && (
                      <p className="flex items-center gap-1.5 text-sm text-white/80 mb-4 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100">
                        <MapPin className="h-3.5 w-3.5" /> {item.location}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest opacity-0 transition-all duration-500 group-hover/card:opacity-100 group-hover/card:translate-y-0">
                      Discovery <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

export function HomePage() {
  const router = useRouter();
  const [itemsByCategory, setItemsByCategory] = useState<Record<string, Item[]>>({});
  const [latestBlogs, setLatestBlogs] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const run = async () => {
      const [entries, blogs] = await Promise.all([
        Promise.all(
          categoryOrder.map(async (type) => {
            const data = await listItems({ categoryType: type, publishedOnly: true });
            return [type, data] as const;
          }),
        ),
        listBlogs(true),
      ]);

      setItemsByCategory(Object.fromEntries(entries));
      setLatestBlogs(blogs.slice(0, 3));
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
      <section className="relative h-screen min-h-[800px] w-full overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover scale-105"
          src="https://videos.pexels.com/video-files/4954871/4954871-uhd_2560_1440_30fps.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        {/* Sunlit Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,248,220,0.15),transparent_70%)]" />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col items-center justify-center gap-10 px-4 text-white">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="animate-reveal inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-2 text-[10px] uppercase tracking-[0.3em] backdrop-blur-xl">
              <Sparkles className="h-3 w-3 text-primary" /> Exclusive Marrakech 2026
            </div>

            <h1 className="ui-heading animate-fade-up text-5xl font-semibold leading-[1.1] text-white sm:text-7xl md:text-8xl lg:text-9xl">
              Experience <br />
              <span className="text-primary italic font-serif">Marrakech</span>
            </h1>

            <p className="animate-reveal max-w-2xl text-lg font-light text-white/80 md:text-xl leading-relaxed" style={{ animationDelay: "150ms" }}>
              Curated premium accommodations, signature activities and seamless transport in the red city.
            </p>
          </div>

          <div className="relative w-full max-w-3xl animate-reveal" style={{ animationDelay: "300ms" }}>
            <div className="group relative flex items-center rounded-full border border-white/20 bg-white/10 p-2 shadow-2xl backdrop-blur-2xl transition-all hover:bg-white/15">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-white">
                <Search className="h-6 w-6" />
              </div>
              <input
                className="h-14 flex-1 bg-transparent px-6 text-lg text-white placeholder:text-white/50 outline-none"
                placeholder="Search villas, clubs or activities..."
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
                className="hidden sm:flex h-14 items-center justify-center rounded-full bg-primary px-10 text-sm font-bold uppercase tracking-widest text-primary-foreground transition-all hover:scale-105 active:scale-95"
                onClick={() => {
                  goToBestMatch();
                  setShowSuggestions(false);
                }}
              >
                Explore
              </button>
            </div>

            {showSuggestions && (suggestions.length > 0 || matchingCategories.length > 0) && (
              <div className="absolute top-full left-0 right-0 mt-4 max-h-[400px] overflow-y-auto rounded-3xl border border-white/20 bg-black/60 p-2 shadow-3xl backdrop-blur-3xl z-50 animate-reveal">
                {suggestions.map((item) => (
                  <button
                    key={item.id}
                    className="flex w-full items-center gap-4 rounded-2xl px-4 py-4 text-left transition-all hover:bg-white/10"
                    onClick={() => {
                      router.push(`/${categoryPathMap[item.categoryType]}/${item.slug}`);
                      setShowSuggestions(false);
                    }}
                  >
                    <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-white/10">
                      <Image src={item.coverImage} alt={item.title} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{item.title}</p>
                      <p className="text-xs text-white/50 uppercase tracking-wider">
                        {categoryLabelMap[item.categoryType]} {item.location ? `· ${item.location}` : ""}
                      </p>
                    </div>
                  </button>
                ))}
                {matchingCategories.map((type) => (
                  <button
                    key={type}
                    className="flex w-full items-center gap-4 border-t border-white/10 px-4 py-4 text-left transition-all hover:bg-white/10"
                    onClick={() => {
                      router.push(`/${categoryPathMap[type]}`);
                      setShowSuggestions(false);
                    }}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">Browse {categoryLabelMap[type]}</p>
                      <p className="text-xs text-white/50 uppercase tracking-wider">View all signature entries</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="absolute bottom-10 left-0 right-0 flex justify-between px-10 items-end">
            <div className="flex gap-10">
              <div className="hidden lg:block text-left text-white/40 text-[10px] uppercase tracking-[0.2em] leading-relaxed">
                Premium Conciergerie <br /> & Local Expertise
              </div>
            </div>
            <div className="animate-bounce">
              <div className="h-10 w-px bg-gradient-to-b from-white/0 via-white/50 to-white" />
            </div>
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
            src="https://uptomarrakech.com/wp-content/uploads/2024/11/UP-removebg-preview-1-1.png.webp"
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
          <div>
            <p className="ui-eyebrow mb-2">Editorial</p>
            <h2 className="ui-heading text-3xl font-semibold">From our blog</h2>
          </div>
          <Link href="/blog" className="group inline-flex items-center gap-2 font-medium text-emerald-700 hover:underline">
            View all articles <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {latestBlogs.length === 0 ? (
          <div className="rounded-3xl border border-border/60 bg-card/50 px-6 py-12 text-center text-muted-foreground italic font-serif">
            New stories are coming soon.
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {latestBlogs.map((post) => (
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
                  <div className="absolute inset-0 bg-linear-to-t from-charcoal/40 to-transparent" />
                </div>
                <div className="p-6 space-y-3 flex-1 flex flex-col">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary">{post.date}</p>
                  <h3 className="ui-heading text-xl font-bold leading-tight group-hover:text-primary transition-colors">{post.title}</h3>
                  <p className="line-clamp-3 text-muted-foreground text-sm leading-relaxed flex-1">{post.excerpt}</p>
                  <div className="pt-4 flex items-center text-xs font-bold uppercase tracking-widest text-primary">
                    Read Article →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
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
        <div className="mb-12 text-center">
          <p className="ui-eyebrow">Trusted Partners</p>
          <h2 className="ui-heading mt-2 text-3xl font-semibold italic font-serif">Our Partner Network</h2>
        </div>

        <Swiper
          modules={[Autoplay]}
          spaceBetween={40} // Increased space for a cleaner look
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 3 },
            1024: { slidesPerView: 5 },
          }}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          loop
          className="flex items-center"
        >
          {partners.map((partner, index) => (
            <SwiperSlide key={index}>
              <div className="group flex h-32 items-center justify-center transition-all duration-500">
                {partner.logo ? (
                  <div className="relative h-24 w-full transition-all duration-500 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 hover:scale-110">
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      fill
                      className="object-contain" // This ensures it fits perfectly without cropping
                    />
                  </div>
                ) : (
                  <span className="text-sm font-bold uppercase tracking-widest text-zinc-400">
                    {partner.name}
                  </span>
                )}
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

