import { ItemDetailsPage } from "@/components/pages/item-details-page";

export default async function ActivityDetails({
  params,
}: {
  params: Promise<{ itemSlug: string }>;
}) {
  const { itemSlug } = await params;
  return <ItemDetailsPage categoryType="activity" slug={itemSlug} />;
}

