import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// Child safety sanitization helper for server AI responses
function sanitizeServerChildText(text: string): string {
  if (!text) return '';
  return text
    .replace(/behead(ed|ing)?/gi, 'defeated')
    .replace(/decapitat(ed|ing|e)?/gi, 'subdued')
    .replace(/severed head/gi, 'trophy of victory')
    .replace(/bloodbath|blood bath/gi, 'fierce battle')
    .replace(/slaughtered|massacred/gi, 'overwhelmed')
    .replace(/mutilat(ed|ing)/gi, 'injured')
    .replace(/disembowel(ed)?/gi, 'struck down')
    .replace(/tortur(ed|ing)/gi, 'punished');
}
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
        model: "gemini-3.6-flash",
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
6. Clearly mention related chapters (1 to 17), key characters, or key events.
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
          if (parsed && typeof parsed.answer === 'string') {
            parsed.answer = sanitizeServerChildText(parsed.answer);
          }
          if (parsed && typeof parsed.historicalNote === 'string') {
            parsed.historicalNote = sanitizeServerChildText(parsed.historicalNote);
          }
          res.json(parsed);
          return;
        } catch {
          // If JSON parse fails, wrap raw text
          res.json({
            answer: sanitizeServerChildText(text),
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

// Endpoint for interactive story decision continuation
app.post("/api/story/continue", async (req, res) => {
  const { current_branch_id, choice_text, history } = req.body;

  if (!choice_text) {
    res.status(400).json({ error: "Please provide a valid choice_text." });
    return;
  }

  try {
    const genAI = getGenAIClient();
    if (genAI) {
      const systemInstruction = "You are a friendly and engaging storyteller for a kids' interactive storybook based on 'The Romance of the Three Kingdoms'. Your goal is to guide the user through historical branches using simple language, emphasizing themes of friendship, wisdom, and honor. When a user makes a choice, describe the outcome based on the historical context and provide the next set of choices. Always format your response in JSON so the application can parse the dialogue and the buttons.";

      const promptText = `Current Story Branch: ${current_branch_id || 'general'}
User Choice Selected: "${choice_text}"
Story History Context: ${JSON.stringify(history || [])}

Generate the next interactive scene for the child.
Return a JSON object matching this exact schema:
{
  "outcome": "string - exciting and inspiring narrative outcome of the user's choice for kids",
  "historical_context": "string - 1 sentence kid-friendly fun fact or historical lesson related to this choice",
  "next_scene_title": "string - catchy title for the next scene",
  "dialogue": "string - 2 to 3 sentences setting up the next dilemma or decision",
  "choices": [
    { "text": "string - short choice action text", "next": "string - unique slug" },
    { "text": "string - short choice action text", "next": "string - unique slug" }
  ]
}`;

      const response = await genAI.models.generateContent({
        model: "gemini-3.6-flash",
        contents: [
          {
            role: "user",
            parts: [{ text: systemInstruction }, { text: promptText }]
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
          if (parsed && typeof parsed.outcome === 'string') {
            parsed.outcome = sanitizeServerChildText(parsed.outcome);
          }
          if (parsed && typeof parsed.dialogue === 'string') {
            parsed.dialogue = sanitizeServerChildText(parsed.dialogue);
          }
          if (parsed && typeof parsed.historical_context === 'string') {
            parsed.historical_context = sanitizeServerChildText(parsed.historical_context);
          }
          if (parsed && Array.isArray(parsed.choices)) {
            parsed.choices = parsed.choices.map((c: any) => ({
              ...c,
              text: sanitizeServerChildText(String(c?.text || ''))
            }));
          }
          res.json(parsed);
          return;
        } catch {
          // fallback if parsing fails
        }
      }
    }
  } catch (err) {
    console.warn("Gemini story continuation error, using fallback branches:", err);
  }

  // Fallback interactive branches when Gemini API is unavailable
  const fallbackBranches: Record<string, any> = {
    // Ch 1
    "Share grain with hungry farming families": {
      outcome: "You distribute grain to starving villagers. Grateful families cheer for Lord Liu, and hundreds of courageous volunteers step forward to join your town guard!",
      historical_context: "In times of famine, acts of benevolence won public trust faster than military force.",
      next_scene_title: "Ch 1: Building a People's Guard",
      dialogue: "With newfound community support, how will you organize the volunteer guards to defend against roving bandits?",
      choices: [
        { text: "Train the volunteers in defensive spear tactics", next: "train_spears" },
        { text: "Build wooden watchtowers around the grain stores", next: "build_watchtowers" }
      ]
    },
    "Send an urgent petition to the Imperial Court": {
      outcome: "Your messenger rides swiftly to Luoyang with an imperial petition. Court officials take note of your leadership and send emergency grain reserves!",
      historical_context: "Formal petitions were the official legal way provincial lords requested imperial aid during disasters.",
      next_scene_title: "Ch 1: imperial Recognition",
      dialogue: "The Imperial Court acknowledges your civic duty and promotes you to local magistrate of Zhuo County. What is your first administrative focus?",
      choices: [
        { text: "Lower taxes for local wheat farmers", next: "lower_taxes" },
        { text: "Repair damaged irrigation canals along the river", next: "repair_canals" }
      ]
    },
    // Ch 2
    "Listen to Zhang Jue's herbal teachings": {
      outcome: "Zhang Jue shares herbal remedies that cure sick villagers. People wear yellow scarves to celebrate good health and spiritual peace!",
      historical_context: "The Yellow Turban movement began as a peaceful healing ministry before escalating into a massive political rebellion.",
      next_scene_title: "Ch 2: The Spreading Movement",
      dialogue: "As thousands join the Yellow Sky movement, local authorities grow nervous. How do you encourage peace among the yellow-scarved disciples?",
      choices: [
        { text: "Advocate for peaceful community farming", next: "peaceful_farming" },
        { text: "Urge leaders to negotiate directly with imperial governors", next: "negotiate_governors" }
      ]
    },
    "Rally local volunteers to protect the town": {
      outcome: "You post notices calling for brave volunteers. Young men assemble at the town hall, ready to defend their homes with courage!",
      historical_context: "The Yellow Turban rebellion forced local towns across China to raise volunteer militias for self-defense.",
      next_scene_title: "Ch 2: Organizing the Defense",
      dialogue: "Hundreds of volunteer soldiers stand in formation in the town plaza. Who will lead the vanguard division?",
      choices: [
        { text: "Appoint a brave warrior with a heavy spear", next: "appoint_spearman" },
        { text: "Set up defensive barricades at the city gates", next: "set_barricades" }
      ]
    },
    // Ch 3
    "Swear the sacred brotherly oath": {
      outcome: "Liu Bei, Guan Yu, and Zhang Fei clasp hands under pink peach blossoms and swear to stand together through all trials! Their hearts unite as one.",
      historical_context: "The Oath of the Peach Garden became China's most famous symbol of eternal brotherhood and loyalty.",
      next_scene_title: "Ch 3: The Three Sworn Brothers",
      dialogue: "Local blacksmiths forge twin heritage swords for Liu Bei, the Green Dragon Crescent Blade for Guan Yu, and the Serpent Spear for Zhang Fei. They prepare to march!",
      choices: [
        { text: "Lead a brave charge to protect nearby villages", next: "front_charge" },
        { text: "Set a clever ambush along the mountain pass", next: "hill_ambush" }
      ]
    },
    "Forge three legendary weapons together": {
      outcome: "Master blacksmiths work through the night! Guan Yu receives his 82-pound Green Dragon Blade, Zhang Fei receives his 18-foot Snake Lance, and Liu Bei receives his Twin Swords.",
      historical_context: "Specialized weapons forged during the Peach Garden Oath became iconic symbols associated with each hero.",
      next_scene_title: "Ch 3: Armed for Justice",
      dialogue: "With custom weapons in hand, the three heroes test their skill in a friendly sparring match before leading 500 volunteer troops.",
      choices: [
        { text: "Spar with Guan Yu to practice swordwork", next: "spar_guanyu" },
        { text: "Review battle maps with Zhang Fei and Liu Bei", next: "review_maps" }
      ]
    },
    // Ch 4
    "Secretly guide young Emperor Xian to safety": {
      outcome: "You sneak into the dark palace gardens and escort young Emperor Xian past Dong Zhuo's guards, keeping the true imperial lineage safe!",
      historical_context: "Safeguarding young Emperor Xian was the ultimate goal of loyal Han ministers during palace coups.",
      next_scene_title: "Ch 4: Escaping the Capital",
      dialogue: "Under cover of night, you guide the royal carriage toward the eastern provinces. Where will you seek refuge?",
      choices: [
        { text: "Head toward Xuchang to build a safe capital", next: "head_xuchang" },
        { text: "Send messengers to rally regional governors", next: "rally_governors" }
      ]
    },
    "Gather brave nobles outside the city walls": {
      outcome: "You ride out to Chenliu and meet Cao Cao and Yuan Shao. Together, you draft a secret imperial decree urging all regional lords to resist tyranny!",
      historical_context: "Cao Cao's call-to-arms rallied warlords across China to challenge Dong Zhuo's military dictatorship.",
      next_scene_title: "Ch 4: The Call-To-Arms",
      dialogue: "Messengers on swift horses gallop across eight provinces carrying your call-to-arms. Which regional lord responds first?",
      choices: [
        { text: "Sun Jian 'The Tiger of Jiangdong'", next: "sun_jian_arrives" },
        { text: "Gongsun Zan with Liu Bei and his brothers", next: "gongsun_zan_arrives" }
      ]
    },
    // Ch 5
    "Appoint Yuan Shao as Supreme Commander": {
      outcome: "Yuan Shao steps onto the sacrificial altar and accepts the leadership seal. Over 100,000 soldiers cheer for the Grand Warlord Alliance!",
      historical_context: "Yuan Shao was chosen as Alliance leader due to his family's prestigious four-generation ministerial lineage.",
      next_scene_title: "Ch 5: The Vanguard Advance",
      dialogue: "The 18 warlord divisions pitch camp near Hulao Pass. How should the Alliance deploy its vanguard forces?",
      choices: [
        { text: "Send Sun Jian's vanguard down Sishui Pass", next: "sun_jian_vanguard" },
        { text: "Send Cao Cao to scout enemy supply lines", next: "cao_scout_lines" }
      ]
    },
    "Urge the lords to share food supplies and cooperate": {
      outcome: "You speak passionately about unity. Yuan Shu agrees to open his granaries, ensuring Sun Jian's vanguard has plenty of food for battle!",
      historical_context: "Logistical cooperation was the single most vital key to maintaining large ancient alliance armies.",
      next_scene_title: "Ch 5: Unified Supply Lines",
      dialogue: "With full bellies and high morale, the Coalition soldiers march toward the formidable mountain passes guarding Luoyang.",
      choices: [
        { text: "Prepare siege ladders for Sishui Pass", next: "siege_ladders" },
        { text: "Send diplomats to negotiate with fortress guards", next: "negotiate_guards" }
      ]
    },
    // Ch 6
    "Guan Yu and Liu Bei ride in to fight together": {
      outcome: "Guan Yu swings his Green Dragon Blade and Liu Bei joins with his Twin Swords! The three sworn brothers fight Lü Bu 3-on-1 until Lü Bu retreats on Red Hare!",
      historical_context: "'Three Heroes Fight Lü Bu' at Hulao Pass became one of the most celebrated martial duels in Chinese literature.",
      next_scene_title: "Ch 6: Victory at Hulao Pass",
      dialogue: "Lü Bu retreats behind the fortress gates, and Dong Zhuo realizes Hulao Pass cannot hold against the three heroic brothers!",
      choices: [
        { text: "Pursue the retreating forces toward Luoyang", next: "pursue_luoyang" },
        { text: "Secure the fortress pass and rescue citizens", next: "secure_pass" }
      ]
    },
    "Challenge Lü Bu to a strategic battle of wits": {
      outcome: "Zhuge Liang steps forward and challenges Lü Bu to a strategic formation test. Astonished by the clever formation, Lü Bu holds his ground in respect!",
      historical_context: "Military tacticians often praised intellectual formations over raw individual physical power.",
      next_scene_title: "Ch 6: The Formation Duel",
      dialogue: "Lü Bu marvels at the Eight-Trigram formation and hesitates to attack without consulting his advisors.",
      choices: [
        { text: "Offer a truce to protect innocent soldiers", next: "offer_truce" },
        { text: "Use the pause to send troops around the flank", next: "flank_pass" }
      ]
    },
    // Ch 7
    "Open the pouch to reveal the Imperial Jade Seal": {
      outcome: "Sun Jian opens the silk pouch inside Zhenguan Well. The carved Heshi jade seal glows with gold lettering: 'May the Ruler Live Long and Prosper!'",
      historical_context: "The Heirloom Seal of the Realm was the supreme physical symbol of imperial legitimacy in ancient China.",
      next_scene_title: "Ch 7: The Sacred Artifact",
      dialogue: "Sun Jian's advisors urge him to keep the seal safe, but Coalition leader Yuan Shao demands he surrender it immediately!",
      choices: [
        { text: "Swear a solemn oath of innocence and protect the seal", next: "protect_seal" },
        { text: "Present the seal publicly to restore peace to the Coalition", next: "present_seal" }
      ]
    },
    "Order troops to extinguish fires and rebuild": {
      outcome: "Sun Jian's soldiers pump water from the wells and extinguish the flames burning Luoyang. Grateful citizens weep and offer blessings!",
      historical_context: "Sun Jian was revered for reburying desecrated royal tombs and restoring order to ruined Luoyang.",
      next_scene_title: "Ch 7: Restoring the Capital",
      dialogue: "Smoldering ruins give way to clean streets as Sun Jian establishes emergency relief centers for homeless families.",
      choices: [
        { text: "Build new granaries to feed returning families", next: "build_granaries" },
        { text: "Send scouts to track Dong Zhuo's movement to Chang'an", next: "track_dong" }
      ]
    },
    // Ch 8
    "Show Lü Bu the true value of honor and justice": {
      outcome: "Diao Chan and Minister Wang Yun remind Lü Bu that true heroes protect the innocent. Realizing Dong Zhuo is a tyrant, Lü Bu decides to uphold justice!",
      historical_context: "The Interlocking Chain Plot succeeded by appealing to Lü Bu's pride and desire to be remembered as a righteous hero.",
      next_scene_title: "Ch 8: The Palace Gate Turning Point",
      dialogue: "When Dong Zhuo arrives at the palace expecting a coronation, Lü Bu steps out with his halberd and executes imperial justice!",
      choices: [
        { text: "Proclaim amnesty and peace for all citizens in Chang'an", next: "proclaim_amnesty" },
        { text: "Appoint righteous ministers to reform court laws", next: "reform_laws" }
      ]
    },
    "Prepare the royal decree at the palace gates": {
      outcome: "Wang Yun issues a royal decree calling Dong Zhuo to the palace. Lü Bu stands guard at the gates to enforce imperial law!",
      historical_context: "The removal of Dong Zhuo freed young Emperor Xian from immediate military tyranny.",
      next_scene_title: "Ch 8: Dawn of a New Governance",
      dialogue: "With the dictator gone, court ministers gather to rebuild state administration. What is the top priority?",
      choices: [
        { text: "Open palace granaries to feed starving refugees", next: "palace_granaries" },
        { text: "Send envoys to invite provincial warlords to peace talks", next: "invite_peace" }
      ]
    },
    // Ch 9
    "Build farming colonies (Tuntian) to feed everyone": {
      outcome: "Cao Cao establishes the 'Tuntian' system! Soldiers and refugees farm wheat side-by-side, creating vast food reserves that end regional famine.",
      historical_context: "The Tuntian agricultural system was Cao Cao's greatest economic policy, creating stability and large grain surpluses.",
      next_scene_title: "Ch 9: The Golden Harvest",
      dialogue: "Xuchang becomes a thriving hub of farming and trade. How will you use the new grain surplus?",
      choices: [
        { text: "Store grain in regional depots for winter relief", next: "store_grain" },
        { text: "Build schools and scholar libraries in Xuchang", next: "build_libraries" }
      ]
    },
    "Issue official imperial decrees to restore law": {
      outcome: "From Xuchang, Cao Cao issues state decrees bearing Emperor Xian's official seal. Regional lords receive legal orders to stop fighting!",
      historical_context: "'Holding the Emperor to Command the Warlords' gave Cao Cao unmatched legal legitimacy over rival generals.",
      next_scene_title: "Ch 9: Imperial Authority",
      dialogue: "Warlords across China must decide whether to obey the Emperor's seal or be branded traitors. How do you respond to disobedient lords?",
      choices: [
        { text: "Send royal peace envoys with imperial banners", next: "send_envoys" },
        { text: "Mobilize disciplined troops to enforce imperial law", next: "enforce_law" }
      ]
    },
    // Ch 10
    "Zhang Fei roars across the wooden bridge": {
      outcome: "Standing alone on Changban Bridge, Zhang Fei glaringly plants his feet and roars like thunder: 'I am Zhang Fei of Yan! Who dares fight me to the death?' Cao Cao's vanguard retreats in shock!",
      historical_context: "Zhang Fei's ferocious courage at Changban Bridge bought crucial time for Liu Bei's fleeing civilian column.",
      next_scene_title: "Ch 10: Holding Changban Bridge",
      dialogue: "With Cao Cao's cavalry held at bay, Liu Bei's refugees safely cross the river toward Jiangling.",
      choices: [
        { text: "Dismantle the wooden bridge planks to prevent pursuit", next: "dismantle_bridge" },
        { text: "Rejoin Liu Bei's main column to organize the camp", next: "rejoin_column" }
      ]
    },
    "Zhao Yun searches bravely to protect infant A'dou": {
      outcome: "General Zhao Yun gallops single-handedly into enemy lines seven times, cradling baby A'dou safely in his chest armor and riding back to Liu Bei!",
      historical_context: "Zhao Yun's rescue of baby A'dou at Changban is celebrated as one of history's most valiant individual feats of chivalry.",
      next_scene_title: "Ch 10: The Heroic Return",
      dialogue: "Zhao Yun kneels before Liu Bei, presenting young A'dou safe and unharmed. Liu Bei wipes tears of gratitude for Zhao Yun's bravery.",
      choices: [
        { text: "Promote Zhao Yun to Commander of the Tiger Guard", next: "promote_zhao" },
        { text: "Rest the weary soldiers and prepare for the southern alliance", next: "rest_soldiers" }
      ]
    },
    // Ch 11
    "Launch a secret night raid on Wuchao grain depot": {
      outcome: "Cao Cao personally leads 5,000 elite cavalry under cover of night to Wuchao! They set Yuan Shao's central grain depot ablaze, turning the tide of battle!",
      historical_context: "The raid on Wuchao destroyed Yuan Shao's food supply, causing his 100,000-man army to collapse at Guandu.",
      next_scene_title: "Ch 11: Fire at Wuchao",
      dialogue: "Flames light up the night sky for thirty miles. Yuan Shao's generals realize their food is gone and panic spreads!",
      choices: [
        { text: "Offer generous terms to surrendering enemy soldiers", next: "generous_terms" },
        { text: "Consolidate control over northern provinces", next: "consolidate_north" }
      ]
    },
    "Fire stone catapults at the siege towers": {
      outcome: "Cao Cao's engineers roll out 'Thunder Carts' (Pili Che). Heavy stone projectiles smash Yuan Shao's wooden arrow towers to splinters!",
      historical_context: "'Thunder Carts' were ancient catapult engines designed to counter tall siege towers along wall perimeters.",
      next_scene_title: "Ch 11: Artillery Victory",
      dialogue: "With the wooden arrow towers destroyed, Cao Cao's soldiers cheer from the earthen ramparts.",
      choices: [
        { text: "Counter-tunnel beneath enemy trenches", next: "counter_tunnel" },
        { text: "Send Xu You to inspect intercepted supply letters", next: "inspect_letters" }
      ]
    },
    // Ch 12
    "Wait patiently until Zhuge Liang wakes up": {
      outcome: "Liu Bei stands quietly in the freezing snow for hours. When Zhuge Liang stirs and sees Liu Bei waiting respectfully, he is deeply moved!",
      historical_context: "The 'Three Visits' became a timeless symbol of seeking wisdom and talent with sincere humility.",
      next_scene_title: "Ch 12: The Longzhong Vision",
      dialogue: "Zhuge Liang invites Liu Bei inside his warm study, unrolling a grand map of China that shows how to form Three Kingdoms for lasting peace.",
      choices: [
        { text: "Agree to form a firm alliance with Sun Quan in the East", next: "ally_sun_quan" },
        { text: "Ask how to bring peace and good governance to Sichuan", next: "sichuan_peace" }
      ]
    },
    "Leave a polite handwritten note expressing your hope": {
      outcome: "Liu Bei writes a respectful letter expressing his earnest desire to rescue suffering citizens. Reading it later, Zhuge Liang agrees to join Liu Bei!",
      historical_context: "Sincerity and written respect convinced Zhuge Liang to leave his peaceful farm life to help the world.",
      next_scene_title: "Ch 12: Sleeping Dragon Awakens",
      dialogue: "Zhuge Liang packs his books and feather fan, bidding farewell to Longzhong to serve as chief strategist.",
      choices: [
        { text: "Welcome Zhuge Liang to Xinye with a grand feast", next: "welcome_feast" },
        { text: "Introduce Zhuge Liang to Guan Yu and Zhang Fei", next: "introduce_brothers" }
      ]
    },
    // Ch 13
    "Zhao Yun feigns retreat into the dry reed pass": {
      outcome: "Zhao Yun feigns defeat, drawing Xiahou Dun's 100,000 troops deep into the narrow Bowan Slope pass packed with dry autumn reeds!",
      historical_context: "Feigned retreats were classic tactical lures used to draw overconfident armies into tight kill zones.",
      next_scene_title: "Ch 13: Trap at Bowan Slope",
      dialogue: "Xiahou Dun's long supply wagons are jammed inside the narrow pass as night falls and mountain winds pick up.",
      choices: [
        { text: "Signal Guan Yu and Zhang Fei to unleash fire arrows", next: "unleash_fire" },
        { text: "Block the exit pass with Zhao Yun's cavalry", next: "block_exit" }
      ]
    },
    "Signal Guan Yu to light the fire arrows": {
      outcome: "Fire arrows rain down onto the parched reeds! Fanned by winds, a wall of flame engulfs the canyon, routing Xiahou Dun's army. Guan Yu and Zhang Fei bow in deep admiration to Zhuge Liang!",
      historical_context: "This victory at Bowan Slope earned Zhuge Liang the complete trust and respect of Liu Bei's veteran generals.",
      next_scene_title: "Ch 13: Respect Earned",
      dialogue: "Guan Yu and Zhang Fei realize Zhuge Liang's brilliant mind is like 'water to a fish'. What is the next strategic step?",
      choices: [
        { text: "Prepare Xinye citizens for relocation before Cao Cao returns", next: "relocate_citizens" },
        { text: "Send Zhuge Liang as envoy to Sun Quan's navy", next: "envoy_sun_quan" }
      ]
    },
    // Ch 14
    "Send Huang Gai's straw fire-ships with the wind": {
      outcome: "Huang Gai's fire-ships ignite and speed down the Yangtze River! Driven by a roaring southeast wind, they slam into Cao Cao's chained fleet, turning the river into fire!",
      historical_context: "The fire attack at Red Cliffs destroyed Cao Cao's navy and stopped his conquest of southern China.",
      next_scene_title: "Ch 14: Victory at Red Cliffs",
      dialogue: "Flames illuminate the night sky across the Yangtze. Cao Cao's remaining land forces retreat north along Huarong Trail.",
      choices: [
        { text: "Guan Yu encounters Cao Cao at Huarong Trail", next: "guanyu_huarong" },
        { text: "Help Sun Quan and Zhou Yu secure the southern riverports", next: "secure_ports" }
      ]
    },
    "Use straw boats in the morning fog to borrow arrows": {
      outcome: "Zhuge Liang sails 20 straw-covered boats through dense fog. Hearing drums, enemy archers shoot 100,000 arrows into the straw! Zhuge Liang returns with full quivers!",
      historical_context: "Borrowing arrows with straw boats demonstrated Zhuge Liang's deep understanding of weather, fog, and human psychology.",
      next_scene_title: "Ch 14: 100,000 Arrows Secured",
      dialogue: "Commander Zhou Yu marvels at Zhuge Liang's genius as 100,000 arrows are unloaded onto the dock.",
      choices: [
        { text: "Equip the Wu archers for the upcoming naval battle", next: "equip_archers" },
        { text: "Consult Pang Tong regarding the chained ship formation", next: "consult_pang" }
      ]
    },
    // Ch 15
    "Build schools and trade roads in Shu Han": {
      outcome: "Zhuge Liang builds academies, silk weaving workshops, and mountain trade roads in Chengdu. Shu Han flourishes with education and economic vitality!",
      historical_context: "Shu Han was celebrated for its clean governance, public education, and famous Sichuan silk trade.",
      next_scene_title: "Ch 15: Prosperity in Sichuan",
      dialogue: "Scholars, traders, and farmers enjoy decades of peace in the mountain kingdom. How do you maintain state harmony?",
      choices: [
        { text: "Promote honest scholars to local administrative posts", next: "promote_scholars" },
        { text: "Maintain peace with neighboring southern tribes", next: "southern_peace" }
      ]
    },
    "Form a lasting trade alliance between Shu and Wu": {
      outcome: "Envoys travel along the Yangtze River, creating an enduring alliance between Shu Han and Eastern Wu. Both realms thrive through shared trade!",
      historical_context: "The alliance between Shu and Wu preserved the multi-state balance of power for over forty years.",
      next_scene_title: "Ch 15: The Tri-State Balance",
      dialogue: "With three sovereign states established, China enters an era of rich cultural heritage and legendary history.",
      choices: [
        { text: "Advance to Chapter 16: Northern Expeditions", next: "ch16_start" },
        { text: "Replay your favorite story chapter from the beginning", next: "replay_story" }
      ]
    },
    // Ch 16
    "Deploy Wooden Oxen transport supply convoys": {
      outcome: "Zhuge Liang's automated Wooden Oxen roll effortlessly up steep mountain cliffs, delivering fresh grain supplies to the frontline troops!",
      historical_context: "The 'Wooden Oxen and Gliding Horses' were ancient mechanical wheelbarrows designed to solve mountain logistics.",
      next_scene_title: "Ch 16: Mountain Logistics Victory",
      dialogue: "With steady food supplies, Zhuge Liang outmaneuvers Sima Yi along the Qishan mountains.",
      choices: [
        { text: "Establish fortified grain depots in the valley", next: "fortify_depots" },
        { text: "Send peaceful agricultural envoys to local villagers", next: "peaceful_envoys" }
      ]
    },
    "Outmaneuver Sima Yi's defensive hill fortresses": {
      outcome: "Zhuge Liang uses clever decoy banners along the river valley. Sima Yi chooses to defend cautiously, preserving both armies from heavy casualties!",
      historical_context: "Sima Yi respected Zhuge Liang's brilliance so much that he preferred strategic defense over risky open battles.",
      next_scene_title: "Ch 16: The Strategic Chess Match",
      dialogue: "The northern campaigns show that wisdom and patience can protect soldiers' lives.",
      choices: [
        { text: "Train young scholars to pass on Zhuge Liang's inventions", next: "train_scholars" },
        { text: "Prepare for the final chapter of reunification", next: "ch17_start" }
      ]
    },
    // Ch 17
    "Proclaim universal peace and rebuild farmland": {
      outcome: "The Jin Dynasty proclaims peace across all three former realms! Farmers return to their fields, roads reopen for trade, and families celebrate reunion.",
      historical_context: "The founding of the Jin Dynasty in 280 AD marked the end of nearly a century of division and war in China.",
      next_scene_title: "Ch 17: The Golden Era of Peace",
      dialogue: "China enters a peaceful era where the heroism of Liu Bei, Cao Cao, Sun Quan, and Zhuge Liang becomes legendary folklore.",
      choices: [
        { text: "Explore the full Character & Battle Guides", next: "explore_guides" },
        { text: "Test your historical knowledge in the Trivia Quiz", next: "take_quiz" }
      ]
    },
    "Establish royal libraries to preserve Three Kingdoms history": {
      outcome: "Imperial scholars record the heroic deeds, clever strategies, and loyal vows into royal archives, preserving the Romance of the Three Kingdoms forever!",
      historical_context: "Scholars like Chen Shou compiled the Records of the Three Kingdoms, ensuring these historical legends lived on for thousands of years.",
      next_scene_title: "Ch 17: Preserving the Legends",
      dialogue: "Your storybook journey through all 17 chapters is complete! You are now a Grand Historian of the Three Kingdoms.",
      choices: [
        { text: "Review your Achievements & Progress Badges", next: "view_progress" },
        { text: "Replay the story from Chapter 1", next: "replay_story" }
      ]
    },
    // Generic fallback choices
    "Wait patiently in the snow": {
      outcome: "Standing quietly outside the thatched cottage in freezing snow, Liu Bei shows true humility. When Zhuge Liang awakens, he is deeply moved by Liu Bei's sincere patience!",
      historical_context: "In Chinese history, 'Three Visits to the Thatched Cottage' is a timeless lesson in seeking wisdom with respect.",
      next_scene_title: "The Unrolling of the Longzhong Plan",
      dialogue: "Zhuge Liang invites the brothers inside his cozy study, unrolling a grand map of China. He reveals how China can be divided into Three Kingdoms to achieve peace!",
      choices: [
        { text: "Ask how to ally with Sun Quan in the east", next: "ally_east" },
        { text: "Ask how to protect Jing Province in the middle", next: "protect_jing" }
      ]
    },
    "Knock loudly on the door": {
      outcome: "Zhang Fei knocks vigorously on the wooden door! Zhuge Liang steps out rubbing his eyes with a yawn, chuckling at the enthusiastic visitors.",
      historical_context: "Zhang Fei was famous for his fiery temper and direct nature, contrasting with Liu Bei's gentle patience.",
      next_scene_title: "A Conversation over Hot Tea",
      dialogue: "Zhuge Liang brews warm tea for the chilly guests and tests Liu Bei's knowledge of strategy and governance. How should Liu Bei respond?",
      choices: [
        { text: "Speak with passion about protecting common citizens", next: "speak_people" },
        { text: "Ask Zhuge Liang for his personal advice first", next: "ask_advice" }
      ]
    },
    "Beat the drums louder": {
      outcome: "Thick river fog hides Zhuge Liang's twenty straw-covered boats. Hearing loud battle drums, the enemy panics and fires thousands of arrows straight into the straw!",
      historical_context: "Zhuge Liang successfully 'borrowed' over 100,000 arrows without losing a single soldier!",
      next_scene_title: "Returning with a Boatload of Arrows",
      dialogue: "As the sun rises and fog clears, Zhuge Liang orders his men to shout 'Thank you for the arrows!' before sailing back swiftly with the wind.",
      choices: [
        { text: "Deliver the 100,000 arrows safely to Commander Zhou Yu", next: "deliver_arrows" },
        { text: "Prepare the next stage of the fire attack strategy", next: "fire_plan" }
      ]
    },
    "Sail closer to the enemy": {
      outcome: "The straw boats drift closer through the mist! Enemy archers rain arrows down continuously, perfectly filling both sides of the straw-covered ships.",
      historical_context: "Zhuge Liang turned his boats around halfway through so the arrows would hit both sides evenly and balance the ships!",
      next_scene_title: "Balanced Ships & Full Quivers",
      dialogue: "With both sides bristling with arrows, the boats float stably on the Yangtze River, ready for a swift return voyage.",
      choices: [
        { text: "Turn the ships around and sail back with the current", next: "sail_back" },
        { text: "Signal Zhou Yu's fleet that the mission is accomplished", next: "signal_fleet" }
      ]
    }
  };

  const branchResult = fallbackBranches[choice_text] || {
    outcome: `You chose: "${choice_text}". The heroes proceed courageously, demonstrating remarkable wisdom and bravery!`,
    historical_context: "Every choice in the Three Kingdoms shaped the destiny of China for generations.",
    next_scene_title: "The Journey Continues",
    dialogue: "With newfound resolve, the alliance prepares for the next grand event in their quest for peace.",
    choices: [
      { text: "Advance with courage and honor", next: "advance_courage" },
      { text: "Consult the strategists for counsel", next: "consult_strategist" }
    ]
  };

  res.json(branchResult);
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
