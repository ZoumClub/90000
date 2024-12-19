"use client";

import { useState, useCallback, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { validateImageFile } from "@/lib/utils/validation";
import type { SellCarFormData } from "@/lib/modules/sell-car/types";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_IMAGES = 3;

export function useImageUpload(form: UseFormReturn<SellCarFormData>) {
  const [previews, setPreviews] = useState<string[]>([]);

  const validateFiles = useCallback((files: File[]) => {
    const validFiles: File[] = [];
    const invalidFiles: File[] = [];

    files.forEach(file => {
      const validation = validateImageFile(file, MAX_IMAGE_SIZE);
      if (!validation.isValid) {
        invalidFiles.push(file);
      } else {
        validFiles.push(file);
      }
    });

    if (invalidFiles.length > 0) {
      toast.error(`${invalidFiles.length} image(s) exceed the ${MAX_IMAGE_SIZE / (1024 * 1024)}MB limit`);
    }

    return validFiles;
  }, []);

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remainingSlots = MAX_IMAGES - previews.length;
    
    if (files.length > remainingSlots) {
      toast.error(`You can only add ${remainingSlots} more image(s)`);
      return;
    }

    const validFiles = validateFiles(files);
    if (validFiles.length === 0) return;

    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);

    const currentFiles = form.getValues("images") || [];
    form.setValue("images", [...currentFiles, ...validFiles], { shouldValidate: true });
  }, [form, previews.length, validateFiles]);

  useEffect(() => {
    return () => {
      previews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, [previews]);

  return {
    previews,
    handleUpload,
    isMaxImagesReached: previews.length >= MAX_IMAGES
  };
}