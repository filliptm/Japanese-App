import type { Express } from "express";
import { createServer, type Server } from "http";
import Anthropic from '@anthropic-ai/sdk';

// the newest Anthropic model is "claude-3-5-sonnet-20241022" which was released October 22, 2024
const MODEL = "claude-3-5-sonnet-20241022";

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error("ANTHROPIC_API_KEY environment variable is required");
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

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
          content: `Translate the following English text to Japanese. Provide both the Japanese characters and romaji reading. Format the response as JSON with "japanese" and "romaji" keys.

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