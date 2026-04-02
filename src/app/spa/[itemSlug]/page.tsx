import { ItemDetailsPage } from "@/components/pages/item-details-page";

export default async function SpaDetails({
  params,
}: {
  params: Promise<{ itemSlug: string }>;
}) {
  const { itemSlug } = await params;
  return <ItemDetailsPage categoryType="spa" slug={itemSlug} />;
}

