"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { StarRating } from "@/components/ui/star-rating";
import { ReviewAvatar } from "@/components/review-avatar";
import { getItemById, addReview, updateReview, deleteReview, bulkAddReviews } from "@/lib/firebase/data";
import type { Item, Review } from "@/lib/types";
import { toast } from "sonner";
import { Plus, Trash2, Edit2, X } from "lucide-react";

export default function ReviewsManager() {
  const params = useParams();
  const router = useRouter();
  const itemId = params.itemId as string;

  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [jsonText, setJsonText] = useState("");

  const [formData, setFormData] = useState<Omit<Review, "id">>({
    authorName: "",
    name: "",
    authorImage: "",
    rating: 5,
    comment: "",
  });

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
      } catch (error) {
        toast.error("Failed to load item");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    void loadItem();
  }, [itemId, router]);

  const handleAddReview = async () => {
    if (!item) return;
    const authorName = formData.authorName || formData.name;
    if (!authorName || !formData.comment || formData.rating < 1) {
      toast.error("Please fill in all fields and select a rating");
      return;
    }

    try {
      setIsAddingReview(true);
      const reviewData = {
        ...formData,
        authorName: authorName,
      };
      if (editingReview?.id) {
        await updateReview(itemId, editingReview.id, reviewData);
        toast.success("Review updated successfully");
      } else {
        await addReview(itemId, reviewData);
        toast.success("Review added successfully");
      }
      
      // Reload item to see new reviews
      const updated = await getItemById(itemId);
      if (updated) setItem(updated);
      
      setFormData({ authorName: "", name: "", authorImage: "", rating: 5, comment: "" });
      setEditingReview(null);
    } catch (error) {
      toast.error(editingReview ? "Failed to update review" : "Failed to add review");
      console.error(error);
    } finally {
      setIsAddingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!item) return;
    try {
      await deleteReview(itemId, reviewId);
      toast.success("Review deleted");
      const updated = await getItemById(itemId);
      if (updated) setItem(updated);
    } catch (error) {
      toast.error("Failed to delete review");
      console.error(error);
    }
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setFormData({
      authorName: review.authorName,
      name: review.name,
      authorImage: review.authorImage,
      rating: review.rating,
      comment: review.comment,
    });
  };

  const handleBulkImport = async (file: File) => {
    try {
      setIsImporting(true);
      const text = await file.text();
      const reviews = JSON.parse(text) as Omit<Review, "id">[];

      if (!Array.isArray(reviews)) {
        toast.error("JSON must be an array of reviews");
        return;
      }

      await bulkAddReviews(itemId, reviews);
      toast.success(`${reviews.length} reviews imported successfully`);
      
      const updated = await getItemById(itemId);
      if (updated) setItem(updated);
    } catch (error) {
      toast.error("Failed to import reviews");
      console.error(error);
    } finally {
      setIsImporting(false);
    }
  };

  const handlePasteJson = async () => {
    if (!jsonText.trim()) {
      toast.error("Please paste JSON content");
      return;
    }

    try {
      setIsImporting(true);
      const reviews = JSON.parse(jsonText) as Omit<Review, "id">[];

      if (!Array.isArray(reviews)) {
        toast.error("JSON must be an array of reviews");
        return;
      }

      await bulkAddReviews(itemId, reviews);
      toast.success(`${reviews.length} reviews imported successfully`);
      
      const updated = await getItemById(itemId);
      if (updated) setItem(updated);
      setJsonText("");
    } catch (error) {
      toast.error(error instanceof SyntaxError ? "Invalid JSON format" : "Failed to import reviews");
      console.error(error);
    } finally {
      setIsImporting(false);
    }
  };

  const handleExportTemplate = () => {
    const template = [
      {
        name: "John Doe",
        authorImage: "https://example.com/photo.jpg",
        rating: 5,
        comment: "Amazing experience! Highly recommend.",
      },
      {
        name: "Jane Smith",
        authorImage: "https://example.com/photo2.jpg",
        rating: 4,
        comment: "Great service and beautiful location.",
      },
    ];

    const dataStr = JSON.stringify(template, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "reviews-template.json";
    link.click();
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
      <div>
        <h1 className="text-3xl font-bold">Reviews for {item.title}</h1>
        <p className="text-muted-foreground">Manage and add customer reviews</p>
      </div>

      {/* Add Review Form */}
      <Card className="p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold">
            {editingReview ? "Edit Review" : "Add New Review"}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
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
              onChange={(e) =>
                setFormData({ ...formData, authorImage: e.target.value })
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Rating</Label>
          <StarRating
            value={formData.rating}
            onChange={(rating) => setFormData({ ...formData, rating })}
            size="lg"
          />
        </div>

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

        <div className="flex gap-3">
          <Button
            onClick={handleAddReview}
            disabled={isAddingReview}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            {editingReview ? "Update Review" : "Add Review"}
          </Button>
          {editingReview && (
            <Button
              variant="outline"
              onClick={() => {
                setEditingReview(null);
                setFormData({
                  authorName: "",
                  name: "",
                  authorImage: "",
                  rating: 5,
                  comment: "",
                });
              }}
            >
              Cancel
            </Button>
          )}
        </div>
      </Card>

      {/* Paste JSON Reviews */}
      <Card className="p-6 space-y-4 bg-blue-50/30 border-blue-200/30">
        <div>
          <h3 className="text-lg font-semibold mb-2">Bulk Add Reviews from JSON</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Paste JSON array directly or copy-paste from your file
          </p>
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
  },
  {
    "authorName": "Jane Smith",
    "authorImage": "https://example.com/photo2.jpg",
    "rating": 4,
    "comment": "Great service"
  }
]`}
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            rows={6}
            className="font-mono text-sm"
          />
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handlePasteJson}
            disabled={isImporting || !jsonText.trim()}
            className="gap-2"
            variant="default"
          >
            <Plus className="h-4 w-4" />
            Add Reviews
          </Button>
          {jsonText && (
            <Button
              variant="ghost"
              onClick={() => setJsonText("")}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          Reviews ({item.reviews?.length || 0})
        </h2>

        {!item.reviews || item.reviews.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            No reviews yet. Add one to get started!
          </Card>
        ) : (
          <div className="grid gap-4">
            {item.reviews?.map((review) => {
              const authorName = review.authorName || review.name || "Guest";
              return (
                <Card key={review.id} className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <ReviewAvatar
                        src={review.authorImage}
                        alt={authorName}
                        size="md"
                      />
                      <div className="space-y-1">
                        <p className="font-semibold">{authorName}</p>
                        <StarRating value={review.rating} readonly size="sm" />
                        {review.createdAt && (
                          <p className="text-xs text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditReview(review)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => review.id && handleDeleteReview(review.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic">{review.comment}</p>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
