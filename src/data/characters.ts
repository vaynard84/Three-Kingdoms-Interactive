import { Character } from '../types';

export const CHARACTERS: Character[] = [
  {
    id: "liu-bei",
    name: "Liu Bei",
    nameChinese: "刘备",
    courtesyName: "Xuande (玄德)",
    faction: "Shu",
    role: "Ruler",
    personality: "Kind-hearted, patient, humble, and deeply devoted to the well-being of common people.",
    strengths: ["Inspiring leadership", "Empathy & benevolence", "Attracting loyal heroes"],
    weaknesses: ["Can be overly emotional", "Hesitant to make harsh decisions"],
    relationships: [
      { targetCharacterId: "guan-yu", targetCharacterName: "Guan Yu", type: "Sworn Brother", description: "Sworn brother from the Peach Garden Oath." },
      { targetCharacterId: "zhang-fei", targetCharacterName: "Zhang Fei", type: "Sworn Brother", description: "Sworn brother who fought loyally by his side." },
      { targetCharacterId: "zhuge-liang", targetCharacterName: "Zhuge Liang", type: "Master/Servant", description: "Trusted chief advisor and strategist." },
      { targetCharacterId: "cao-cao", targetCharacterName: "Cao Cao", type: "Rival", description: "Arch-rival for the control of China." }
    ],
    majorEvents: ["Peach Garden Oath", "Three Visits to the Thatched Cottage", "Battle of Red Cliffs", "Founding of Shu Han"],
    biography: "Starting as a humble weaver of straw mats, Liu Bei claimed descent from the imperial Han family. Through sheer perseverance, benevolence, and the support of legendary brothers and advisors, he founded the Kingdom of Shu Han to protect the Han legacy.",
    whyThisCharacterMatters: "Liu Bei shows that true leadership comes from caring for others and never giving up, even when faced with overwhelming odds.",
    timeline: [
      { year: "184 AD", event: "Swore the Peach Garden Oath with Guan Yu and Zhang Fei." },
      { year: "207 AD", event: "Visited Zhuge Liang three times to recruit him." },
      { year: "208 AD", event: "Allied with Sun Quan to win the Battle of Red Cliffs." },
      { year: "221 AD", event: "Crowned himself Emperor of Shu Han in Chengdu." }
    ],
    chapterIds: [2, 3, 5, 6, 10, 12, 13, 14, 15],
    avatarSymbol: "👑",
    quote: "I would rather have people turn their backs on me than turn my back on the people."
  },
  {
    id: "guan-yu",
    name: "Guan Yu",
    nameChinese: "关羽",
    courtesyName: "Yunchang (云长)",
    faction: "Shu",
    role: "Warrior",
    personality: "Honorable, righteous, incredibly brave, proud, and fiercely loyal.",
    strengths: ["Unmatched martial skill", "Unwavering loyalty", "Inspiring military presence"],
    weaknesses: ["Pride and disdain for arrogant enemy generals"],
    relationships: [
      { targetCharacterId: "liu-bei", targetCharacterName: "Liu Bei", type: "Sworn Brother", description: "Elder sworn brother whom he served with total devotion." },
      { targetCharacterId: "zhang-fei", targetCharacterName: "Zhang Fei", type: "Sworn Brother", description: "Younger sworn brother." },
      { targetCharacterId: "cao-cao", targetCharacterName: "Cao Cao", type: "Rival", description: "Respected enemy who tried to recruit him with rich gifts." }
    ],
    majorEvents: ["Peach Garden Oath", "Duel at Hulao Pass", "Crossing Five Passes and Slaying Six Generals", "Battle of Fancheng"],
    biography: "Known as the 'God of War' and 'Lord of the Magnificent Beard', Guan Yu wielded the 82-pound Green Dragon Crescent Blade. His legendary loyalty to Liu Bei made him an enduring symbol of righteousness in Chinese history.",
    whyThisCharacterMatters: "Guan Yu teaches us that keeping promises and standing by friends is worth more than all the gold in the world.",
    timeline: [
      { year: "184 AD", event: "Swore brotherhood in the Peach Garden." },
      { year: "200 AD", event: "Slew Hua Xiong and Yan Liang; rode through five passes to rejoin Liu Bei." },
      { year: "208 AD", event: "Commanded the naval vanguard at Red Cliffs." },
      { year: "219 AD", event: "Defended Jing Province in his heroic final campaign." }
    ],
    chapterIds: [2, 3, 5, 6, 10, 11, 13, 14],
    avatarSymbol: "🗡️",
    quote: "Gifts and titles cannot change my heart; my loyalty belongs to my brother."
  },
  {
    id: "zhang-fei",
    name: "Zhang Fei",
    nameChinese: "张飞",
    courtesyName: "Yide (翼德)",
    faction: "Shu",
    role: "Warrior",
    personality: "Fiery, outspoken, fiercely brave, generous to friends, but quick-tempered.",
    strengths: ["Fearless battlefield strength", "Voice like thunder", "Unflinching loyalty"],
    weaknesses: ["Short temper", "Harsh treatment of subordinates when drinking"],
    relationships: [
      { targetCharacterId: "liu-bei", targetCharacterName: "Liu Bei", type: "Sworn Brother", description: "Eldest sworn brother." },
      { targetCharacterId: "guan-yu", targetCharacterName: "Guan Yu", type: "Sworn Brother", description: "Second sworn brother." }
    ],
    majorEvents: ["Peach Garden Oath", "Duel at Hulao Pass", "Roaring at Changban Bridge"],
    biography: "Wielding his 18-foot Viper Spear, Zhang Fei was a formidable warrior. At Changban Bridge, he stood alone on horseback and let out a thunderous roar so loud it terrified Cao Cao's advancing army into retreating!",
    whyThisCharacterMatters: "Zhang Fei shows that great courage can turn the tide of danger, though controlling one's temper is equally important.",
    timeline: [
      { year: "184 AD", event: "Joined Liu Bei and Guan Yu in the Peach Garden Oath." },
      { year: "190 AD", event: "Fought Lü Bu for fifty rounds at Hulao Pass." },
      { year: "208 AD", event: "Stood alone at Changban Bridge to hold off Cao Cao's army." }
    ],
    chapterIds: [2, 3, 5, 6, 10, 12, 13],
    avatarSymbol: "⚡",
    quote: "I am Zhang Yide of Yan! Who dares to fight me to the death?"
  },
  {
    id: "cao-cao",
    name: "Cao Cao",
    nameChinese: "曹操",
    courtesyName: "Mengde (孟德)",
    faction: "Wei",
    role: "Ruler",
    personality: "Brilliant, decisive, ambitious, cunning, poetic, and highly pragmatic.",
    strengths: ["Military strategy", "Recruiting top talent regardless of background", "Poetic vision"],
    weaknesses: ["Suspicious nature", "Ruthless when threatened"],
    relationships: [
      { targetCharacterId: "liu-bei", targetCharacterName: "Liu Bei", type: "Rival", description: "Chief rival for supreme leadership of China." },
      { targetCharacterId: "emperor-xian", targetCharacterName: "Emperor Xian", type: "Master/Servant", description: "Escorted the Emperor to Xuchang and used his authority." },
      { targetCharacterId: "yuan-shao", targetCharacterName: "Yuan Shao", type: "Rival", description: "Former childhood friend turned fierce northern competitor." },
      { targetCharacterId: "xun-yu", targetCharacterName: "Xun Yu", type: "Ally", description: "Trusted chief advisor and grand recruiter of talent." },
      { targetCharacterId: "sima-yi", targetCharacterName: "Sima Yi", type: "Master/Servant", description: "Retained Sima Yi while remaining watchful of his ambitions." }
    ],
    majorEvents: ["Coalition Against Dong Zhuo", "Rescuing Emperor Xian", "Battle of Guandu", "Battle of Red Cliffs"],
    biography: "Cao Cao was a strategic titan, gifted poet, and master administrator. By uniting northern China and establishing the foundation for the Kingdom of Wei, he proved to be one of history's most capable rulers.",
    whyThisCharacterMatters: "Cao Cao is a fascinating figure who teaches us that talent, organization, and quick thinking can build powerful kingdoms.",
    timeline: [
      { year: "190 AD", event: "Rallied the coalition against Dong Zhuo." },
      { year: "196 AD", event: "Escorted Emperor Xian to Xuchang and became Prime Minister." },
      { year: "200 AD", event: "Defeated Yuan Shao at the Battle of Guandu." },
      { year: "208 AD", event: "Fought the Allied Forces at Red Cliffs." }
    ],
    chapterIds: [2, 4, 5, 7, 9, 10, 11, 14, 15],
    avatarSymbol: "🦅",
    quote: "I would rather fail others than let others fail me!"
  },
  {
    id: "sun-quan",
    name: "Sun Quan",
    nameChinese: "孙权",
    courtesyName: "Zhongmou (仲谋)",
    faction: "Wu",
    role: "Ruler",
    personality: "Wise, composed, adept at judging character, cautious yet bold in critical moments.",
    strengths: ["Naval dominance", "Delegating to brilliant commanders", "Defending rich territories"],
    weaknesses: ["Internal family succession disputes later in life"],
    relationships: [
      { targetCharacterId: "zhou-yu", targetCharacterName: "Zhou Yu", type: "Ally", description: "Trusted chief naval commander." },
      { targetCharacterId: "liu-bei", targetCharacterName: "Liu Bei", type: "Ally", description: "Temporary ally at Red Cliffs; later competitor." },
      { targetCharacterId: "sun-shangxiang", targetCharacterName: "Sun Shangxiang", type: "Family", description: "Brave younger sister skilled in archery and martial arts." },
      { targetCharacterId: "gan-ning", targetCharacterName: "Gan Ning", type: "Ally", description: "Prized naval champion whose daring raids shocked enemy lines." }
    ],
    majorEvents: ["Battle of Red Cliffs", "Claiming Jing Province", "Founding of Eastern Wu"],
    biography: "Inheriting leadership of the Jiangdong region from his father Sun Jian and brother Sun Ce at a young age, Sun Quan ruled Eastern Wu with sharp judgment for over 50 years, commanding the Yangtze River navy.",
    whyThisCharacterMatters: "Sun Quan shows how careful planning, strong teamwork, and defending home territory can withstand massive invasions.",
    timeline: [
      { year: "200 AD", event: "Took leadership of Jiangdong at age 18 after Sun Ce's passing." },
      { year: "208 AD", event: "Approved Zhou Yu's plan to fight Cao Cao at Red Cliffs." },
      { year: "229 AD", event: "Crowned himself Emperor of Eastern Wu." }
    ],
    chapterIds: [14, 15],
    avatarSymbol: "🐅",
    quote: "If anyone suggests surrendering to Cao Cao, my sword shall strike this table!"
  },
  {
    id: "zhuge-liang",
    name: "Zhuge Liang",
    nameChinese: "诸葛亮",
    courtesyName: "Kongming (孔明)",
    faction: "Shu",
    role: "Strategist",
    personality: "Calm, masterfully intelligent, deeply loyal, inventive, and calm under fire.",
    strengths: ["Brilliant military tactics", "Diplomacy", "Scientific inventions (wooden oxen, repeating crossbows)"],
    weaknesses: ["Overworked himself by inspecting every detail"],
    relationships: [
      { targetCharacterId: "liu-bei", targetCharacterName: "Liu Bei", type: "Master/Servant", description: "Lord and soulmate in vision for China." },
      { targetCharacterId: "sima-yi", targetCharacterName: "Sima Yi", type: "Rival", description: "Ultimate northern rival during the Northern Expeditions." },
      { targetCharacterId: "zhou-yu", targetCharacterName: "Zhou Yu", type: "Ally", description: "Allied commander at Red Cliffs." },
      { targetCharacterId: "jiang-wei", targetCharacterName: "Jiang Wei", type: "Ally", description: "Prodigy student and entrusted heir to Shu's military legacy." }
    ],
    majorEvents: ["Three Visits to the Thatched Cottage", "Bowan Slope Fire Trap", "Borrowing Arrows with Straw Boats", "Empty Fort Strategy"],
    biography: "Known as the 'Sleeping Dragon', Zhuge Liang is history's archetype of strategic genius. Holding a feather fan, he directed armies, devised weather-based tactics, and invented clever logistics tools.",
    whyThisCharacterMatters: "Zhuge Liang shows that intelligence, calm preparation, and wisdom are more powerful than muscle and big armies.",
    timeline: [
      { year: "207 AD", event: "Joined Liu Bei after the Three Visits." },
      { year: "208 AD", event: "Devised fire strategies and borrowed arrows with straw boats at Red Cliffs." },
      { year: "227–234 AD", event: "Led six Northern Expeditions to attempt reunification." }
    ],
    chapterIds: [12, 13, 14, 15],
    avatarSymbol: "🪶",
    quote: "Devote oneself entirely unto death."
  },
  {
    id: "sima-yi",
    name: "Sima Yi",
    nameChinese: "司马懿",
    courtesyName: "Zhongda (仲达)",
    faction: "Wei",
    role: "Strategist",
    personality: "Patient, deeply calculating, enduring, cautious, and politically astute.",
    strengths: ["Defense mastery", "Patience", "Outlasting opponents"],
    weaknesses: ["Overly cautious against Zhuge Liang's traps"],
    relationships: [
      { targetCharacterId: "zhuge-liang", targetCharacterName: "Zhuge Liang", type: "Rival", description: "Arch-rival on the northwestern battlefield." },
      { targetCharacterId: "cao-cao", targetCharacterName: "Cao Cao", type: "Master/Servant", description: "Served Wei cautiously while waiting for the right moment." },
      { targetCharacterId: "jiang-wei", targetCharacterName: "Jiang Wei", type: "Rival", description: "Fought against Shu's post-Zhuge Liang expeditions." }
    ],
    majorEvents: ["Defense against Northern Expeditions", "Coup at Gaoping Tombs"],
    biography: "Sima Yi was the formidable Wei strategist who successfully held off Zhuge Liang's Northern Expeditions. His extreme patience and political foresight eventually paved the way for his grandson to unite China under the Jin Dynasty.",
    whyThisCharacterMatters: "Sima Yi proves that patience and long-term endurance can be the ultimate key to success.",
    timeline: [
      { year: "208 AD", event: "Entered Cao Cao's administration." },
      { year: "231 AD", event: "Commanded Wei armies against Zhuge Liang's campaigns." },
      { year: "249 AD", event: "Seized control of Wei state in the Gaoping Tombs Incident." }
    ],
    chapterIds: [15, 16, 17],
    avatarSymbol: "🛡️",
    quote: "The eagle does not show its talons until the moment it strikes."
  },
  {
    id: "zhao-yun",
    name: "Zhao Yun",
    nameChinese: "赵云",
    courtesyName: "Zilong (子龙)",
    faction: "Shu",
    role: "Warrior",
    personality: "Chivalrous, modest, flawless in battle, calm, and utterly dependable.",
    strengths: ["Spear mastery", "Unmatched courage under fire", "Modesty"],
    weaknesses: ["Rarely sought personal glory or political power"],
    relationships: [
      { targetCharacterId: "liu-bei", targetCharacterName: "Liu Bei", type: "Master/Servant", description: "Loyal tiger general who guarded Liu Bei's family." }
    ],
    majorEvents: ["Battle of Bowan Slope", "Single-handed rescue at Changban"],
    biography: "Clad in gleaming silver armor riding a white horse, Zhao Yun (Zilong of Changshan) was one of Shu's Five Tiger Generals. At the Battle of Changban, he rode alone into enemy lines seven times to rescue Liu Bei's infant son!",
    whyThisCharacterMatters: "Zhao Yun represents chivalry, selfless heroism, and dependability.",
    timeline: [
      { year: "200 AD", event: "Pledged allegiance to Liu Bei." },
      { year: "208 AD", event: "Saved baby Liu Shan at Changban." },
      { year: "214 AD", event: "Helped capture Sichuan for Shu." }
    ],
    chapterIds: [10, 13, 14],
    avatarSymbol: "🐴",
    quote: "I am Zhao Zilong of Changshan! My spear knows no fear!"
  },
  {
    id: "lu-bu",
    name: "Lü Bu",
    nameChinese: "吕布",
    courtesyName: "Fengxian (奉先)",
    faction: "Other",
    role: "Warrior",
    personality: "Incomparably powerful, reckless, impulsive, and easily influenced by rewards.",
    strengths: ["Unrivaled strength & archery", "Sky-Piercer Halberd", "Red Hare steed"],
    weaknesses: ["Lack of loyalty and strategic long-term thinking"],
    relationships: [
      { targetCharacterId: "dong-zhuo", targetCharacterName: "Dong Zhuo", type: "Enemy", description: "Adopted father whom he turned against." },
      { targetCharacterId: "diao-chan", targetCharacterName: "Diao Chan", type: "Family", description: "Beloved maiden in the Chain Plot." }
    ],
    majorEvents: ["Three Heroes Fight Lü Bu", "Assassination of Dong Zhuo", "Shooting the Halberd at Xiapi"],
    biography: "Known as 'Among men, Lü Bu; among horses, Red Hare', he was indisputably the most feared martial warrior of the era. However, his frequent changes in loyalty earned him a tragic reputation.",
    whyThisCharacterMatters: "Lü Bu teaches us that physical strength without loyalty and wisdom will not bring long-lasting success.",
    timeline: [
      { year: "189 AD", event: "Became Dong Zhuo's bodyguard and foster son." },
      { year: "190 AD", event: "Fought Liu Bei, Guan Yu, and Zhang Fei at Hulao Pass." },
      { year: "192 AD", event: "Eliminated Dong Zhuo at the palace gate." }
    ],
    chapterIds: [4, 5, 6, 8],
    avatarSymbol: "⚔️",
    quote: "Who in this world dares to challenge my Sky-Piercer Halberd?"
  },
  {
    id: "dong-zhuo",
    name: "Dong Zhuo",
    nameChinese: "董卓",
    courtesyName: "Zhongying (仲颖)",
    faction: "Other",
    role: "Ruler",
    personality: "Cruel, tyrannical, greedy, arrogant, and ruthless.",
    strengths: ["Brute military force", "Command of frontier cavalry"],
    weaknesses: ["Extremely paranoid", "Alienated all ministers and generals"],
    relationships: [
      { targetCharacterId: "lu-bu", targetCharacterName: "Lü Bu", type: "Enemy", description: "Bodyguard who eventually turned against him." },
      { targetCharacterId: "emperor-xian", targetCharacterName: "Emperor Xian", type: "Master/Servant", description: "Controlled the Emperor as a puppet." }
    ],
    majorEvents: ["Occupation of Luoyang", "Burning of Luoyang", "Fall at Chang'an"],
    biography: "A frontier warlord who seized control of the Han capital, deposed the Emperor, and ruled through terror until his own bodyguard turned against him.",
    whyThisCharacterMatters: "Dong Zhuo serves as a historical warning against tyranny and cruelty.",
    timeline: [
      { year: "189 AD", event: "Marched into Luoyang and grabbed power." },
      { year: "190 AD", event: "Burned Luoyang and moved capital to Chang'an." },
      { year: "192 AD", event: "Eliminated by Lü Bu in Chang'an." }
    ],
    chapterIds: [1, 4, 5, 6, 7, 8],
    avatarSymbol: "🔥",
    quote: "Those who obey me shall live; those who oppose me shall perish!"
  },
  {
    id: "diao-chan",
    name: "Diao Chan",
    nameChinese: "貂蝉",
    courtesyName: "N/A",
    faction: "Other",
    role: "Official",
    personality: "Courageous, clever, self-sacrificing, poised, and devoted to righteousness.",
    strengths: ["Quick wits", "Unshakable nerve", "Dramatic poise"],
    weaknesses: ["Placed herself in extreme personal danger"],
    relationships: [
      { targetCharacterId: "lu-bu", targetCharacterName: "Lü Bu", type: "Ally", description: "Target of her strategic romance." },
      { targetCharacterId: "dong-zhuo", targetCharacterName: "Dong Zhuo", type: "Enemy", description: "Target of the Chain Plot." }
    ],
    majorEvents: ["The Chain Plot in Chang'an"],
    biography: "One of the Four Great Beauties of ancient China. She risked her life to help Minister Wang Yun carry out the 'Chain Plot', successfully ending Dong Zhuo's dark reign.",
    whyThisCharacterMatters: "Diao Chan shows that bravery and wit can overcome massive armies without firing a single arrow.",
    timeline: [
      { year: "192 AD", event: "Executed the Chain Plot in Chang'an to save the country." }
    ],
    chapterIds: [8],
    avatarSymbol: "🌸",
    quote: "If it restores peace to the nation, I fear no danger."
  },
  {
    id: "zhou-yu",
    name: "Zhou Yu",
    nameChinese: "周瑜",
    courtesyName: "Gongjin (公瑾)",
    faction: "Wu",
    role: "Strategist",
    personality: "Talented, handsome, musically gifted, proud, and a master naval commander.",
    strengths: ["Naval tactics", "Commanding Wu fleet", "Inspiring military spirit"],
    weaknesses: ["Intense rivalry with Zhuge Liang"],
    relationships: [
      { targetCharacterId: "sun-quan", targetCharacterName: "Sun Quan", type: "Ally", description: "Chief naval commander." },
      { targetCharacterId: "zhuge-liang", targetCharacterName: "Zhuge Liang", type: "Rival", description: "Brilliant ally yet fierce intellectual rival at Red Cliffs." }
    ],
    majorEvents: ["Battle of Red Cliffs"],
    biography: "Known as 'Zhou the Handsome Young Master', he was Eastern Wu's legendary Grand Commander who orchestrated the fire-ship strategy at Red Cliffs.",
    whyThisCharacterMatters: "Zhou Yu demonstrates the power of decisive naval strategy and leading from the front.",
    timeline: [
      { year: "208 AD", event: "Commanded the allied fleet at Red Cliffs to victory over Cao Cao." }
    ],
    chapterIds: [14],
    avatarSymbol: "⛵",
    quote: "With fire and the southeastern wind, Cao Cao's navy shall burn!"
  },
  {
    id: "yuan-shao",
    name: "Yuan Shao",
    nameChinese: "袁绍",
    courtesyName: "Benchu (本初)",
    faction: "Other",
    role: "Ruler",
    personality: "Noble, dignified, proud, but hesitant and indecisive in key moments.",
    strengths: ["Prestigious family heritage (Four Generations of High Ministers)", "Massive army size"],
    weaknesses: ["Indecisiveness", "Ignoring good advice from trusted advisors"],
    relationships: [
      { targetCharacterId: "cao-cao", targetCharacterName: "Cao Cao", type: "Rival", description: "Childhood friend turned northern arch-rival." }
    ],
    majorEvents: ["Leader of the Coalition against Dong Zhuo", "Battle of Guandu"],
    biography: "Head of the prestigious Yuan clan, he led the 18 Warlord Coalition against Dong Zhuo and controlled northern China before his loss at Guandu.",
    whyThisCharacterMatters: "Yuan Shao demonstrates that prestige and numbers mean little without decisive action and good listening.",
    timeline: [
      { year: "190 AD", event: "Elected Supreme Leader of the Coalition against Dong Zhuo." },
      { year: "200 AD", event: "Fought Cao Cao at the Battle of Guandu." }
    ],
    chapterIds: [1, 2, 4, 5, 7, 9, 11],
    avatarSymbol: "🚩",
    quote: "My family's prestige spans four generations; who dares defy my banners?"
  },
  {
    id: "emperor-xian",
    name: "Emperor Xian of Han",
    nameChinese: "汉献帝",
    courtesyName: "Liu Xie (刘协)",
    faction: "Han",
    role: "Official",
    personality: "Gentle, cultured, trapped in tragic circumstances beyond his control.",
    strengths: ["Legitimate Imperial bloodline"],
    weaknesses: ["Had no private army or political power"],
    relationships: [
      { targetCharacterId: "dong-zhuo", targetCharacterName: "Dong Zhuo", type: "Master/Servant", description: "Placed on the throne as a puppet." },
      { targetCharacterId: "cao-cao", targetCharacterName: "Cao Cao", type: "Master/Servant", description: "Escorted to Xuchang and guarded by Cao Cao." }
    ],
    majorEvents: ["Accession in Luoyang", "Flight to Xuchang", "Abdication in 220 AD"],
    biography: "The last emperor of the 400-year Han Dynasty. Placed on the throne as a young boy, he was passed between warlords until Cao Pi forced his abdication in 220 AD.",
    whyThisCharacterMatters: "Emperor Xian's story helps us understand how political power can shift when central authority breaks down.",
    timeline: [
      { year: "189 AD", event: "Made emperor by Dong Zhuo at age 8." },
      { year: "196 AD", event: "Escorted to Xuchang by Cao Cao." },
      { year: "220 AD", event: "Stepped down, ending the Han Dynasty." }
    ],
    chapterIds: [1, 4, 9, 15],
    avatarSymbol: "🏛️",
    quote: "May peace return to the lands of Han."
  },
  {
    id: "xun-yu",
    name: "Xun Yu",
    nameChinese: "荀彧",
    courtesyName: "Wenruo (文若)",
    faction: "Wei",
    role: "Official",
    personality: "Principled, noble, deeply intellectual, diplomatic, and unyieldingly loyal to the Han imperial house.",
    strengths: ["Master talent scout", "Grand administrative foresight", "Unshakable ethical integrity"],
    weaknesses: ["Inner conflict between loyalty to Han and devotion to Cao Cao"],
    relationships: [
      { targetCharacterId: "cao-cao", targetCharacterName: "Cao Cao", type: "Ally", description: "Chief strategist and administrative pillar behind Wei's rise." },
      { targetCharacterId: "emperor-xian", targetCharacterName: "Emperor Xian of Han", type: "Master/Servant", description: "Devoted Han loyalist who sought to preserve imperial dignity." }
    ],
    majorEvents: ["Escorting Emperor Xian to Xuchang", "Battle of Guandu Logistics", "Recruiting Northern Talents"],
    biography: "Known as Cao Cao's 'Zhang Liang', Xun Yu was the chief political strategist who advised Cao Cao to welcome Emperor Xian to Xuchang and personally recruited legendary figures like Guo Jia and Sima Yi. His noble principles stood as Wei's moral foundation.",
    whyThisCharacterMatters: "Xun Yu illustrates how deep moral principles and strategic brilliance can shape an entire era's administrative order.",
    timeline: [
      { year: "191 AD", event: "Joined Cao Cao and became his premier advisor and grand recruiter." },
      { year: "196 AD", event: "Devised the master strategy to escort Emperor Xian to Xuchang." },
      { year: "200 AD", event: "Maintained home supply lines and civilian morale during the Battle of Guandu." }
    ],
    chapterIds: [9, 11],
    avatarSymbol: "📜",
    quote: "To secure peace across the realm, one must first restore honor and protect the throne."
  },
  {
    id: "sun-shangxiang",
    name: "Sun Shangxiang",
    nameChinese: "孙尚香",
    courtesyName: "Lady Sun (孙夫人)",
    faction: "Wu",
    role: "Warrior",
    personality: "Bold, spirited, fiercely independent, trained in archery and swordsmanship, and deeply loyal.",
    strengths: ["Fearless martial skills", "Commanded an all-female armed guard", "Diplomatic bridge between Wu and Shu"],
    weaknesses: ["Caught in the dangerous political rivalry between her brother and husband"],
    relationships: [
      { targetCharacterId: "sun-quan", targetCharacterName: "Sun Quan", type: "Family", description: "Fierce younger sister of Sun Quan." },
      { targetCharacterId: "liu-bei", targetCharacterName: "Liu Bei", type: "Family", description: "Wed to Liu Bei in a famous diplomatic marriage." }
    ],
    majorEvents: ["Wu-Shu Diplomatic Marriage", "Escape from Jing Province", "Battle of Yiling Era"],
    biography: "The sister of Sun Ce and Sun Quan, Lady Sun was renowned for her martial prowess—her personal chambers were lined with weapons and guarded by female warriors. Her marriage to Liu Bei bridged Wu and Shu, making her an iconic historical hero.",
    whyThisCharacterMatters: "She shows that women held formidable courage, influence, and martial authority in a fierce warlord era.",
    timeline: [
      { year: "209 AD", event: "Married Liu Bei at Jing Province as part of the Wu-Shu alliance." },
      { year: "212 AD", event: "Escaped back to Eastern Wu after a high-stakes river pursuit." }
    ],
    chapterIds: [14, 15],
    avatarSymbol: "🏹",
    quote: "Do not judge me by my silk robes—my blades strike as true as any general's!"
  },
  {
    id: "gan-ning",
    name: "Gan Ning",
    nameChinese: "甘宁",
    courtesyName: "Xingba (兴霸)",
    faction: "Wu",
    role: "General",
    personality: "Wildly daring, flamboyant, fierce, protective of his men, and utterly fearless.",
    strengths: ["Unmatched river raiding & naval combat", "Sensational night combat tactics", "High morale leadership"],
    weaknesses: ["Short temper and pirate past that alienated conservative scholars"],
    relationships: [
      { targetCharacterId: "sun-quan", targetCharacterName: "Sun Quan", type: "Ally", description: "Prized naval general praised by Sun Quan." },
      { targetCharacterId: "zhou-yu", targetCharacterName: "Zhou Yu", type: "Ally", description: "Fought alongside Zhou Yu in the Yangtze campaigns." }
    ],
    majorEvents: ["Battle of Red Cliffs Navy", "Night Raid on Hefei", "Conquest of Jing Riverways"],
    biography: "Originally a famous river pirate known as 'Bell Pirate' for the bells tied to his belts, Gan Ning joined Wu and became one of Sun Quan's greatest naval commanders. His legendary 100-man night raid against Cao Cao's camp at Hefei left enemy commanders stunned.",
    whyThisCharacterMatters: "Gan Ning shows how unconventional background and raw courage can turn into legendary military leadership.",
    timeline: [
      { year: "208 AD", event: "Joined Eastern Wu and spearheaded naval assaults at Red Cliffs." },
      { year: "215 AD", event: "Led 100 elite horsemen in a daring midnight raid at Hefei without losing a single man." }
    ],
    chapterIds: [14, 15],
    avatarSymbol: "🔔",
    quote: "Cao Cao may have Wei's vast legions, but Eastern Wu has Gan Ning!"
  },
  {
    id: "jiang-wei",
    name: "Jiang Wei",
    nameChinese: "姜维",
    courtesyName: "Boyue (伯约)",
    faction: "Shu",
    role: "General",
    personality: "Chivalrous, intensely dedicated, brilliant in battle, indefatigable, and fiercely loyal to Shu.",
    strengths: ["Mastery of mountain strategy & troop formations", "Untiring perseverance", "Direct pupil of Zhuge Liang"],
    weaknesses: ["Over-extended Shu's resources in repeated Northern Expeditions"],
    relationships: [
      { targetCharacterId: "zhuge-liang", targetCharacterName: "Zhuge Liang", type: "Ally", description: "Discovered and mentored by Zhuge Liang as his ultimate successor." },
      { targetCharacterId: "sima-yi", targetCharacterName: "Sima Yi", type: "Rival", description: "Fought Sima Yi and his successors to preserve Shu." }
    ],
    majorEvents: ["Defection to Shu", "Nine Expeditions to Central Plains", "Defense of Jiange Pass"],
    biography: "Originally a young officer of Wei, his brilliance was recognized by Zhuge Liang, who recruited him into Shu. Inheriting Zhuge Liang's campaign books, Jiang Wei led eleven Northern Expeditions to keep the flame of Han alive until Shu's final days.",
    whyThisCharacterMatters: "Jiang Wei embodies the tragic hero who never surrenders, carrying a noble dream even against impossible odds.",
    timeline: [
      { year: "228 AD", event: "Joined Zhuge Liang during the 1st Northern Expedition." },
      { year: "253 AD", event: "Assumed total military command of Shu Han." },
      { year: "263 AD", event: "Held Jiange Pass against massive invasion forces." }
    ],
    chapterIds: [15, 16, 17],
    avatarSymbol: "🗡️",
    quote: "My body belongs to Shu; so long as I draw breath, the Han flag shall not fall!"
  }
];
