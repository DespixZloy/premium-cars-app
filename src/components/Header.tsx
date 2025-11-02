import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Menu, X, Instagram, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Главная' },
    { path: '/brands', label: 'Бренды' },
    { path: '/sell', label: 'Продать авто' },
    { path: '/commission', label: 'Комиссия' },
    { path: '/order', label: 'Заказ авто' },
    { path: '/video', label: 'Видео' },
    { path: '/reviews', label: 'Отзывы' },
    { path: '/contacts', label: 'Контакты' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-500">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - улучшенная версия */}
          <Link to="/" className="flex items-center space-x-3 group cursor-pointer z-10 flex-shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
              {/* <span className="text-black font-bold text-lg sm:text-xl">LM</span> */}
              <img src="https://uqbdbcahdagjlfgndvdo.supabase.co/storage/v1/object/sign/images/Logo1.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83ZmFiNTEzMC02NTQxLTQ5YzEtYjkxYS1jNmNkM2E0MzRkODkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZXMvTG9nbzEucG5nIiwiaWF0IjoxNzYxNDA0OTUxLCJleHAiOjIwNDUyMjg5NTF9.b-bdvYrGJGAKNg_N2dIqLPR7zM6bd6YGYezPodNbc28" alt="" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-white font-bold text-lg sm:text-xl tracking-tight">LUXURY MOTORS</h1>
              <p className="text-gold text-xs tracking-widest">PREMIUM AUTOMOBILE</p>
            </div>
          </Link>

           {/* Desktop Navigation - показывается только на очень больших экранах */}
          <nav className="hidden 2xl:flex items-center space-x-6 mx-8">
            
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative text-sm font-medium transition-colors duration-300 px-3 py-2 rounded-lg ${
                  isActive(link.path)
                    ? 'text-gold bg-gold/10'
                    : 'text-gray-300 hover:text-gold hover:bg-white/5'
                }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-gold/10 rounded-lg -z-10"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}
            <div className="flex items-center space-x-4 flex-shrink-0">
            <a
              href="tel:+74951234567"
              className="flex items-center space-x-2 text-white hover:text-gold transition-colors duration-300 group"
            >
              <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center group-hover:bg-gold/30 transition-colors duration-300">
                <Phone className="w-5 h-5" />
              </div>
              <span className="font-semibold whitespace-nowrap">+7 (495) 123-45-67</span>
            </a>

            <div className="flex items-center space-x-3 border-l border-gold/20 pl-4 ml-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-gold rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://t.me"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-gold rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
              >
                <Send className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>
          </nav>

          {/* Contact Info & Socials - показывается только на очень больших экранах */}


          {/* Кнопка меню для диапазона 1024px - 1599px и мобильных */}
          <div className="flex 2xl:hidden items-center space-x-4">
            <div className="hidden lg:flex justify-center space-x-4 flex-shrink-0">
            <a
              href="tel:+74951234567"
              className="flex items-center space-x-2 text-white hover:text-gold transition-colors duration-300 group"
            >
              <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center group-hover:bg-gold/30 transition-colors duration-300">
                <Phone className="w-5 h-5" />
              </div>
              <span className="font-semibold whitespace-nowrap">+7 (495) 123-45-67</span>
            </a>

            <div className="flex items-center space-x-3 border-l border-gold/20 pl-4 ml-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-gold rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://t.me"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-gold rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
              >
                <Send className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>
            {/* Телефон для средних экранов (показывается вместо полной навигации) */}
            <a
              href="tel:+74951234567"
              className="hidden sm:flex lg:hidden items-center space-x-2 text-white hover:text-gold transition-colors duration-300 group"
            >
              <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center group-hover:bg-gold/30 transition-colors duration-300">
                <Phone className="w-5 h-5" />
              </div>
            </a>

            {/* Mobile menu button - показывается на всех экранах кроме 2xl */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:flex 2xl:hidden w-10 h-10 flex items-center justify-center text-gray-300 hover:text-gold transition-colors flex-shrink-0"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation - для диапазона 1024px-1599px и мобильных */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="2xl:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-md border-t border-gold/20 mt-4 overflow-hidden"
            >
              <div className="px-4 py-6 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-3 px-4 text-base font-medium transition-all duration-300 rounded-lg ${
                      isActive(link.path)
                        ? 'text-gold bg-gold/10 border-l-4 border-gold'
                        : 'text-gray-300 hover:text-gold hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-4 border-t border-gold/20 mt-4">
                  <a
                    href="tel:+74951234567"
                    className="flex items-center space-x-3 text-gold font-semibold py-3 px-4 hover:bg-gold/10 rounded-lg transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    <span>+7 (495) 123-45-67</span>
                  </a>
                  <div className="flex items-center space-x-4 mt-4 px-4">
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-gold transition-colors"
                    >
                      <Instagram className="w-6 h-6" />
                    </a>
                    <a
                      href="https://t.me"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-gold transition-colors"
                    >
                      <Send className="w-6 h-6" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}