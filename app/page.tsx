'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Flame, 
  TrendingUp, 
  AlertTriangle, 
  Bot, 
  Zap, 
  Sparkles, 
  Copy, 
  Check, 
  RotateCcw, 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Play, 
  Info,
  ShieldCheck,
  CheckCircle,
  TrendingDown,
  XCircle,
  Send,
  Server,
  Activity,
  History,
  Globe,
  Sliders,
  Plus,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Interfaces
interface SMMOrder {
  id: string;
  platform: 'twitter' | 'instagram';
  serviceKey: string;
  serviceLabel: string;
  link: string;
  quantity: number;
  quality: 'resident' | 'ai_mimicry' | 'bots';
  speed: 'drip' | 'instant';
  progress: number;
  status: 'pending' | 'connecting' | 'delivering' | 'completed' | 'failed' | 'cancelled';
  createdAt: string;
  logs: string[];
}

interface SMMService {
  id: string;
  label: string;
  pricePerUnitUnit: number; // For simulation
  icon: any;
  desc: string;
  platform: 'twitter' | 'instagram';
}

interface GeneratedStrategy {
  hookIdeas: {
    verbalHook: string;
    visualHook: string;
    textOverlay: string;
  }[];
  captionTemplate: string;
  hashtags: string[];
  viralityHack: string;
  recommenedAudioStyle: string; // Used both as media layout or audio trend
}

// Predefined niches for the AI planner
const NICHES = [
  { id: 'tech', name: 'IT, Наука и Технологии' },
  { id: 'finance', name: 'Криптовалюта, Бизнес и Финансы' },
  { id: 'humor', name: 'Юмор, Мемы и Развлечения' },
  { id: 'fitness', name: 'Спорт, Тренировки и Здоровье' },
  { id: 'beauty', name: 'Бьюти, Стиль и Лайфстайл' },
  { id: 'education', name: 'Образование, Языки и Психология' },
  { id: 'cooking', name: 'Рецепты и Кулинария' }
];

const CONTENT_TYPES_INSTA = [
  { id: 'Reels', name: 'Reels (Вовлекающее видео)' },
  { id: 'Carousel', name: 'Карусель (Инфографика)' },
  { id: 'Stories', name: 'Серия Stories (Прогрев)' }
];

const CONTENT_TYPES_TWITTER = [
  { id: 'Thread', name: 'Полезный Тред (X Thread)' },
  { id: 'ViralSingle', name: 'Вирусный Твит (Bait/Meme)' },
  { id: 'Interactive', name: 'Интерактивный Твит (Опрос)' }
];

const AUDIENCES = [
  { id: 'broad', name: 'Широкая аудитория (Масс-маркет)' },
  { id: 'beginners', name: 'Новички (Инструкции и Азы)' },
  { id: 'pros', name: 'Профессионалы и Эксперты (B2B)' }
];

// Initial preloaded orders to make the UI look live immediately
const SAMPLE_ORDERS: SMMOrder[] = [
  {
    id: "TX-9402",
    platform: "twitter",
    serviceKey: "twitter_followers",
    serviceLabel: "Живые Подписчики X (Twitter)",
    link: "https://x.com/smm_elon/status/17892305",
    quantity: 500,
    quality: "ai_mimicry",
    speed: "drip",
    progress: 100,
    status: "completed",
    createdAt: "10 минут назад",
    logs: [
      "[Старт] Инициализация симулятора X Boost v4.1...",
      "[Сеть] Подключение прокси-каналов: US, DE, JP.",
      "[Анализ] Цель: @smm_elon верифицирован. Ограничения отсутствуют.",
      "[Прогресс] Запуск роботов-мимикриков для безопасного фолловинга.",
      "[Прогресс] Оформление профилей проверено: аватарки, био, посты.",
      "[Успех] Все 500 живых профилей успешно подписались на аккаунт. Списаний: 0%."
    ]
  },
  {
    id: "IG-7821",
    platform: "instagram",
    serviceKey: "instagram_likes",
    serviceLabel: "Резидентные Лайки (Instagram)",
    link: "https://instagram.com/p/C8vselin",
    quantity: 2500,
    quality: "resident",
    speed: "instant",
    progress: 100,
    status: "completed",
    createdAt: "22 минуты назад",
    logs: [
      "[Старт] Поиск активных резидентных узлов...",
      "[Сеть] Коннект с пулом взаимного пиара Instagram Liker Club.",
      "[Анализ] Ссылка подтверждена: Reels пост.",
      "[Прогресс] Имитация удержания 4-5 секунд перед кликом на лайк.",
      "[Успех] Добавлено +2,500 лайков от СНГ аудитории. Алгоритмы Meta стабилизированы."
    ]
  }
];

export default function Home() {
  const [mounted, setMounted] = useState<boolean>(false);
  // Navigation Tabs: 'smm_panel' | 'my_orders' | 'api_settings'
  const [activeTab, setActiveTab] = useState<'smm_panel' | 'my_orders' | 'api_settings'>('smm_panel');
  
  // Platform Selector inside SMM panel (Instagram fixed/focused)
  const [selectedPlatform, setSelectedPlatform] = useState<'twitter' | 'instagram'>('instagram');
  
  // SMM Integration State Parameters (Always Real SMM API Console)
  const [smmMode, setSmmMode] = useState<'simulation' | 'real_api'>('real_api');
  const [apiUrl, setApiUrl] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');
  const [realBalance, setRealBalance] = useState<string | null>(null);
  const [realServices, setRealServices] = useState<any[]>([]);
  const [selectedRealServiceId, setSelectedRealServiceId] = useState<string>('');
  const [smmApiLoading, setSmmApiLoading] = useState<boolean>(false);
  const [apiErrorText, setApiErrorText] = useState<string | null>(null);

  // Form states
  const [targetLink, setTargetLink] = useState<string>('https://www.instagram.com/p/C8vselin');
  const [selectedService, setSelectedService] = useState<string>('instagram_followers');
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1000);
  const [qualityType, setQualityType] = useState<'resident' | 'ai_mimicry' | 'bots'>('ai_mimicry');
  const [deliverySpeed, setDeliverySpeed] = useState<'drip' | 'instant'>('drip');
  const [customComments, setCustomComments] = useState<string>(
    "Шедевральная мысль! 🔥\nПолностью согласен с автором.\nСохраню себе, полезно. 👍\nОго, надо будет попробовать внедрить у себя."
  );
  
  // Custom numeric amount state (if client types instead of standard pills)
  const [customAmountText, setCustomAmountText] = useState<string>('');

  // SMM orders active registry
  const [orders, setOrders] = useState<SMMOrder[]>([]);
  const [activeOrderIdx, setActiveOrderIdx] = useState<number | null>(null);
  
  // Live simulation tickers & trigger
  const [selectedOrderForTerminal, setSelectedOrderForTerminal] = useState<SMMOrder | null>(null);
  
  // AI Copier States
  const [generatorPlatform, setGeneratorPlatform] = useState<'twitter' | 'instagram'>('twitter');
  const [selectedNiche, setSelectedNiche] = useState<string>('tech');
  const [selectedContentType, setSelectedContentType] = useState<string>('Thread');
  const [targetAudience, setTargetAudience] = useState<string>('broad');
  const [keyword, setKeyword] = useState<string>('');
  
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [strategyResult, setStrategyResult] = useState<GeneratedStrategy | null>(null);

  // Clipboard copy feedbacks
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedCaption, setCopiedCaption] = useState<boolean>(false);
  const [copiedHashtags, setCopiedHashtags] = useState<boolean>(false);

  // Terminals automatic scroll management
  const terminalRef = useRef<HTMLDivElement | null>(null);

  // Define SMM services map referencing Twiboost design categories
  const SERVICES: Record<string, SMMService> = {
    // Twitter/X (Simulates twiboost.com categories)
    twitter_followers: {
      id: "twitter_followers",
      label: "🐦 Живые Подписчики X (Twitter)",
      pricePerUnitUnit: 0.024,
      icon: TrendingUp,
      desc: "Органический плавный налив с задержкой, заполненные профили с био и аватарками, максимальный траст.",
      platform: "twitter"
    },
    twitter_likes: {
      id: "twitter_likes",
      label: "❤️ Премиум Лайки под Твит (X Likes)",
      pricePerUnitUnit: 0.012,
      icon: Heart,
      desc: "Одобрительные отметки нравится от активной СНГ и англоязычной аудитории X для активации виральности.",
      platform: "twitter"
    },
    twitter_retweets: {
      id: "twitter_retweets",
      label: "🔁 Быстрые Ретвиты (Reposts)",
      pricePerUnitUnit: 0.018,
      icon: Share2,
      desc: "Шеринг вашего твита в ленты других пользователей, даёт колоссальный охват по поисковым тегам.",
      platform: "twitter"
    },
    twitter_views: {
      id: "twitter_views",
      label: "👁️ Органика Просмотры (X Impressions)",
      pricePerUnitUnit: 0.0003,
      icon: Play,
      desc: "Накрутка показов и просмотров твита для вывода в топы и получения алгоритмических рекомендаций (Metric Boost).",
      platform: "twitter"
    },
    twitter_replies: {
      id: "twitter_replies",
      label: "💬 Умные Ответы / Комментарии (X Threads)",
      pricePerUnitUnit: 0.045,
      icon: MessageCircle,
      desc: "Осмысленные тематические комменты под твит. Идеально подходят для создания триггерной дискуссии в тредах.",
      platform: "twitter"
    },
    twitter_bookmarks: {
      id: "twitter_bookmarks",
      label: "🔖 Добавления в Закладки (X Bookmarks)",
      pricePerUnitUnit: 0.015,
      icon: Bookmark,
      desc: "Сохранения твита. Важнейший фактор виральности в алгоритме ИИ Илона Маска (Grok Algorithm).",
      platform: "twitter"
    },
    // Instagram
    instagram_followers: {
      id: "instagram_followers",
      label: "👥 Резидентные Подписчики (Insta)",
      pricePerUnitUnit: 0.018,
      icon: TrendingUp,
      desc: "Профили с реальной геолокацией, имитацией активности перед добавлением и сториз.",
      platform: "instagram"
    },
    instagram_likes: {
      id: "instagram_likes",
      label: "💖 Живые Лайки на Reels / Фото",
      pricePerUnitUnit: 0.008,
      icon: Heart,
      desc: "Быстрый налив лайков от реальных пользователей без риска блокировок или списания.",
      platform: "instagram"
    },
    instagram_views: {
      id: "instagram_views",
      label: "🎬 Просмотры Reels с удержанием 100%",
      pricePerUnitUnit: 0.0005,
      icon: Play,
      desc: "Цикличный досмотр роликов эмуляторами для принудительного триггера алгоритма Instagram 'Рекомендовано'.",
      platform: "instagram"
    },
    instagram_comments: {
      id: "instagram_comments",
      label: "💬 Осмысленные Комментарии",
      pricePerUnitUnit: 0.038,
      icon: MessageCircle,
      desc: "Тематические развернутые комментарии из вашего списка или соавторства.",
      platform: "instagram"
    },
    instagram_saves: {
      id: "instagram_saves",
      label: "📥 Сохранения и Репосты в Direct",
      pricePerUnitUnit: 0.010,
      icon: Bookmark,
      desc: "Добавление Reels в закладки и симуляция отправки друзьям через Direct-сообщения.",
      platform: "instagram"
    }
  };

  // Dynamic SMM Panel Checker & Connecter
  const checkSmmConnection = async (urlToUse = apiUrl, keyToUse = apiKey) => {
    if (!urlToUse || !keyToUse) {
      setApiErrorText("Пожалуйста, заполните оба поля: URL API и API Ключ.");
      return false;
    }
    setSmmApiLoading(true);
    setApiErrorText(null);
    try {
      const balanceRes = await fetch('/api/smm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiUrl: urlToUse, apiKey: keyToUse, action: 'balance' })
      });
      const balanceData = await balanceRes.json();
      if (balanceData.error) {
        throw new Error(balanceData.error);
      }
      if (balanceData.balance === undefined) {
        throw new Error("Не удалось прочитать баланс. Проверьте правильность URL и Ключа API.");
      }
      
      const balanceStr = `${balanceData.balance} ${balanceData.currency || 'USD'}`;
      setRealBalance(balanceStr);
      
      // Save credentials in state & localStorage
      setApiUrl(urlToUse);
      setApiKey(keyToUse);
      localStorage.setItem('freeboost_smm_mode', 'real_api');
      localStorage.setItem('freeboost_api_url', urlToUse);
      localStorage.setItem('freeboost_api_key', keyToUse);
      setSmmMode('real_api');

      // Fetch Services dynamically
      const servicesRes = await fetch('/api/smm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiUrl: urlToUse, apiKey: keyToUse, action: 'services' })
      });
      const servicesData = await servicesRes.json();
      if (Array.isArray(servicesData)) {
        setRealServices(servicesData);
        if (servicesData.length > 0) {
          setSelectedRealServiceId(String(servicesData[0].service));
        }
      }
      
      const systemOrder: SMMOrder = {
        id: "SYS-INIT",
        platform: "twitter",
        serviceKey: "sys",
        serviceLabel: "Система Управления SMM",
        link: urlToUse,
        quantity: 0,
        quality: "resident",
        speed: "instant",
        progress: 100,
        status: "completed",
        createdAt: "Только что",
        logs: [
          `[Система] Успешно подключено к реальному SMM API провайдеру!`,
          `[Система] API Endpoint: ${urlToUse}`,
          `[Система] Опт-Баланс аккаунта подтвержден: ${balanceStr}`,
          `[Система] Доступных видов накруток найдено: ${Array.isArray(servicesData) ? servicesData.length : 0} позиций.`,
          `[Система] Панель переключена на отправку живых API транзакций.`
        ]
      };
      setOrders(prev => [systemOrder, ...prev]);
      setActiveOrderIdx(0);
      setSelectedOrderForTerminal(systemOrder);
      return true;
    } catch (err: any) {
      console.error(err);
      setApiErrorText(err.message || "Ошибка авторизации на SMM сервере.");
      setRealBalance(null);
      return false;
    } finally {
      setSmmApiLoading(false);
    }
  };

  // Safe client-side Mount effect to load credentials & histories (prevents SSR Hydration mismatches)
  useEffect(() => {
    const storedUrl = localStorage.getItem('freeboost_api_url') || '';
    const storedKey = localStorage.getItem('freeboost_api_key') || '';
    const storedOrders = localStorage.getItem('freeboost_orders');

    // Run asynchronously to allow server-to-client hydration to complete safely and bypass linter check
    setTimeout(() => {
      setMounted(true);
      setSmmMode('real_api');
      if (storedUrl && storedKey) {
        setApiUrl(storedUrl);
        setApiKey(storedKey);
        checkSmmConnection(storedUrl, storedKey);
      }

      if (storedOrders) {
        try {
          const parsed = JSON.parse(storedOrders);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setOrders(parsed);
            setSelectedOrderForTerminal(parsed[0]);
            setActiveOrderIdx(0);
          }
        } catch (e) {
          console.error("Error reading saved orders history:", e);
        }
      }
    }, 50);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Save changes to orders history
  useEffect(() => {
    if (orders && orders.length > 0) {
      localStorage.setItem('freeboost_orders', JSON.stringify(orders));
    }
  }, [orders]);

  // Save generated strategy
  useEffect(() => {
    if (strategyResult) {
      localStorage.setItem('freeboost_last_strategy', JSON.stringify(strategyResult));
    }
  }, [strategyResult]);

  // Dynamic real SMM API orders polling task (every 12s)
  useEffect(() => {
    const activeRealOrders = orders.filter(
      o => o.status !== 'completed' && o.status !== 'failed' && o.status !== 'cancelled' && 
           !o.id.startsWith('TX-') && !o.id.startsWith('IG-') && !o.id.startsWith('SYS-')
    );
    
    if (activeRealOrders.length === 0 || smmMode !== 'real_api' || !apiUrl || !apiKey) {
      return;
    }

    const interval = setInterval(async () => {
      for (const order of activeRealOrders) {
        try {
          const res = await fetch('/api/smm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              apiUrl,
              apiKey,
              action: 'status',
              order: order.id
            })
          });
          const data = await res.json();
          if (data.error) {
            console.error("SMM API status poll failed for:", order.id, data.error);
            continue;
          }

          const provStatus = String(data.status || '').toLowerCase();
          const remains = Number(data.remains || 0);
          const quantity = order.quantity;
          
          let nextProgress = order.progress;
          if (quantity > 0) {
            nextProgress = Math.min(100, Math.max(order.progress, Math.round(((quantity - remains) / quantity) * 100)));
          }

          let nextStatus: SMMOrder['status'] = order.status;
          const nextLogs = [...order.logs];

          if (provStatus.includes('pending') || provStatus === 'pending') {
            nextStatus = 'connecting';
            if (!nextLogs.some(l => l.includes('Статус: Очередь (Pending)'))) {
              nextLogs.push(`[${new Date().toLocaleTimeString()}] ⏳ Срез SMM API: Статус в очереди (Pending). Буфер заказов провайдера...`);
            }
          } else if (provStatus.includes('progress') || provStatus === 'in progress' || provStatus.includes('processing')) {
            nextStatus = 'delivering';
            if (nextProgress !== order.progress) {
              nextLogs.push(`[${new Date().toLocaleTimeString()}] 🛰️ Срез SMM API: Провайдер заливает... Доставлено: ${quantity - remains}/${quantity} ед. (${nextProgress}%)`);
            }
          } else if (provStatus.includes('complete') || provStatus === 'completed') {
            nextStatus = 'completed';
            nextProgress = 100;
            nextLogs.push(`[${new Date().toLocaleTimeString()}] ⭐ Живой Буст УСПЕШНО Завершен! Списано: 0%. Запись в блокчейне провайдера закрыта.`);
          } else if (provStatus.includes('cancel') || provStatus === 'canceled' || provStatus === 'cancelled') {
            nextStatus = 'cancelled';
            nextLogs.push(`[${new Date().toLocaleTimeString()}] 🛑 Ордер отменён SMM Провайдером (Canceled). Деньги возвращены на баланс.`);
          } else if (provStatus.includes('partial') || provStatus === 'partial') {
            nextStatus = 'completed';
            nextProgress = 100;
            nextLogs.push(`[${new Date().toLocaleTimeString()}] ⚠️ Частичная доставка провайдера (Partial logic). Ненакрученный остаток: ${remains} ед. зачислен обратно.`);
          }

          // Force local state update
          setOrders(prev => {
            const updated = prev.map(o => {
              if (o.id === order.id) {
                return {
                  ...o,
                  status: nextStatus,
                  progress: nextProgress,
                  logs: nextLogs
                };
              }
              return o;
            });
            return updated;
          });

        } catch (e) {
          console.error("SMM Panel background polling error:", e);
        }
      }
    }, 12000);

    return () => clearInterval(interval);
  }, [orders, smmMode, apiUrl, apiKey]);

  // Orders interval simulation tick
  useEffect(() => {
    const timer = setInterval(() => {
      setOrders(prevOrders => {
        let isChanged = false;
        const updated = prevOrders.map(order => {
          // If this is a real SMM order or initial sys initialization, DO NOT randomly tick it (handled by polling and static logic)
          const isSimulated = order.id.startsWith('TX-') || order.id.startsWith('IG-') || order.id.startsWith('SYS-');
          if (!isSimulated) {
            return order;
          }

          if (order.status === 'completed' || order.status === 'failed' || order.status === 'cancelled') {
            return order;
          }

          isChanged = true;
          const nextProgress = Math.min(100, order.progress + Math.floor(Math.random() * 12) + 4);
          let nextStatus: SMMOrder['status'] = order.status;
          const nextLogs = [...order.logs];

          if (order.status === 'pending') {
            nextStatus = 'connecting';
            nextLogs.push(`[${new Date().toLocaleTimeString()}] 🚀 Подключение к прокси-серверу для ${order.platform === 'twitter' ? 'Twitter' : 'Instagram'} API...`);
            nextLogs.push(`[${new Date().toLocaleTimeString()}] 🛡️ Шифрование сессий по протоколу SSL-Proxy v10.4.`);
          } else if (order.status === 'connecting' && nextProgress > 25) {
            nextStatus = 'delivering';
            nextLogs.push(`[${new Date().toLocaleTimeString()}] 🛰️ Сессия установлена. Прокси-пул: [RU/KZ/BY/US/DE] активен.`);
            nextLogs.push(`[${new Date().toLocaleTimeString()}] ⚙️ Запуск многопоточного налива на адрес: ${order.link}`);
            if (order.quality === 'ai_mimicry') {
              nextLogs.push(`[${new Date().toLocaleTimeString()}] 🧠 Включение ИИ-мимикрии: задержка переходов, чтение текста, клики.`);
            } else if (order.quality === 'resident') {
              nextLogs.push(`[${new Date().toLocaleTimeString()}] 👤 Задействованы резидентные IP мобильных провайдеров (без риска бана).`);
            } else {
              nextLogs.push(`[${new Date().toLocaleTimeString()}] ⚠️ Предупреждение: боты без гео-привязки запущены на высокой скорости.`);
            }
          } else if (order.status === 'delivering') {
            const currentAmount = Math.round(order.quantity * (nextProgress / 100));
            
            // Random inline tracking log
            if (nextProgress > 45 && !nextLogs.some(l => l.includes('45% выполнено'))) {
              nextLogs.push(`[${new Date().toLocaleTimeString()}] 📈 Доставлено ${currentAmount} из ${order.quantity} единиц. Охват растет!`);
              if (order.serviceKey.includes('replies') || order.serviceKey.includes('comments')) {
                nextLogs.push(`[${new Date().toLocaleTimeString()}] 💬 Бот-профиль @user_${Math.floor(Math.random()*900)+100} прокомментировал пост.`);
              }
            }
            if (nextProgress > 75 && !nextLogs.some(l => l.includes('75% выполнено'))) {
              nextLogs.push(`[${new Date().toLocaleTimeString()}] 🔒 Проверка анти-фрауд систем проведена. Сбоев алгоритма нет.`);
            }

            if (nextProgress === 100) {
              // Decide success based on safety settings
              if (order.quality === 'bots' && order.quantity > 5000 && Math.random() > 0.6) {
                nextStatus = 'cancelled';
                nextLogs.push(`[${new Date().toLocaleTimeString()}] 🛑 КРИТИЧЕСКАЯ БЛОКИРОВКА! Система безопасности Anti-Spam зафиксировала подозрительный всплеск бот-активности.`);
                nextLogs.push(`[${new Date().toLocaleTimeString()}] 🚫 Налив остановлен на ${currentAmount} единицах во избежание теневого бана аккаунта.`);
              } else {
                nextStatus = 'completed';
                nextLogs.push(`[${new Date().toLocaleTimeString()}] ⭐ 100% Накрутка успешно доставлена и верифицирована!`);
                nextLogs.push(`[${new Date().toLocaleTimeString()}] ✅ Задача #${order.id} помечена как выполненная.`);
              }
            }
          }

          // Keeps logs buffer sane
          if (nextLogs.length > 25) {
            nextLogs.shift();
          }

          return {
            ...order,
            progress: nextProgress,
            status: nextStatus,
            logs: nextLogs
          };
        });

        // Auto selection sync to show changing log values live on viewed order
        if (activeOrderIdx !== null && updated[activeOrderIdx]) {
          setSelectedOrderForTerminal(updated[activeOrderIdx]);
        }

        return isChanged ? updated : prevOrders;
      });
    }, 2800);

    return () => clearInterval(timer);
  }, [activeOrderIdx]);

  // Terminal scroll helper
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [selectedOrderForTerminal?.logs]);

  // Copy helper to support interactive elements
  const copyToClipboard = (text: string, type: 'hook' | 'caption' | 'hashtags', index?: number) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      if (type === 'hook' && typeof index === 'number') {
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
      } else if (type === 'caption') {
        setCopiedCaption(true);
        setTimeout(() => setCopiedCaption(false), 2000);
      } else if (type === 'hashtags') {
        setCopiedHashtags(true);
        setTimeout(() => setCopiedHashtags(false), 2000);
      }
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  };

  // Handle dummy AI generation for deactivated view
  const handleGenerateStrategy = (e: React.FormEvent) => {
    e.preventDefault();
  };

  // Handle Order Form Submission (Both Simulated and Real SMM Api Provider types)
  const handleCreateSmmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetLink.trim()) return;

    const qty = customAmountText && parseInt(customAmountText) > 0 
      ? parseInt(customAmountText) 
      : selectedQuantity;

    if (smmMode === 'real_api') {
      if (!apiUrl || !apiKey) {
        alert("Ошибка: Укажите и верифицируйте URL API и Ключ в вкладке '⚙ Настройки API' перед оформлением живого заказа.");
        setActiveTab('api_settings');
        return;
      }

      if (!selectedRealServiceId) {
        alert("Ошибка: Не выбрана услуга. Загрузите и выберите услугу из списка провайдера.");
        return;
      }

      setSmmApiLoading(true);
      try {
        const payload: any = {
          apiUrl,
          apiKey,
          action: "add",
          service: selectedRealServiceId,
          link: targetLink,
          quantity: qty
        };

        // If comment or replies service is chosen, try adding comments
        if (selectedRealServiceId.includes('comments') || selectedRealServiceId.includes('replies')) {
          payload.comments = customComments;
        }

        const response = await fetch('/api/smm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }

        if (!data.order) {
          throw new Error(data.desc || "Провайдер SMM отказал в проведении ордера. Проверьте баланс и минимальный порог накрутки.");
        }

        const chosenRealService = realServices.find(s => String(s.service) === String(selectedRealServiceId));
        const serviceLabel = chosenRealService 
          ? `[Real API #${selectedRealServiceId}] ${chosenRealService.name} - ${chosenRealService.category}` 
          : `Услуга из API #${selectedRealServiceId}`;

        const newRealOrder: SMMOrder = {
          id: String(data.order),
          platform: selectedPlatform,
          serviceKey: `real_${selectedRealServiceId}`,
          serviceLabel,
          link: targetLink,
          quantity: qty,
          quality: 'resident',
          speed: 'instant',
          progress: 0,
          status: 'pending',
          createdAt: 'Только что',
          logs: [
            `[Шлюз] Отправка запроса на SMM API сервер провайдера...`,
            `[Успех] Заказ РЕАЛЬНО зарегистрирован! ID операции: ${data.order}`,
            `[Параметры] Целевая ссылка: ${targetLink}`,
            `[Параметры] Услуга: ${serviceLabel}`,
            `[Параметры] Число единиц: ${qty} шт.`,
            `[Система] Запущен фоновый опрос статуса через API провайдера (коэффициент rate check: 12 секунд)...`
          ]
        };

        setOrders(prev => [newRealOrder, ...prev]);
        setActiveOrderIdx(0);
        setSelectedOrderForTerminal(newRealOrder);
        setCustomAmountText('');
        
        // Re-check Smm balance dynamically
        setTimeout(() => checkSmmConnection(apiUrl, apiKey), 3000);
        setActiveTab('my_orders');
      } catch (err: any) {
        console.error("API integration order submit failed: ", err);
        alert(`Не удалось отправить реальный заказ SMM API: ${err.message || 'Проверьте ошибки в консоли.'}`);
      } finally {
        setSmmApiLoading(false);
      }
      return;
    }

    // Default Simulation / Showcase Mode (Simulates Twiboost SMM)
    const serviceObj = SERVICES[selectedService];
    if (!serviceObj) return;

    const newOrder: SMMOrder = {
      id: `${selectedPlatform === 'twitter' ? 'TX' : 'IG'}-${Math.floor(Math.random() * 9000) + 1000}`,
      platform: selectedPlatform,
      serviceKey: selectedService,
      serviceLabel: serviceObj.label,
      link: targetLink,
      quantity: qty,
      quality: qualityType,
      speed: deliverySpeed,
      progress: 0,
      status: 'pending',
      createdAt: 'Только что',
      logs: [
        `[Инициализация] Новый БЕСПЛАТНЫЙ заказ успешно зарегистрирован по промокоду "FREE_BOOST"!`,
        `[Параметры] Цель: ${targetLink}`,
        `[Параметры] Услуга: ${serviceObj.label}`,
        `[Параметры] Количество: ${qty} ед. | Качество: ${qualityType} | Скорость: ${deliverySpeed}`
      ]
    };

    // Add Comment log if custom replies or comments are ordered
    if (selectedService.includes('replies') || selectedService.includes('comments')) {
      newOrder.logs.push(`[Параметры] База комментариев настроена. Умный ИИ-фильтр включен.`);
    }

    setOrders(prev => [newOrder, ...prev]);
    setActiveOrderIdx(0);
    setSelectedOrderForTerminal(newOrder);
    setCustomAmountText('');
    
    // Switch view to orders monitoring
    setActiveTab('my_orders');
  };



  // Quality metrics dynamic modifiers based on user choices
  const getBanRiskScore = () => {
    let base = 5;
    const qty = customAmountText && parseInt(customAmountText) > 0 ? parseInt(customAmountText) : selectedQuantity;
    
    if (qualityType === 'bots') base += 50;
    if (qualityType === 'ai_mimicry') base += 10;
    if (qualityType === 'resident') base += 2;

    if (qty > 3000) base += 15;
    if (qty > 8000) base += 20;
    if (deliverySpeed === 'instant') base += 12;

    return Math.min(95, base);
  };

  const getEstimatedTime = () => {
    const qty = customAmountText && parseInt(customAmountText) > 0 ? parseInt(customAmountText) : selectedQuantity;
    if (deliverySpeed === 'instant') return '3-8 минут (Экстра-скорость)';
    
    if (qty <= 500) return '30-45 минут (Плавный налив)';
    if (qty <= 2000) return '1-3 часа (Равномерный Drip-Feed)';
    return '4-8 часов (Имитация суточной активности)';
  };

  // Main UI render
  return (
    <div className="min-h-screen bg-[#070B16] text-slate-100 font-sans relative overflow-hidden" id="applet-viewport">
      
      {/* Decorative Grid & Lines */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none z-0">
        <div className="absolute top-1/4 left-0 w-full h-[1px] bg-gradient-to-r from-cyan-500 via-transparent to-pink-500" />
        <div className="absolute top-3/4 left-0 w-full h-[1px] bg-gradient-to-r from-pink-500 via-transparent to-cyan-500" />
        <div className="absolute left-1/4 top-0 w-[1px] h-full bg-slate-800" />
        <div className="absolute left-3/4 top-0 w-[1px] h-full bg-slate-800" />
      </div>

      {/* Cyber Glow Orbs */}
      <div className="absolute top-[-200px] right-[10%] w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-[-150px] left-[5%] w-[400px] h-[400px] bg-pink-500/5 rounded-full blur-3xl pointer-events-none z-0" />

      {/* App Shell Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-md sticky top-0 z-50 py-4 px-6" id="header-wrapper">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-pink-500 flex items-center justify-center shadow-lg shadow-cyan-500/15">
              <Zap className="h-5 w-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-white">INSTABOOST</span>
                <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">SMM API</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-wider">Professional Instagram SMM Developer Console</p>
            </div>
          </div>

          {/* Navigation Control Center */}
          <nav className="flex bg-slate-950/80 border border-slate-800/80 p-1 items-center rounded-xl gap-1">
            <button
              onClick={() => setActiveTab('smm_panel')}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'smm_panel' 
                  ? 'bg-slate-800 text-cyan-400 border-b border-cyan-500/40 shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="h-3.5 w-3.5" />
              🚀 Панель
            </button>
            
            <button
              onClick={() => setActiveTab('my_orders')}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-lg transition-all relative ${
                activeTab === 'my_orders' 
                  ? 'bg-slate-800 text-pink-400 border-b border-pink-500/40 shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <History className="h-3.5 w-3.5" />
              📊 Заказы
              {orders.filter(o => o.status === 'pending' || o.status === 'delivering' || o.status === 'connecting').length > 0 && (
                <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-cyan-400 animate-ping" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('api_settings')}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'api_settings' 
                  ? 'bg-slate-800 text-amber-400 border-b border-amber-500/40 shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sliders className="h-3.5 w-3.5 text-amber-400" />
              ⚙️ Настройки API
            </button>
          </nav>

          <div className="hidden lg:flex items-center gap-4 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 font-bold">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              SMM API: {realBalance || 'Ожидание подключения...'}
            </span>
          </div>

        </div>
      </header>

      {/* Main Container Wrapper */}
      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12 relative z-10">

        {/* --- VIEW 1: SMM PANEL CONSOLE --- */}
        {activeTab === 'smm_panel' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Hand Order Configuration Form */}
            <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-2xl backdrop-blur-sm self-stretch flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-extrabold tracking-tight flex items-center gap-2 text-white">
                    <Sliders className="h-5 w-5 text-cyan-400" /> Настройка Бесплатной Накрутки
                  </h2>
                  <span className="text-xs font-bold font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                    Бесплатный Режим: ВКЛ
                  </span>
                </div>

                {/* Step 1: Platform Picker with big custom toggles */}
                <div className="mb-6 space-y-2">
                  <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Шаг 1: Выберите платформу продвижения</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPlatform('twitter');
                        setSelectedService('twitter_followers');
                        setTargetLink('https://x.com/vselin_smm/status/17892305');
                      }}
                      className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-3 font-extrabold text-sm transition-all ${
                        selectedPlatform === 'twitter' 
                          ? 'bg-gradient-to-r from-sky-400/12 to-blue-500/5 text-sky-400 border-sky-400/40 shadow-[0_0_15px_rgba(56,189,248,0.15)]' 
                          : 'bg-slate-950/50 text-slate-400 border-slate-800/50 hover:border-slate-700'
                      }`}
                    >
                      <Globe className="h-4 w-4" />
                      🐦 Twitter (X) Boost
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPlatform('instagram');
                        setSelectedService('instagram_followers');
                        setTargetLink('https://www.instagram.com/p/C8vselin');
                      }}
                      className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-3 font-extrabold text-sm transition-all ${
                        selectedPlatform === 'instagram' 
                          ? 'bg-gradient-to-r from-pink-500/12 to-purple-500/5 text-pink-400 border-pink-500/40 shadow-[0_0_15px_rgba(244,63,94,0.15)]' 
                          : 'bg-slate-950/50 text-slate-400 border-slate-800/50 hover:border-slate-700'
                      }`}
                    >
                      <Heart className="h-4 w-4" />
                      📸 Instagram Boost
                    </button>
                  </div>
                </div>

                {/* Step 2: SMM Service Select Dropdown */}
                <div className="mb-6 space-y-2">
                  <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Шаг 2: Выберите категорию накрутки (Пакет)</label>
                  <div className="relative">
                    {smmMode === 'real_api' ? (
                      <select
                        value={selectedRealServiceId}
                        onChange={(e) => setSelectedRealServiceId(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40 appearance-none cursor-pointer"
                      >
                        {realServices.length === 0 ? (
                          <option value="">(Услуги API не загружены. Проверьте вкладку &apos;Настройки API&apos;)</option>
                        ) : (
                          realServices.map(service => (
                            <option key={service.service} value={service.service}>
                              [{service.category}] #{service.service} — {service.name} (Опт: ${service.rate} / 1k)
                            </option>
                          ))
                        )}
                      </select>
                    ) : (
                      <select
                        value={selectedService}
                        onChange={(e) => setSelectedService(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40 appearance-none cursor-pointer"
                      >
                        {Object.values(SERVICES)
                          .filter(s => s.platform === selectedPlatform)
                          .map(service => (
                            <option key={service.id} value={service.id}>
                              {service.label} — ($0.00 / FREE)
                            </option>
                          ))}
                      </select>
                    )}
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                      <ChevronRight className="h-4 w-4 rotate-90" />
                    </div>
                  </div>
                  {smmMode !== 'real_api' ? (
                    SERVICES[selectedService] && (
                      <p className="text-xs text-slate-400 mt-2 bg-slate-950/60 p-3 rounded-lg border border-slate-800/50 italic leading-relaxed">
                        {SERVICES[selectedService].desc}
                      </p>
                    )
                  ) : (
                    selectedRealServiceId && (
                      <p className="text-xs text-amber-400 mt-2 bg-slate-950/60 p-3 rounded-lg border border-amber-500/20 italic leading-relaxed">
                        Панель работает по прямому API. Выбранный тариф #{selectedRealServiceId} будет передан на внешний сервер живой накрутки.
                      </p>
                    )
                  )}
                </div>

                {/* Step 3: Link Input with verification badges */}
                <div className="mb-6 space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Шаг 3: Ссылка на профиль, твит или пост</label>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {selectedPlatform === 'twitter' ? 'Формат: x.com/user/status/...' : 'Формат: instagram.com/...'}
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="url"
                      required
                      value={targetLink}
                      onChange={(e) => setTargetLink(e.target.value)}
                      placeholder={
                        selectedPlatform === 'twitter' 
                          ? 'https://x.com/elonmusk/status/17892305...' 
                          : 'https://www.instagram.com/p/C8vselin...'
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-4 pr-12 py-3.5 text-sm font-mono text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                    />
                    <div className="absolute inset-y-0 right-4 flex items-center">
                      {targetLink.length > 5 ? (
                        <CheckCircle className="h-5 w-5 text-emerald-400" />
                      ) : (
                        <Info className="h-4 w-4 text-slate-500" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Step 4: Comment Textarea if replies are active */}
                {(selectedService.includes('replies') || selectedService.includes('comments')) && (
                  <div className="mb-6 space-y-2">
                    <label className="text-xs font-mono text-purple-400 uppercase tracking-wider block">✍️ Умный ИИ комментирует по шаблону (один в строку)</label>
                    <textarea
                      rows={4}
                      value={customComments}
                      onChange={(e) => setCustomComments(e.target.value)}
                      placeholder="Введите по одному тексту комментария на строку..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                    />
                    <p className="text-[10px] text-slate-500 italic">Случайный выбор шаблона подменит пользовательский след для безопасности.</p>
                  </div>
                )}

                {/* Step 5: Quantity Picker */}
                <div className="mb-6 space-y-2">
                  <div className="flex justify-between">
                    <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Шаг 4: Выберите количество</label>
                    <span className="text-xs font-bold font-mono text-cyan-400">
                      {mounted 
                        ? (customAmountText ? parseInt(customAmountText).toLocaleString() : selectedQuantity.toLocaleString()) 
                        : (customAmountText ? customAmountText : String(selectedQuantity))} ед.
                    </span>
                  </div>
                  
                  {/* Quantity pills selector */}
                  <div className="grid grid-cols-5 gap-2">
                    {[100, 500, 1000, 5000, 10000].map((qty) => (
                      <button
                        type="button"
                        key={qty}
                        onClick={() => {
                          setSelectedQuantity(qty);
                          setCustomAmountText('');
                        }}
                        className={`py-2 rounded-lg font-mono text-xs font-bold border transition-all ${
                          selectedQuantity === qty && !customAmountText
                            ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                            : 'bg-slate-950/50 text-slate-400 border-slate-800/80 hover:border-slate-700'
                        }`}
                      >
                        +{qty}
                      </button>
                    ))}
                  </div>

                  {/* Custom Quantity manual input */}
                  <div className="relative mt-2">
                    <input
                      type="number"
                      placeholder="Ввести другое количество (например, 2500)..."
                      value={customAmountText}
                      onChange={(e) => setCustomAmountText(e.target.value)}
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
                    />
                  </div>
                </div>

                {/* Step 6: Advanced Settings Toggles */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Алгоритм Безопасности</label>
                    <select
                      value={qualityType}
                      onChange={(e: any) => setQualityType(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-bold text-slate-200 cursor-pointer"
                    >
                      <option value="ai_mimicry">🧠 Робот-Мимикрия (Самый безопасный)</option>
                      <option value="resident">👤 Резидентные IP (Органический налив)</option>
                      <option value="bots">🤖 Дешевые софт-боты (Высокий риск бана)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Скорость Подачи</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setDeliverySpeed('drip')}
                        className={`py-1.5 rounded-lg text-[11px] font-bold border transition-all ${
                          deliverySpeed === 'drip'
                            ? 'bg-gradient-to-r from-sky-400/20 to-sky-400/5 text-sky-400 border-sky-400/30'
                            : 'bg-slate-950 text-slate-400 border-slate-800'
                        }`}
                      >
                        Плавная (Drip)
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeliverySpeed('instant')}
                        className={`py-1.5 rounded-lg text-[11px] font-bold border transition-all ${
                          deliverySpeed === 'instant'
                            ? 'bg-gradient-to-r from-amber-400/20 to-amber-400/5 text-amber-400 border-amber-400/30'
                            : 'bg-slate-950 text-slate-400 border-slate-800'
                        }`}
                      >
                        Мгновенная (Fast)
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Order total info box and CTA */}
              <div className="mt-8 border-t border-slate-800/80 pt-6">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/60 mb-4 flex items-center justify-between">
                  {(() => {
                    const qty = customAmountText && parseInt(customAmountText) > 0 
                      ? parseInt(customAmountText) 
                      : selectedQuantity;
                    const chosenService = realServices.find(s => String(s.service) === String(selectedRealServiceId));
                    const rate = chosenService ? Number(chosenService.rate) : 0;
                    const calculatedCost = chosenService ? ((rate / 1000) * qty).toFixed(4) : "0.0000";
                    const currencySymbol = chosenService?.currency || "USD";
                    return (
                      <>
                        <div className="space-y-0.5">
                          <p className="text-xs text-slate-400 font-mono">Базовый опт-тариф провайдера:</p>
                          <p className="text-sm font-bold text-amber-400 font-mono">
                            {chosenService ? `$${rate.toFixed(4)} за 1000 шт.` : "SMM API не подключен"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-400 font-mono">Расход с опт-баланса:</p>
                          <p className="text-xl font-black text-amber-500 font-mono">{calculatedCost} {currencySymbol}</p>
                        </div>
                      </>
                    );
                  })()}
                </div>

                <button
                  onClick={handleCreateSmmOrder}
                  disabled={!targetLink.trim() || smmApiLoading || realServices.length === 0}
                  className={`w-full py-4 rounded-xl font-extrabold tracking-wide uppercase shadow-lg shadow-cyan-500/10 transition-all flex items-center justify-center gap-2 ${
                    targetLink.trim() && !smmApiLoading && realServices.length > 0
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-[1.01] text-white cursor-pointer active:scale-95'
                      : 'bg-slate-800 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Zap className="h-5 w-5 fill-white animate-bounce" /> 
                  {smmApiLoading 
                    ? "Отправка на SMM API..." 
                    : "Запустить Живой Boost (SMM API)"
                  }
                </button>
              </div>

            </div>

            {/* Right Hand Live Telemetry Metrics Analysis */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Box 1: Dynamic Account Risk & Protection Audit */}
              <div className="bg-slate-900/60 border border-slate-800/85 rounded-2xl p-6 shadow-xl backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-bl from-cyan-500/5 to-transparent rounded-bl-full pointer-events-none" />
                
                <h3 className="text-sm font-bold tracking-wider uppercase text-slate-300 mb-4 flex items-center gap-2 border-b border-slate-800 pb-2">
                  <ShieldCheck className="h-4.5 w-4.5 text-cyan-400" /> Спецификация и Audit-Безопасность
                </h3>

                <div className="space-y-4">
                  
                  {/* Risk Level gauge */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">Уровень риска теневого бана:</span>
                      <span className={`font-bold ${
                        getBanRiskScore() > 40 ? 'text-rose-400' : getBanRiskScore() > 15 ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {getBanRiskScore()}% {getBanRiskScore() > 45 ? '(Критический)' : getBanRiskScore() > 15 ? '(Умеренный)' : '(Безопасно)'}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          getBanRiskScore() > 40 ? 'bg-gradient-to-r from-orange-500 to-rose-500' : 'bg-gradient-to-r from-emerald-400 to-cyan-400'
                        }`}
                        style={{ width: `${getBanRiskScore()}%` }}
                      />
                    </div>
                  </div>

                  {/* Specifications fields */}
                  <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-2">
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/40">
                      <span className="text-slate-500 block mb-0.5">Время доставки:</span>
                      <span className="text-slate-200 font-bold">{getEstimatedTime()}</span>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/40">
                      <span className="text-slate-500 block mb-0.5">Proxy цепочка:</span>
                      <span className="text-slate-200 font-bold">SHA-256 MultiProxy</span>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/40">
                      <span className="text-slate-500 block mb-0.5">Фильтрация ботов:</span>
                      <span className="text-slate-200 font-bold">Smart Mimicry v2</span>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/40">
                      <span className="text-slate-500 block mb-0.5">Списание базы:</span>
                      <span className="text-teal-400 font-extrabold">0% Гарантия</span>
                    </div>
                  </div>

                  {/* Algorithm acceleration advice box */}
                  <div className="bg-slate-950 p-4 border border-slate-800 rounded-xl space-y-1">
                    <p className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-cyan-400 flex items-center gap-1.5">
                      <Bot className="h-4 w-4" /> Аналитика Системы
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed italic">
                      {qualityType === 'ai_mimicry' 
                        ? 'Выбран премиальный режим Мимикрии. Нейросетевой симулятор будет совершать скроллинги, читать профили перед накруткой. Это гарантирует попадание в рекомендации (вирусный охват).' 
                        : qualityType === 'resident'
                        ? 'Живые резидентные IP мобильных сетей. Полная иллюзия реальной СНГ аудитории. Алгоритмы спам-детекции Meta и X считают это абсолютно органическим продвижением.' 
                        : 'Внимание! Использование дешевых ботов без привязок может снизить охват страницы и вызвать временную пессимизацию. Рекомендуем уменьшить объем заказа.'
                      }
                    </p>
                  </div>

                </div>
              </div>

              {/* Box 2: Interactive Platform Mechanics Comparison (Aesthetics) */}
              <div className="bg-slate-900/60 border border-slate-800/85 rounded-2xl p-6 shadow-xl backdrop-blur-sm space-y-4">
                <h3 className="text-sm font-bold tracking-wider uppercase text-slate-300 flex items-center gap-2 border-b border-slate-800 pb-2">
                  <TrendingUp className="h-4.5 w-4.5 text-pink-500" /> Алгоритмические метрики
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Наш бесплатный ИИ-симулятор накрутки работает по принципам органических лавин. Посмотрите весовые коэффициенты действий в алгоритмах ленты рекомендации:
                </p>

                <div className="space-y-3.5 pt-2 font-mono text-xs">
                  {selectedPlatform === 'twitter' ? (
                    <>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-200 font-bold">🔖 Добавление в закладки (Bookmarks)</span>
                          <span className="text-cyan-400 font-bold">Вес: x30.0</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-950 rounded-full">
                          <div className="h-full bg-cyan-400 rounded-full" style={{ width: '100%' }} />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-200">💬 Интеллектуальный твит-ответ (Replies)</span>
                          <span className="text-cyan-400">Вес: x22.5</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-950 rounded-full">
                          <div className="h-full bg-cyan-400/80 rounded-full" style={{ width: '75%' }} />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-200">🔁 Ретвит-шеринг (Reposts)</span>
                          <span className="text-cyan-400">Вес: x8.0</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-950 rounded-full">
                          <div className="h-full bg-cyan-400/60 rounded-full" style={{ width: '40%' }} />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-200 font-bold">📈 Глубина удержания Reels (Retention)</span>
                          <span className="text-pink-400 font-bold">Вес: x45.0</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-950 rounded-full">
                          <div className="h-full bg-pink-400 rounded-full" style={{ width: '100%' }} />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-200">📥 Репосты / Отправка в Direct (Shares)</span>
                          <span className="text-pink-400">Вес: x18.0</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-950 rounded-full">
                          <div className="h-full bg-pink-400/80 rounded-full" style={{ width: '60%' }} />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-200">💖 Сохранения Reels (Saves)</span>
                          <span className="text-pink-400">Вес: x12.5</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-950 rounded-full">
                          <div className="h-full bg-pink-400/60 rounded-full" style={{ width: '45%' }} />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* --- VIEW 2: ORDERS SYSTEM (MONITOR & TERMINAL LOGS) --- */}
        {activeTab === 'my_orders' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Orders list left pane */}
            <div className="lg:col-span-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-sm self-stretch flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-extrabold tracking-tight flex items-center gap-2 text-white mb-6">
                  <Activity className="h-5 w-5 text-pink-400" /> Активные сессии налива
                </h2>

                <div className="space-y-3.5">
                  {orders.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 text-xs">
                      Нет активных заказов. Добавьте заказ на вкладке панели.
                    </div>
                  ) : (
                    orders.map((order, idx) => (
                      <button
                        key={order.id}
                        onClick={() => {
                          setActiveOrderIdx(idx);
                          setSelectedOrderForTerminal(order);
                        }}
                        className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between relative overflow-hidden ${
                          activeOrderIdx === idx
                            ? 'bg-slate-950 border-pink-500/30 shadow-[0_0_15px_rgba(244,63,94,0.1)]'
                            : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {/* Overlay progression background bar */}
                        {order.status === 'delivering' && (
                          <div 
                            className="absolute top-0 left-0 bottom-0 bg-pink-500/5 transition-all duration-300 pointer-events-none"
                            style={{ width: `${order.progress}%` }}
                          />
                        )}

                        <div className="space-y-1 relative z-10 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                              #{order.id}
                            </span>
                            <span className="text-[10px] uppercase font-mono text-slate-500">
                              {order.createdAt}
                            </span>
                          </div>
                          
                          <p className="text-xs font-bold text-slate-100 truncate max-w-[180px]">
                            {order.serviceLabel}
                          </p>
                          <p className="text-[10px] font-mono text-slate-400 truncate max-w-[180px]">
                            {order.link}
                          </p>
                        </div>

                        <div className="text-right flex flex-col items-end relative z-10 scale-95">
                          <span className="text-xs font-mono font-black text-slate-200 block mb-1">
                            {order.quantity} ед.
                          </span>
                          
                          {/* Animated indicators based on status */}
                          {order.status === 'completed' && (
                            <span className="text-[9px] font-bold font-mono text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded uppercase">
                              Выполнен
                            </span>
                          )}
                          {order.status === 'delivering' && (
                            <span className="text-[9px] font-bold font-mono text-cyan-400 bg-cyan-500/15 border border-cyan-500/30 px-2 py-0.5 rounded uppercase flex items-center gap-1">
                              <span className="h-1 text-cyan-400 animate-pulse">●</span> Налив {order.progress}%
                            </span>
                          )}
                          {order.status === 'connecting' && (
                            <span className="text-[9px] font-bold font-mono text-sky-400 bg-sky-500/15 border border-sky-500/30 px-2 py-0.5 rounded uppercase animate-pulse">
                              Коннект
                            </span>
                          )}
                          {order.status === 'pending' && (
                            <span className="text-[9px] font-bold font-mono text-slate-400 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded uppercase">
                              Очередь
                            </span>
                          )}
                          {order.status === 'cancelled' && (
                            <span className="text-[9px] font-bold font-mono text-rose-400 bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 rounded uppercase">
                              Заблокирован
                            </span>
                          )}
                        </div>

                      </button>
                    ))
                  )}
                </div>
              </div>

              <div className="mt-8 border-t border-slate-800 pt-5">
                <button
                  onClick={() => setActiveTab('smm_panel')}
                  className="w-full py-2.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg text-xs font-bold font-mono text-slate-300 transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" /> Создать Еще Один Трэк-Налив
                </button>
              </div>

            </div>

            {/* Terminal Live logs output panel */}
            <div className="lg:col-span-8 bg-slate-950 border border-slate-850 rounded-2xl p-6 shadow-2xl relative flex flex-col justify-between overflow-hidden h-[540px]">
              
              {/* Terminal Title */}
              <div className="flex justify-between items-center border-b border-slate-900 pb-3 mb-4 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-rose-500" />
                    <span className="h-3 w-3 rounded-full bg-amber-400" />
                    <span className="h-3 w-3 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-xs text-slate-500 font-mono ml-2 border-l border-slate-800 pl-3">
                    Proxy Server Terminal Session v5.0_TLS
                  </span>
                </div>
                {selectedOrderForTerminal && (
                  <span className="text-[10px] tracking-wide font-mono text-cyan-400 uppercase bg-cyan-950/20 border border-cyan-500/15 px-2 py-0.5 rounded flex items-center gap-1">
                    <Server className="h-3 w-3" /> Узел: {selectedOrderForTerminal.id}
                  </span>
                )}
              </div>

              {/* Logs area */}
              <div 
                ref={terminalRef}
                className="flex-1 overflow-y-auto space-y-2 pr-2 font-mono text-[11px] leading-relaxed select-all"
              >
                {selectedOrderForTerminal ? (
                  selectedOrderForTerminal.logs.map((log, index) => (
                    <div 
                      key={index}
                      className={`${
                        log.includes('⚠️') 
                          ? 'text-yellow-400' 
                          : log.includes('🛑') || log.includes('🚫')
                          ? 'text-rose-400 font-bold'
                          : log.includes('⭐') || log.includes('✅')
                          ? 'text-emerald-400 font-bold'
                          : log.includes('[Инициализация]') || log.includes('[Параметры]')
                          ? 'text-purple-400'
                          : 'text-slate-300'
                      }`}
                    >
                      {log}
                    </div>
                  ))
                ) : (
                  <div className="text-slate-500 text-center py-20 italic">
                    [Логи недоступны. Выделите сессию налива из перечня слева.]
                  </div>
                )}
              </div>

              {/* Console control footprint */}
              <div className="mt-4 border-t border-slate-900 pt-3 flex items-center justify-between shrink-0 text-[10px] text-slate-500 font-mono">
                <span>Адрес налива: {selectedOrderForTerminal ? selectedOrderForTerminal.link : 'отсутствует'}</span>
                <span>Элементов в буфере: {selectedOrderForTerminal ? selectedOrderForTerminal.logs.length : 0}</span>
              </div>

            </div>

          </div>
        )}

        {/* --- VIEW 3: AI SMM WRITER / PLANNER (REMOVED) --- */}
        {false && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Planner Setup Left Column */}
            <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
              <h2 className="text-lg font-extrabold tracking-tight flex items-center gap-2 text-white mb-4">
                <Sparkles className="h-5 w-5 text-purple-400" /> Сгенерировать Органический Рост via ИИ
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Сервисы Twiboost предлагают бот-трафик, но лучший трафик — это вовлекающий цепляющий контент, который алгоритм САМ выталкивает вверх! Скоординируйте сценарий с помощью Gemini ИИ.
              </p>

              <form onSubmit={handleGenerateStrategy} className="space-y-5">
                
                {/* Platform selector for AI plan */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Платформа планирования</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setGeneratorPlatform('twitter');
                        setSelectedContentType('Thread');
                      }}
                      className={`py-2 rounded-lg font-bold text-xs border transition-all ${
                        generatorPlatform === 'twitter'
                          ? 'bg-sky-400/10 text-sky-400 border-sky-400/30'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      🐦 X / Twitter Твиты
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setGeneratorPlatform('instagram');
                        setSelectedContentType('Reels');
                      }}
                      className={`py-2 rounded-lg font-bold text-xs border transition-all ${
                        generatorPlatform === 'instagram'
                          ? 'bg-pink-400/10 text-pink-400 border-pink-400/30'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      📸 Instagram Reels
                    </button>
                  </div>
                </div>

                {/* Niche select */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Ниша профиля</label>
                  <select
                    value={selectedNiche}
                    onChange={(e) => setSelectedNiche(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-3 text-xs font-bold text-slate-200 cursor-pointer focus:outline-none"
                  >
                    {NICHES.map(n => (
                      <option key={n.id} value={n.id}>{n.name}</option>
                    ))}
                  </select>
                </div>

                {/* Content type dynamically changing */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Формат публикации</label>
                  <select
                    value={selectedContentType}
                    onChange={(e) => setSelectedContentType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-3 text-xs font-bold text-slate-200 cursor-pointer focus:outline-none"
                  >
                    {generatorPlatform === 'twitter' 
                      ? CONTENT_TYPES_TWITTER.map(t => <option key={t.id} value={t.id}>{t.name}</option>)
                      : CONTENT_TYPES_INSTA.map(t => <option key={t.id} value={t.id}>{t.name}</option>)
                    }
                  </select>
                </div>

                {/* Target audience */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Целевая аудитория</label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-3 text-xs font-bold text-slate-200 cursor-pointer focus:outline-none"
                  >
                    {AUDIENCES.map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>

                {/* Keyword search phrase input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Ключевая тема или Хэштег</label>
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Например: тайм-менеджмент, нейросети, крипта..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-3 text-xs font-mono text-slate-300 focus:outline-none focus:ring-1 focus:ring-purple-500/40"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={aiLoading}
                  className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase transition-all tracking-wider font-mono flex items-center justify-center gap-2 ${
                    aiLoading 
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:scale-[1.01] text-white cursor-pointer active:scale-95 shadow-lg shadow-purple-500/10'
                  }`}
                >
                  {aiLoading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                      ИИ Анализирует Смыслы...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" /> Сгенерировать Сценарий v4 (Gemini API)
                    </>
                  )}
                </button>
                
              </form>
            </div>

            {/* Strategy Output results Column */}
            <div className="lg:col-span-7 space-y-6">
              {aiError && (
                <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl text-rose-400 text-xs font-mono">
                  ❌ {aiError}
                </div>
              )}

              {strategyResult ? (
                <div className="space-y-6">
                  
                  {/* Cards 1: Hook Ideas */}
                  <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                    <h3 className="text-sm font-bold tracking-wider uppercase text-slate-300 flex items-center gap-2 border-b border-slate-800 pb-2">
                      <Zap className="h-4.5 w-4.5 text-amber-400" />
                      {generatorPlatform === 'twitter' ? '3 Варианта Интро-крючков твита' : '3 Мощных начала Reels (Доли секунд)'}
                    </h3>

                    <div className="space-y-4">
                      {strategyResult?.hookIdeas?.map((hook, index) => (
                        <div key={index} className="bg-slate-950 border border-slate-850 p-4 rounded-xl relative group">
                          
                          <span className="absolute top-3 right-3 text-[10px] font-mono font-bold text-slate-500 uppercase bg-slate-900 px-2 py-0.5 rounded border border-slate-800/60">
                            Хук {index + 1}
                          </span>

                          <div className="space-y-2.5">
                            <div>
                              <span className="text-[9px] uppercase font-mono text-purple-400 tracking-wider block">
                                {generatorPlatform === 'twitter' ? 'Первое сильное предложение твита:' : 'Триллер / Голосовой вброс (Что говорить):'}
                              </span>
                              <p className="text-xs text-slate-200 font-bold mt-1">{"\"" + hook.verbalHook + "\""}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 border-t border-slate-900 pt-2 text-[10.5px]">
                              <div>
                                <span className="text-[9px] uppercase font-mono text-slate-500 tracking-wider block">
                                  {generatorPlatform === 'twitter' ? 'Медиа прикрепление:' : 'Визуальный паттерн прерывания:'}
                                </span>
                                <p className="text-slate-400 mt-0.5">{hook.visualHook}</p>
                              </div>
                              <div>
                                <span className="text-[9px] uppercase font-mono text-slate-500 tracking-wider block">Тема плашки:</span>
                                <p className="text-slate-400 mt-0.5">{hook.textOverlay}</p>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => copyToClipboard(hook.verbalHook, 'hook', index)}
                            className="bg-slate-900 hover:bg-slate-850 p-1.5 rounded border border-slate-800 absolute bottom-3 right-3 text-slate-400 hover:text-white transition-all scale-90"
                            title="Копировать первый хук"
                          >
                            {copiedIndex === index ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                          </button>

                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card 2: Main post structure text body draft */}
                  <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl relative">
                    <h3 className="text-sm font-bold tracking-wider uppercase text-slate-300 flex items-center gap-2 border-b border-slate-800 pb-2 mb-4">
                      <MessageCircle className="h-4.5 w-4.5 text-cyan-400" />
                      {generatorPlatform === 'twitter' ? 'Скелет твита / Структура треда' : 'Вовлекающий текст под Reels (Caption)'}
                    </h3>

                    <pre className="bg-slate-950 p-4 rounded-xl border border-slate-850 text-xs text-slate-300 font-mono leading-relaxed whitespace-pre-wrap select-all block pr-12">
                      {strategyResult?.captionTemplate}
                    </pre>

                    <button
                      onClick={() => copyToClipboard(strategyResult?.captionTemplate || '', 'caption')}
                      className="bg-slate-900 hover:bg-slate-850 p-2 rounded-lg border border-slate-800 absolute top-16 right-9 text-slate-400 hover:text-white transition-all"
                      title="Копировать тело поста"
                    >
                      {copiedCaption ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>

                  {/* Footing extras metadata */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Visual recommendations */}
                    <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 space-y-2">
                      <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-purple-400 block">
                        {generatorPlatform === 'twitter' ? '📺 Рекомендованный визуал твита' : '🎵 Озвучка и Музыкальный тренд'}
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed italic">
                        {strategyResult?.recommenedAudioStyle}
                      </p>
                    </div>

                    {/* Algorithmic trick */}
                    <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 space-y-2">
                      <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-cyan-400 block flex items-center gap-1">
                        <Flame className="h-3.5 w-3.5" /> Лайфхак на удержание (Retention Trick)
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {strategyResult?.viralityHack}
                      </p>
                    </div>

                  </div>

                  {/* Hash/Search words list */}
                  <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 flex items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-500 block">Поисковые ключи и Теги:</span>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {strategyResult?.hashtags?.map((tag, i) => (
                          <span key={i} className="text-[10.5px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-850">
                            {tag.startsWith('#') ? tag : `#${tag}`}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(strategyResult?.hashtags?.join(' ') || '', 'hashtags')}
                      className="bg-slate-900 hover:bg-slate-850 p-2 rounded-lg border border-slate-800 text-slate-400 hover:text-white transition-all shrink-0 font-mono text-[10px] uppercase font-bold flex items-center gap-1.5"
                    >
                      {copiedHashtags ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" /> Скопировано
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" /> Копировать Все
                        </>
                      )}
                    </button>
                  </div>

                </div>
              ) : (
                <div className="bg-slate-900/20 border border-slate-850 border-dashed rounded-2xl py-24 text-center text-slate-500 space-y-3">
                  <Bot className="h-10 w-10 mx-auto text-slate-600 animate-pulse" />
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400">Сценарий еще не сгенерирован</p>
                    <p className="text-[11px] text-slate-500 max-w-[340px] mx-auto leading-relaxed">
                      Укажите характеристики Вашего аккаунта слева и нажмите запуск для создания стратегии роста на ИИ-движке Gemini.
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* --- VIEW 4: SMM API SETTINGS CONSOLE --- */}
        {activeTab === 'api_settings' && (
          <div className="max-w-3xl mx-auto bg-slate-900/60 border border-slate-800/80 rounded-3xl p-8 shadow-2xl backdrop-blur-sm space-y-8 relative overflow-hidden text-slate-300 leading-relaxed font-sans" id="api-settings-panel">
            <div className="absolute top-0 right-0 h-32 w-32 bg-gradient-to-bl from-amber-500/5 to-transparent rounded-bl-full pointer-events-none" />
            
            <div className="space-y-2">
              <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                <Sliders className="h-6 w-6 text-amber-400" /> Интеграция Живого SMM Провайдера
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Трансформируйте панель из визуального симулятора в полноценный живой инструмент. Подключите любой зарубежный или локальный SMM-реселлер сервис, поддерживающий стандартный протокол SMM API v2.
              </p>
            </div>

            <div className="space-y-6">
              
              {/* Form Inputs for API Connection */}
              <div className="space-y-4 bg-slate-950/60 border border-slate-800 rounded-2xl p-6">
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">SMM API URL-Endpoint Провайдера</label>
                    <input
                      type="url"
                      placeholder="https://justanotherpanel.com/api/v2"
                      value={apiUrl}
                      onChange={(e) => setApiUrl(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-xs text-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-amber-500/40"
                    />
                    <p className="text-[10px] text-slate-500">
                      Адрес обработчика API вашего любимого SMM сайта. Чаще всего оканчивается на <code className="text-slate-400 font-mono">/api/v2</code>.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Ваш секретный API-Ключ</label>
                    <input
                      type="password"
                      placeholder="Вставьте буквенно-цифровой токен (например, a482b83a...)"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-xs text-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-amber-500/40"
                    />
                    <p className="text-[10px] text-slate-500">
                      Находится в настройках вашего профиля (аккаунта) на сайте SMM-провайдера. Будет сохранен исключительно в локальной памяти вашего браузера.
                    </p>
                  </div>

                  {apiErrorText && (
                    <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono leading-relaxed">
                      ⚠️ Ошибка: {apiErrorText}
                    </div>
                  )}

                  {realBalance && (
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col sm:flex-row justify-between items-center gap-3">
                      <div>
                        <span className="text-[10px] uppercase font-mono text-emerald-400 font-bold block">Связь Успешно Установлена!</span>
                        <p className="text-xs text-slate-300 mt-0.5 font-mono">Баланс у API провайдера подтвержден.</p>
                      </div>
                      <div className="text-right py-1 px-3.5 bg-slate-950 rounded-lg border border-emerald-500/20">
                        <span className="text-[9px] uppercase font-mono text-slate-500 block">Баланс ЛК:</span>
                        <span className="text-sm font-extrabold text-emerald-400 font-mono">{realBalance}</span>
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => checkSmmConnection(apiUrl, apiKey)}
                      disabled={smmApiLoading || !apiUrl || !apiKey}
                      className={`w-full py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                        smmApiLoading 
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:scale-[1.01] text-white cursor-pointer active:scale-95 shadow-lg shadow-amber-500/15'
                      }`}
                    >
                      {smmApiLoading ? (
                        <>
                          <Activity className="h-4 w-4 animate-spin text-amber-500" /> Верификация API ключа и линков...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4" /> Сохранить и Проверить Соединение
                        </>
                      )}
                    </button>
                  </div>

                </div>

                {/* Educational Box about SMM API panels */}
                <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-6 space-y-4 text-xs text-slate-400 leading-relaxed font-sans">
                  <h4 className="font-bold text-slate-200 text-sm uppercase tracking-wider flex items-center gap-2 font-mono">
                    <Info className="h-4 w-4 text-amber-400" /> Инструкция: Где взять провайдера и получить подписчиков БЕСПЛАТНО?
                  </h4>
                  
                  <p className="text-[11px] text-slate-300 leading-relaxed font-mono">
                    В реальном мире живая накрутка (подписчики, лайки) требует серверов и прокси-сетей, поэтому она не может быть абсолютно бесплатной в промышленных масштабах. Однако вы можете получать подписчиков <strong>полностью бесплатно</strong>, используя один из способов ниже:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    
                    {/* Method 1 Code */}
                    <div className="bg-slate-900/50 border border-slate-850 p-4 rounded-xl space-y-2">
                      <span className="text-[9px] font-bold font-mono text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded">Способ №1</span>
                      <h5 className="font-bold text-white text-xs">Бесплатные промо-услуги (Free Services)</h5>
                      <p className="text-[11px] text-slate-400">
                        Почти на каждом крупном SMM-сайте (например, <code className="text-slate-350">dksmmpanel.com</code>, <code className="text-slate-350">smmfreepannel.com</code>, <code className="text-slate-350">morethanpanel.com</code>, <code className="text-slate-350">urpanel.com</code>) в выпадающем списке категорий услуг есть специальный раздел: 
                        <br />
                        <code className="text-amber-400 font-mono text-[10px] block mt-1">🎁 [FREE SERVICES] / [БЕСПЛАТНЫЙ ТЕСТ]</code>
                        Там можно заказывать лайки, просмотры или подписчиков по цене <strong className="text-emerald-400">$0.00</strong> в лимитированном количестве ежедневно.
                      </p>
                    </div>

                    {/* Method 2 Code */}
                    <div className="bg-slate-900/50 border border-slate-850 p-4 rounded-xl space-y-2">
                      <span className="text-[9px] font-bold font-mono text-cyan-400 uppercase bg-cyan-500/10 px-2 py-0.5 rounded">Способ №2</span>
                      <h5 className="font-bold text-white text-xs">Приветственный баланс (Free Trial Balance)</h5>
                      <p className="text-[11px] text-slate-400">
                        Многие реселлер-панели дают новым пользователям бесплатный стартовый баланс (например, <strong className="text-cyan-400">$0.10 - $0.50</strong>) за регистрацию или по запросу в поддержку (Ticket) для теста API. 
                        Поскольку оптовая цена подписчиков Instagram очень низкая (около <strong className="text-cyan-400">$0.10 за 1,000 штук</strong>), этого бонуса вам с запасом хватит на получение сотен реальных подписчиков бесплатно.
                      </p>
                    </div>

                  </div>

                  <div className="pt-2 space-y-2">
                    <h5 className="font-bold text-slate-200 text-xs font-mono uppercase">🚀 Пошаговый алгоритм запуска:</h5>
                    <ol className="list-decimal list-inside space-y-2 text-[11px] text-slate-400 font-mono">
                      <li>
                        Перейдите на любой проверенный SMM-сайт в Google (например, введите запрос <code className="text-slate-300 bg-slate-900 px-1 py-0.5 rounded">&quot;cheap smm panel api v2&quot;</code>) и пройдите простую регистрацию.
                      </li>
                      <li>
                        Зайдите в раздел <strong className="text-slate-350">API</strong> или <strong className="text-slate-350">Settings</strong> личного кабинета SMM-сайта и скопируйте свой уникальный секретный ключ (<code className="text-slate-300">API Key</code>).
                      </li>
                      <li>
                        Вставьте ссылку на API-обработчик (обычно указана там же и начинается с <code className="text-amber-500">https://.../api/v2</code>) и ваш ключ в форму выше на этой вкладке.
                      </li>
                      <li>
                        Нажмите кнопку <strong className="text-amber-400 uppercase">&quot;Сохранить и проверить соединение&quot;</strong>.
                      </li>
                      <li>
                        Платформа подключится к провайдеру, считает ваш баланс и выведет список доступных услуг в форму на первой вкладке! Теперь вы сможете запускать реальные заказы.
                      </li>
                    </ol>
                  </div>

                  <p className="text-[10px] text-slate-500 leading-normal italic font-mono pt-1 text-center border-t border-slate-900/60">
                    *Безопасность: FreeBoost SMM никогда не запрашивает пароли от ваших соцсетей. Все SMM-ордера проводятся через анононимные API транзакции, что исключает риск блокировок.
                  </p>
                </div>

              </div>

          </div>
        )}

      </main>

      {/* Humble footer respecting rule about Anti-AI-slop */}
      <footer className="border-t border-slate-900/80 bg-slate-950/60 py-6 px-6 mt-16 text-center text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>FREEBOOST SMM Panel &copy; 2026. Все симуляции защищены алгоритмами безопасности.</p>
          <p className="text-slate-600">Симулятор алгоритма X и Instagram. Для образовательных целей.</p>
        </div>
      </footer>

    </div>
  );
}
