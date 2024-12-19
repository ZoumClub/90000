"use client";

import { useState, useCallback, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { validateVideoFile } from "@/lib/utils/validation";
import type { SellCarFormData } from "@/lib/modules/sell-car/types";

const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

export function useVideoUpload(form: UseFormReturn<SellCarFormData>) {
  const [preview, setPreview] = useState<string | null>(null);

  const validateFile = useCallback((file: File): boolean => {
    const validation = validateVideoFile(file, MAX_VIDEO_SIZE);
    if (!validation.isValid) {
      toast.error(validation.error || `Video must be less than ${MAX_VIDEO_SIZE / (1024 * 1024)}MB`);
      return false;
    }
    return true;
  }, []);

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateFile(file)) return;

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    const newPreview = URL.createObjectURL(file);
    setPreview(newPreview);
    form.setValue("video", file, { shouldValidate: true });
  }, [form, preview, validateFile]);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return {
    preview,
    handleUpload
  };
}