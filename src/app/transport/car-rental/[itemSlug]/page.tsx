import { ItemDetailsPage } from "@/components/pages/item-details-page";

export default async function CarRentalDetails({
  params,
}: {
  params: Promise<{ itemSlug: string }>;
}) {
  const { itemSlug } = await params;
  return <ItemDetailsPage categoryType="car_rental" slug={itemSlug} />;
}

