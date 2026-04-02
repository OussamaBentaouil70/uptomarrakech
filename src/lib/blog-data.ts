export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  content: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "luxury-marrakech-weekend-guide",
    title: "Luxury Marrakech Weekend Guide",
    excerpt: "A curated 48-hour itinerary for elegant stays, dining and experiences.",
    image: "https://images.unsplash.com/photo-1597211684565-dca64d8108fd?auto=format&fit=crop&w=1400&q=80",
    date: "2026-04-02",
    content:
      "Marrakech blends luxury, tradition and vibrant lifestyle. This guide helps you design an elevated weekend with handpicked villas, rooftop dinners and private transfers.",
  },
  {
    slug: "best-villas-route-ourika",
    title: "Best Villas on Route d'Ourika",
    excerpt: "Explore the most exclusive villas with large gardens and private pools.",
    image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1400&q=80",
    date: "2026-04-01",
    content:
      "Route d'Ourika remains one of the top areas for luxury accommodation in Marrakech, combining calm surroundings with quick city access.",
  },
  {
    slug: "where-to-book-beach-clubs-marrakech",
    title: "Where to Book Beach Clubs in Marrakech",
    excerpt: "From relaxed pool days to festive DJ vibes, choose your perfect beach club.",
    image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1400&q=80",
    date: "2026-03-30",
    content:
      "Marrakech beach clubs offer a premium social scene. We compare atmosphere, service style, and best timing for reservations.",
  },
];

