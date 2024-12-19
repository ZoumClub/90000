"use client";

import { supabase } from "@/lib/supabase/client";
import type { SellCarFormData } from "@/lib/modules/sell-car/types";

export async function submitCarListing(formData: SellCarFormData) {
  try {
    // Set current PIN for RLS
    const { error: pinError } = await supabase.rpc('set_current_pin', { 
      pin: formData.pin 
    });

    if (pinError) throw pinError;

    // Insert car data
    const { data: car, error: carError } = await supabase
      .from("user_cars")
      .insert({
        seller_name: formData.seller_name,
        pin: formData.pin,
        brand: formData.brand,
        model: formData.model,
        year: formData.year,
        price: formData.price,
        mileage_range: formData.mileage_range,
        previous_owners: formData.previous_owners,
        fuel_type: formData.fuel_type,
        transmission: formData.transmission,
        body_type: formData.body_type,
        exterior_color: formData.exterior_color,
        interior_color: formData.interior_color
      })
      .select()
      .single();

    if (carError) throw carError;

    // Insert features
    if (formData.features.length > 0) {
      // Get feature IDs
      const { data: features, error: featuresError } = await supabase
        .from("features")
        .select("id")
        .in("name", formData.features);

      if (featuresError) throw featuresError;

      if (features && features.length > 0) {
        // Insert into junction table
        const featureRecords = features.map(feature => ({
          car_id: car.id,
          feature_id: feature.id
        }));

        const { error: linkError } = await supabase
          .from("user_car_features")
          .insert(featureRecords);

        if (linkError) throw linkError;
      }
    }

    // Store credentials
    localStorage.setItem("userPin", formData.pin);
    localStorage.setItem("userName", formData.seller_name);

    return { success: true, carId: car.id };
  } catch (error) {
    console.error("Error submitting car listing:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to submit car listing" 
    };
  }
}