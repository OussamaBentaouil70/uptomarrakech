"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { StarRating } from "@/components/ui/star-rating";
import { ReviewAvatar } from "@/components/review-avatar";
import { getItemById, setItemReviews } from "@/lib/firebase/data";
import type { Item, Review } from "@/lib/types";
import { toast } from "sonner";
import { Plus, Trash2, Edit2, X, Save } from "lucide-react";

type ReviewDraft = Review & { id: string };

const emptyForm = {
  authorName: "",
  name: "",
  authorImage: "",
  rating: 5,
  comment: "",
  commentFr: "",
};

function normalizeReview(input: Partial<Review> & { id?: string }, fallbackIndex: number): ReviewDraft {
  const authorName = input.authorName || input.name || "Guest";
  return {
    id: input.id || `draft-${fallbackIndex}-${Math.random().toString(36).slice(2, 9)}`,
    authorName,
    name: input.name || authorName,
    authorImage: input.authorImage || "",
    rating: Number(input.rating || 5),
    comment: input.comment || "",
    commentFr: input.commentFr || "",
    date: input.date,
    createdAt: input.createdAt,
  };
}

export default function ReviewsManagerClient({ itemId }: { itemId: string }) {
  const router = useRouter();

  const [item, setItem] = useState<Item | null>(null);
  const [draftReviews, setDraftReviews] = useState<ReviewDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [jsonText, setJsonText] = useState("");
  const [jsonTextFr, setJsonTextFr] = useState("");
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    const loadItem = async () => {
      try {
        const data = await getItemById(itemId);
        if (!data) {
          toast.error("Item not found");
          router.push("/admin/items");
          return;
        }
        setItem(data);
        setDraftReviews((data.reviews || []).map((review, index) => normalizeReview(review, index)));
      } catch (error) {
        toast.error("Failed to load item");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    void loadItem();
  }, [itemId, router]);

  const resetForm = () => {
    setEditingReviewId(null);
    setFormData(emptyForm);
  };

  const handleAddOrUpdateReview = () => {
    const authorName = formData.authorName || formData.name;
    if (!authorName || !formData.comment || formData.rating < 1) {
      toast.error("Please fill in all fields and select a rating");
      return;
    }

    const review: ReviewDraft = {
      id: editingReviewId || `draft-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`,
      authorName,
      name: authorName,
      authorImage: formData.authorImage,
      rating: formData.rating,
      comment: formData.comment,
      commentFr: formData.commentFr,
      createdAt: editingReviewId ? draftReviews.find((draft) => draft.id === editingReviewId)?.createdAt : new Date().toISOString(),
    };

    setDraftReviews((current) => {
      if (editingReviewId) {
        return current.map((draft) => (draft.id === editingReviewId ? review : draft));
      }
      return [review, ...current];
    });

    toast.success(editingReviewId ? "Review updated in draft" : "Review added to draft");
    resetForm();
  };

  const handleEditReview = (review: ReviewDraft) => {
    setEditingReviewId(review.id);
    setFormData({
      authorName: review.authorName || review.name || "",
      name: review.name || review.authorName || "",
      authorImage: review.authorImage || "",
      rating: review.rating,
      comment: review.comment,
      commentFr: review.commentFr || "",
    });
  };

  const handleDeleteReview = (reviewId: string) => {
    setDraftReviews((current) => current.filter((review) => review.id !== reviewId));
    if (editingReviewId === reviewId) {
      resetForm();
    }
    toast.success("Review removed from draft");
  };

  const handlePasteJson = (locale: "en" | "fr") => {
    const raw = locale === "en" ? jsonText : jsonTextFr;
    if (!raw.trim()) {
      toast.error("Please paste JSON content");
      return;
    }

    try {
      const parsed = JSON.parse(raw) as Array<Partial<Review> & { commentFr?: string }>;
      if (!Array.isArray(parsed)) {
        toast.error("JSON must be an array of reviews");
        return;
      }

      if (locale === "en") {
        setDraftReviews((current) => [
          ...parsed.map((review, index) => normalizeReview(review, index)),
          ...current,
        ]);
        setJsonText("");
        toast.success(`${parsed.length} English reviews added to draft`);
        return;
      }

      setDraftReviews((current) => {
        const next = [...current];
        parsed.forEach((review, index) => {
          const target = next[index];
          if (!target) return;
          next[index] = {
            ...target,
            commentFr: review.commentFr || review.comment || target.commentFr || "",
            authorName: review.authorName || target.authorName,
            name: review.name || target.name,
            authorImage: review.authorImage || target.authorImage,
          };
        });
        return next;
      });
      setJsonTextFr("");
      toast.success(`${parsed.length} French translations added to draft`);
    } catch (error) {
      toast.error(error instanceof SyntaxError ? "Invalid JSON format" : "Failed to import reviews");
      console.error(error);
    }
  };

  const handleSaveDraft = async () => {
    if (!item) return;
    try {
      setSaving(true);
      await setItemReviews(
        itemId,
        draftReviews.map((draftReview) => {
          const { id: _id, ...review } = draftReview;
          return review;
        }),
      );
      const updated = await getItemById(itemId);
      if (updated) {
        setItem(updated);
      }
      toast.success("Reviews saved successfully");
    } catch (error) {
      toast.error("Failed to save reviews");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!item) return null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reviews for {item.title}</h1>
          <p className="text-muted-foreground">Manage customer reviews before saving them to Firestore</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleSaveDraft} disabled={saving} className="gap-2 rounded-full px-6">
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Reviews"}
          </Button>
        </div>
      </div>

      <Card className="p-6 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">{editingReviewId ? "Edit Review Draft" : "Add New Review Draft"}</h2>
          {editingReviewId && (
            <Button variant="ghost" onClick={resetForm} className="gap-2">
              <X className="h-4 w-4" />
              Cancel
            </Button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Reviewer Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={formData.authorName || formData.name || ""}
              onChange={(e) => setFormData({ ...formData, authorName: e.target.value, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Photo URL</Label>
            <Input
              id="image"
              placeholder="https://example.com/photo.jpg"
              value={formData.authorImage || ""}
              onChange={(e) => setFormData({ ...formData, authorImage: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Rating</Label>
          <StarRating value={formData.rating} onChange={(rating) => setFormData({ ...formData, rating })} size="lg" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="comment">Review Comment</Label>
            <Textarea
              id="comment"
              placeholder="Write the review here..."
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="comment-fr">Review Comment (FR)</Label>
            <Textarea
              id="comment-fr"
              placeholder="Rédigez la traduction française ici..."
              value={formData.commentFr || ""}
              onChange={(e) => setFormData({ ...formData, commentFr: e.target.value })}
              rows={4}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={handleAddOrUpdateReview} className="gap-2">
            <Plus className="h-4 w-4" />
            {editingReviewId ? "Update Draft" : "Add Draft Review"}
          </Button>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="p-6 space-y-4 bg-blue-50/30 border-blue-200/30">
          <div>
            <h3 className="text-lg font-semibold mb-2">Bulk Add Reviews from JSON</h3>
            <p className="text-sm text-muted-foreground mb-4">Paste the English review array. It stays in draft until you save.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="json-paste">Paste JSON Here</Label>
            <Textarea
              id="json-paste"
              placeholder={`[
  {
    "authorName": "John Doe",
    "authorImage": "https://example.com/photo.jpg",
    "rating": 5,
    "comment": "Amazing experience!"
  }
]`}
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              rows={8}
              className="font-mono text-sm"
            />
          </div>

          <div className="flex gap-3">
            <Button onClick={() => handlePasteJson("en")} disabled={!jsonText.trim()} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Reviews
            </Button>
            {jsonText && (
              <Button variant="ghost" onClick={() => setJsonText("")} className="gap-2">
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </Card>

        <Card className="p-6 space-y-4 bg-emerald-50/30 border-emerald-200/30">
          <div>
            <h3 className="text-lg font-semibold mb-2">Bulk Add Reviews from JSON (FR version)</h3>
            <p className="text-sm text-muted-foreground mb-4">Paste the French translations in the same order to fill <span className="font-semibold">commentFr</span>.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="json-paste-fr">Paste JSON Here</Label>
            <Textarea
              id="json-paste-fr"
              placeholder={`[
  {
    "commentFr": "Expérience incroyable !"
  }
]`}
              value={jsonTextFr}
              onChange={(e) => setJsonTextFr(e.target.value)}
              rows={8}
              className="font-mono text-sm"
            />
          </div>

          <div className="flex gap-3">
            <Button onClick={() => handlePasteJson("fr")} disabled={!jsonTextFr.trim()} className="gap-2" variant="default">
              <Plus className="h-4 w-4" />
              Add FR Translations
            </Button>
            {jsonTextFr && (
              <Button variant="ghost" onClick={() => setJsonTextFr("")} className="gap-2">
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Draft Reviews ({draftReviews.length})</h2>

        {draftReviews.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">No reviews yet. Add one to get started!</Card>
        ) : (
          <div className="grid gap-4">
            {draftReviews.map((review) => {
              const authorName = review.authorName || review.name || "Guest";
              return (
                <Card key={review.id} className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4 min-w-0">
                      <ReviewAvatar src={review.authorImage} alt={authorName} size="md" />
                      <div className="space-y-1 min-w-0">
                        <p className="font-semibold">{authorName}</p>
                        <StarRating value={review.rating} readonly size="sm" />
                        {review.createdAt && <p className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</p>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleEditReview(review)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDeleteReview(review.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-2xl border border-border/40 bg-white/70 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">English</p>
                      <p className="text-muted-foreground italic">{review.comment}</p>
                    </div>
                    <div className="rounded-2xl border border-border/40 bg-white/70 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">French</p>
                      <p className="text-muted-foreground italic">{review.commentFr || "No French translation yet."}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}