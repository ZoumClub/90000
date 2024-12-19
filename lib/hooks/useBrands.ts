"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import type { Brand } from "@/types/brand";

export function useBrands() {
  const [data, setData] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data: brands, error } = await supabase
        .from("brands")
        .select("*")
        .eq("is_visible", true)
        .neq("name", "All Brands") // Exclude "All Brands"
        .order("order_index");

      if (error) throw error;
      setData(brands || []);
    } catch (err) {
      console.error("Error fetching brands:", err);
      setError(err instanceof Error ? err : new Error("Failed to fetch brands"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, isLoading, error, refresh };
}