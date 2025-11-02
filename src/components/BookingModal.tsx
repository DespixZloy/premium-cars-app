import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, CheckCircle2, ChevronDown } from 'lucide-react';
import { supabase, Car, CarBrand, CarImage } from '../lib/supabase';
import { sendTelegramNotification } from '../lib/telegram';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  car: Car & { brand: CarBrand };
}

interface Country {
  code: string;
  name: string;
  flag: string;
  prefix: string;
  pattern: string;
  placeholder: string;
}

const countries: Country[] = [
  { code: 'RU', name: '', flag: '🇷🇺', prefix: '+7', pattern: '^\\+7 \\(\\d{3}\\) \\d{3}-\\d{2}-\\d{2}$', placeholder: '+7 (999) 123-45-67' },
  { code: 'KZ', name: '', flag: '🇰🇿', prefix: '+7', pattern: '^\\+7 \\(\\d{3}\\) \\d{3}-\\d{2}-\\d{2}$', placeholder: '+7 (701) 123-45-67' },
  { code: 'BY', name: '', flag: '🇧🇾', prefix: '+375', pattern: '^\\+375 \\(\\d{2}\\) \\d{3}-\\d{2}-\\d{2}$', placeholder: '+375 (29) 123-45-67' },
  { code: 'UA', name: '', flag: '🇺🇦', prefix: '+380', pattern: '^\\+380 \\(\\d{2}\\) \\d{3}-\\d{2}-\\d{2}$', placeholder: '+380 (67) 123-45-67' },
];

export function BookingModal({ isOpen, onClose, car }: BookingModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
  const [phoneError, setPhoneError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [carImages, setCarImages] = useState<CarImage[]>([]);

  // Загружаем изображения автомобиля при открытии модального окна
  useEffect(() => {
    if (isOpen && car.id) {
      loadCarImages(car.id);
    }
  }, [isOpen, car.id]);

  const loadCarImages = async (carId: string) => {
    try {
      const { data: images, error } = await supabase
        .from('car_images')
        .select('*')
        .eq('car_id', carId)
        .order('is_primary', { ascending: false })
        .order('display_order');

      if (error) {
        console.error('Error loading car images:', error);
        return;
      }

      setCarImages(images || []);
    } catch (err) {
      console.error('Error loading car images:', err);
    }
  };

  const formatPhoneNumber = (value: string, country: Country): string => {
    const digits = value.replace(/\D/g, '');
    const prefixDigits = country.prefix.replace(/\D/g, '');
    
    if (digits.startsWith(prefixDigits)) {
      const localDigits = digits.slice(prefixDigits.length);
      
      if (country.code === 'RU' || country.code === 'KZ') {
        if (localDigits.length <= 3) {
          return `${country.prefix} (${localDigits}`;
        } else if (localDigits.length <= 6) {
          return `${country.prefix} (${localDigits.slice(0,3)}) ${localDigits.slice(3)}`;
        } else if (localDigits.length <= 8) {
          return `${country.prefix} (${localDigits.slice(0,3)}) ${localDigits.slice(3,6)}-${localDigits.slice(6)}`;
        } else {
          return `${country.prefix} (${localDigits.slice(0,3)}) ${localDigits.slice(3,6)}-${localDigits.slice(6,8)}-${localDigits.slice(8,10)}`;
        }
      } else if (country.code === 'BY') {
        if (localDigits.length <= 2) {
          return `${country.prefix} (${localDigits}`;
        } else if (localDigits.length <= 5) {
          return `${country.prefix} (${localDigits.slice(0,2)}) ${localDigits.slice(2)}`;
        } else if (localDigits.length <= 7) {
          return `${country.prefix} (${localDigits.slice(0,2)}) ${localDigits.slice(2,5)}-${localDigits.slice(5)}`;
        } else {
          return `${country.prefix} (${localDigits.slice(0,2)}) ${localDigits.slice(2,5)}-${localDigits.slice(5,7)}-${localDigits.slice(7,9)}`;
        }
      } else if (country.code === 'UA') {
        if (localDigits.length <= 2) {
          return `${country.prefix} (${localDigits}`;
        } else if (localDigits.length <= 5) {
          return `${country.prefix} (${localDigits.slice(0,2)}) ${localDigits.slice(2)}`;
        } else if (localDigits.length <= 7) {
          return `${country.prefix} (${localDigits.slice(0,2)}) ${localDigits.slice(2,5)}-${localDigits.slice(5)}`;
        } else {
          return `${country.prefix} (${localDigits.slice(0,2)}) ${localDigits.slice(2,5)}-${localDigits.slice(5,7)}-${localDigits.slice(7,9)}`;
        }
      }
    }
    
    return value;
  };

  const validatePhone = (phone: string, country: Country): boolean => {
    const regex = new RegExp(country.pattern);
    return regex.test(phone);
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value, selectedCountry);
    setCustomerPhone(formatted);
    
    if (formatted && !validatePhone(formatted, selectedCountry)) {
      setPhoneError(`Введите корректный номер телефона для ${selectedCountry.code}`);
    } else {
      setPhoneError('');
    }
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setCustomerPhone(country.prefix + ' ');
    setPhoneError('');
    setShowCountryDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setPhoneError('');

    if (!validatePhone(customerPhone, selectedCountry)) {
      setPhoneError(`Введите корректный номер телефона для ${selectedCountry.code}`);
      return;
    }

    if (!customerName.trim()) {
      setError('Пожалуйста, введите ваше имя');
      return;
    }

    setLoading(true);

    try {
      const { data, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          car_id: car.id,
          customer_name: customerName.trim(),
          customer_phone: customerPhone.trim(),
          phone_country: selectedCountry.code,
          status: 'pending',
          telegram_sent: false,
        })
        .select()
        .single();

      if (bookingError) {
        console.error('❌ Ошибка базы данных:', bookingError);
        throw new Error(`Ошибка базы данных: ${bookingError.message}`);
      }

      console.log('✅ Бронирование сохранено успешно:', data.id);

      // Отправляем уведомление в Telegram с изображениями
      const telegramSent = await sendTelegramNotification({
        customerName,
        customerPhone,
        phoneCountry: selectedCountry.code,
        car: {
          ...car,
          images: carImages, // Передаем загруженные изображения
        },
      });

      if (data && telegramSent) {
        await supabase
          .from('bookings')
          .update({ telegram_sent: true })
          .eq('id', data.id);
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setCustomerName('');
        setCustomerPhone(selectedCountry.prefix + ' ');
        setPhoneError('');
        setCarImages([]);
      }, 2000);
    } catch (err: any) {
      console.error('❌ Ошибка при бронировании:', err);
      setError(err.message || 'Произошла ошибка при бронировании. Пожалуйста, попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div 
              className="bg-gradient-to-br from-gray-900 to-black rounded-2xl max-w-md w-full p-6 border border-gold/20 relative animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors duration-300"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>

              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-10 h-10 text-gold" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Успешно забронировано!</h3>
                  <p className="text-gray-400">
                    Мы свяжемся с вами в ближайшее время
                  </p>
                </motion.div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Забронировать автомобиль
                  </h2>
                  
                  <div className="mb-6 p-4 bg-gray-800/50 rounded-lg">
                    <p className="text-gold font-semibold">{car.brand.name} {car.model}</p>
                    <p className="text-2xl font-bold text-white">{car.price.toLocaleString('ru-RU')} ₽</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-gray-300 font-semibold mb-2">Ваше имя</label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        required
                        placeholder="Введите ваше имя"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-gold transition-colors duration-300"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 font-semibold mb-2">Номер телефона</label>
                      <div className="flex space-x-1">
                        <div className="relative flex-1">
                          <button
                            type="button"
                            onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                            className="w-full px-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-gold transition-colors duration-300 flex items-center justify-between"
                          >
                            <span className="flex items-center space-x-1">
                              <span className="text-lg">{selectedCountry.flag}</span>
                              <span>{selectedCountry.prefix}</span>
                            </span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${showCountryDropdown ? 'rotate-180' : ''}`} />
                          </button>
                          
                          {showCountryDropdown && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg z-10 max-h-48 overflow-y-auto">
                              {countries.map((country) => (
                                <button
                                  key={country.code}
                                  type="button"
                                  onClick={() => handleCountrySelect(country)}
                                  className="w-full px-3 py-2 text-white hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-1"
                                >
                                  <span className="text-lg">{country.flag}</span>
                                  <span className="flex-1 text-left">{country.name}</span>
                                  <span className="text-gray-400">{country.prefix}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <input
                          type="tel"
                          value={customerPhone}
                          onChange={(e) => handlePhoneChange(e.target.value)}
                          required
                          placeholder={selectedCountry.placeholder}
                          className="w-full flex-[2] px-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-gold transition-colors duration-300"
                        />
                      </div>
                      {phoneError && (
                        <p className="text-red-400 text-sm mt-2">{phoneError}</p>
                      )}
                    </div>

                    {error && (
                      <div className="flex items-center space-x-2 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                        <p className="text-red-400 text-sm">{error}</p>
                      </div>
                    )}

                    <div className="flex space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors duration-300"
                      >
                        Отмена
                      </button>
                      <button
                        type="submit"
                        disabled={loading || !!phoneError}
                        className="flex-1 py-3 bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold text-black font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                            <span>Отправка...</span>
                          </>
                        ) : (
                          'Забронировать'
                        )}
                      </button>
                    </div>
                  </form>

                  <p className="text-gray-500 text-xs mt-4 text-center">
                    Нажимая кнопку, вы соглашаетесь с условиями обработки персональных данных
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}