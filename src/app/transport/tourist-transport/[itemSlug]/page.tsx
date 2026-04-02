import { ItemDetailsPage } from "@/components/pages/item-details-page";

export default async function TouristTransportDetails({
  params,
}: {
  params: Promise<{ itemSlug: string }>;
}) {
  const { itemSlug } = await params;
  return <ItemDetailsPage categoryType="tourist_transport" slug={itemSlug} />;
}

