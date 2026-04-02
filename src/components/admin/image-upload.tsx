"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { uploadImage } from "@/lib/upload";
import { toast } from "sonner";

export function ImageUpload({
  onUploaded,
}: {
  onUploaded: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        accept="image/*"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          try {
            setUploading(true);
            const url = await uploadImage(file);
            onUploaded(url);
            toast.success("Image uploaded");
          } catch (error) {
            console.error(error);
            toast.error("Upload failed");
          } finally {
            setUploading(false);
          }
        }}
      />
      <Button type="button" variant="secondary" disabled={uploading}>
        {uploading ? "Uploading..." : "Cloudinary upload"}
      </Button>
    </div>
  );
}

