import { ItemDetailsPage } from "@/components/pages/item-details-page";
import { listItems } from "@/lib/firebase/data";

export async function generateStaticParams() {
  const items = await listItems({ categoryType: "tourist_transport", publishedOnly: true });
  return items.map((item) => ({
    itemSlug: item.slug,
  }));
}

export default async function TouristTransportDetails({
  params,
}: {
  params: Promise<{ itemSlug: string }>;
}) {
  const { itemSlug } = await params;
  return <ItemDetailsPage categoryType="tourist_transport" slug={itemSlug} />;
}

