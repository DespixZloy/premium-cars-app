import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, MapPin, Clock, ChevronDown } from 'lucide-react';
import { supabase, Car, CarBrand } from '../lib/supabase';

export function HomePage() {
  const [brands, setBrands] = useState<CarBrand[]>([]);
  const [newArrivals, setNewArrivals] = useState<(Car & { brand: CarBrand; images: string[] })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const scrollToBrands = () => {
    document.getElementById('brands-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  async function loadData() {
    try {
      const [brandsRes, carsRes] = await Promise.all([
        supabase.from('car_brands').select('*').order('display_order').limit(8),
        supabase
          .from('cars')
          .select(`
            *,
            brand:car_brands(*),
            images:car_images(image_url, display_order)
          `)
          .eq('is_new_arrival', true)
          .eq('status', 'available')
          .order('created_at', { ascending: false })
          .limit(6),
      ]);

      if (brandsRes.data) setBrands(brandsRes.data);
      if (carsRes.data) {
        const carsWithImages = carsRes.data.map((car: any) => ({
          ...car,
          brand: car.brand,
          images: car.images
            .sort((a: any, b: any) => a.display_order - b.display_order)
            .map((img: any) => img.image_url),
        }));
        setNewArrivals(carsWithImages);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-black">
      {/* Hero Section - улучшенная версия из первого проекта */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold rounded-full filter blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/80 rounded-full filter blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto w-full">
          <div className="mb-6 animate-fade-in">
            <span className="inline-block px-6 py-2 bg-gold/20 border border-gold/30 rounded-full text-gold text-sm font-semibold tracking-widest uppercase backdrop-blur-sm">
              Премиум автомобили
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-white mb-6 animate-fade-in-up">
            Роскошь в
            <span className="block bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
              Каждой Детали
            </span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Эксклюзивная коллекция премиальных автомобилей мировых брендов.
            Ваша мечта начинается здесь.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Link
              to="/#/brands"
              className="group px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold text-black font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-gold/50 flex items-center justify-center space-x-2 min-w-[200px]"
            >
              <span>Выбрать автомобиль</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/#/contacts"
              className="group px-6 sm:px-8 py-3 sm:py-4 bg-transparent border-2 border-gold text-gold hover:bg-gold hover:text-black font-semibold rounded-full transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 min-w-[200px]"
            >
              <span>Связаться с нами</span>
            </Link>
          </div>
        </div>

        <button
          onClick={scrollToBrands}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce cursor-pointer hover:text-gold transition-colors duration-300"
        >
          <ChevronDown className="w-8 h-8" />
        </button>
      </section>

      {/* Brands Section */}
      <section id="brands-section" className="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Выберите <span className="text-gold">бренд</span>
            </h2>
            <p className="text-gray-400 text-lg">Лучшие мировые производители автомобилей</p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-800 rounded-lg h-40 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {brands.map((brand, index) => (
                <motion.div
                  key={brand.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Link
                    to={`/#/brand/${brand.slug}`}
                    className="block bg-gray-900 rounded-lg p-6 border border-gold/20 hover:border-gold transition-all group hover:shadow-lg hover:shadow-gold/30 h-full"
                  >
                    <div className="flex items-center justify-center h-20 mb-4">
                      {brand.logo_url ? (
                        <img 
                          src={brand.logo_url} 
                          alt={brand.name} 
                          className="h-16 object-contain group-hover:scale-110 transition-transform duration-300" 
                        />
                      ) : (
                        <div className="text-2xl font-bold text-gold group-hover:animate-glow">
                          {brand.name}
                        </div>
                      )}
                    </div>
                    <h3 className="text-white text-center font-semibold text-lg group-hover:text-gold transition-colors">
                      {brand.name}
                    </h3>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/#/brands"
              className="inline-flex items-center space-x-2 text-gold hover:text-gold-light transition-colors font-semibold"
            >
              <span>Посмотреть все бренды</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Новые <span className="text-gold">поступления</span>
            </h2>
            <p className="text-gray-400 text-lg">Эксклюзивные автомобили, только что прибывшие в наш салон</p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-800 rounded-lg h-96 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {newArrivals.map((car, index) => (
                <motion.div
                  key={car.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="group"
                >
                  <Link
                    to={`/#/car/${car.id}`}
                    className="block bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-gold/30 border border-gold/20 hover:border-gold/50"
                  >
                    <div className="relative h-64 overflow-hidden">
                      {car.images[0] ? (
                        <img
                          src={car.images[0]}
                          alt={`${car.brand.name} ${car.model}`}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600 bg-gray-800">
                          No image
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 bg-gold text-black font-bold rounded-full text-sm">
                          NEW
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="text-gold text-sm font-semibold mb-2">{car.brand.name}</div>
                      <h3 className="text-white text-xl font-bold mb-2 group-hover:text-gold transition-colors">
                        {car.model}
                      </h3>
                      <div className="flex items-center justify-between text-gray-400 text-sm mb-4">
                        <span>{car.year} год</span>
                        <span>{car.mileage.toLocaleString()} км</span>
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
      </section>

      {/* About Section */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                О <span className="text-gold">нашем салоне</span>
              </h2>
              <p className="text-gray-400 text-lg mb-6">
                LUXURY MOTORS - это эксклюзивный автосалон премиальных автомобилей в самом центре Москвы.
                Мы специализируемся на продаже автомобилей класса люкс от ведущих мировых производителей.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-gold/10 p-3 rounded-lg">
                    <Star className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Эксклюзивные автомобили</h3>
                    <p className="text-gray-400 text-sm">
                      Только проверенные премиальные автомобили с полной историей
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-gold/10 p-3 rounded-lg">
                    <Clock className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Работаем без выходных</h3>
                    <p className="text-gray-400 text-sm">
                      Ежедневно с 9:00 до 21:00, всегда готовы помочь вам
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-gold/10 p-3 rounded-lg">
                    <MapPin className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Удобное расположение</h3>
                    <p className="text-gray-400 text-sm">
                      Москва, Кутузовский проспект, д. 36, стр. 1
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 0 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative h-96 lg:h-full"
            >
              <div className="w-full h-full rounded-lg overflow-hidden border border-gold/20">
                <iframe
                  src="https://yandex.ru/map-widget/v1/?um=constructor%3A86b7faf501b120bfdeb4f5d0b95c01856fa6de8af4211be00140eb78b1b22ae2&amp;source=constructor"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  className="grayscale hover:grayscale-0 transition-all duration-500"
                  title="Яндекс Карта"
                ></iframe>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}