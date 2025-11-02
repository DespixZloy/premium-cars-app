import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

export function VideoPage() {
  const videos = [
    {
      id: '1',
      title: 'Обзор нашего автосалона',
      thumbnail: 'https://images.pexels.com/photos/3802508/pexels-photo-3802508.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: '5:32',
    },
    {
      id: '2',
      title: 'Ferrari 488 GTB - тест-драйв',
      thumbnail: 'https://images.pexels.com/photos/544542/pexels-photo-544542.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: '12:45',
    },
    {
      id: '3',
      title: 'Lamborghini Huracán - детальный обзор',
      thumbnail: 'https://images.pexels.com/photos/337909/pexels-photo-337909.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: '15:20',
    },
    {
      id: '4',
      title: 'Porsche 911 Turbo S - на треке',
      thumbnail: 'https://images.pexels.com/photos/909907/pexels-photo-909907.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: '8:15',
    },
    {
      id: '5',
      title: 'Mercedes-AMG GT R - звук мотора',
      thumbnail: 'https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: '6:42',
    },
    {
      id: '6',
      title: 'Как мы проверяем автомобили',
      thumbnail: 'https://images.pexels.com/photos/3752169/pexels-photo-3752169.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: '10:30',
    },
    {
      id: '7',
      title: 'Bentley Continental GT - роскошь и комфорт',
      thumbnail: 'https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: '14:25',
    },
    {
      id: '8',
      title: 'История успеха наших клиентов',
      thumbnail: 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: '7:18',
    },
    {
      id: '9',
      title: 'Aston Martin DBS Superleggera - обзор',
      thumbnail: 'https://images.pexels.com/photos/1035108/pexels-photo-1035108.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: '11:55',
    },
  ];

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
            Видео <span className="text-gold">галерея</span>
          </h1>
          <p className="text-gray-400 text-xl max-w-3xl mx-auto">
            Смотрите обзоры, тест-драйвы и детальные видео наших премиальных автомобилей
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -8 }}
              className="group cursor-pointer"
            >
              <div className="bg-gray-900 rounded-lg overflow-hidden border border-gold/20 hover:border-gold transition-all hover:shadow-2xl hover:shadow-gold/30">
                <div className="relative aspect-video bg-gray-800 overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors flex items-center justify-center">
                    <div className="bg-gold/90 group-hover:bg-gold rounded-full p-4 group-hover:scale-110 transition-all">
                      <Play className="w-8 h-8 text-black fill-black" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/80 px-3 py-1 rounded-full text-white text-sm font-semibold">
                    {video.duration}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-white text-lg font-bold group-hover:text-gold transition-colors">
                    {video.title}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 bg-gray-900 rounded-lg p-12 border border-gold/20 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Хотите увидеть больше?
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Подпишитесь на наш YouTube канал, чтобы не пропустить новые видео и эксклюзивные обзоры
          </p>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gold text-black font-bold text-lg rounded-lg hover:bg-gold-light transition-all hover:shadow-lg hover:shadow-gold/50"
          >
            <Play className="w-6 h-6" />
            <span>Подписаться на канал</span>
          </a>
        </motion.div>
      </div>
    </div>
  );
}
