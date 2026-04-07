"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { listItems, listPublishedCategories } from "@/lib/firebase/data";
import type { Category, CategoryType, Item } from "@/lib/types";
import { CategoryCard } from "@/components/cards/category-card";
import { AccommodationCard } from "@/components/cards/accommodation-card";
import { AccommodationFilters } from "@/components/accommodation-filters";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { categoryLabelMap, categoryPathMap } from "@/lib/category-map";

type Props = {
  title: string;
  type: CategoryType;
  isAccommodation?: boolean;
  selectedLocation?: string;
  selectedRooms?: string;
};

const categoryThemeMap: Record<CategoryType, { banner: string; blurb: string }> = {
  accommodation: {
    banner: "bg-primary/5",
    blurb: "Elegant villas and stays selected for comfort, style and privacy.",
  },
  night_club: {
    banner: "bg-primary/5",
    blurb: "Signature nightlife spots with premium atmosphere and service.",
  },
  activity: {
    banner: "bg-primary/5",
    blurb: "High-quality experiences curated for unforgettable Marrakech moments.",
  },
  beach_club: {
    banner: "bg-primary/5",
    blurb: "From relaxed poolsides to vibrant day vibes, discover your perfect match.",
  },
  spa: {
    banner: "bg-primary/5",
    blurb: "Wellness destinations chosen for calm, care and refined rituals.",
  },
  car_rental: {
    banner: "bg-primary/5",
    blurb: "Premium vehicles and smooth booking for effortless city and road travel.",
  },
  tourist_transport: {
    banner: "bg-primary/5",
    blurb: "Comfort-first transport options for airport, city and private tours.",
  },
  restaurant: {
    banner: "bg-primary/5",
    blurb: "A journey through the finest flavors and most exclusive dining settings.",
  },
};

const accommodationFeatureImage =
  "https://uptomarrakech.com/wp-content/uploads/2025/06/villa-rental-2.jpg";

const additionalServicesOrder: CategoryType[] = [
  "accommodation",
  "restaurant",
  "activity",
  "spa",
  "beach_club",
  "night_club",
  "car_rental",
  "tourist_transport",
];

const serviceDescriptionMap: Record<
  CategoryType,
  {
    title: string;
    intro: string;
    highlights: Array<{ heading: string; body: string }>;
  }
> = {
  accommodation: {
    title: "Find Your Perfect Villa in Marrakech",
    intro:
      "Choosing the right villa is key to a memorable Marrakech experience. Whether you're planning a romantic getaway, a family holiday, or a trip with friends, we have the perfect property to suit your needs. Here's what to consider when you rent a villa in Marrakech.",
    highlights: [
      {
        heading: "Luxury Villas for Every Traveller",
        body: "Our portfolio is tailored to accommodate any occasion. Find spacious multi-bedroom estates perfect for large groups, charming and intimate riads for couples, and family-friendly villas complete with all the necessary amenities to keep everyone entertained. Each property is handpicked for its quality, location, and unique character.",
      },
      {
        heading: "Why Choose a Private Villa Rental?",
        body: "Renting a villa offers a level of privacy, space, and personalization that hotels simply cannot match. Enjoy the freedom to set your own schedule, dine when you please, and immerse yourself in the local culture from the comfort of your own exclusive home. It's the ultimate way to experience the allure of Marrakech.",
      },
    ],
  },
  night_club: {
    title: "Discover Marrakech Nightlife, Your Way",
    intro:
      "From elegant lounges to high-energy dance floors, Marrakech nightlife offers a unique rhythm for every mood. We help you choose venues that match your vibe, group size, and preferred atmosphere.",
    highlights: [
      {
        heading: "Curated Premium Venues",
        body: "Our nightlife selection prioritizes ambiance, quality service, and unforgettable moments, whether you are looking for a chic evening or a lively party experience.",
      },
      {
        heading: "Better Nights, Less Guesswork",
        body: "With the right recommendations, you save time and enjoy the best addresses in town with confidence and comfort.",
      },
    ],
  },
  activity: {
    title: "Choose The Right Marrakech Experience",
    intro:
      "Marrakech is full of adventures, from cultural discoveries to adrenaline-filled outings. The key is choosing activities that fit your pace, your group, and the kind of memories you want to create.",
    highlights: [
      {
        heading: "Handpicked Experiences",
        body: "Our collection includes authentic experiences, private tours, and premium excursions selected for quality, safety, and reliability.",
      },
      {
        heading: "Travel Smarter",
        body: "Clear options and trusted partners help you focus on fun while making the most of your Marrakech itinerary.",
      },
    ],
  },
  beach_club: {
    title: "Find Your Ideal Beach Club Escape",
    intro:
      "Whether you prefer a laid-back pool day or a vibrant social scene, Marrakech beach clubs offer a perfect mix of comfort, music, and sunshine.",
    highlights: [
      {
        heading: "Stylish Daytime Spots",
        body: "From exclusive cabanas to festive day events, our beach clubs are selected for atmosphere, service, and overall quality.",
      },
      {
        heading: "Your Mood, Your Setting",
        body: "Pick the perfect place to relax, celebrate, and enjoy premium hospitality throughout your day.",
      },
    ],
  },
  spa: {
    title: "Wellness Experiences Tailored To You",
    intro:
      "A spa day in Marrakech is more than relaxation, it's a complete reset with traditional rituals, modern treatments, and personalized care.",
    highlights: [
      {
        heading: "Tranquil, High-Quality Spaces",
        body: "Our selected spas combine elegant environments with expert therapists for restorative and refined treatments.",
      },
      {
        heading: "Feel Fully Recharged",
        body: "Ideal for solo escapes, couples, or post-adventure recovery, these experiences help you return refreshed and balanced.",
      },
    ],
  },
  car_rental: {
    title: "Rent The Perfect Car For Marrakech",
    intro:
      "The right vehicle makes your stay more flexible and comfortable, whether you need a compact city car, a luxury model, or an SUV for day trips.",
    highlights: [
      {
        heading: "Reliable Rental Partners",
        body: "Enjoy transparent service, quality fleets, and smooth pickups with options adapted to your travel style.",
      },
      {
        heading: "Freedom To Explore",
        body: "Drive Marrakech and nearby destinations at your own pace with comfort and convenience.",
      },
    ],
  },
  tourist_transport: {
    title: "Private Transport For Stress-Free Travel",
    intro:
      "From airport transfers to private drivers and city rides, our transport options are built for comfort, punctuality, and peace of mind.",
    highlights: [
      {
        heading: "Professional And Reliable",
        body: "Ideal for families, business travelers, and groups, with experienced drivers and well-maintained vehicles.",
      },
      {
        heading: "Smooth Logistics",
        body: "Let us handle routes and timing so you can focus on enjoying your trip.",
      },
    ],
  },
  restaurant: {
    title: "Taste Marrakech Through Exceptional Dining",
    intro:
      "From rooftop fine dining to authentic local cuisine, Marrakech has a remarkable culinary scene for every occasion.",
    highlights: [
      {
        heading: "Selected For Quality",
        body: "Each restaurant is chosen for food excellence, atmosphere, and memorable service.",
      },
      {
        heading: "Reserve With Confidence",
        body: "Find the right table for romantic dinners, celebrations, or culinary discovery in top Marrakech venues.",
      },
    ],
  },
};

export function CategoryListPage({
  title,
  type,
  isAccommodation,
  selectedLocation,
  selectedRooms,
}: Props) {
  const [items, setItems] = useState<Item[]>([]);
  const [allPublishedItems, setAllPublishedItems] = useState<Item[]>([]);
  const [publishedCategories, setPublishedCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 9;
  const theme = categoryThemeMap[type] || categoryThemeMap.activity;
  const serviceContent = serviceDescriptionMap[type] || serviceDescriptionMap.activity;

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      const data = await listItems({
        categoryType: type,
        publishedOnly: true,
        location: selectedLocation || undefined,
        rooms: selectedRooms ? Number(selectedRooms) : undefined,
      });
      setItems(data);
      setLoading(false);
    };
    void run();
  }, [selectedLocation, selectedRooms, type]);

  useEffect(() => {
    const run = async () => {
      const [categories, publishedItems] = await Promise.all([
        listPublishedCategories(),
        listItems({ publishedOnly: true }),
      ]);
      setPublishedCategories(categories);
      setAllPublishedItems(publishedItems);
    };
    void run();
  }, []);

  const locations = useMemo(
    () =>
      Array.from(new Set(items.map((i) => i.location).filter((v): v is string => Boolean(v)))),
    [items],
  );
  const roomOptions = useMemo(
    () =>
      Array.from(
        new Set(items.map((i) => i.accommodation?.rooms).filter((v): v is number => Boolean(v))),
      ).sort((a, b) => a - b),
    [items],
  );

  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const pagedItems = useMemo(
    () => items.slice((currentPage - 1) * perPage, currentPage * perPage),
    [items, currentPage],
  );

  const currentCategory = useMemo(
    () => publishedCategories.find((category) => category.type === type),
    [publishedCategories, type],
  );

  const descriptionImage = useMemo(() => {
    if (type === "accommodation") return accommodationFeatureImage;
    return (
      currentCategory?.heroImage ||
      items[0]?.coverImage ||
      allPublishedItems.find((item) => item.categoryType === type)?.coverImage
    );
  }, [allPublishedItems, currentCategory?.heroImage, items, type]);

  const bannerImage = useMemo(
    () => items[0]?.coverImage || currentCategory?.heroImage || descriptionImage,
    [currentCategory?.heroImage, descriptionImage, items],
  );

  const previewImageByType = useMemo(() => {
    return allPublishedItems.reduce<Partial<Record<CategoryType, string>>>((acc, item) => {
      if (!acc[item.categoryType] && item.coverImage) {
        acc[item.categoryType] = item.coverImage;
      }
      return acc;
    }, {});
  }, [allPublishedItems]);

  const additionalServices = useMemo(
    () => {
      const getOrder = (categoryType: CategoryType) => {
        const index = additionalServicesOrder.indexOf(categoryType);
        return index === -1 ? Number.MAX_SAFE_INTEGER : index;
      };

      return publishedCategories
        .filter((category) => category.type !== type && Boolean(categoryPathMap[category.type]))
        .sort((a, b) => getOrder(a.type) - getOrder(b.type));
    },
    [publishedCategories, type],
  );

  return (
    <main className="bg-background min-h-screen">
      <section className={cn("relative overflow-hidden border-b border-border/40", theme.banner)}>
        {bannerImage ? (
          <>
            <Image
              src={bannerImage}
              alt={title}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/45" />
            <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/25 to-black/35" />
          </>
        ) : null}

        <div className="relative px-6 py-24 text-center md:py-28">
          <div className="mx-auto max-w-3xl space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/90">
              The Collection
            </span>
            <h1 className="ui-display text-5xl font-bold tracking-tight text-white md:text-6xl">
              {title}
            </h1>
            <p className="font-serif text-lg italic text-white/90">
              {theme.blurb}
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-12">
        {isAccommodation && (
          <div className="mb-12">
            <AccommodationFilters
              locations={locations}
              roomOptions={roomOptions}
              selectedLocation={selectedLocation}
              selectedRooms={selectedRooms}
            />
          </div>
        )}

        {loading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-96 animate-pulse rounded-3xl bg-card/40 border border-border/40" />
            ))}
          </div>
        ) : (
          <>
            {!items.length ? (
              <div className="ui-surface p-20 text-center space-y-4">
                <p className="text-muted-foreground font-serif italic text-xl">Aucun résultat trouvé pour cette sélection.</p>
                <Button variant="ghost" onClick={() => window.location.reload()}>Reset filters</Button>
              </div>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {pagedItems.map((item, index) => (
                  <div key={item.id} className="animate-reveal" style={{ animationDelay: `${index * 100}ms` }}>
                    {isAccommodation ? <AccommodationCard item={item} /> : <CategoryCard item={item} />}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {!loading && items.length > perPage && (
          <div className="mt-16 flex items-center justify-center gap-4">
            <Button
              variant="outline"
              className="rounded-full px-6"
              disabled={currentPage <= 1}
              onClick={() => {
                setPage((p) => Math.max(1, p - 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Previous
            </Button>
            
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    className={cn(
                      "h-10 w-10 rounded-full text-xs font-bold transition-all",
                      p === currentPage 
                        ? "bg-primary text-primary-foreground shadow-lg" 
                        : "hover:bg-primary/10 text-muted-foreground"
                    )}
                    onClick={() => {
                      setPage(p);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    {p}
                  </button>
                );
              })}
            </div>

            <Button
              variant="outline"
              className="rounded-full px-6"
              disabled={currentPage >= totalPages}
              onClick={() => {
                setPage((p) => Math.min(totalPages, p + 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Next
            </Button>
          </div>
        )}

        {!loading && (
          <section className="mt-20 space-y-14">
            <div className="ui-surface overflow-hidden">
              <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-6 p-8 md:p-10 lg:p-12">
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-[0.32em] text-primary">
                      Why Choose This Service
                    </span>
                    <h2 className="ui-heading text-3xl font-semibold leading-tight sm:text-4xl">
                      {serviceContent.title}
                    </h2>
                  </div>

                  <div className="space-y-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    <p>{serviceContent.intro}</p>
                    {serviceContent.highlights.map((highlight) => (
                      <div key={highlight.heading} className="space-y-2">
                        <h3 className="ui-heading text-xl font-semibold text-foreground">
                          {highlight.heading}
                        </h3>
                        <p>{highlight.body}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative min-h-80">
                  {descriptionImage ? (
                    <Image
                      src={descriptionImage}
                      alt={serviceContent.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-linear-to-br from-primary/20 via-secondary/20 to-background" />
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black/35 via-black/15 to-transparent" />
                </div>
              </div>
            </div>

            {additionalServices.length > 0 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.32em] text-primary">
                    Additional Services
                  </span>
                  <h3 className="ui-heading text-2xl font-semibold sm:text-3xl">
                    Explore More Experiences In Marrakech
                  </h3>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                  {additionalServices.map((service) => (
                    <Link
                      key={service.id}
                      href={`/${categoryPathMap[service.type]}`}
                      className="group relative overflow-hidden rounded-3xl border border-border/50 bg-card/40"
                    >
                      <div className="relative h-52 w-full">
                        {service.heroImage || previewImageByType[service.type] ? (
                          <Image
                            src={service.heroImage || previewImageByType[service.type] || ""}
                            alt={service.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="h-full w-full bg-linear-to-br from-primary/25 via-secondary/20 to-background" />
                        )}
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-transparent" />
                      </div>

                      <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/75">
                          Additional Service
                        </p>
                        <h4 className="mt-1 text-xl font-semibold leading-tight">
                          {service.name || categoryLabelMap[service.type]}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}

