"use client";

import { useEffect, useState } from "react";
import { getItemBySlug, listItems } from "@/lib/firebase/data";
import type { CategoryType, Item } from "@/lib/types";
import { InquiryForm } from "@/components/inquiry-form";
import { GallerySlider } from "@/components/gallery-slider";
import Link from "next/link";
import { categoryLabelMap, categoryPathMap } from "@/lib/category-map";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

type Props = {
  categoryType: CategoryType;
  slug: string;
};

import { Mail, Phone, MapPin, Utensils, Star, Quote, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function ItemDetailsPage({ categoryType, slug }: Props) {
  const [item, setItem] = useState<Item | null>(null);
  const [suggestions, setSuggestions] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const run = async () => {
      const [data, allInCategory] = await Promise.all([
        getItemBySlug(categoryType, slug),
        listItems({ categoryType, publishedOnly: true }),
      ]);

      if (!active) return;

      setItem(data);
      if (!data) {
        setSuggestions([]);
        setLoading(false);
        return;
      }

      setSuggestions(
        allInCategory
          .filter((candidate) => candidate.slug !== data.slug)
          .slice(0, 6),
      );
      setLoading(false);
    };

    void run();

    return () => {
      active = false;
    };
  }, [categoryType, slug]);

  if (!loading && !item) {
    return <main className="mx-auto max-w-7xl p-8 text-center py-20 font-serif italic text-2xl">L'article que vous recherchez est introuvable.</main>;
  }

  if (loading || !item) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <main className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] w-full overflow-hidden">
        <img
          src={item.coverImage}
          alt={item.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent" />
        <div className="absolute inset-0 flex items-end justify-center pb-20 px-6">
          <div className="max-w-4xl w-full text-center space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary animate-reveal">
              The Collection • {categoryType.replace('_', ' ')}
            </span>
            <h1 className="ui-display text-5xl md:text-7xl font-bold tracking-tight animate-reveal animation-delay-200">
              {item.title}
            </h1>
            {item.location && (
              <p className="flex items-center justify-center gap-2 text-muted-foreground animate-reveal animation-delay-300">
                <MapPin className="h-4 w-4" /> {item.location}
              </p>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid lg:grid-cols-3 gap-16">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-16">
            <GallerySlider coverImage={item.coverImage} gallery={item.gallery} alt={item.title} />
            <div className="space-y-8">
              <h2 className="ui-heading text-3xl font-semibold border-l-4 border-primary pl-6">About this experience</h2>
              <div className="prose prose-zinc max-w-none prose-lg leading-relaxed text-muted-foreground">
                {item.description.split('\n').map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>



            {item.carte && (
              <div className="ui-surface p-10 bg-primary/5 border-primary/10 space-y-6 text-center">
                <Utensils className="h-10 w-10 text-primary mx-auto" />
                <div className="space-y-2">
                  <h3 className="ui-heading text-2xl font-semibold tracking-tight">Gastronomic Journey</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Découvrez l'art de vivre à travers notre sélection culinaire exclusive.
                  </p>
                </div>
                <a
                  href={item.carte}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-bold uppercase tracking-widest text-primary-foreground transition-all hover:scale-105 hover:shadow-xl"
                >
                  View the Menu
                </a>
              </div>
            )}

            {item.reviews && item.reviews.length > 0 && (
              <div className="space-y-8">
                <h2 className="ui-heading text-3xl font-semibold">Guest Impressions</h2>
                <div className="grid gap-6">
                  {item.reviews.map((review, i) => (
                    <div key={i} className="ui-surface p-8 space-y-4 bg-card/40 backdrop-blur-sm border-border/40">
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1 text-primary">
                          {Array.from({ length: review.rating }).map((_, j) => (
                            <Star key={j} className="h-4 w-4 fill-current" />
                          ))}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{review.date}</span>
                      </div>
                      <div className="relative">
                        <Quote className="absolute -left-2 -top-2 h-8 w-8 text-primary/10 -z-10" />
                        <p className="text-muted-foreground italic font-serif text-lg leading-relaxed">
                          "{review.comment}"
                        </p>
                      </div>
                      <p className="font-semibold text-sm">— {review.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            <div className="sticky top-28 space-y-8">
              <div className="ui-surface space-y-6 p-8 border-primary/20 bg-card/60 backdrop-blur-xl">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Reservation</p>
                  {item.price > 0 ? (
                    <p className="ui-heading text-4xl font-bold">
                      {item.price}€<span className="text-sm font-normal text-muted-foreground ml-2">/ {item.priceUnit}</span>
                    </p>
                  ) : (
                    <p className="ui-heading text-2xl font-bold">Price on request</p>
                  )}
                </div>

                <div className="space-y-4 pt-6 border-t border-border/30">
                  {item.accommodation && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Capacity</span>
                      <span className="font-semibold">{item.accommodation.rooms} Rooms • {item.accommodation.people} Guests</span>
                    </div>
                  )}
                  {item.location && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Area</span>
                      <span className="font-semibold">{item.location}</span>
                    </div>
                  )}
                  {item.locationUrl && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Location</span>
                      <a
                        href={item.locationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-primary hover:underline"
                      >
                        Open map
                      </a>
                    </div>
                  )}
                </div>

                <div className="pt-4 space-y-3">
                  <a href="tel:+212699124735" className="flex items-center gap-3 text-sm font-medium hover:text-primary transition-colors">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Phone className="h-4 w-4" />
                    </div>
                    +212 6 99-12 47 35
                  </a>
                  <a href={`https://wa.me/212699124735`} className="flex items-center gap-3 text-sm font-medium hover:text-primary transition-colors">
                    <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                      <Quote className="h-4 w-4 rotate-180" />
                    </div>
                    WhatsApp Concierge
                  </a>
                </div>
              </div>

              <div className="ui-surface shadow-2xl p-8 border-primary/10 bg-white">
                <h3 className="ui-heading text-xl font-semibold mb-6">Inquire Now</h3>
                <InquiryForm itemId={item.id} itemSlug={item.slug} categoryType={item.categoryType} />
              </div>
            </div>
          </aside>
        </div>
      </div>

      {suggestions.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-20 space-y-6">
          <div className="flex items-end justify-between gap-4 border-b border-border/40 pb-4">
            <h2 className="ui-heading text-3xl font-semibold md:text-4xl text-foreground">
              Other Suggestions
            </h2>
          </div>

          <Swiper
            modules={[Autoplay, Navigation]}
            spaceBetween={24}
            slidesPerView={1.1}
            breakpoints={{
              640: { slidesPerView: 2.1 },
              1024: { slidesPerView: 3.2 },
            }}
            autoplay={{ delay: 4500, disableOnInteraction: false }}
            navigation
            className="pb-10"
          >
            {suggestions.map((suggestion) => (
              <SwiperSlide key={suggestion.id}>
                <Link
                  href={`/${categoryPathMap[suggestion.categoryType]}/${suggestion.slug}`}
                  className="group/card block relative h-80 overflow-hidden rounded-3xl bg-secondary/30 transition-all duration-500 hover:shadow-2xl"
                >
                  <img
                    src={suggestion.coverImage}
                    alt={suggestion.title}
                    className="h-full w-full object-cover transition-transform duration-1000 group-hover/card:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity group-hover/card:opacity-90" />

                  <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                    <div className="translate-y-4 transition-transform duration-500 group-hover/card:translate-y-0">
                      <span className="mb-3 inline-block rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[10px] uppercase tracking-widest backdrop-blur-md">
                        {categoryLabelMap[suggestion.categoryType]}
                      </span>
                      <h3 className="text-2xl font-semibold tracking-tight leading-tight mb-2">
                        {suggestion.title}
                      </h3>
                      {suggestion.location && (
                        <p className="flex items-center gap-1.5 text-sm text-white/80 mb-4 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100">
                          <MapPin className="h-3.5 w-3.5" /> {suggestion.location}
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
        </section>
      )}
    </main>
  );
}

