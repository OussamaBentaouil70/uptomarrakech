import { CategoryListPage } from "@/components/pages/category-list-page";

export default async function AccommodationPage({
  searchParams,
}: {
  searchParams: Promise<{ location?: string; rooms?: string }>;
}) {
  const params = await searchParams;
  return (
    <CategoryListPage
      title="Accommodation"
      type="accommodation"
      isAccommodation
      selectedLocation={params.location}
      selectedRooms={params.rooms}
    />
  );
}

