import { ItemDetailsPage } from "@/components/pages/item-details-page";

export default async function AccommodationDetails({
  params,
}: {
  params: Promise<{ itemSlug: string }>;
}) {
  const { itemSlug } = await params;
  return <ItemDetailsPage categoryType="accommodation" slug={itemSlug} />;
}

