export interface Accessory {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url: string;
  provider_name: string;
  contact_number: string;
  whatsapp_number?: string;
  created_at: string;
  updated_at: string;
}