import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Send, Youtube } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-gold/20 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">
              <span className="text-white">LUXURY</span>
              <span className="text-gold ml-2">MOTORS</span>
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Эксклюзивный автосалон премиальных автомобилей в Москве. Мы предлагаем только лучшие автомобили мировых брендов.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gold transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://t.me"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gold transition-colors"
              >
                <Send className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gold transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-gold">Навигация</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-gold transition-colors text-sm">
                  Главная
                </Link>
              </li>
              <li>
                <Link to="/brands" className="text-gray-400 hover:text-gold transition-colors text-sm">
                  Купить авто
                </Link>
              </li>
              <li>
                <Link to="/sell" className="text-gray-400 hover:text-gold transition-colors text-sm">
                  Продать авто
                </Link>
              </li>
              <li>
                <Link to="/commission" className="text-gray-400 hover:text-gold transition-colors text-sm">
                  Прием на комиссию
                </Link>
              </li>
              <li>
                <Link to="/order" className="text-gray-400 hover:text-gold transition-colors text-sm">
                  Заказ авто
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-gold">Информация</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/video" className="text-gray-400 hover:text-gold transition-colors text-sm">
                  Видео
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="text-gray-400 hover:text-gold transition-colors text-sm">
                  Отзывы
                </Link>
              </li>
              <li>
                <Link to="/contacts" className="text-gray-400 hover:text-gold transition-colors text-sm">
                  Контакты
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-gold">Контакты</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2 text-gray-400 text-sm">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <a href="tel:+74951234567" className="hover:text-gold transition-colors">
                    +7 (495) 123-45-67
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-2 text-gray-400 text-sm">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <a href="mailto:info@luxurymotors.ru" className="hover:text-gold transition-colors">
                  info@luxurymotors.ru
                </a>
              </li>
              <li className="flex items-start space-x-2 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Москва, Кутузовский проспект, д. 36, стр. 1</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gold/20 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {currentYear} LUXURY MOTORS. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
