import { GoogleGenAI, Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export async function POST(req: NextRequest) {
  try {
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY environment variable is missing on the server. Please check settings." },
        { status: 500 }
      );
    }

    const { niche, contentType, keyword, targetAudience, platform = "instagram" } = await req.json();

    if (!niche) {
      return NextResponse.json({ error: "Niche is required" }, { status: 400 });
    }

    const isTwitter = platform === "twitter";

    const prompt = isTwitter ? `
      Ты – профессиональный эксперт по продвижению органических постов и тредов в X (Twitter) и алгоритмам вирального охвата.
      Клиент хочет увеличить показы и вовлечение в X (Twitter) в нише "${niche}".
      Тип контента: ${contentType || "Пост / Тред"}.
      Ключевое слово/Тема: "${keyword || "Органика"}".
      Целевая аудитория: "${targetAudience || "Широкая аудитория"}".

      Сгенерируй детальный план твита или треда, включая 3 различных варианта интригующего начала (Hooks) для первого твита трэда, шаблон самого твита или структуры треда (Caption/Core Text Template) с призывом к действию (CTA), набор целевых ключевых фраз (hashtags), и секретный лайфхак на удержание внимания в X (Virality Hack - например, ссылка на продолжение в закладках, спорный тезис для комментариев, авто-ретвит бот).
      Вывод должен быть на русском языке.
    ` : `
      Ты – профессиональный эксперт по продвижению органических просмотров в Instagram Instagram Reels и алгоритмам вовлечения.
      Клиент хочет увеличить просмотры в Instagram в нише "${niche}".
      Тип контента: ${contentType || "Reels"}.
      Ключевое слово/Тема: "${keyword || "Органика"}".
      Целевая аудитория: "${targetAudience || "Широкая аудитория"}".

      Сгенерируй детальный план для видео, включая 3 мощных затягивающих сценария (Hooks) для первых 2 секунд, шаблон вовлекающего текста (Caption) с призывом к действию (CTA), оптимальный набор из 6-8 хэштегов и секретный лайфхак на удержание внимания (Virality Hack - например, закольцованное видео, побуждение оставить комментарий и т.д.).
      Вывод должен быть на русском языке.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: isTwitter 
          ? "Ты — сильный русскоговорящий маркетолог и эксперт по платформе X (Twitter) с глубоким пониманием мемов, вирусных циклов, триггерной дискуссии и алгоритма продвижения твитов."
          : "Ты — русскоговорящий SMM-гуру по контенту для Instagram, дающий конкретные, цепляющие и применимые на практике советы по вирусному контенту.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hookIdeas: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  verbalHook: {
                    type: Type.STRING,
                    description: isTwitter ? "Цепляющая первая фраза / кликбейт первого твита" : "Что сказать голосом в первые 3 секунды, чтобы зацепить."
                  },
                  visualHook: {
                    type: Type.STRING,
                    description: isTwitter ? "Какую картинку, GIF или опрос прикрепить для удержания" : "Какое визуальное движение, жест или объект показать на экране."
                  },
                  textOverlay: {
                    type: Type.STRING,
                    description: isTwitter ? "Короткий заголовок (для превью)" : "Броский текст на видео (Заголовок)."
                  }
                },
                required: ["verbalHook", "visualHook", "textOverlay"]
              },
              description: "3 варианта мощного начала (хука)"
            },
            captionTemplate: {
              type: Type.STRING,
              description: isTwitter ? "Текст основного твита или структура треда с четким CTA" : "Шаблон описания поста с интригой и четким CTA (призывом к действию)."
            },
            hashtags: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING
              },
              description: isTwitter ? "6-8 популярных ключевых слов / тегов для поиска X" : "6-8 целевых трендовых хэштегов."
            },
            viralityHack: {
              type: Type.STRING,
              description: isTwitter ? "Прием для стимуляции закладок (Bookmarks), ретвитов (Reposts) и бурного тред-обсуждения." : "Секретный тактический прием для увеличения глубины просмотра (Retention) или вовлечения (комментарии/репосты)."
            },
            recommenedAudioStyle: {
              type: Type.STRING,
              description: isTwitter ? "Рекомендация по типу визуала (например: скриншот блокнота, трек-метрика, инфографика, мем)." : "Рекомендация по звуковому оформлению (темп, тип тренда, оригинальная озвучка)."
            }
          },
          required: ["hookIdeas", "captionTemplate", "hashtags", "viralityHack", "recommenedAudioStyle"]
        },
      },
    });

    const dataText = response.text;
    if (!dataText) {
      throw new Error("No response text from Gemini");
    }

    const payload = JSON.parse(dataText);
    return NextResponse.json(payload);

  } catch (err: any) {
    console.error("Gemini API Error:", err);
    return NextResponse.json({ error: err.message || "An error occurred with Gemini generation" }, { status: 500 });
  }
}
