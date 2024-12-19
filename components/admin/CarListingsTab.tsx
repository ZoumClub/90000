"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { useDealerCars } from "@/lib/hooks/useDealerCars";
import { DealerCarDialog } from "./dialogs/DealerCarDialog";
import { columns } from "./columns/carListingsColumns";
import { useVisibilityToggle } from "@/lib/hooks/useVisibilityToggle";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/client";
import type { DealerCar } from "@/types/dealerCar";
import type { CarStatus } from "@/lib/modules/cars/constants";

export function CarListingsTab() {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedCar, setSelectedCar] = useState<DealerCar | null>(null);
  const { cars, isLoading, error, refresh } = useDealerCars();
  const { toggleVisibility } = useVisibilityToggle({
    table: "dealer_cars",
    onSuccess: refresh,
  });

  const handleEdit = (car: DealerCar) => {
    setSelectedCar(car);
    setShowDialog(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("dealer_cars").delete().eq("id", id);

      if (error) throw error;
      toast.success("Car listing deleted successfully");
      refresh();
    } catch (error) {
      console.error("Error deleting car:", error);
      toast.error("Failed to delete car listing");
    }
  };

  const handleStatusChange = async (id: string, newStatus: CarStatus) => {
    try {
      const { error } = await supabase
        .from("dealer_cars")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;
      toast.success(`Car status updated to ${newStatus}`);
      refresh();
    } catch (error) {
      console.error("Error updating car status:", error);
      toast.error("Failed to update car status");
    }
  };

  const handleClose = () => {
    setSelectedCar(null);
    setShowDialog(false);
    refresh();
  };

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        Failed to load cars. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Car Listings</h2>
        <Button onClick={() => setShowDialog(true)}>Add New Listing</Button>
      </div>

      <DataTable
        columns={columns}
        data={cars || []}
        meta={{
          onViewDetails: (car: DealerCar) => {
            setSelectedCar(car);
            setShowDialog(true);
          },
          onStatusChange: handleStatusChange,
          onDelete: handleDelete,
        }}
      />

      <DealerCarDialog open={showDialog} onClose={handleClose} car={selectedCar} />
    </div>
  );
}
