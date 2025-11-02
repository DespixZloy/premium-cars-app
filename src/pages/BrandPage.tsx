import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Filter } from 'lucide-react';
import { supabase, Car, CarBrand } from '../lib/supabase';

export function BrandPage() {
  const { slug } = useParams<{ slug: string }>();
  const [brand, setBrand] = useState<CarBrand | null>(null);
  const [cars, setCars] = useState<(Car & { images: string[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceFilter, setPriceFilter] = useState<'all' | 'low' | 'mid' | 'high'>('all');

  useEffect(() => {
    if (slug) {
      loadBrandData();
    }
  }, [slug]);

  async function loadBrandData() {
    try {
      const { data: brandData, error: brandError } = await supabase
        .from('car_brands')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (brandError) throw brandError;
      if (!brandData) {
        console.error('Brand not found');
        return;
      }

      setBrand(brandData);

      const { data: carsData, error: carsError } = await supabase
        .from('cars')
        .select(`
          *,
          images:car_images(image_url, display_order)
        `)
        .eq('brand_id', brandData.id)
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (carsError) throw carsError;
      if (carsData) {
        const carsWithImages = carsData.map((car: any) => ({
          ...car,
          images: car.images
            .sort((a: any, b: any) => a.display_order - b.display_order)
            .map((img: any) => img.image_url),
        }));
        setCars(carsWithImages);
      }
    } catch (error) {
      console.error('Error loading brand data:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredCars = cars.filter((car) => {
    if (priceFilter === 'all') return true;
    if (priceFilter === 'low') return car.price < 5000000;
    if (priceFilter === 'mid') return car.price >= 5000000 && car.price < 15000000;
    if (priceFilter === 'high') return car.price >= 15000000;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-gold text-2xl">Загрузка...</div>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Бренд не найден</h1>
          <Link to="/brands" className="text-gold hover:text-gold-light">
            Вернуться к списку брендов
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-20 px-4 mt-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            {brand.logo_url ? (
              <img src={brand.logo_url} alt={brand.name} className="h-24 object-contain" />
            ) : (
              <h1 className="text-6xl font-bold text-gold">{brand.name}</h1>
            )}
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Автомобили <span className="text-gold">{brand.name}</span>
          </h1>
          {brand.description && (
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">{brand.description}</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between mb-8 flex-wrap gap-4"
        >
          <div className="text-gray-400">
            Найдено автомобилей: <span className="text-gold font-semibold">{filteredCars.length}</span>
          </div>
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gold" />
            <div className="flex space-x-2">
              {[
                { value: 'all', label: 'Все' },
                { value: 'low', label: 'До 5 млн' },
                { value: 'mid', label: '5-15 млн' },
                { value: 'high', label: 'От 15 млн' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setPriceFilter(option.value as any)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    priceFilter === option.value
                      ? 'bg-gold text-black'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {filteredCars.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-gray-400 text-xl">Автомобили этого бренда пока не добавлены</p>
            <Link
              to="/brands"
              className="inline-block mt-6 text-gold hover:text-gold-light transition-colors"
            >
              Вернуться к списку брендов
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCars.map((car, index) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -8 }}
              >
                <Link
                  to={`/car/${car.id}`}
                  className="block bg-black rounded-lg overflow-hidden border border-gold/20 hover:border-gold transition-all group hover:shadow-2xl hover:shadow-gold/30"
                >
                  <div className="relative h-64 overflow-hidden bg-gray-800">
                    {car.images[0] ? (
                      <img
                        src={car.images[0]}
                        alt={`${brand.name} ${car.model}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600">
                        No image
                      </div>
                    )}
                    {car.is_new_arrival && (
                      <div className="absolute top-4 right-4 bg-gold text-black px-3 py-1 rounded-full text-sm font-semibold">
                        NEW
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-white text-xl font-bold mb-2 group-hover:text-gold transition-colors">
                      {car.model}
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-gray-400 text-sm mb-4">
                      <div>
                        <span className="text-gray-500">Год:</span> {car.year}
                      </div>
                      <div>
                        <span className="text-gray-500">Пробег:</span> {car.mileage.toLocaleString()} км
                      </div>
                      {car.color && (
                        <div>
                          <span className="text-gray-500">Мощность:</span> {car.power}
                        </div>
                      )}
                      {car.transmission && (
                        <div>
                          <span className="text-gray-500">Объем двигателя:</span> {car.engine_volume}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between border-t border-gold/20 pt-4">
                      <span className="text-2xl font-bold text-gold">
                        {car.price.toLocaleString('ru-RU')} ₽
                      </span>
                      <ArrowRight className="w-5 h-5 text-gold group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
