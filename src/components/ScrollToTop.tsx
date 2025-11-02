import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Прокрутка к верху при изменении маршрута
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' // Плавная прокрутка
    });
  }, [pathname]);

  return null;
}