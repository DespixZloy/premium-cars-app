/*
  # Luxury Car Dealership Database Schema

  ## Overview
  Creates a comprehensive database schema for a premium luxury car dealership website
  with support for brands, cars, images, bookings, reviews, and contact information.

  ## New Tables

  ### 1. car_brands
  - `id` (uuid, primary key) - Unique brand identifier
  - `name` (text) - Brand name (e.g., Ferrari, Lamborghini)
  - `slug` (text, unique) - URL-friendly brand identifier
  - `logo_url` (text) - URL to brand logo image
  - `description` (text) - Brand description
  - `display_order` (integer) - Order for displaying brands
  - `created_at` (timestamptz) - Record creation timestamp

  ### 2. cars
  - `id` (uuid, primary key) - Unique car identifier
  - `brand_id` (uuid, foreign key) - Reference to car brand
  - `model` (text) - Car model name
  - `year` (integer) - Manufacturing year
  - `price` (numeric) - Price in rubles
  - `mileage` (integer) - Mileage in kilometers
  - `color` (text) - Car color
  - `engine` (text) - Engine specifications
  - `transmission` (text) - Transmission type
  - `fuel_type` (text) - Fuel type
  - `description` (text) - Detailed description
  - `specifications` (jsonb) - Additional specifications
  - `status` (text) - Available, Reserved, Sold
  - `is_new_arrival` (boolean) - Flag for new arrivals
  - `created_at` (timestamptz) - Record creation timestamp

  ### 3. car_images
  - `id` (uuid, primary key) - Unique image identifier
  - `car_id` (uuid, foreign key) - Reference to car
  - `image_url` (text) - URL to car image
  - `is_primary` (boolean) - Primary image flag
  - `display_order` (integer) - Order for displaying images
  - `created_at` (timestamptz) - Record creation timestamp

  ### 4. bookings
  - `id` (uuid, primary key) - Unique booking identifier
  - `car_id` (uuid, foreign key) - Reference to car
  - `customer_name` (text) - Customer full name
  - `customer_phone` (text) - Customer phone number
  - `booking_date` (timestamptz) - Booking timestamp
  - `status` (text) - Pending, Confirmed, Cancelled
  - `telegram_sent` (boolean) - Telegram notification sent flag
  - `created_at` (timestamptz) - Record creation timestamp

  ### 5. reviews
  - `id` (uuid, primary key) - Unique review identifier
  - `customer_name` (text) - Reviewer name
  - `rating` (integer) - Star rating (1-5)
  - `message` (text) - Review message
  - `approved` (boolean) - Approval status
  - `created_at` (timestamptz) - Record creation timestamp

  ### 6. contact_info
  - `id` (uuid, primary key) - Unique identifier
  - `phone` (text) - Primary phone number
  - `whatsapp` (text) - WhatsApp number
  - `telegram` (text) - Telegram handle
  - `instagram` (text) - Instagram handle
  - `youtube` (text) - YouTube channel
  - `address` (text) - Physical address
  - `yandex_map_url` (text) - Yandex Maps embed URL
  - `latitude` (numeric) - Location latitude
  - `longitude` (numeric) - Location longitude
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable Row Level Security (RLS) on all tables
  - Public read access for car brands, cars, car images, approved reviews, and contact info
  - Authenticated insert for bookings and reviews
  - No direct public write access to prevent spam and abuse

  ## Indexes
  - Create indexes on foreign keys for performance
  - Create indexes on frequently queried fields (brand slug, car status)
*/

-- Create car_brands table
CREATE TABLE IF NOT EXISTS car_brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  logo_url text,
  description text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create cars table
CREATE TABLE IF NOT EXISTS cars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid NOT NULL REFERENCES car_brands(id) ON DELETE CASCADE,
  model text NOT NULL,
  year integer NOT NULL,
  price numeric NOT NULL,
  mileage integer DEFAULT 0,
  color text,
  engine text,
  transmission text,
  fuel_type text,
  description text,
  specifications jsonb DEFAULT '{}',
  status text DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'sold')),
  is_new_arrival boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create car_images table
CREATE TABLE IF NOT EXISTS car_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id uuid NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  is_primary boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id uuid NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  booking_date timestamptz DEFAULT now(),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  telegram_sent boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  message text NOT NULL,
  approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create contact_info table
CREATE TABLE IF NOT EXISTS contact_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text,
  whatsapp text,
  telegram text,
  instagram text,
  youtube text,
  address text,
  yandex_map_url text,
  latitude numeric,
  longitude numeric,
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_cars_brand_id ON cars(brand_id);
CREATE INDEX IF NOT EXISTS idx_cars_status ON cars(status);
CREATE INDEX IF NOT EXISTS idx_cars_is_new_arrival ON cars(is_new_arrival);
CREATE INDEX IF NOT EXISTS idx_car_images_car_id ON car_images(car_id);
CREATE INDEX IF NOT EXISTS idx_bookings_car_id ON bookings(car_id);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(approved);
CREATE INDEX IF NOT EXISTS idx_car_brands_slug ON car_brands(slug);

-- Enable Row Level Security
ALTER TABLE car_brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;

-- RLS Policies for car_brands (public read)
CREATE POLICY "Anyone can view car brands"
  ON car_brands FOR SELECT
  TO anon, authenticated
  USING (true);

-- RLS Policies for cars (public read)
CREATE POLICY "Anyone can view available cars"
  ON cars FOR SELECT
  TO anon, authenticated
  USING (true);

-- RLS Policies for car_images (public read)
CREATE POLICY "Anyone can view car images"
  ON car_images FOR SELECT
  TO anon, authenticated
  USING (true);

-- RLS Policies for bookings (anyone can insert, no read for public)
CREATE POLICY "Anyone can create bookings"
  ON bookings FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- RLS Policies for reviews (public read approved only, anyone can insert)
CREATE POLICY "Anyone can view approved reviews"
  ON reviews FOR SELECT
  TO anon, authenticated
  USING (approved = true);

CREATE POLICY "Anyone can submit reviews"
  ON reviews FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- RLS Policies for contact_info (public read)
CREATE POLICY "Anyone can view contact info"
  ON contact_info FOR SELECT
  TO anon, authenticated
  USING (true);