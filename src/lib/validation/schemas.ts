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

export const itemSchema = z.object({
  categoryType: categoryTypeSchema,
  slug: z.string().min(2),
  title: z.string().min(2),
  excerpt: z.string().min(10),
  description: z.string().min(10),
  coverImage: z.string().url(),
  gallery: z.array(z.string().url()).default([]),
  location: z.string().optional(),
  price: z.coerce.number().min(0),
  priceUnit: z.enum(["night", "day", "person", "package"]),
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
export type InquiryInput = z.infer<typeof inquirySchema>;

