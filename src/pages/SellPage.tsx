import { useState } from 'react';
import { motion } from 'framer-motion';
import { Car, Loader2, CheckCircle2, Phone, Mail, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { sendSellTelegramNotification } from '../lib/telegram';

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

export function SellPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    brand: '',
    model: '',
    year: '',
    mileage: '',
    price: '',
    description: '',
  });
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

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
    setFormData(prev => ({ ...prev, phone: formatted }));
    
    if (formatted && !validatePhone(formatted, selectedCountry)) {
      setPhoneError(`Введите корректный номер телефона для ${selectedCountry.code}`);
    } else {
      setPhoneError('');
    }
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setFormData(prev => ({ ...prev, phone: country.prefix + ' ' }));
    setPhoneError('');
    setShowCountryDropdown(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      handlePhoneChange(value);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validatePhone(formData.phone, selectedCountry)) {
      setPhoneError(`Введите корректный номер телефона для ${selectedCountry.code}`);
      return;
    }

    if (!formData.name.trim() || !formData.brand.trim() || !formData.model.trim()) {
      setError('Пожалуйста, заполните все обязательные поля (имя, марка, модель)');
      return;
    }

    setSubmitting(true);

    try {
      // Подготавливаем данные для вставки
      const sellData = {
        customer_name: formData.name.trim(),
        customer_phone: formData.phone.trim(),
        customer_email: formData.email ? formData.email.trim() : null,
        phone_country: selectedCountry.code,
        brand: formData.brand.trim(),
        model: formData.model.trim(),
        year: formData.year ? parseInt(formData.year) : null,
        mileage: formData.mileage ? parseInt(formData.mileage) : null,
        price: formData.price ? parseFloat(formData.price) : null,
        description: formData.description ? formData.description.trim() : null,
        telegram_sent: false,
      };

      console.log('📤 Отправка данных на выкуп:', sellData);

      // Сохраняем данные в базу данных
      const { data, error: submitError } = await supabase
        .from('sell_requests')
        .insert([sellData])
        .select();

      if (submitError) {
        console.error('❌ Ошибка базы данных:', submitError);
        throw new Error(`Ошибка базы данных: ${submitError.message}`);
      }

      console.log('✅ Заявка на выкуп сохранена успешно:', data[0].id);

      // Отправляем уведомление в Telegram
      const telegramData = {
        customerName: formData.name,
        customerPhone: formData.phone,
        customerEmail: formData.email || undefined,
        phoneCountry: selectedCountry.code,
        brand: formData.brand,
        model: formData.model,
        year: formData.year ? parseInt(formData.year) : undefined,
        mileage: formData.mileage ? parseInt(formData.mileage) : undefined,
        price: formData.price ? parseFloat(formData.price) : undefined,
        description: formData.description || undefined,
      };

      console.log('📨 Отправка уведомления в Telegram...');
      
      const telegramSent = await sendSellTelegramNotification(telegramData);

      // Обновляем статус отправки в Telegram если нужно
      if (telegramSent && data[0]) {
        try {
          await supabase
            .from('sell_requests')
            .update({ telegram_sent: true })
            .eq('id', data[0].id);
          console.log('✅ Статус Telegram обновлен');
        } catch (updateError) {
          console.warn('⚠️ Не удалось обновить статус Telegram:', updateError);
        }
      }

      // Успех!
      setSuccess(true);
      
      // Сбрасываем форму
      setFormData({
        name: '',
        phone: selectedCountry.prefix + ' ',
        email: '',
        brand: '',
        model: '',
        year: '',
        mileage: '',
        price: '',
        description: '',
      });
      setPhoneError('');

      // Автоматически скрываем успешное сообщение через 5 секунд
      setTimeout(() => {
        setSuccess(false);
      }, 5000);

    } catch (err: any) {
      console.error('❌ Ошибка при отправке заявки:', err);
      setError(err.message || 'Произошла неизвестная ошибка при отправке заявки. Пожалуйста, попробуйте еще раз.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
            Продать <span className="text-gold">автомобиль</span>
          </h1>
          <p className="text-gray-400 text-xl max-w-3xl mx-auto">
            Мы предлагаем выгодные условия выкупа автомобилей премиум-класса.
            Оценка и оформление в день обращения.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="bg-gray-900 rounded-lg p-6 border border-gold/20 text-center"
          >
            <div className="bg-gold/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Car className="w-8 h-8 text-gold" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Быстрая оценка</h3>
            <p className="text-gray-400 text-sm">Оценим ваш автомобиль в течение 30 минут</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-gray-900 rounded-lg p-6 border border-gold/20 text-center"
          >
            <div className="bg-gold/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-gold" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Честная цена</h3>
            <p className="text-gray-400 text-sm">Предложим максимальную цену за ваш автомобиль</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-gray-900 rounded-lg p-6 border border-gold/20 text-center"
          >
            <div className="bg-gold/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-gold" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Полное сопровождение</h3>
            <p className="text-gray-400 text-sm">Поможем с оформлением всех документов</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-gray-900 rounded-lg p-8 border border-gold/20"
        >
          <h2 className="text-3xl font-bold text-white mb-6">Заполните форму</h2>

          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gold/10 border border-gold/20 rounded-lg p-4 mb-6 flex items-start space-x-3"
            >
              <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-gold font-semibold mb-1">Заявка успешно отправлена!</p>
                <p className="text-gray-400 text-sm">
                  Наш менеджер свяжется с вами в ближайшее время для оценки автомобиля
                </p>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6"
            >
              <p className="text-red-400 text-sm">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Ваше имя *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-black border border-gold/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold transition-colors"
                  placeholder="Иван Иванов"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                  Телефон *
                </label>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <button
                      type="button"
                      onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                      className="w-full px-4 py-3 bg-black border border-gold/20 rounded-lg text-white focus:outline-none focus:border-gold transition-colors flex items-center justify-between"
                    >
                      <span className="flex items-center space-x-2">
                        <span className="text-lg">{selectedCountry.flag}</span>
                        <span className="text-sm">{selectedCountry.prefix}</span>
                      </span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${showCountryDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {showCountryDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-black border border-gold/20 rounded-lg z-10 max-h-48 overflow-y-auto">
                        {countries.map((country) => (
                          <button
                            key={country.code}
                            type="button"
                            onClick={() => handleCountrySelect(country)}
                            className="w-full px-4 py-2 text-white hover:bg-gray-800 transition-colors duration-200 flex items-center space-x-3"
                          >
                            <span className="text-lg">{country.flag}</span>
                            <span className="flex-1 text-left text-sm">{country.name}</span>
                            <span className="text-gray-400 text-sm">{country.prefix}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder={selectedCountry.placeholder}
                    className="flex-[2] px-4 py-3 bg-black border border-gold/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold transition-colors"
                  />
                </div>
                {phoneError && (
                  <p className="text-red-400 text-sm mt-2">{phoneError}</p>
                )}
              </div>

             <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black border border-gold/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold transition-colors"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-300 mb-2">
                  Марка *
                </label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-black border border-gold/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold transition-colors"
                  placeholder="Mercedes-Benz"
                />
              </div>

              <div>
                <label htmlFor="model" className="block text-sm font-medium text-gray-300 mb-2">
                  Модель *
                </label>
                <input
                  type="text"
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-black border border-gold/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold transition-colors"
                  placeholder="S-Class"
                />
              </div>

              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-300 mb-2">
                  Год выпуска *
                </label>
                <input
                  type="number"
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                  min="1990"
                  max={new Date().getFullYear() + 1}
                  className="w-full px-4 py-3 bg-black border border-gold/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold transition-colors"
                  placeholder="2023"
                />
              </div>

              <div>
                <label htmlFor="mileage" className="block text-sm font-medium text-gray-300 mb-2">
                  Пробег (км) *
                </label>
                <input
                  type="number"
                  id="mileage"
                  name="mileage"
                  value={formData.mileage}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-3 bg-black border border-gold/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold transition-colors"
                  placeholder="25000"
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-2">
                  Желаемая цена (₽)
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 bg-black border border-gold/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold transition-colors"
                  placeholder="5000000"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                Дополнительная информация
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 bg-black border border-gold/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold transition-colors resize-none"
                placeholder="Расскажите о состоянии автомобиля, комплектации, истории обслуживания..."
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-gold text-black font-bold text-lg rounded-lg hover:bg-gold-light transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 hover:shadow-lg hover:shadow-gold/50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Отправка...</span>
                </>
              ) : (
                <span>Отправить заявку</span>
              )}
            </button>
          </form>
          <div className="mt-8 pt-8 border-t border-gold/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                <div>
                  <p className="text-white font-semibold mb-1">Позвоните нам</p>
                  <a href="tel:+74951234567" className="text-gold hover:text-gold-light transition-colors">
                    +7 (495) 123-45-67
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                <div>
                  <p className="text-white font-semibold mb-1">Напишите нам</p>
                  <a
                    href="mailto:info@luxurymotors.ru"
                    className="text-gold hover:text-gold-light transition-colors"
                  >
                    info@luxurymotors.ru
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}