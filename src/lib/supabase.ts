import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface CarBrand {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  description: string | null;
  display_order: number;
  created_at: string;
}

export interface Car {
  id: string;
  brand_id: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  color: string | null;
  engine: string | null;
  transmission: string | null;
  fuel_type: string | null;
  description: string | null;
  specifications: Record<string, any>;
  status: 'available' | 'reserved' | 'sold';
  is_new_arrival: boolean;
  created_at: string;
  brand?: CarBrand;
  images?: CarImage[];
}

export interface CarImage {
  id: string;
  car_id: string;
  image_url: string;
  is_primary: boolean;
  display_order: number;
  created_at: string;
}

export interface Booking {
  id: string;
  car_id: string;
  customer_name: string;
  customer_phone: string;
  phone_country: string | null;
  booking_date: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  telegram_sent: boolean;
  created_at: string;
}

export interface Review {
  id: string;
  customer_name: string;
  rating: number;
  message: string;
  approved: boolean;
  created_at: string;
}

export interface ContactInfo {
  id: string;
  phone: string | null;
  whatsapp: string | null;
  telegram: string | null;
  instagram: string | null;
  youtube: string | null;
  address: string | null;
  yandex_map_url: string | null;
  latitude: number | null;
  longitude: number | null;
  updated_at: string;
}

export interface OrderRequest {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  phone_country: string | null;
  brand: string;
  model: string;
  budget: number | null;
  delivery_country: string | null;
  comments: string | null;
  telegram_sent: boolean;
  created_at: string;
}

export interface SellRequest {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  phone_country: string | null;
  brand: string;
  model: string;
  year: number | null;
  mileage: number | null;
  price: number | null;
  description: string | null;
  telegram_sent: boolean;
  created_at: string;
}

export interface CommissionRequest {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  phone_country: string | null;
  brand: string;
  model: string;
  year: number | null;
  price: number | null;
  telegram_sent: boolean;
  created_at: string;
}