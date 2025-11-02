import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, Gauge, Palette, Fuel, Settings, ArrowLeft, X, TrendingUp } from 'lucide-react';
import { supabase, Car, CarBrand } from '../lib/supabase';
import { BookingModal } from '../components/BookingModal';

export function CarPage() {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<(Car & { brand: CarBrand; images: string[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadCar();
    }
  }, [id]);

  async function loadCar() {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select(`
          *,
          brand:car_brands(*),
          images:car_images(image_url, display_order)
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        const carWithImages = {
          ...data,
          brand: data.brand,
          images: data.images
            .sort((a: any, b: any) => a.display_order - b.display_order)
            .map((img: any) => img.image_url),
        };
        setCar(carWithImages);
      }
    } catch (error) {
      console.error('Error loading car:', error);
    } finally {
      setLoading(false);
    }
  }

  const nextImage = () => {
    if (car && car.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % car.images.length);
      setImageLoading(true);
    }
  };

  const prevImage = () => {
    if (car && car.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + car.images.length) % car.images.length);
      setImageLoading(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Автомобиль не найден</h1>
          <Link to="/brands" className="text-gold hover:text-gold-light">
            Вернуться к каталогу
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-black">
        <div className="max-w-7xl mx-auto px-4 mt-12 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link
              to={`/brand/${car.brand.slug}`}
              className="inline-flex items-center space-x-2 text-gray-400 hover:text-gold transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Вернуться к {car.brand.name}</span>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery - улучшенная версия из первого проекта */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <div 
                className="relative rounded-2xl overflow-hidden bg-gray-900 aspect-video cursor-pointer"
                onClick={() => setImageModalOpen(true)}
              >
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                <img
                  src={car.images[currentImageIndex]}
                  alt={car.model}
                  className="w-full h-full object-cover animate-fade-in"
                  onLoad={() => setImageLoading(false)}
                  onError={() => setImageLoading(false)}
                />
                <div className="absolute top-4 right-4">
                  <span className="px-4 py-2 bg-gold text-black font-bold rounded-full text-sm">
                    В наличии
                  </span>
                </div>
              </div>

              {car.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {car.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setImageLoading(true);
                        setCurrentImageIndex(index);
                      }}
                      className={`relative rounded-lg overflow-hidden aspect-video transition-all duration-300 ${
                        currentImageIndex === index
                          ? 'ring-2 ring-gold scale-95'
                          : 'hover:ring-2 hover:ring-gray-600'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${car.model} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div>
                <div className="text-gold text-sm font-semibold mb-2">{car.brand.name}</div>
                <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">{car.model}</h1>
                <div className="text-4xl font-bold text-gold mb-6">
                  {car.price.toLocaleString('ru-RU')} ₽
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex bg-gradient-to-br from-gray-900 to-black border border-gold/20 rounded-xl p-4 hover:border-gold/50 transition-colors duration-300">
                  <div className="flex items-center align-center space-x-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Год выпуска</p>
                      <p className="text-white font-semibold">{car.year}</p>
                    </div>
                  </div>
                </div>
                <div className="flex bg-gradient-to-br from-gray-900 to-black border border-gold/20 rounded-xl p-4 hover:border-gold/50 transition-colors duration-300">
                  <div className="flex items-center align-center space-x-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                      <Gauge className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Пробег</p>
                      <p className="text-white font-semibold">{car.mileage.toLocaleString()} км</p>
                    </div>
                  </div>
                </div>
                {car.power && (
                  <div className="flex bg-gradient-to-br from-gray-900 to-black border border-gold/20 rounded-xl p-4 hover:border-gold/50 transition-colors duration-300">
                    <div className="flex items-center align-center space-x-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Мощность</p>
                        <p className="text-white font-semibold">{car.power}</p>
                      </div>
                    </div>
                  </div>
                )}
                {car.engine_volume && (
                  <div className="flex bg-gradient-to-br from-gray-900 to-black border border-gold/20 rounded-xl p-4 hover:border-gold/50 transition-colors duration-300">
                    <div className="flex items-center align-center space-x-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                        <Settings className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Объем двигателя</p>
                        <p className="text-white font-semibold">{car.engine_volume}</p>
                      </div>
                    </div>
                  </div>
                )}
                {car.engine && (
                  <div className="flex bg-gradient-to-br from-gray-900 to-black border border-gold/20 rounded-xl p-4 hover:border-gold/50 transition-colors duration-300">
                    <div className="flex items-center align-center space-x-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                        <Settings className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Двигатель</p>
                        <p className="text-white font-semibold">{car.engine}</p>
                      </div>
                    </div>
                  </div>
                )}
                {car.fuel_type && (
                  <div className="flex bg-gradient-to-br from-gray-900 to-black border border-gold/20 rounded-xl p-4 hover:border-gold/50 transition-colors duration-300">
                    <div className="flex items-center align-center space-x-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                        <Fuel className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Топливо</p>
                        <p className="text-white font-semibold">{car.fuel_type}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {car.description && (
                <div className="bg-gradient-to-br from-gray-900 to-black border border-gold/20 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-3">Описание</h3>
                  <p className="text-gray-400 leading-relaxed">{car.description}</p>
                </div>
              )}

              <button
                onClick={() => setBookingModalOpen(true)}
                className="w-full py-4 bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold text-black font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-gold/50"
              >
                Забронировать автомобиль
              </button>

              <div className="bg-gradient-to-br from-gray-900 to-black border border-gold/20 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Контакты</h3>
                <div className="space-y-3 text-gray-400">
                  <div>
                    <span className="text-white font-semibold">Телефон:</span>{' '}
                    <a href="tel:+74951234567" className="text-gold hover:text-gold-light transition-colors">
                      +7 (495) 123-45-67
                    </a>
                  </div>
                  <div>
                    <span className="text-white font-semibold">Адрес:</span> Москва, Кутузовский проспект, д. 36, стр. 1
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Image Modal - улучшенная версия из первого проекта */}
      {imageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
          <div className="relative max-w-6xl max-h-full">
            <button
              onClick={() => setImageModalOpen(false)}
              className="absolute -top-12 right-0 w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors duration-300 z-10"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
            
            <div className="relative rounded-2xl overflow-hidden bg-gray-900">
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              <img
                src={car.images[currentImageIndex]}
                alt={car.model}
                className="max-w-full max-h-[80vh] object-contain animate-fade-in"
                onLoad={() => setImageLoading(false)}
              />
              
              {car.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                    {car.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setImageLoading(true);
                          setCurrentImageIndex(index);
                        }}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentImageIndex ? 'bg-gold w-8' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {car && (
        <BookingModal
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
          car={car}
        />
      )}
    </>
  );
}