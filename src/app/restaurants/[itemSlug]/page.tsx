import { ItemDetailsPage } from "@/components/pages/item-details-page";
import { listItems } from "@/lib/firebase/data";

export async function generateStaticParams() {
  const items = await listItems({ categoryType: "restaurant", publishedOnly: true });
  return items.map((item) => ({
    itemSlug: item.slug,
  }));
}

export default async function RestaurantDetails({
  params,
}: {
  params: Promise<{ itemSlug: string }>;
}) {
  const { itemSlug } = await params;
  return <ItemDetailsPage categoryType="restaurant" slug={itemSlug} />;
}
