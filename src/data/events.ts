import { HistoricalEvent } from '../types';

export const EVENTS: HistoricalEvent[] = [
  {
    id: "yellow-turban-rebellion",
    title: "Yellow Turban Rebellion",
    titleChinese: "黄巾之乱",
    when: "184 AD",
    where: "Across Northern and Central China (Jizhou, Henan)",
    involvedCharacterIds: ["liu-bei", "guan-yu", "zhang-fei", "cao-cao", "yuan-shao"],
    cause: "Severe drought, floods, and corrupt palace officials made millions of farmers starve.",
    whatHappened: "Zhang Jue gathered millions of peasant rebels wearing yellow headbands to overthrow the Han government.",
    whoWonOrBenefited: "The Han army and volunteer local warlords crushed the rebels, but local warlords kept their private armies.",
    whyItMattered: "This rebellion shattered central government control and created the independent warlord armies.",
    whatHappenedNext: "Warlords started fighting each other for territory and influence.",
    relatedChapterIds: [1, 2, 3],
    factionInvolved: ["Han", "Other"],
    diagram: {
      nodes: [
        { id: "zhang-jue", label: "Zhang Jue (Rebel Leader)", role: "Leader", faction: "Other" },
        { id: "han-court", label: "Han Court", role: "Target", faction: "Han" },
        { id: "liu-bei", label: "Liu Bei (Volunteer)", role: "General", faction: "Shu" },
        { id: "cao-cao", label: "Cao Cao (Officer)", role: "General", faction: "Wei" }
      ],
      links: [
        { source: "zhang-jue", target: "han-court", type: "Attacked", label: "Rebelled against" },
        { source: "liu-bei", target: "zhang-jue", type: "Defeated", label: "Fought against" },
        { source: "cao-cao", target: "zhang-jue", type: "Defeated", label: "Led imperial cavalry" }
      ]
    }
  },
  {
    id: "peach-garden-oath",
    title: "Peach Garden Oath",
    titleChinese: "桃园三结义",
    when: "184 AD",
    where: "Zhuo County (Zhang Fei's Peach Orchard)",
    involvedCharacterIds: ["liu-bei", "guan-yu", "zhang-fei"],
    cause: "Three brave men wanted to combine their strength to save people during the rebellion.",
    whatHappened: "Liu Bei, Guan Yu, and Zhang Fei swore an eternal brotherhood under blooming peach trees.",
    whoWonOrBenefited: "All three brothers gained lifelong trust and a unified cause.",
    whyItMattered: "It created the most famous band of brothers in Asian history.",
    whatHappenedNext: "They recruited a volunteer army and fought together across China.",
    relatedChapterIds: [3],
    factionInvolved: ["Shu"],
    diagram: {
      nodes: [
        { id: "liu-bei", label: "Liu Bei (Eldest Brother)", role: "Leader", faction: "Shu" },
        { id: "guan-yu", label: "Guan Yu (Second Brother)", role: "General", faction: "Shu" },
        { id: "zhang-fei", label: "Zhang Fei (Third Brother)", role: "General", faction: "Shu" }
      ],
      links: [
        { source: "liu-bei", target: "guan-yu", type: "Allied With", label: "Sworn Brotherhood" },
        { source: "guan-yu", target: "zhang-fei", type: "Allied With", label: "Sworn Brotherhood" },
        { source: "zhang-fei", target: "liu-bei", type: "Allied With", label: "Sworn Brotherhood" }
      ]
    }
  },
  {
    id: "coalition-against-dong-zhuo",
    title: "Coalition Against Dong Zhuo",
    titleChinese: "反董卓联盟",
    when: "190 AD",
    where: "Hulao Pass and Luoyang",
    involvedCharacterIds: ["yuan-shao", "cao-cao", "dong-zhuo", "lu-bu", "liu-bei", "guan-yu", "zhang-fei"],
    cause: "Dong Zhuo took control of the capital, replaced the Emperor, and ruled like a dictator.",
    whatHappened: "18 warlords led by Yuan Shao joined armies to remove Dong Zhuo.",
    whoWonOrBenefited: "Dong Zhuo was forced to retreat, but jealousy broke the coalition apart.",
    whyItMattered: "It proved that China had no single ruler left—the era of warring states had begun.",
    whatHappenedNext: "Dong Zhuo burned Luoyang and retreated to Chang'an.",
    relatedChapterIds: [4, 5, 6, 7],
    factionInvolved: ["Wei", "Shu", "Han", "Other"],
    diagram: {
      nodes: [
        { id: "yuan-shao", label: "Yuan Shao (Coalition Leader)", role: "Leader", faction: "Other" },
        { id: "dong-zhuo", label: "Dong Zhuo (Dictator)", role: "Target", faction: "Other" },
        { id: "lu-bu", label: "Lü Bu (Champion)", role: "General", faction: "Other" },
        { id: "three-brothers", label: "Three Brothers", role: "Ally", faction: "Shu" }
      ],
      links: [
        { source: "yuan-shao", target: "dong-zhuo", type: "Attacked", label: "Marched against" },
        { source: "lu-bu", target: "dong-zhuo", type: "Advised", label: "Guarded" },
        { source: "three-brothers", target: "lu-bu", type: "Attacked", label: "Fought at Hulao Pass" }
      ]
    }
  },
  {
    id: "battle-of-hulao-pass",
    title: "Battle of Hulao Pass",
    titleChinese: "虎牢关之战",
    when: "190 AD",
    where: "Hulao Pass Fortress",
    involvedCharacterIds: ["lu-bu", "zhang-fei", "guan-yu", "liu-bei"],
    cause: "Lü Bu blocked the coalition army from reaching Luoyang.",
    whatHappened: "Zhang Fei, Guan Yu, and Liu Bei fought Lü Bu in a famous 3-on-1 duel, forcing him back.",
    whoWonOrBenefited: "The three brothers made a name for themselves across China.",
    whyItMattered: "It showed Lü Bu could be pushed back when heroes fought together.",
    whatHappenedNext: "Dong Zhuo realized Hulao Pass was unsafe and set fire to Luoyang.",
    relatedChapterIds: [6],
    factionInvolved: ["Shu", "Other"],
    diagram: {
      nodes: [
        { id: "lu-bu", label: "Lü Bu", role: "Target", faction: "Other" },
        { id: "zhang-fei", label: "Zhang Fei", role: "General", faction: "Shu" },
        { id: "guan-yu", label: "Guan Yu", role: "General", faction: "Shu" },
        { id: "liu-bei", label: "Liu Bei", role: "Leader", faction: "Shu" }
      ],
      links: [
        { source: "zhang-fei", target: "lu-bu", type: "Attacked", label: "1st Challenger" },
        { source: "guan-yu", target: "lu-bu", type: "Attacked", label: "2nd Challenger" },
        { source: "liu-bei", target: "lu-bu", type: "Attacked", label: "3rd Challenger" }
      ]
    }
  },
  {
    id: "dong-zhuo-death",
    title: "Fall of Dong Zhuo",
    titleChinese: "诛灭董卓",
    when: "192 AD",
    where: "Chang'an Imperial Palace",
    involvedCharacterIds: ["dong-zhuo", "lu-bu", "diao-chan"],
    cause: "Dong Zhuo's cruelty threatened everyone in Chang'an.",
    whatHappened: "Wang Yun and Diao Chan used the Chain Plot to make Lü Bu turn against Dong Zhuo.",
    whoWonOrBenefited: "The Han court was freed from Dong Zhuo's tyranny.",
    whyItMattered: "It ended one of the darkest dictatorships of the era.",
    whatHappenedNext: "Chang'an fell into chaos as Dong Zhuo's generals fought for control.",
    relatedChapterIds: [8],
    factionInvolved: ["Other", "Han"],
    diagram: {
      nodes: [
        { id: "diao-chan", label: "Diao Chan", role: "Strategist", faction: "Other" },
        { id: "lu-bu", label: "Lü Bu", role: "General", faction: "Other" },
        { id: "dong-zhuo", label: "Dong Zhuo", role: "Target", faction: "Other" }
      ],
      links: [
        { source: "diao-chan", target: "lu-bu", type: "Advised", label: "Persuaded" },
        { source: "lu-bu", target: "dong-zhuo", type: "Betrayed", label: "Eliminated at palace" }
      ]
    }
  },
  {
    id: "battle-of-guandu",
    title: "Battle of Guandu",
    titleChinese: "官渡之战",
    when: "200 AD",
    where: "Guandu, Henan",
    involvedCharacterIds: ["cao-cao", "yuan-shao", "guan-yu"],
    cause: "Yuan Shao marched south with 100,000 men to eliminate Cao Cao.",
    whatHappened: "Cao Cao sneaked into Wuchao and burned Yuan Shao's food depot, causing Yuan Shao's army to panic.",
    whoWonOrBenefited: "Cao Cao won a massive victory and conquered northern China.",
    whyItMattered: "It made Cao Cao the most powerful ruler in northern China.",
    whatHappenedNext: "Cao Cao turned his eyes toward conquering southern China.",
    relatedChapterIds: [11],
    factionInvolved: ["Wei", "Other"],
    diagram: {
      nodes: [
        { id: "cao-cao", label: "Cao Cao (20,000 men)", role: "Leader", faction: "Wei" },
        { id: "yuan-shao", label: "Yuan Shao (100,000 men)", role: "Target", faction: "Other" },
        { id: "wuchao", label: "Wuchao Grain Depot", role: "Target", faction: "Other" }
      ],
      links: [
        { source: "yuan-shao", target: "cao-cao", type: "Attacked", label: "Besieged at Guandu" },
        { source: "cao-cao", target: "wuchao", type: "Attacked", label: "Burned food supply" }
      ]
    }
  },
  {
    id: "three-visits-cottage",
    title: "Three Visits to the Thatched Cottage",
    titleChinese: "三顾茅庐",
    when: "207 AD",
    where: "Longzhong, Hubei",
    involvedCharacterIds: ["liu-bei", "zhuge-liang", "guan-yu", "zhang-fei"],
    cause: "Liu Bei needed a master mind to guide his strategy.",
    whatHappened: "Liu Bei visited Zhuge Liang three times in winter until Zhuge Liang agreed to help him.",
    whoWonOrBenefited: "Liu Bei gained history's greatest strategist.",
    whyItMattered: "Zhuge Liang created the blueprint to divide China into Three Kingdoms.",
    whatHappenedNext: "Zhuge Liang led Liu Bei's forces to victories at Bowan Slope and Red Cliffs.",
    relatedChapterIds: [12],
    factionInvolved: ["Shu"],
    diagram: {
      nodes: [
        { id: "liu-bei", label: "Liu Bei", role: "Leader", faction: "Shu" },
        { id: "zhuge-liang", label: "Zhuge Liang", role: "Strategist", faction: "Shu" }
      ],
      links: [
        { source: "liu-bei", target: "zhuge-liang", type: "Allied With", label: "Recruited after 3 visits" }
      ]
    }
  },
  {
    id: "battle-of-changban",
    title: "Battle of Changban",
    titleChinese: "长坂坡之战",
    when: "208 AD",
    where: "Changban, Hubei",
    involvedCharacterIds: ["liu-bei", "zhao-yun", "zhang-fei", "cao-cao"],
    cause: "Cao Cao's elite cavalry pursued Liu Bei's retreating army and civilian followers.",
    whatHappened: "Zhao Yun rescued Liu Bei's baby single-handedly, and Zhang Fei roared on Changban Bridge to halt Cao Cao.",
    whoWonOrBenefited: "Liu Bei and his family survived Cao Cao's dangerous chase.",
    whyItMattered: "It demonstrated the incredible bravery of Zhao Yun and Zhang Fei.",
    whatHappenedNext: "Liu Bei joined forces with Sun Quan to prepare for the Battle of Red Cliffs.",
    relatedChapterIds: [10, 13],
    factionInvolved: ["Shu", "Wei"],
    diagram: {
      nodes: [
        { id: "cao-cao", label: "Cao Cao's Army", role: "Target", faction: "Wei" },
        { id: "zhao-yun", label: "Zhao Yun", role: "General", faction: "Shu" },
        { id: "zhang-fei", label: "Zhang Fei", role: "General", faction: "Shu" }
      ],
      links: [
        { source: "zhao-yun", target: "cao-cao", type: "Attacked", label: "Rescued baby through enemy lines" },
        { source: "zhang-fei", target: "cao-cao", type: "Attacked", label: "Halted cavalry at bridge" }
      ]
    }
  },
  {
    id: "battle-of-red-cliffs",
    title: "Battle of Red Cliffs",
    titleChinese: "赤壁之战",
    when: "208 AD",
    where: "Red Cliffs, Yangtze River",
    involvedCharacterIds: ["cao-cao", "zhuge-liang", "zhou-yu", "sun-quan", "liu-bei"],
    cause: "Cao Cao brought 800,000 troops south to conquer Sun Quan and Liu Bei.",
    whatHappened: "The Allied forces used fire-ships against Cao Cao's chained fleet along the Yangtze River.",
    whoWonOrBenefited: "The Allied forces of Sun Quan and Liu Bei destroyed Cao Cao's fleet.",
    whyItMattered: "It stopped Cao Cao from unifying China and set up the Three Kingdoms.",
    whatHappenedNext: "China officially split into three rival regions.",
    relatedChapterIds: [14],
    factionInvolved: ["Wei", "Shu", "Wu"],
    diagram: {
      nodes: [
        { id: "cao-cao", label: "Cao Cao (Chained Fleet)", role: "Target", faction: "Wei" },
        { id: "zhou-yu", label: "Zhou Yu (Wu Navy)", role: "Leader", faction: "Wu" },
        { id: "zhuge-liang", label: "Zhuge Liang (Shu Advisor)", role: "Strategist", faction: "Shu" }
      ],
      links: [
        { source: "zhou-yu", target: "cao-cao", type: "Attacked", label: "Launched fire-ships" },
        { source: "zhuge-liang", target: "zhou-yu", type: "Advised", label: "Predicted wind & supplied tactics" }
      ]
    }
  },
  {
    id: "conquest-of-yi-province",
    title: "Conquest of Yi Province",
    titleChinese: "刘备入蜀",
    when: "214 AD",
    where: "Sichuan (Chengdu)",
    involvedCharacterIds: ["liu-bei", "zhuge-liang", "zhao-yun", "zhang-fei"],
    cause: "Liu Bei needed a rich, mountain-protected home base to build his kingdom.",
    whatHappened: "Liu Bei marched into Sichuan and established Chengdu as his capital.",
    whoWonOrBenefited: "Liu Bei gained a wealthy, secure territory.",
    whyItMattered: "This fulfilled the second stage of Zhuge Liang's Longzhong strategy.",
    whatHappenedNext: "Liu Bei declared himself King of Hanzhong and later Emperor of Shu.",
    relatedChapterIds: [15],
    factionInvolved: ["Shu"],
    diagram: {
      nodes: [
        { id: "liu-bei", label: "Liu Bei", role: "Leader", faction: "Shu" },
        { id: "zhuge-liang", label: "Zhuge Liang", role: "Strategist", faction: "Shu" }
      ],
      links: [
        { source: "liu-bei", target: "zhuge-liang", type: "Allied With", label: "Established Shu Han" }
      ]
    }
  },
  {
    id: "guan-yu-last-campaign",
    title: "Guan Yu's Campaign & Fancheng",
    titleChinese: "襄樊之战",
    when: "219 AD",
    where: "Fancheng & Jing Province",
    involvedCharacterIds: ["guan-yu", "cao-cao", "sun-quan"],
    cause: "Guan Yu marched north to attack Wei's fortress at Fancheng.",
    whatHappened: "Guan Yu flooded seven Wei armies, but Sun Quan secretly attacked Guan Yu's rear in Jing Province.",
    whoWonOrBenefited: "Sun Quan captured Jing Province.",
    whyItMattered: "It led to the heroic end of Guan Yu and broke the alliance between Shu and Wu.",
    whatHappenedNext: "Liu Bei launched the Battle of Yiling to avenge Guan Yu.",
    relatedChapterIds: [15],
    factionInvolved: ["Shu", "Wei", "Wu"],
    diagram: {
      nodes: [
        { id: "guan-yu", label: "Guan Yu", role: "Leader", faction: "Shu" },
        { id: "cao-cao", label: "Cao Cao Forces", role: "Target", faction: "Wei" },
        { id: "sun-quan", label: "Sun Quan Forces", role: "Target", faction: "Wu" }
      ],
      links: [
        { source: "guan-yu", target: "cao-cao", type: "Attacked", label: "Flooded Seven Armies" },
        { source: "sun-quan", target: "guan-yu", type: "Betrayed", label: "Captured Jing Province" }
      ]
    }
  },
  {
    id: "battle-of-yiling",
    title: "Battle of Yiling",
    titleChinese: "夷陵之战",
    when: "222 AD",
    where: "Yiling, Hubei",
    involvedCharacterIds: ["liu-bei", "sun-quan"],
    cause: "Liu Bei marched east to avenge Guan Yu and reclaim Jing Province.",
    whatHappened: "Wu commander Lu Xun used fire traps to burn Liu Bei's 700-li line of camps in the forest.",
    whoWonOrBenefited: "Sun Quan's Eastern Wu secured its borders.",
    whyItMattered: "Shu suffered heavy losses and Liu Bei passed away shortly after.",
    whatHappenedNext: "Zhuge Liang renewed the alliance with Wu and took over full leadership of Shu.",
    relatedChapterIds: [15],
    factionInvolved: ["Shu", "Wu"],
    diagram: {
      nodes: [
        { id: "liu-bei", label: "Liu Bei", role: "Leader", faction: "Shu" },
        { id: "lu-xun", label: "Lu Xun (Wu Commander)", role: "General", faction: "Wu" }
      ],
      links: [
        { source: "lu-xun", target: "liu-bei", type: "Attacked", label: "Burned 700-li camps" }
      ]
    }
  },
  {
    id: "campaign-of-hefei",
    title: "Battle of Hefei & Night Raid",
    titleChinese: "合肥之战",
    when: "215 AD",
    where: "Hefei Fortress (Anhui)",
    involvedCharacterIds: ["gan-ning", "sun-quan", "cao-cao"],
    cause: "Sun Quan led 100,000 Wu troops north to capture the vital strategic fortress of Hefei.",
    whatHappened: "Wei commander Zhang Liao mounted a fierce counter-assault. Later, Wu commander Gan Ning led 100 elite horsemen in a thrilling midnight raid straight through Cao Cao's main encampment without losing a single soldier.",
    whoWonOrBenefited: "Wei successfully held Hefei, but Gan Ning earned eternal legendary fame for Wu.",
    whyItMattered: "It established the river fortress of Hefei as an insurmountable border between Wei and Wu.",
    whatHappenedNext: "Sun Quan praised Gan Ning, declaring: 'Cao Cao has Zhang Liao, but I have my Gan Ning!'",
    relatedChapterIds: [14, 15],
    factionInvolved: ["Wu", "Wei"],
    diagram: {
      nodes: [
        { id: "gan-ning", label: "Gan Ning (100 Raiders)", role: "General", faction: "Wu" },
        { id: "sun-quan", label: "Sun Quan", role: "Leader", faction: "Wu" },
        { id: "cao-cao", label: "Cao Cao Forces", role: "Target", faction: "Wei" }
      ],
      links: [
        { source: "gan-ning", target: "cao-cao", type: "Attacked", label: "Midnight 100-Rider Raid" },
        { source: "sun-quan", target: "gan-ning", type: "Advised", label: "Praised courage" }
      ]
    }
  },
  {
    id: "southern-campaign",
    title: "Zhuge Liang's Southern Campaign",
    titleChinese: "诸葛亮平定南中",
    when: "225 AD",
    where: "Nanzhong (Yunnan/Guizhou)",
    involvedCharacterIds: ["zhuge-liang"],
    cause: "Southern tribes rebelled after Liu Bei's passing, threatening Shu's southern border.",
    whatHappened: "Zhuge Liang marched into dense jungles and captured king Meng Huo seven times, releasing him each time until Meng Huo submitted wholeheartedly.",
    whoWonOrBenefited: "Shu Han secured its southern frontier without long-term garrison resentment.",
    whyItMattered: "It allowed Zhuge Liang to mobilize full military focus toward the Northern Expeditions.",
    whatHappenedNext: "Zhuge Liang penned the Chu Shi Biao and marched north against Wei.",
    relatedChapterIds: [16],
    factionInvolved: ["Shu", "Other"],
    diagram: {
      nodes: [
        { id: "zhuge-liang", label: "Zhuge Liang", role: "Leader", faction: "Shu" },
        { id: "meng-huo", label: "Meng Huo (Southern King)", role: "Target", faction: "Other" }
      ],
      links: [
        { source: "zhuge-liang", target: "meng-huo", type: "Attacked", label: "Captured 7 Times" },
        { source: "zhuge-liang", target: "meng-huo", type: "Allied With", label: "Won heart & secured southern peace" }
      ]
    }
  },
  {
    id: "northern-expeditions",
    title: "Zhuge Liang's Northern Expeditions",
    titleChinese: "诸葛亮北伐",
    when: "227–234 AD",
    where: "Qishan & Shaanxi",
    involvedCharacterIds: ["zhuge-liang", "sima-yi", "jiang-wei"],
    cause: "Zhuge Liang wished to restore the Han Dynasty by marching against Wei.",
    whatHappened: "Zhuge Liang launched six campaigns, facing Sima Yi in epic battles of strategy and patience.",
    whoWonOrBenefited: "Sima Yi successfully defended Wei's borders through patience.",
    whyItMattered: "It demonstrated Zhuge Liang's ultimate loyalty to the late Liu Bei.",
    whatHappenedNext: "Sima Yi gained supreme military prestige inside the Kingdom of Wei.",
    relatedChapterIds: [16],
    factionInvolved: ["Shu", "Wei"],
    diagram: {
      nodes: [
        { id: "zhuge-liang", label: "Zhuge Liang (Shu)", role: "Leader", faction: "Shu" },
        { id: "sima-yi", label: "Sima Yi (Wei)", role: "Target", faction: "Wei" },
        { id: "jiang-wei", label: "Jiang Wei", role: "General", faction: "Shu" }
      ],
      links: [
        { source: "zhuge-liang", target: "sima-yi", type: "Attacked", label: "Led 6 Expeditions" },
        { source: "sima-yi", target: "zhuge-liang", type: "Advised", label: "Defended borders" },
        { source: "zhuge-liang", target: "jiang-wei", type: "Advised", label: "Passed strategic manuals" }
      ]
    }
  },
  {
    id: "rise-of-sima-family",
    title: "Rise of the Sima Family",
    titleChinese: "司马氏崛起",
    when: "249 AD",
    where: "Luoyang",
    involvedCharacterIds: ["sima-yi"],
    cause: "Sima Yi waited patiently while Wei's internal politics crumbled.",
    whatHappened: "Sima Yi seized control of Wei during the Gaoping Tombs Incident.",
    whoWonOrBenefited: "The Sima clan took control of the Kingdom of Wei.",
    whyItMattered: "It set up the end of the Three Kingdoms division.",
    whatHappenedNext: "Sima Yi's grandson Sima Yan founded the Jin Dynasty.",
    relatedChapterIds: [17],
    factionInvolved: ["Wei"],
    diagram: {
      nodes: [
        { id: "sima-yi", label: "Sima Yi", role: "Leader", faction: "Wei" }
      ],
      links: [
        { source: "sima-yi", target: "sima-yi", type: "Allied With", label: "Seized control of Wei court" }
      ]
    }
  },
  {
    id: "reunification-under-jin",
    title: "Reunification Under Jin",
    titleChinese: "晋灭三国 / 天下一统",
    when: "280 AD",
    where: "China",
    involvedCharacterIds: ["sima-yi", "sun-quan", "liu-bei", "cao-cao", "jiang-wei"],
    cause: "After decades of warfare, the Jin Dynasty conquered Wu, completing reunification.",
    whatHappened: "Sima Yan (grandson of Sima Yi) established the Jin Dynasty and unified China in 280 AD.",
    whoWonOrBenefited: "China was unified once again after nearly 100 years of warfare.",
    whyItMattered: "It ended the Three Kingdoms era and brought peace to the realm.",
    whatHappenedNext: "The stories of these heroic figures were recorded and told for generations to come.",
    relatedChapterIds: [17],
    factionInvolved: ["Wei", "Shu", "Wu", "Han"],
    diagram: {
      nodes: [
        { id: "jin", label: "Jin Dynasty (Sima Clan)", role: "Leader", faction: "Han" },
        { id: "wei", label: "Wei", role: "Target", faction: "Wei" },
        { id: "shu", label: "Shu", role: "Target", faction: "Shu" },
        { id: "wu", label: "Wu", role: "Target", faction: "Wu" }
      ],
      links: [
        { source: "jin", target: "wei", type: "Attacked", label: "Absorbed Wei" },
        { source: "jin", target: "shu", type: "Attacked", label: "Unified Shu" },
        { source: "jin", target: "wu", type: "Attacked", label: "Conquered Wu in 280 AD" }
      ]
    }
  }
];
