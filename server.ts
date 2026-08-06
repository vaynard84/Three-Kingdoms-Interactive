import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GoogleGenAI lazily / safely
let aiClient: GoogleGenAI | null = null;
function getGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// Fallback knowledge answers for when API key is missing or offline
const fallbackKnowledge: Record<string, { answer: string; followUps: string[]; related: { chapters?: number[]; characters?: string[]; events?: string[] } }> = {
  "cao cao attack yuan shao": {
    answer: "Cao Cao fought Yuan Shao at the famous Battle of Guandu in 200 AD! Yuan Shao had a much larger army, but Cao Cao used smart tactics and raided Yuan Shao's food supply at Wuchao. Without food, Yuan Shao's troops panicked, and Cao Cao won a giant victory that gave him control of northern China.",
    followUps: ["Why did Yuan Shao lose even with more soldiers?", "What happened to Cao Cao after Guandu?"],
    related: { chapters: [11], characters: ["Cao Cao", "Yuan Shao"], events: ["Battle of Guandu"] }
  },
  "cao cao bad person": {
    answer: "In the story, Cao Cao is often portrayed as a cunning villain who wanted power, but he was also a brilliant leader, poet, and military strategist! He cared about bringing order to China during a time of chaos. While Liu Bei stood for loyalty and righteousness, Cao Cao valued talent and ambition. So he was complex—neither purely good nor purely evil!",
    followUps: ["Why was Liu Bei Cao Cao's biggest rival?", "What was Cao Cao's famous quote?"],
    related: { chapters: [9, 11, 14], characters: ["Cao Cao", "Liu Bei"], events: ["Battle of Guandu", "Battle of Red Cliffs"] }
  },
  "liu bei guan yu zhang fei friends": {
    answer: "Liu Bei, Guan Yu, and Zhang Fei became sworn brothers in a famous peach orchard under blooming trees! They swore the 'Peach Garden Oath' to protect the Han Dynasty and care for each other like real brothers, promising to die on the same day even if born on different ones. Their loyalty is one of the grandest themes in Chinese history!",
    followUps: ["Where did the Peach Garden Oath happen?", "What weapons did the three brothers use?"],
    related: { chapters: [3], characters: ["Liu Bei", "Guan Yu", "Zhang Fei"], events: ["Peach Garden Oath"] }
  },
  "smartest strategist": {
    answer: "Zhuge Liang (also called Sleeping Dragon) is widely remembered as the master strategist of the Three Kingdoms! He could predict the weather, invent cool military machines like wooden oxen, and outsmart entire armies with clever tricks like borrowing 100,000 arrows with straw boats. However, Sima Yi and Zhou Yu were also legendary strategic geniuses!",
    followUps: ["How did Zhuge Liang borrow arrows with straw boats?", "Who was Zhuge Liang's rival in Wei?"],
    related: { chapters: [12, 13, 14], characters: ["Zhuge Liang", "Zhou Yu", "Sima Yi"], events: ["Three Visits to the Thatched Cottage", "Battle of Red Cliffs"] }
  },
  "difference between wei shu wu": {
    answer: "China split into three rival kingdoms:\n1. Wei (North) - Led by Cao Cao and Cao Pi. Powerful, rich, and possessed the largest army.\n2. Shu (Southwest) - Led by Liu Bei. Famous for loyalty, righteous heroes, and Zhuge Liang's wisdom.\n3. Wu (Southeast) - Led by Sun Quan. Protected by the Yangtze River, famous for its grand navy and brave generals like Zhou Yu!",
    followUps: ["Which kingdom had the strongest navy?", "Which kingdom eventually united China?"],
    related: { chapters: [14, 15], characters: ["Cao Cao", "Liu Bei", "Sun Quan"], events: ["Battle of Red Cliffs", "The Formation of the Three Kingdoms"] }
  }
};

app.post("/api/ask", async (req, res) => {
  const { question } = req.body;
  if (!question || typeof question !== "string") {
    res.status(400).json({ error: "Please provide a valid question." });
    return;
  }

  const qLower = question.toLowerCase();

  try {
    const genAI = getGenAIClient();
    if (genAI) {
      const response = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `You are "The Story Guide", an enthusiastic, wise, and kid-friendly historian storytelling guide for children aged 7–12 learning about "Romance of the Three Kingdoms".
Answer the child's question about the Three Kingdoms story, characters, battles, or kingdoms.

Guidelines for your response:
1. Keep the tone exciting, child-friendly, clear, and age-appropriate (ages 7-12).
2. Avoid graphic violence. Focus on courage, strategy, friendship, loyalty, and history.
3. Be historically accurate to the classic novel/history while making complex politics easy to understand.
4. Keep the answer around 2-3 short paragraphs.
5. Provide 2-3 follow-up questions the child can ask next.
6. Clearly mention related chapters (1 to 15), key characters, or key events.
7. Return your response in JSON format matching this schema:
{
  "answer": "string",
  "followUps": ["string", "string"],
  "related": {
    "chapters": [number],
    "characters": ["string"],
    "events": ["string"]
  },
  "historicalNote": "string (optional distinction between novel romance vs historical reality if relevant)"
}`
              },
              {
                text: `Child's question: "${question}"`
              }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json"
        }
      });

      const text = response.text;
      if (text) {
        try {
          const parsed = JSON.parse(text);
          res.json(parsed);
          return;
        } catch {
          // If JSON parse fails, wrap raw text
          res.json({
            answer: text,
            followUps: ["Who was the bravest warrior in Shu?", "Tell me more about the Battle of Red Cliffs!"],
            related: { chapters: [14], characters: ["Zhuge Liang", "Liu Bei"], events: ["Battle of Red Cliffs"] }
          });
          return;
        }
      }
    }
  } catch (err) {
    console.warn("Gemini API error or missing key, falling back to local guide knowledge:", err);
  }

  // Fallback matching
  let matchedKey = Object.keys(fallbackKnowledge).find(k => {
    const words = k.split(" ");
    return words.every(w => qLower.includes(w));
  });

  if (!matchedKey) {
    // Partial word match fallback
    if (qLower.includes("cao cao") || qLower.includes("yuan shao")) matchedKey = "cao cao attack yuan shao";
    else if (qLower.includes("friend") || qLower.includes("oath") || qLower.includes("peach") || qLower.includes("guan yu") || qLower.includes("zhang fei")) matchedKey = "liu bei guan yu zhang fei friends";
    else if (qLower.includes("smart") || qLower.includes("zhuge") || qLower.includes("strategist") || qLower.includes("advisor")) matchedKey = "smartest strategist";
    else if (qLower.includes("wei") || qLower.includes("shu") || qLower.includes("wu") || qLower.includes("kingdom")) matchedKey = "difference between wei shu wu";
    else matchedKey = "cao cao bad person";
  }

  const fallback = fallbackKnowledge[matchedKey];
  res.json({
    answer: fallback.answer,
    followUps: fallback.followUps,
    related: fallback.related,
    historicalNote: "This answer is brought to you by the Story Guide's built-in historical archives!"
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
