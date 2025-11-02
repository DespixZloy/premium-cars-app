import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase, Review } from '../lib/supabase';

export function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [customerName, setCustomerName] = useState('');
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReviews();
  }, []);

  async function loadReviews() {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setReviews(data);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const { error: submitError } = await supabase.from('reviews').insert({
        customer_name: customerName,
        rating,
        message,
        approved: false,
      });

      if (submitError) throw submitError;

      setSuccess(true);
      setCustomerName('');
      setRating(5);
      setMessage('');

      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError('Произошла ошибка при отправке отзыва. Пожалуйста, попробуйте позже.');
      console.error('Review submission error:', err);
    } finally {
      setSubmitting(false);
    }
  }

  const renderStars = (count: number, interactive: boolean = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            onClick={() => interactive && onRate && onRate(star)}
            disabled={!interactive}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
          >
            <Star
              className={`w-5 h-5 ${
                star <= count ? 'fill-gold text-gold' : 'text-gray-600'
              }`}
            />
          </button>
        ))}
      </div>
    );
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
            <span className="text-gold">Отзывы</span> наших клиентов
          </h1>
          <p className="text-gray-400 text-xl max-w-3xl mx-auto">
            Мы ценим каждого нашего клиента и стремимся предоставлять только лучший сервис
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <h2 className="text-3xl font-bold text-white mb-6">Что говорят наши клиенты</h2>
            {loading ? (
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-gray-900 rounded-lg p-6 border border-gold/20 animate-pulse h-40" />
                ))}
              </div>
            ) : reviews.length === 0 ? (
              <div className="bg-gray-900 rounded-lg p-12 border border-gold/20 text-center">
                <p className="text-gray-400 text-lg">Пока нет отзывов. Станьте первым!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((review, index) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="bg-gray-900 rounded-lg p-6 border border-gold/20 hover:border-gold transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-white font-semibold text-lg mb-2">{review.customer_name}</h3>
                        {renderStars(review.rating)}
                      </div>
                      <div className="text-gray-500 text-sm">
                        {new Date(review.created_at).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </div>
                    </div>
                    <p className="text-gray-400 leading-relaxed">{review.message}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="bg-gray-900 rounded-lg p-6 border border-gold/20 sticky top-24">
              <h2 className="text-2xl font-bold text-white mb-6">Оставить отзыв</h2>

              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gold/10 border border-gold/20 rounded-lg p-4 mb-6 flex items-start space-x-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gold font-semibold mb-1">Спасибо за отзыв!</p>
                    <p className="text-gray-400 text-sm">
                      Ваш отзыв будет опубликован после модерации
                    </p>
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="reviewName" className="block text-sm font-medium text-gray-300 mb-2">
                    Ваше имя
                  </label>
                  <input
                    type="text"
                    id="reviewName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-black border border-gold/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold transition-colors"
                    placeholder="Иван Иванов"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Оценка</label>
                  {renderStars(rating, true, setRating)}
                </div>

                <div>
                  <label htmlFor="reviewMessage" className="block text-sm font-medium text-gray-300 mb-2">
                    Ваш отзыв
                  </label>
                  <textarea
                    id="reviewMessage"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-black border border-gold/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold transition-colors resize-none"
                    placeholder="Расскажите о вашем опыте..."
                  />
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    <p className="text-red-500 text-sm">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-gold text-black font-bold rounded-lg hover:bg-gold-light transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 hover:shadow-lg hover:shadow-gold/50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Отправка...</span>
                    </>
                  ) : (
                    <span>Отправить отзыв</span>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
