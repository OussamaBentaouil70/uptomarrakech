import { ItemDetailsPage } from "@/components/pages/item-details-page";

export default async function NightClubDetails({
  params,
}: {
  params: Promise<{ itemSlug: string }>;
}) {
  const { itemSlug } = await params;
  return <ItemDetailsPage categoryType="night_club" slug={itemSlug} />;
}

