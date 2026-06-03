export const CATEGORY_TYPES = [
  "accommodation",
  "night_club",
  "activity",
  "beach_club",
  "spa",
  "car_rental",
  "tourist_transport",
  "restaurant",
] as const;

export type CategoryType = (typeof CATEGORY_TYPES)[number];

export type PriceUnit = "night" | "day" | "person" | "package";

export type InquiryStatus = "new" | "in_progress" | "closed";

export type Category = {
  id: string;
  slug: string;
  name: string;
  nameFr?: string;
  type: CategoryType;
  heroImage?: string;
  sortOrder: number;
  published: boolean;
};

export type Review = {
  id?: string;
  name?: string;
  authorName?: string;
  authorImage?: string;
  rating: number;
  comment: string;
  commentFr?: string;
  date?: string;
  createdAt?: string;
};

export type Item = {
  id: string;
  categoryType: CategoryType;
  slug: string;
  title: string;
  titleFr?: string;
  excerpt: string;
  excerptFr?: string;
  description: string;
  descriptionFr?: string;
  coverImage: string;
  gallery: string[];
  location?: string;
  locationFr?: string;
  locationUrl?: string;
  price: number;
  priceUnit: PriceUnit;
  carte?: string; // URL to menu or text
  reviews?: Review[];
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
  firstName?: string;
  lastName?: string;
  name?: string;
  phone: string;
  email: string;
  date?: string;
  time?: string;
  message: string;
  // Legacy fields for old reservations.
  startDate?: string;
  endDate?: string;
  status: InquiryStatus;
  createdAt?: string;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  titleFr?: string;
  content: string;
  contentFr?: string;
  excerpt: string;
  excerptFr?: string;
  coverImage: string;
  gallery: string[];
  date: string;
  published: boolean;
  createdAt?: any;
};
