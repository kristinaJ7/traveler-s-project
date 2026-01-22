// Базовые URL
export const SUPABASE_URL = 'https://uihbgimivslszyqasxeu.supabase.co';
export const SUPABASE_KEY = 'sb_publishable_b2pCJEAkUBLnXmwtfNpOBA_nbFtQwY5';




// Пути к хранилищу Supabase ( изображения хранятся там)
export const SUPABASE_STORAGE_URL = `${SUPABASE_URL}/storage/v1/object/public`;

// Эндопоинты таблиц Supabase
export const API_ENDPOINTS = {
  TOURS: 'products_tours', // таблица туров
  USERS: 'users',        // таблица пользователей
  ORDERS: 'orders',      // таблица заказов
  REVIEWS: 'reviews',     // таблица отзывов
} as const;

// Карта категорий туров → CSS-классы
export const CATEGORY_MAP = {
  'пляжный': 'card__category_beach',
  'экскурсионный': 'card__category_excursion',
  'горный': 'card__category_mountain',
  'круиз': 'card__category_cruise',
  'семейный': 'card__category_family',
  'экстремальный': 'card__category_extreme',
  'другое': 'card__category_other',
} as const;

// Настройки отображения
export const APP_SETTINGS = {
  ITEMS_PER_PAGE: 12,           // количество туров на странице
  IMAGE_SIZE: 'medium',         // размер изображений (small/medium/large)
  CAROUSEL_AUTOPLAY: true,    // автопрокрутка каруселей
  SHOW_RATINGS: true,         // показывать рейтинги
} as const;

// Сообщения об ошибках
export const ERROR_MESSAGES = {
  LOAD_TOURS_FAILED: 'Не удалось загрузить туры. Проверьте подключение к интернету.',
  NO_TOURS_FOUND: 'Туров не найдено.',
  INVALID_CATEGORY: 'Неизвестная категория тура.',
  NETWORK_ERROR: 'Ошибка сети. Попробуйте перезагрузить страницу.',
} as const;

// Валидационные правила
export const VALIDATION_RULES = {
  MIN_PRICE: 0,
  MAX_PRICE: 1000000,
  MIN_DURATION: 1,
  MAX_DURATION: 90,
  REQUIRED_FIELDS: ['title', 'price', 'category', 'image'],
} as const;

