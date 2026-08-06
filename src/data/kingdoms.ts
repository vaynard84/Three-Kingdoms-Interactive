import { Kingdom } from '../types';

export const KINGDOMS: Kingdom[] = [
  {
    id: "Wei",
    name: "Cao Wei",
    nameChinese: "曹魏",
    founder: "Cao Pi (proclaimed) / Cao Cao (foundation)",
    capital: "Luoyang / Xuchang",
    colorTheme: {
      bg: "bg-blue-950",
      text: "text-blue-100",
      border: "border-blue-600",
      badge: "bg-blue-800 text-blue-100",
      gradient: "from-blue-900 via-slate-900 to-indigo-950",
      accentHex: "#2563eb"
    },
    leaders: ["Cao Cao", "Cao Pi", "Cao Rui"],
    keyCharacters: ["Cao Cao", "Sima Yi", "Xun Yu", "Xiahou Dun", "Zhang Liao"],
    majorTerritories: ["Central Plains", "Yellow River Basin", "Luoyang", "Xuchang"],
    allies: ["None permanently"],
    enemies: ["Shu Han", "Eastern Wu"],
    importantBattles: ["Battle of Guandu", "Battle of Red Cliffs", "Battle of Fancheng", "Northern Expeditions"],
    relatedChapterIds: [4, 5, 9, 11, 14, 15],
    description: "The largest, most populous, and economically strongest kingdom. Located in northern China, Wei was built by Cao Cao and valued merit, strict order, and military organization.",
    emblemSymbol: "🦅"
  },
  {
    id: "Shu",
    name: "Shu Han",
    nameChinese: "蜀汉",
    founder: "Liu Bei",
    capital: "Chengdu",
    colorTheme: {
      bg: "bg-emerald-950",
      text: "text-emerald-100",
      border: "border-emerald-600",
      badge: "bg-emerald-800 text-emerald-100",
      gradient: "from-emerald-900 via-teal-950 to-emerald-950",
      accentHex: "#059669"
    },
    leaders: ["Liu Bei", "Liu Shan"],
    keyCharacters: ["Liu Bei", "Guan Yu", "Zhang Fei", "Zhuge Liang", "Zhao Yun"],
    majorTerritories: ["Sichuan (Yi Province)", "Chengdu", "Hanzhong"],
    allies: ["Eastern Wu (Allied against Wei at times)"],
    enemies: ["Cao Wei"],
    importantBattles: ["Battle of Bowan Slope", "Battle of Red Cliffs", "Battle of Yiling", "Northern Expeditions"],
    relatedChapterIds: [3, 10, 12, 13, 14, 15],
    description: "Nestled in the lush, mountain-protected Sichuan basin, Shu Han was founded by Liu Bei to uphold the legacy and righteousness of the ancient Han Dynasty.",
    emblemSymbol: "🐉"
  },
  {
    id: "Wu",
    name: "Eastern Wu",
    nameChinese: "东吴",
    founder: "Sun Quan",
    capital: "Jianye (Nanjing)",
    colorTheme: {
      bg: "bg-red-950",
      text: "text-red-100",
      border: "border-red-600",
      badge: "bg-red-800 text-red-100",
      gradient: "from-red-900 via-rose-950 to-red-950",
      accentHex: "#dc2626"
    },
    leaders: ["Sun Jian", "Sun Ce", "Sun Quan"],
    keyCharacters: ["Sun Quan", "Zhou Yu", "Lu Xun", "Huang Gai", "Lu Su"],
    majorTerritories: ["Jiangdong (South of Yangtze River)", "Jianye", "Jing Province"],
    allies: ["Shu Han (Intermittent)"],
    enemies: ["Cao Wei"],
    importantBattles: ["Battle of Red Cliffs", "Capture of Jing Province", "Battle of Yiling"],
    relatedChapterIds: [7, 14, 15],
    description: "Masters of the Yangtze River and maritime trade, Eastern Wu relied on its legendary navy, strong fortresses, and brave Jiangdong officers.",
    emblemSymbol: "🐅"
  },
  {
    id: "Han",
    name: "Han Dynasty (Loyalists)",
    nameChinese: "汉朝",
    founder: "Emperor Gaozu (202 BC)",
    capital: "Luoyang / Chang'an",
    colorTheme: {
      bg: "bg-amber-950",
      text: "text-amber-100",
      border: "border-amber-600",
      badge: "bg-amber-800 text-amber-100",
      gradient: "from-amber-900 via-yellow-950 to-amber-950",
      accentHex: "#d97706"
    },
    leaders: ["Emperor Ling", "Emperor Xian"],
    keyCharacters: ["Emperor Xian", "Wang Yun", "Xun Yu"],
    majorTerritories: ["Imperial Capital Grounds"],
    allies: ["Liu Bei (Han loyalist)"],
    enemies: ["Rebel warlords"],
    importantBattles: ["Yellow Turban Rebellion"],
    relatedChapterIds: [1, 4, 8, 9, 15],
    description: "The 400-year golden empire whose decline triggered the warlord era. Represented authority, tradition, and royal legitimacy.",
    emblemSymbol: "🏛️"
  },
  {
    id: "Other",
    name: "Independent Warlords & Factions",
    nameChinese: "群雄",
    founder: "Various regional warlords",
    capital: "Various regional strongholds",
    colorTheme: {
      bg: "bg-purple-950",
      text: "text-purple-100",
      border: "border-purple-600",
      badge: "bg-purple-800 text-purple-100",
      gradient: "from-purple-900 via-slate-900 to-purple-950",
      accentHex: "#9333ea"
    },
    leaders: ["Dong Zhuo", "Yuan Shao", "Lü Bu", "Liu Biao", "Yuan Shu"],
    keyCharacters: ["Lü Bu", "Dong Zhuo", "Diao Chan", "Yuan Shao"],
    majorTerritories: ["Jizhou", "Chang'an", "Xu Province"],
    allies: ["Short-lived coalitions"],
    enemies: ["Each other and the main three kingdoms"],
    importantBattles: ["Hulao Pass", "Battle of Guandu"],
    relatedChapterIds: [2, 4, 5, 6, 7, 8],
    description: "Powerful regional leaders who carved out independent lands during the fall of the Han before the main three kingdoms solidified.",
    emblemSymbol: "🚩"
  }
];
