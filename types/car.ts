"use client";

export interface BaseCar {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage_range: string;
  fuel_type: string;
  transmission: string;
  body_type: string;
  exterior_color: string;
  interior_color: string;
  features: string[];
  images?: string[];
  video?: string;
  created_at: string;
  updated_at: string;
}

export interface DealerCar extends BaseCar {
  dealer_id: string;
  savings?: number;
  type: 'new' | 'used';
  dealer?: {
    name: string;
    phone: string;
    whatsapp?: string;
  };
}

export interface UserCar extends BaseCar {
  seller_name: string;
  pin: string;
  previous_owners: number;
  bids?: {
    id: string;
    amount: number;
    created_at: string;
    dealer?: {
      name: string;
      phone: string;
      whatsapp?: string;
    };
  }[];
}