import { listItems } from "@/lib/firebase/data";
import ReviewsManagerClient from "./reviews-manager-client";

type PageProps = {
  params: Promise<{ itemId: string }>;
};

export async function generateStaticParams() {
  const items = await listItems();
  return items.map((item) => ({
    itemId: item.id,
  }));
}

export default async function ReviewsPage({ params }: PageProps) {
  const { itemId } = await params;
  return <ReviewsManagerClient itemId={itemId} />;
}
