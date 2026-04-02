import { ItemDetailsPage } from "@/components/pages/item-details-page";

export default async function BeachClubDetails({
  params,
}: {
  params: Promise<{ itemSlug: string }>;
}) {
  const { itemSlug } = await params;
  return <ItemDetailsPage categoryType="beach_club" slug={itemSlug} />;
}

