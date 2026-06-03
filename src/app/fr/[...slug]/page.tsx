import { notFound } from "next/navigation";
import { HomePage } from "@/components/pages/home-page";
import { CategoryListPage } from "@/components/pages/category-list-page";
import { ItemDetailsPage } from "@/components/pages/item-details-page";
import BlogPage from "@/app/blog/page";
import BlogDetailsPage from "@/app/blog/[slug]/page";
import ContactPage from "@/app/contact/page";
import ThankYouPage from "@/app/thank-you/page";
import { getBlogBySlug, listBlogs, listItems } from "@/lib/firebase/data";
import type { CategoryType } from "@/lib/types";

const categoryBySegment: Record<string, CategoryType> = {
  accommodation: "accommodation",
  activities: "activity",
  "beach-clubs": "beach_club",
  "night-clubs": "night_club",
  restaurants: "restaurant",
  spa: "spa",
  "car-rental": "car_rental",
  "tourist-transport": "tourist_transport",
};

function isCategorySegment(segment: string): segment is keyof typeof categoryBySegment {
  return segment in categoryBySegment;
}

export async function generateStaticParams() {
  const [blogs, items] = await Promise.all([listBlogs(true), listItems({ publishedOnly: true })]);

  const categoryPaths = Object.entries(categoryBySegment).map(([segment]) => ({ slug: [segment] }));
  const itemPaths = items.flatMap((item) => {
    const categorySegment = Object.entries(categoryBySegment).find(([, type]) => type === item.categoryType)?.[0];
    return categorySegment ? [{ slug: [categorySegment, item.slug] }] : [];
  });

  return [
    { slug: [] },
    { slug: ["contact"] },
    { slug: ["thank-you"] },
    { slug: ["blog"] },
    ...blogs.map((blog) => ({ slug: ["blog", blog.slug] })),
    ...categoryPaths,
    ...itemPaths,
  ];
}

export default async function FrenchRoutePage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug = [] } = await params;

  if (slug.length === 0) {
    return <HomePage />;
  }

  if (slug.length === 1) {
    switch (slug[0]) {
      case "contact":
        return <ContactPage />;
      case "thank-you":
        return <ThankYouPage />;
      case "blog":
        return <BlogPage />;
      case "accommodation":
        return <CategoryListPage title="Accommodation" type="accommodation" isAccommodation />;
      case "activities":
        return <CategoryListPage title="Activities" type="activity" />;
      case "beach-clubs":
        return <CategoryListPage title="Beach Clubs" type="beach_club" />;
      case "night-clubs":
        return <CategoryListPage title="Night Clubs" type="night_club" />;
      case "restaurants":
        return <CategoryListPage title="Restaurants" type="restaurant" />;
      case "spa":
        return <CategoryListPage title="Spa" type="spa" />;
      case "car-rental":
        return <CategoryListPage title="Car Rental" type="car_rental" />;
      case "tourist-transport":
        return <CategoryListPage title="Tourist Transport" type="tourist_transport" />;
      default:
        return notFound();
    }
  }

  if (slug.length === 2 && slug[0] === "blog") {
    const post = await getBlogBySlug(slug[1]);
    if (!post) return notFound();
    return <BlogDetailsPage params={Promise.resolve({ slug: slug[1] })} />;
  }

  if (slug.length === 2 && isCategorySegment(slug[0])) {
    const categoryType = categoryBySegment[slug[0]];
    const items = await listItems({ categoryType, publishedOnly: true });
    const item = items.find((candidate) => candidate.slug === slug[1]);
    if (!item) return notFound();
    return <ItemDetailsPage categoryType={categoryType} slug={slug[1]} />;
  }

  return notFound();
}
