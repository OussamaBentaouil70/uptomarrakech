export const CATEGORY_TYPES = [
  "accommodation",
  "night_club",
  "activity",
  "beach_club",
  "spa",
  "car_rental",
  "tourist_transport",
] as const;

export type CategoryType = (typeof CATEGORY_TYPES)[number];

export type PriceUnit = "night" | "day" | "person" | "package";

export type InquiryStatus = "new" | "in_progress" | "closed";

export type Category = {
  id: string;
  slug: string;
  name: string;
  type: CategoryType;
  heroImage?: string;
  sortOrder: number;
  published: boolean;
};

export type Item = {
  id: string;
  categoryType: CategoryType;
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  coverImage: string;
  gallery: string[];
  location?: string;
  price: number;
  priceUnit: PriceUnit;
  accommodation?: {
    rooms: number;
    people: number;
  };
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type Inquiry = {
  id: string;
  itemId: string;
  itemSlug: string;
  categoryType: CategoryType;
  name: string;
  phone: string;
  email?: string;
  message: string;
  startDate?: string;
  endDate?: string;
  status: InquiryStatus;
  createdAt?: string;
};

