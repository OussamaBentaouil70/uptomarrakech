"use client";

import { useEffect, useState } from "react";
import { getItemBySlug } from "@/lib/firebase/data";
import type { CategoryType, Item } from "@/lib/types";
import { InquiryForm } from "@/components/inquiry-form";
import { GallerySlider } from "@/components/gallery-slider";

type Props = {
  categoryType: CategoryType;
  slug: string;
};

export function ItemDetailsPage({ categoryType, slug }: Props) {
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      const data = await getItemBySlug(categoryType, slug);
      setItem(data);
      setLoading(false);
    };
    void run();
  }, [categoryType, slug]);

  if (!loading && !item) {
    return <main className="mx-auto max-w-7xl p-8">Item not found.</main>;
  }
  if (loading || !item) return <main className="mx-auto max-w-7xl p-8">Loading...</main>;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:py-14">
      <section className="ui-shell ui-shell-ornament mb-6">
        <p className="ui-eyebrow mb-2">Signature Stay</p>
        <h1 className="ui-section-title">{item.title}</h1>
      </section>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <GallerySlider coverImage={item.coverImage} gallery={item.gallery} alt={item.title} />
          <div className="ui-surface p-5 md:p-6">
            <p className="text-lg text-zinc-700">{item.description}</p>
          </div>
        </div>
        <aside className="space-y-4">
          <div className="ui-surface space-y-2 p-5">
            <p className="ui-heading text-2xl font-semibold">
              From {item.price}€ / {item.priceUnit}
            </p>
            {item.location && <p className="text-zinc-700">Location: {item.location}</p>}
            {item.accommodation && (
              <p className="text-zinc-700">
                {item.accommodation.rooms} rooms · {item.accommodation.people} people
              </p>
            )}
            <div className="pt-2 text-sm text-zinc-600">
              Call: +212 6 99-12 47 35
              <br />
              WhatsApp: +212 6 99-12 47 35
            </div>
          </div>
          <InquiryForm itemId={item.id} itemSlug={item.slug} categoryType={item.categoryType} />
        </aside>
      </div>
      <div className="ui-divider mt-12" />
    </main>
  );
}

