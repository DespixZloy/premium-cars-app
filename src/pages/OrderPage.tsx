import { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Shield, Clock, Loader2, CheckCircle2, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { sendOrderTelegramNotification } from '../lib/telegram';

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

export function OrderPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    brand: '',
    model: '',
    budget: '',
    deliveryCountry: '',
    comments: '',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
    
    // Валидация телефона
    if (!validatePhone(formData.phone, selectedCountry)) {
      setPhoneError(`Введите корректный номер телефона для ${selectedCountry.code}`);
      return;
    }

    // Проверка обязательных полей
    if (!formData.name.trim() || !formData.brand.trim() || !formData.model.trim()) {
      setError('Пожалуйста, заполните все обязательные поля (имя, марка, модель)');
      return;
    }

    setSubmitting(true);

    try {
      // Подготавливаем данные для вставки
      const orderData = {
        customer_name: formData.name.trim(),
        customer_phone: formData.phone.trim(),
        customer_email: formData.email ? formData.email.trim() : null,
        phone_country: selectedCountry.code,
        brand: formData.brand.trim(),
        model: formData.model.trim(),
        budget: formData.budget ? parseFloat(formData.budget) : null,
        delivery_country: formData.deliveryCountry || null,
        comments: formData.comments ? formData.comments.trim() : null,
        telegram_sent: false,
      };

      console.log('📤 Отправка данных в базу:', orderData);

      // Сохраняем данные в базу данных
      const { data, error: submitError } = await supabase
        .from('order_requests')
        .insert([orderData])
        .select();

      if (submitError) {
        console.error('❌ Ошибка базы данных:', submitError);
        
        // Подробная обработка ошибок RLS
        if (submitError.code === '42501') {
          throw new Error('Ошибка прав доступа. Пожалуйста, обновите политики безопасности базы данных.');
        } else if (submitError.code === '23502') {
          throw new Error('Не все обязательные поля заполнены.');
        } else {
          throw new Error(`Ошибка базы данных: ${submitError.message}`);
        }
      }

      if (!data || data.length === 0) {
        throw new Error('Не удалось сохранить заявку. Данные не вернулись от сервера.');
      }

      console.log('✅ Заявка сохранена успешно:', data[0].id);

      // Отправляем уведомление в Telegram
      const telegramData = {
        customerName: formData.name,
        customerPhone: formData.phone,
        customerEmail: formData.email || undefined,
        phoneCountry: selectedCountry.code,
        brand: formData.brand,
        model: formData.model,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
        deliveryCountry: formData.deliveryCountry || undefined,
        comments: formData.comments || undefined,
      };

      console.log('📨 Отправка уведомления в Telegram...');
      
      const telegramSent = await sendOrderTelegramNotification(telegramData);

      // Обновляем статус отправки в Telegram если нужно
      if (telegramSent && data[0]) {
        try {
          await supabase
            .from('order_requests')
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
        budget: '',
        deliveryCountry: '',
        comments: '',
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
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
            Заказ <span className="text-gold">автомобиля</span>
          </h1>
          <p className="text-gray-400 text-xl max-w-3xl mx-auto">
            Не нашли нужный автомобиль в нашем каталоге? Закажите автомобиль вашей мечты
            из любой точки мира. Мы найдем и доставим его для вас.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="bg-gray-900 rounded-lg p-8 border border-gold/20 text-center"
          >
            <div className="bg-gold/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Globe className="w-10 h-10 text-gold" />
            </div>
            <h3 className="text-white font-bold text-xl mb-3">Со всего мира</h3>
            <p className="text-gray-400">
              Работаем с дилерами и аукционами в Европе, США, ОАЭ и других странах
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-gray-900 rounded-lg p-8 border border-gold/20 text-center"
          >
            <div className="bg-gold/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-gold" />
            </div>
            <h3 className="text-white font-bold text-xl mb-3">Полная проверка</h3>
            <p className="text-gray-400">
              Проверяем юридическую чистоту и техническое состояние автомобиля
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-gray-900 rounded-lg p-8 border border-gold/20 text-center"
          >
            <div className="bg-gold/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-10 h-10 text-gold" />
            </div>
            <h3 className="text-white font-bold text-xl mb-3">Быстрая доставка</h3>
            <p className="text-gray-400">
              Организуем доставку и таможенное оформление в кратчайшие сроки
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Этапы работы</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-gold text-black w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-lg mb-2">Консультация</h4>
                    <p className="text-gray-400">
                      Обсуждаем ваши пожелания по модели, комплектации, бюджету и срокам
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-gold text-black w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-lg mb-2">Поиск автомобиля</h4>
                    <p className="text-gray-400">
                      Находим подходящие варианты через наших партнеров по всему миру
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-gold text-black w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-lg mb-2">Проверка и согласование</h4>
                    <p className="text-gray-400">
                      Проводим детальную проверку и согласуем с вами все детали сделки
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-gold text-black w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-lg mb-2">Доставка и оформление</h4>
                    <p className="text-gray-400">
                      Организуем доставку, растаможку и полное юридическое оформление
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-gold text-black w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    5
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-lg mb-2">Передача автомобиля</h4>
                    <p className="text-gray-400">
                      Получаете готовый к эксплуатации автомобиль с полным пакетом документов
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-gold/20">
              <h3 className="text-xl font-bold text-white mb-4">Популярные направления</h3>
              <div className="grid grid-cols-2 gap-3 text-gray-400">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gold rounded-full"></div>
                  <span>Германия</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gold rounded-full"></div>
                  <span>США</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gold rounded-full"></div>
                  <span>ОАЭ</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gold rounded-full"></div>
                  <span>Япония</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gold rounded-full"></div>
                  <span>Италия</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gold rounded-full"></div>
                  <span>Великобритания</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="bg-gray-900 rounded-lg p-8 border border-gold/20"
          >
            <h2 className="text-3xl font-bold text-white mb-6">Оставить заявку</h2>

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
                    Наш специалист свяжется с вами для обсуждения деталей заказа
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

            <form onSubmit={handleSubmit} className="space-y-4">
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
                <div className="flex space-x-1">
                  <div className="relative flex-1">
                    <button
                      type="button"
                      onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                      className="w-full px-3 py-3 bg-black border border-gold/20 rounded-lg text-white focus:outline-none focus:border-gold transition-colors flex items-center justify-between"
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
                            className="w-full px-3 py-2 text-white hover:bg-gray-800 transition-colors duration-200 flex items-center space-x-1"
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
                    className="w-full flex-[2] px-4 py-3 bg-black border border-gold/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold transition-colors"
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

              <div className="grid grid-cols-2 gap-4">
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
                    placeholder="Ferrari"
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
                    placeholder="488 GTB"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="deliveryCountry" className="block text-sm font-medium text-gray-300 mb-2">
                  Страна поставки
                </label>
                <select
                  id="deliveryCountry"
                  name="deliveryCountry"
                  value={formData.deliveryCountry}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black border border-gold/20 rounded-lg text-white focus:outline-none focus:border-gold transition-colors"
                >
                  <option value="">Выберите страну</option>
                  <option value="germany">Германия</option>
                  <option value="usa">США</option>
                  <option value="uae">ОАЭ</option>
                  <option value="japan">Япония</option>
                  <option value="italy">Италия</option>
                  <option value="uk">Великобритания</option>
                  <option value="other">Другая</option>
                </select>
              </div>

              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-300 mb-2">
                  Бюджет (₽)
                </label>
                <input
                  type="number"
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 bg-black border border-gold/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold transition-colors"
                  placeholder="10000000"
                />
              </div>

              <div>
                <label htmlFor="comments" className="block text-sm font-medium text-gray-300 mb-2">
                  Пожелания
                </label>
                <textarea
                  id="comments"
                  name="comments"
                  value={formData.comments}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-black border border-gold/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold transition-colors resize-none"
                  placeholder="Опишите желаемую комплектацию, цвет, срок поставки..."
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
                  <span>Заказать автомобиль</span>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}