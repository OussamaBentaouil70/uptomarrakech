import { z } from "zod";
import { CATEGORY_TYPES } from "@/lib/types";

export const categoryTypeSchema = z.enum(CATEGORY_TYPES);

export const categorySchema = z.object({
  slug: z.string().min(2),
  name: z.string().min(2),
  type: categoryTypeSchema,
  heroImage: z.string().url().optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().min(0),
  published: z.boolean(),
});

export const reviewSchema = z.object({
  name: z.string().min(2),
  rating: z.coerce.number().min(1).max(5),
  comment: z.string().min(2),
  date: z.string(),
});

export const itemSchema = z.object({
  categoryType: categoryTypeSchema,
  slug: z.string().min(2),
  title: z.string().min(2),
  excerpt: z.string().min(10),
  description: z.string().min(10),
  coverImage: z.string().url(),
  gallery: z.array(z.string().url()).default([]),
  location: z.string().optional().or(z.literal("")),
  locationUrl: z.string().url().optional().or(z.literal("")),
  price: z.coerce.number().min(0),
  priceUnit: z.enum(["night", "day", "person", "package"]),
  carte: z.string().url().optional().or(z.literal("")),
  reviews: z.array(reviewSchema).optional().default([]),
  accommodation: z
    .object({
      rooms: z.coerce.number().int().min(1),
      people: z.coerce.number().int().min(1),
    })
    .optional(),
  published: z.boolean(),
});

export const inquirySchema = z.object({
  itemId: z.string().min(1),
  itemSlug: z.string().min(1),
  categoryType: categoryTypeSchema,
  name: z.string().min(2),
  phone: z.string().min(6),
  email: z.string().email().optional().or(z.literal("")),
  message: z.string().min(10),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type CategoryInput = z.infer<typeof categorySchema>;
export type ItemInput = z.infer<typeof itemSchema>;
export const blogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  coverImage: z.string().min(1, "Cover image is required"),
  gallery: z.array(z.string()).default([]),
  date: z.string().min(1, "Date is required"),
  published: z.boolean().default(true),
});

export type BlogInput = z.infer<typeof blogSchema>;
export type InquiryInput = z.infer<typeof inquirySchema>;

