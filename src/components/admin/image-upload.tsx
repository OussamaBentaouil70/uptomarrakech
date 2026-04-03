"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { uploadImage } from "@/lib/upload";
import { toast } from "sonner";
import { Upload, ImageIcon, Loader2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function ImageUpload({
  onUploaded,
  className,
  multiple = false,
  label = "Upload Image",
}: {
  onUploaded: (url: string | string[]) => void;
  className?: string;
  multiple?: boolean;
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      
      if (multiple) {
        const fileArray = Array.from(files);
        const urls = await Promise.all(fileArray.map(file => uploadImage(file)));
        onUploaded(urls);
        toast.success(`${urls.length} images uploaded successfully`);
      } else {
        const url = await uploadImage(files[0]);
        onUploaded(url);
        toast.success("Image uploaded successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("relative group", className)}>
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        multiple={multiple}
        onChange={handleUpload}
        className="hidden"
      />
      
      <button
        type="button"
        disabled={uploading}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "w-full flex flex-col items-center justify-center gap-3 py-10 px-6 rounded-3xl border-2 border-dashed transition-all duration-300",
          "bg-muted/5 border-border/60 hover:bg-primary/5 hover:border-primary/40",
          uploading && "opacity-60 cursor-not-allowed"
        )}
      >
        <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
          {uploading ? (
            <Loader2 className="h-7 w-7 animate-spin" />
          ) : (
            <Upload className="h-7 w-7" />
          )}
        </div>
        
        <div className="text-center space-y-1">
          <p className="font-semibold text-sm">{uploading ? "Transmitting Media..." : label}</p>
          <p className="text-xs text-muted-foreground italic font-serif">JPG, PNG or WebP • Max 5MB</p>
        </div>
        
        {!uploading && (
          <div className="mt-2 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white border border-border/40 text-[10px] font-bold uppercase tracking-widest text-primary shadow-sm group-hover:shadow-md transition-all">
            <Plus className="h-3 w-3" /> Browse Library
          </div>
        )}
      </button>
    </div>
  );
}

