import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { supabase, CarBrand } from '../lib/supabase';

export function BrandsPage() {
  const [brands, setBrands] = useState<CarBrand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBrands();
  }, []);

  async function loadBrands() {
    try {
      const { data, error } = await supabase
        .from('car_brands')
        .select('*')
        .order('display_order');

      if (error) throw error;
      if (data) setBrands(data);
    } catch (error) {
      console.error('Error loading brands:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
            Выберите <span className="text-gold">бренд</span>
          </h1>
          <p className="text-gray-400 text-xl max-w-3xl mx-auto">
            Представляем вашему вниманию эксклюзивную коллекцию премиальных автомобилей
            от ведущих мировых производителей
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-lg h-64 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {brands.map((brand, index) => (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                whileHover={{ y: -8 }}
              >
                <Link
                  to={`/brand/${brand.slug}`}
                  className="block bg-gray-900 rounded-lg p-8 border border-gold/20 hover:border-gold transition-all group hover:shadow-2xl hover:shadow-gold/30 h-full"
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="h-32 mt-6 mb-6 flex items-center justify-center">
                      {brand.logo_url ? (
                        <img
                          src={brand.logo_url}
                          alt={brand.name}
                          className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="text-5xl font-bold text-gold group-hover:animate-glow">
                          {brand.name}
                        </div>
                      )}
                    </div>
                    <h2 className="text-white text-2xl font-bold text-center mb-2 group-hover:text-gold transition-colors">
                      {brand.name}
                    </h2>
                    {brand.description && (
                      <p className="text-gray-400 text-sm text-center mb-4">
                        {brand.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-2 text-gold group-hover:text-gold-light transition-colors">
                      <span className="text-sm font-semibold">Смотреть модели</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && brands.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-gray-400 text-xl">Бренды пока не добавлены</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
