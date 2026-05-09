import { ItemDetailsPage } from "@/components/pages/item-details-page";
import { listItems } from "@/lib/firebase/data";

export async function generateStaticParams() {
  const items = await listItems({ categoryType: "car_rental", publishedOnly: true });
  return items.map((item) => ({
    itemSlug: item.slug,
  }));
}

export default async function CarRentalDetails({
  params,
}: {
  params: Promise<{ itemSlug: string }>;
}) {
  const { itemSlug } = await params;
  return <ItemDetailsPage categoryType="car_rental" slug={itemSlug} />;
}

