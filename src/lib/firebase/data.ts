import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";
import type { Category, CategoryType, Inquiry, Item, BlogPost } from "@/lib/types";
import type {
  CategoryInput,
  InquiryInput,
  ItemInput,
  BlogInput,
} from "@/lib/validation/schemas";

const categoriesCol = collection(db, "categories");
const itemsCol = collection(db, "items");
const inquiriesCol = collection(db, "inquiries");

function removeUndefined<T extends Record<string, unknown>>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined),
  ) as T;
}

function withId<T>(id: string, data: Omit<T, "id">): T {
  return { id, ...data } as T;
}

export async function listCategories(): Promise<Category[]> {
  const snap = await getDocs(categoriesCol);
  return snap.docs
    .map((d) => withId<Category>(d.id, d.data() as Omit<Category, "id">))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function listPublishedCategories(): Promise<Category[]> {
  // Avoid composite index requirements by sorting client-side.
  const snap = await getDocs(query(categoriesCol, where("published", "==", true)));
  return snap.docs
    .map((d) => withId<Category>(d.id, d.data() as Omit<Category, "id">))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function upsertCategory(id: string | null, input: CategoryInput) {
  const cleanInput = removeUndefined(input as Record<string, unknown>) as CategoryInput;
  if (id) {
    await updateDoc(doc(db, "categories", id), cleanInput);
    return id;
  }
  const created = await addDoc(categoriesCol, cleanInput);
  return created.id;
}

export async function deleteCategory(id: string) {
  await deleteDoc(doc(db, "categories", id));
}

export async function listItems(filters?: {
  categoryType?: CategoryType;
  location?: string;
  rooms?: number;
  publishedOnly?: boolean;
}): Promise<Item[]> {
  const constraints = [];
  if (filters?.categoryType) {
    constraints.push(where("categoryType", "==", filters.categoryType));
  }
  if (filters?.publishedOnly) {
    constraints.push(where("published", "==", true));
  }
  if (filters?.location) {
    constraints.push(where("location", "==", filters.location));
  }

  // Avoid composite index requirements by sorting client-side.
  const snap = await getDocs(query(itemsCol, ...constraints));
  const mapped = snap.docs
    .map((d) => withId<Item>(d.id, d.data() as Omit<Item, "id">))
    .sort((a, b) => a.title.localeCompare(b.title));

  if (!filters?.rooms) return mapped;
  return mapped.filter((item) => (item.accommodation?.rooms ?? 0) >= filters.rooms!);
}

export async function getItemBySlug(
  categoryType: CategoryType,
  slug: string,
): Promise<Item | null> {
  const q = query(
    itemsCol,
    where("categoryType", "==", categoryType),
    where("slug", "==", slug),
    where("published", "==", true),
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return withId<Item>(d.id, d.data() as Omit<Item, "id">);
}

export async function getItemById(id: string): Promise<Item | null> {
  const snap = await getDoc(doc(db, "items", id));
  if (!snap.exists()) return null;
  return withId<Item>(snap.id, snap.data() as Omit<Item, "id">);
}

export async function upsertItem(id: string | null, input: ItemInput) {
  const payload = removeUndefined({
    ...input,
    updatedAt: serverTimestamp(),
  });
  if (id) {
    await updateDoc(doc(db, "items", id), payload);
    return id;
  }
  const created = await addDoc(itemsCol, {
    ...payload,
    createdAt: serverTimestamp(),
  });
  return created.id;
}

export async function deleteItem(id: string) {
  await deleteDoc(doc(db, "items", id));
}

export async function createInquiry(input: InquiryInput) {
  const created = await addDoc(inquiriesCol, {
    ...input,
    status: "new",
    createdAt: serverTimestamp(),
  });
  return created.id;
}

export async function listInquiries(): Promise<Inquiry[]> {
  const snap = await getDocs(inquiriesCol);
  return snap.docs
    .map((d) => withId<Inquiry>(d.id, d.data() as Omit<Inquiry, "id">))
    .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
}

export async function updateInquiryStatus(id: string, status: Inquiry["status"]) {
  await updateDoc(doc(db, "inquiries", id), { status });
}

const blogsCol = collection(db, "blogs");

export async function listBlogs(publishedOnly = false): Promise<BlogPost[]> {
  const constraints = [];
  if (publishedOnly) {
    constraints.push(where("published", "==", true));
  }
  const snap = await getDocs(query(blogsCol, ...constraints));
  return snap.docs
    .map((d) => withId<BlogPost>(d.id, d.data() as Omit<BlogPost, "id">))
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  const q = query(blogsCol, where("slug", "==", slug), where("published", "==", true));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return withId<BlogPost>(d.id, d.data() as Omit<BlogPost, "id">);
}

export async function upsertBlog(id: string | null, input: BlogInput) {
  const payload = removeUndefined({
    ...input,
    updatedAt: serverTimestamp(),
  });
  if (id) {
    await updateDoc(doc(db, "blogs", id), payload);
    return id;
  }
  const created = await addDoc(blogsCol, {
    ...payload,
    createdAt: serverTimestamp(),
  });
  return created.id;
}

export async function deleteBlog(id: string) {
  await deleteDoc(doc(db, "blogs", id));
}
