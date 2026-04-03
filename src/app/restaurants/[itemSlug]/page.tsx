import { ItemDetailsPage } from "@/components/pages/item-details-page";

export default async function RestaurantDetails({
  params,
}: {
  params: Promise<{ itemSlug: string }>;
}) {
  const { itemSlug } = await params;
  return <ItemDetailsPage categoryType="restaurant" slug={itemSlug} />;
}
