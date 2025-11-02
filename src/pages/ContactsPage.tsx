import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Instagram, Send, Youtube } from 'lucide-react';

export function ContactsPage() {
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
            <span className="text-gold">Контакты</span>
          </h1>
          <p className="text-gray-400 text-xl max-w-3xl mx-auto">
            Свяжитесь с нами любым удобным способом. Мы работаем без выходных и всегда готовы помочь вам
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="space-y-8"
          >
            <div className="bg-gray-900 rounded-lg p-8 border border-gold/20">
              <h2 className="text-3xl font-bold text-white mb-8">Наши контакты</h2>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-gold/10 p-3 rounded-lg">
                    <Phone className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-2">Телефон</h3>
                    <a
                      href="tel:+74951234567"
                      className="text-gold hover:text-gold-light transition-colors text-lg"
                    >
                      +7 (495) 123-45-67
                    </a>
                    <p className="text-gray-400 text-sm mt-1">Звоните в любое время</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-gold/10 p-3 rounded-lg">
                    <Mail className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-2">Email</h3>
                    <a
                      href="mailto:info@luxurymotors.ru"
                      className="text-gold hover:text-gold-light transition-colors text-lg"
                    >
                      info@luxurymotors.ru
                    </a>
                    <p className="text-gray-400 text-sm mt-1">Пишите нам в любое время</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-gold/10 p-3 rounded-lg">
                    <MapPin className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-2">Адрес</h3>
                    <p className="text-white text-lg">
                      Москва, Кутузовский проспект,<br />д. 36, стр. 1
                    </p>
                    <p className="text-gray-400 text-sm mt-1">Рядом с метро Кутузовская</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-gold/10 p-3 rounded-lg">
                    <Clock className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-2">Часы работы</h3>
                    <p className="text-white text-lg">Ежедневно: 9:00 - 21:00</p>
                    <p className="text-gray-400 text-sm mt-1">Без выходных и перерывов</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-8 border border-gold/20">
              <h3 className="text-2xl font-bold text-white mb-6">Мы в социальных сетях</h3>
              <div className="space-y-4">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-4 p-4 bg-black rounded-lg border border-gold/20 hover:border-gold transition-all group"
                >
                  <div className="bg-gold/10 p-3 rounded-lg group-hover:bg-gold/20 transition-colors">
                    <Instagram className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <p className="text-white font-semibold group-hover:text-gold transition-colors">Instagram</p>
                    <p className="text-gray-400 text-sm">@luxurymotors</p>
                  </div>
                </a>

                <a
                  href="https://t.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-4 p-4 bg-black rounded-lg border border-gold/20 hover:border-gold transition-all group"
                >
                  <div className="bg-gold/10 p-3 rounded-lg group-hover:bg-gold/20 transition-colors">
                    <Send className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <p className="text-white font-semibold group-hover:text-gold transition-colors">Telegram</p>
                    <p className="text-gray-400 text-sm">@luxurymotors_ru</p>
                  </div>
                </a>

                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-4 p-4 bg-black rounded-lg border border-gold/20 hover:border-gold transition-all group"
                >
                  <div className="bg-gold/10 p-3 rounded-lg group-hover:bg-gold/20 transition-colors">
                    <Youtube className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <p className="text-white font-semibold group-hover:text-gold transition-colors">YouTube</p>
                    <p className="text-gray-400 text-sm">LUXURY MOTORS</p>
                  </div>
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="h-[600px] lg:h-full"
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

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gray-900 rounded-lg p-12 border border-gold/20"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Как добраться</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gold/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-gold text-2xl font-bold">Ⓜ️</span>
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">На метро</h3>
              <p className="text-gray-400">
                Станция метро "Кутузовская"<br />
                5 минут пешком
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gold/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-gold text-2xl">🚗</span>
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">На автомобиле</h3>
              <p className="text-gray-400">
                Бесплатная парковка<br />
                для наших гостей
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gold/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-gold text-2xl">🚌</span>
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">На автобусе</h3>
              <p className="text-gray-400">
                Остановка "Кутузовский проспект"<br />
                Автобусы: 116, 157, 523
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-12 bg-gradient-to-r from-gold/10 to-gold-light/10 rounded-lg p-8 border border-gold/20 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-4">Приезжайте на тест-драйв</h3>
          <p className="text-gray-400 text-lg mb-6 max-w-2xl mx-auto">
            Мы будем рады видеть вас в нашем автосалоне. Приезжайте на тест-драйв
            любого автомобиля из нашей коллекции.
          </p>
          <a
            href="tel:+74951234567"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gold text-black font-bold text-lg rounded-lg hover:bg-gold-light transition-all hover:shadow-lg hover:shadow-gold/50"
          >
            <Phone className="w-6 h-6" />
            <span>Записаться на тест-драйв</span>
          </a>
        </motion.div>
      </div>
    </div>
  );
}
