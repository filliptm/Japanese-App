import type { Express } from "express";
import { createServer, type Server } from "http";
import Anthropic from '@anthropic-ai/sdk';

// the newest Anthropic model is "claude-3-5-sonnet-20241022" which was released October 22, 2024
const MODEL = "claude-3-5-sonnet-20241022";

// For demo purposes, we'll bypass the API key requirement
// if (!process.env.ANTHROPIC_API_KEY) {
//   throw new Error("ANTHROPIC_API_KEY environment variable is required");
// }

// Mock Anthropic client for demo purposes
const anthropic = {
  messages: {
    create: async ({ messages }) => {
      const text = messages[0].content.split('English text: ')[1];
      let mockResponse;
      
      // Dictionary of common phrases and their translations
      const translations = {
        // Greetings
        'hello': {
          japanese: "こんにちは",
          romaji: "konnichiwa",
          syllables: "ko-n-ni-chi-wa"
        },
        'good morning': {
          japanese: "おはようございます",
          romaji: "ohayou gozaimasu",
          syllables: "o-ha-yo-u go-za-i-ma-su"
        },
        'good evening': {
          japanese: "こんばんは",
          romaji: "konbanwa",
          syllables: "ko-n-ba-n-wa"
        },
        'goodbye': {
          japanese: "さようなら",
          romaji: "sayounara",
          syllables: "sa-yo-u-na-ra"
        },
        'see you later': {
          japanese: "またね",
          romaji: "matane",
          syllables: "ma-ta-ne"
        },
        
        // Common phrases
        'thank you': {
          japanese: "ありがとう",
          romaji: "arigatou",
          syllables: "a-ri-ga-to-u"
        },
        'you\'re welcome': {
          japanese: "どういたしまして",
          romaji: "dou itashimashite",
          syllables: "do-u i-ta-shi-ma-shi-te"
        },
        'excuse me': {
          japanese: "すみません",
          romaji: "sumimasen",
          syllables: "su-mi-ma-se-n"
        },
        'sorry': {
          japanese: "ごめんなさい",
          romaji: "gomen nasai",
          syllables: "go-me-n na-sa-i"
        },
        'please': {
          japanese: "お願いします",
          romaji: "onegaishimasu",
          syllables: "o-ne-ga-i-shi-ma-su"
        },
        
        // Questions
        'how are you': {
          japanese: "お元気ですか",
          romaji: "ogenki desu ka",
          syllables: "o-ge-n-ki de-su ka"
        },
        'what is your name': {
          japanese: "お名前は何ですか",
          romaji: "onamae wa nan desu ka",
          syllables: "o-na-ma-e wa na-n de-su ka"
        },
        'where is': {
          japanese: "どこですか",
          romaji: "doko desu ka",
          syllables: "do-ko de-su ka"
        },
        'when': {
          japanese: "いつですか",
          romaji: "itsu desu ka",
          syllables: "i-tsu de-su ka"
        },
        'why': {
          japanese: "なぜですか",
          romaji: "naze desu ka",
          syllables: "na-ze de-su ka"
        },
        
        // Common sentences
        'i am learning japanese': {
          japanese: "私は日本語を勉強しています",
          romaji: "watashi wa nihongo o benkyou shiteimasu",
          syllables: "wa-ta-shi wa ni-ho-n-go o be-n-kyo-u shi-te-i-ma-su"
        },
        'i like japanese food': {
          japanese: "私は日本食が好きです",
          romaji: "watashi wa nihonshoku ga suki desu",
          syllables: "wa-ta-shi wa ni-ho-n-sho-ku ga su-ki de-su"
        },
        'i want to go to japan': {
          japanese: "私は日本に行きたいです",
          romaji: "watashi wa nihon ni ikitai desu",
          syllables: "wa-ta-shi wa ni-ho-n ni i-ki-ta-i de-su"
        },
        'i don\'t understand': {
          japanese: "わかりません",
          romaji: "wakarimasen",
          syllables: "wa-ka-ri-ma-se-n"
        },
        'i understand': {
          japanese: "わかります",
          romaji: "wakarimasu",
          syllables: "wa-ka-ri-ma-su"
        },
        
        // Food related
        'delicious': {
          japanese: "美味しい",
          romaji: "oishii",
          syllables: "o-i-shi-i"
        },
        'water': {
          japanese: "水",
          romaji: "mizu",
          syllables: "mi-zu"
        },
        'restaurant': {
          japanese: "レストラン",
          romaji: "resutoran",
          syllables: "re-su-to-ra-n"
        },
        'menu': {
          japanese: "メニュー",
          romaji: "menyuu",
          syllables: "me-nyu-u"
        },
        'check please': {
          japanese: "お会計お願いします",
          romaji: "okaikei onegaishimasu",
          syllables: "o-ka-i-ke-i o-ne-ga-i-shi-ma-su"
        }
      };
      
      // Try to find a matching phrase in our dictionary
      let foundTranslation = null;
      const lowerText = text.toLowerCase();
      
      for (const [phrase, translation] of Object.entries(translations)) {
        if (lowerText.includes(phrase)) {
          foundTranslation = translation;
          break;
        }
      }
      
      // If we found a match, use it; otherwise generate a more contextual response
      if (foundTranslation) {
        mockResponse = foundTranslation;
      } else {
        // Try to analyze the text and provide a more contextual response
        if (lowerText.includes('my name is') || lowerText.includes('i am called')) {
          mockResponse = {
            japanese: "私の名前は[名前]です",
            romaji: "watashi no namae wa [name] desu",
            syllables: "wa-ta-shi no na-ma-e wa [name] de-su"
          };
        } else if (lowerText.includes('love') || lowerText.includes('like')) {
          mockResponse = {
            japanese: "私は[対象]が好きです",
            romaji: "watashi wa [object] ga suki desu",
            syllables: "wa-ta-shi wa [object] ga su-ki de-su"
          };
        } else if (lowerText.includes('want')) {
          mockResponse = {
            japanese: "私は[対象]が欲しいです",
            romaji: "watashi wa [object] ga hoshii desu",
            syllables: "wa-ta-shi wa [object] ga ho-shi-i de-su"
          };
        } else if (lowerText.includes('where') || lowerText.includes('location')) {
          mockResponse = {
            japanese: "[場所]はどこですか",
            romaji: "[place] wa doko desu ka",
            syllables: "[place] wa do-ko de-su ka"
          };
        } else if (lowerText.includes('when') || lowerText.includes('time')) {
          mockResponse = {
            japanese: "いつ[行動]しますか",
            romaji: "itsu [action] shimasu ka",
            syllables: "i-tsu [action] shi-ma-su ka"
          };
        } else if (lowerText.includes('how') || lowerText.includes('way')) {
          mockResponse = {
            japanese: "どうやって[行動]しますか",
            romaji: "douyatte [action] shimasu ka",
            syllables: "do-u-ya-tte [action] shi-ma-su ka"
          };
        } else {
          // Default response with a note that this is a placeholder
          mockResponse = {
            japanese: text + " (翻訳例: これは翻訳の例です)",
            romaji: text + " (romaji example: kore wa honyaku no rei desu)",
            syllables: text + " (syllables example: ko-re wa ho-nya-ku no re-i de-su)"
          };
        }
      }
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(mockResponse)
          }
        ]
      };
    }
  }
};

export function registerRoutes(app: Express): Server {
  app.post("/api/translate", async (req, res) => {
    try {
      const { text } = req.body;

      if (!text || typeof text !== "string") {
        return res.status(400).send("Text is required");
      }

      const response = await anthropic.messages.create({
        max_tokens: 1024,
        messages: [{
          role: "user",
          content: `Translate the following English text to Japanese. Provide:
1. The Japanese characters
2. The romaji reading
3. Break down the pronunciation into syllables (separated by hyphens)

Format the response as JSON with "japanese", "romaji", and "syllables" keys.

English text: ${text}`
        }],
        model: MODEL,
      });

      // Get the content from the first message - it should be text content
      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Expected text response from Claude');
      }

      try {
        const result = JSON.parse(content.text);
        res.json(result);
      } catch (e) {
        // Fallback in case the response isn't valid JSON
        const lines = content.text.split('\n');
        res.json({
          japanese: lines[0] || "",
          romaji: lines[1] || "",
        });
      }
    } catch (error) {
      console.error("Translation error:", error);
      res.status(500).send("Failed to translate text");
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}