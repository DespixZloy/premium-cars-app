const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

interface BookingData {
  customerName: string;
  customerPhone: string;
  phoneCountry?: string;
  car: any;
}

interface OrderData {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  phoneCountry?: string;
  brand: string;
  model: string;
  budget?: number;
  deliveryCountry?: string;
  comments?: string;
}

interface SellData {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  phoneCountry?: string;
  brand: string;
  model: string;
  year?: number;
  mileage?: number;
  price?: number;
  description?: string;
}

interface CommissionData {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  phoneCountry?: string;
  brand: string;
  model: string;
  year?: number;
  price?: number;
}

/**
 * Общая функция для отправки текстовых сообщений в Telegram
 */
async function sendTelegramMessage(message: string): Promise<boolean> {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.ok) {
      console.log('Telegram notification sent successfully');
      return true;
    } else {
      console.error('Telegram API error:', result);
      return false;
    }
  } catch (error) {
    console.error('Failed to send Telegram notification:', error);
    return false;
  }
}

/**
 * Отправляет фото в Telegram с подписью
 */
async function sendTelegramPhoto(photoUrl: string, caption: string): Promise<boolean> {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        photo: photoUrl,
        caption: caption,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.ok) {
      console.log('Telegram photo sent successfully');
      return true;
    } else {
      console.error('Telegram API error:', result);
      return false;
    }
  } catch (error) {
    console.error('Failed to send Telegram photo:', error);
    return false;
  }
}

/**
 * Получает основное фото автомобиля
 */
function getPrimaryCarImage(car: any): string | null {
  if (car.images && car.images.length > 0) {
    // Ищем основное фото
    const primaryImage = car.images.find((img: any) => img.is_primary);
    if (primaryImage) {
      return primaryImage.image_url;
    }
    // Или берем первое фото
    return car.images[0].image_url;
  }
  
  // Если нет изображений в car.images, проверяем другие возможные поля
  if (car.image_url) {
    return car.image_url;
  }
  
  if (car.primary_image) {
    return car.primary_image;
  }
  
  return null;
}

/**
 * Отправляет уведомление в Telegram о новом бронировании автомобиля
 */
export async function sendTelegramNotification(bookingData: BookingData): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn('Telegram credentials not configured');
    return false;
  }

  const primaryImage = getPrimaryCarImage(bookingData.car);
  const message = formatBookingMessage(bookingData);

  // Если есть фото, отправляем фото с полной информацией, иначе текстовое сообщение
  if (primaryImage) {
    return await sendTelegramPhoto(primaryImage, message);
  } else {
    return await sendTelegramMessage(message);
  }
}

/**
 * Форматирует сообщение о бронировании автомобиля (полная версия для фото)
 */
function formatBookingMessage(bookingData: BookingData): string {
  const { customerName, customerPhone, phoneCountry, car } = bookingData;

  return `
🚗 <b>Новое бронирование автомобиля!</b>

<b>Автомобиль:</b>
🏷 Марка: ${car.brand?.name || car.brand}
🚘 Модель: ${car.model}
📅 Год: ${car.year}
💰 Цена: ${car.price?.toLocaleString('ru-RU') || '0'} ₽
📏 Пробег: ${car.mileage?.toLocaleString('ru-RU') || '0'} км
🎨 Цвет: ${car.color || 'Не указан'}
⚙️ Двигатель: ${car.engine || 'Не указан'}
🔄 КПП: ${car.transmission || 'Не указана'}
⛽ Топливо: ${car.fuel_type || 'Не указано'}

<b>Клиент:</b>
👤 Имя: ${customerName}
📞 Телефон: ${customerPhone} ${phoneCountry ? `(${phoneCountry})` : ''}

⏰ Время бронирования: ${new Date().toLocaleString('ru-RU')}
  `.trim();
}

/**
 * Отправляет уведомление в Telegram о новом заказе автомобиля
 */
export async function sendOrderTelegramNotification(orderData: OrderData): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn('Telegram credentials not configured');
    return false;
  }

  const message = formatOrderMessage(orderData);
  return await sendTelegramMessage(message);
}

/**
 * Форматирует сообщение о заказе автомобиля
 */
function formatOrderMessage(orderData: OrderData): string {
  const { 
    customerName, 
    customerPhone, 
    customerEmail, 
    phoneCountry,
    brand, 
    model, 
    budget, 
    deliveryCountry, 
    comments 
  } = orderData;

  const formattedBudget = budget ? `${budget.toLocaleString('ru-RU')} ₽` : 'Не указан';
  const countryName = getCountryName(deliveryCountry);

  return `
🎯 <b>Новый заказ автомобиля!</b>

<b>Автомобиль:</b>
🏷 Марка: ${brand}
🚘 Модель: ${model}
💰 Бюджет: ${formattedBudget}
🌍 Страна поставки: ${countryName}

<b>Клиент:</b>
👤 Имя: ${customerName}
📞 Телефон: ${customerPhone} ${phoneCountry ? `(${phoneCountry})` : ''}
📧 Email: ${customerEmail || 'Не указан'}

<b>Дополнительная информация:</b>
💬 Пожелания: ${comments || 'Не указаны'}

⏰ Время заявки: ${new Date().toLocaleString('ru-RU')}
  `.trim();
}

/**
 * Отправляет уведомление в Telegram о новой заявке на продажу
 */
export async function sendSellTelegramNotification(sellData: SellData): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn('Telegram credentials not configured');
    return false;
  }

  const message = formatSellMessage(sellData);
  return await sendTelegramMessage(message);
}

/**
 * Форматирует сообщение о заявке на продажу
 */
function formatSellMessage(sellData: SellData): string {
  const { 
    customerName, 
    customerPhone, 
    customerEmail, 
    phoneCountry,
    brand, 
    model, 
    year, 
    mileage, 
    price, 
    description 
  } = sellData;

  const formattedPrice = price ? `${price.toLocaleString('ru-RU')} ₽` : 'Не указана';
  const formattedMileage = mileage ? `${mileage.toLocaleString('ru-RU')} км` : 'Не указан';

  return `
💰 <b>Новая заявка на ВЫКУП автомобиля!</b>

<b>Автомобиль:</b>
🏷 Марка: ${brand}
🚘 Модель: ${model}
📅 Год: ${year || 'Не указан'}
📏 Пробег: ${formattedMileage}
💵 Желаемая цена: ${formattedPrice}

<b>Клиент:</b>
👤 Имя: ${customerName}
📞 Телефон: ${customerPhone} ${phoneCountry ? `(${phoneCountry})` : ''}
📧 Email: ${customerEmail || 'Не указан'}

<b>Дополнительная информация:</b>
💬 ${description || 'Не указана'}

⏰ Время заявки: ${new Date().toLocaleString('ru-RU')}
  `.trim();
}

/**
 * Отправляет уведомление в Telegram о новой комиссионной заявке
 */
export async function sendCommissionTelegramNotification(commissionData: CommissionData): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn('Telegram credentials not configured');
    return false;
  }

  const message = formatCommissionMessage(commissionData);
  return await sendTelegramMessage(message);
}

/**
 * Форматирует сообщение о комиссионной заявке
 */
function formatCommissionMessage(commissionData: CommissionData): string {
  const { 
    customerName, 
    customerPhone, 
    customerEmail, 
    phoneCountry,
    brand, 
    model, 
    year, 
    price 
  } = commissionData;

  const formattedPrice = price ? `${price.toLocaleString('ru-RU')} ₽` : 'Не указана';

  return `
🏪 <b>Новая заявка на КОМИССИЮ!</b>

<b>Автомобиль:</b>
🏷 Марка: ${brand}
🚘 Модель: ${model}
📅 Год: ${year || 'Не указан'}
💵 Ожидаемая цена: ${formattedPrice}

<b>Клиент:</b>
👤 Имя: ${customerName}
📞 Телефон: ${customerPhone} ${phoneCountry ? `(${phoneCountry})` : ''}
📧 Email: ${customerEmail || 'Не указан'}

⏰ Время заявки: ${new Date().toLocaleString('ru-RU')}
  `.trim();
}

/**
 * Преобразует код страны в читаемое название
 */
function getCountryName(countryCode?: string): string {
  if (!countryCode) return 'Не указана';

  const countryMap: { [key: string]: string } = {
    'germany': 'Германия',
    'usa': 'США',
    'uae': 'ОАЭ',
    'japan': 'Япония',
    'italy': 'Италия',
    'uk': 'Великобритания',
    'other': 'Другая страна'
  };

  return countryMap[countryCode] || countryCode;
}

/**
 * Проверяет конфигурацию Telegram
 */
export function checkTelegramConfig(): boolean {
  const hasToken = !!TELEGRAM_BOT_TOKEN;
  const hasChatId = !!TELEGRAM_CHAT_ID;

  if (!hasToken) {
    console.warn('VITE_TELEGRAM_BOT_TOKEN is not configured');
  }

  if (!hasChatId) {
    console.warn('VITE_TELEGRAM_CHAT_ID is not configured');
  }

  return hasToken && hasChatId;
}