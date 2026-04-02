import type { CategoryType } from "@/lib/types";

export const categoryPathMap: Record<CategoryType, string> = {
  accommodation: "accommodation",
  night_club: "night-clubs",
  activity: "activities",
  beach_club: "beach-clubs",
  spa: "spa",
  car_rental: "transport/car-rental",
  tourist_transport: "transport/tourist-transport",
};

export const categoryLabelMap: Record<CategoryType, string> = {
  accommodation: "Accommodation",
  night_club: "Night clubs",
  activity: "Activities",
  beach_club: "Beach clubs",
  spa: "Spa",
  car_rental: "Car rental",
  tourist_transport: "Tourist transport",
};

