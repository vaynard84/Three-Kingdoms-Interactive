export type FactionId = 'Wei' | 'Shu' | 'Wu' | 'Han' | 'Other';
export type CharacterRole = 'Ruler' | 'Strategist' | 'Warrior' | 'Official' | 'General';

export interface ChapterQuizOption {
  id: string;
  text: string;
  explanation: string;
}

export interface ChapterQuiz {
  question: string;
  options: ChapterQuizOption[];
  correctOptionId: string;
}

export interface Chapter {
  id: number;
  title: string;
  titleChinese: string;
  shortIntro: string;
  story: string[];
  charactersInvolved: string[];
  locations: string[];
  whatHappened: string;
  whyItMatters: string;
  keyTakeaways: [string, string, string];
  quiz: ChapterQuiz;
  suggestedQuestions: string[];
  yearOrEra: string;
}

export interface CharacterRelationship {
  targetCharacterId: string;
  targetCharacterName: string;
  type: 'Ally' | 'Sworn Brother' | 'Rival' | 'Master/Servant' | 'Enemy' | 'Family';
  description: string;
}

export interface Character {
  id: string;
  name: string;
  nameChinese: string;
  courtesyName?: string;
  faction: FactionId;
  role: CharacterRole;
  personality: string;
  strengths: string[];
  weaknesses: string[];
  relationships: CharacterRelationship[];
  majorEvents: string[];
  biography: string;
  whyThisCharacterMatters: string;
  timeline: { year: string; event: string }[];
  chapterIds: number[];
  avatarSymbol: string;
  quote?: string;
}

export interface EventDiagramNode {
  id: string;
  label: string;
  role: 'Leader' | 'General' | 'Strategist' | 'Target' | 'Ally';
  faction: FactionId;
}

export interface EventDiagramLink {
  source: string;
  target: string;
  type: 'Attacked' | 'Allied With' | 'Advised' | 'Defeated' | 'Betrayed';
  label: string;
}

export interface HistoricalEvent {
  id: string;
  title: string;
  titleChinese: string;
  when: string;
  where: string;
  involvedCharacterIds: string[];
  cause: string;
  whatHappened: string;
  whoWonOrBenefited: string;
  whyItMattered: string;
  whatHappenedNext: string;
  relatedChapterIds: number[];
  factionInvolved: FactionId[];
  diagram: {
    nodes: EventDiagramNode[];
    links: EventDiagramLink[];
  };
}

export interface Kingdom {
  id: FactionId;
  name: string;
  nameChinese: string;
  founder: string;
  capital: string;
  colorTheme: {
    bg: string;
    text: string;
    border: string;
    badge: string;
    gradient: string;
    accentHex: string;
  };
  leaders: string[];
  keyCharacters: string[];
  majorTerritories: string[];
  allies: string[];
  enemies: string[];
  importantBattles: string[];
  relatedChapterIds: number[];
  description: string;
  emblemSymbol: string;
}

export interface TimelineEntry {
  id: string;
  year: string;
  yearNumber: number;
  title: string;
  shortSummary: string;
  faction: FactionId;
  eventId?: string;
  chapterId?: number;
}

export interface GlossaryTerm {
  term: string;
  chinese?: string;
  pinyin?: string;
  definition: string;
  example: string;
}

export interface DailyFact {
  id: number;
  title: string;
  fact: string;
  characterOrEvent: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: 'reading' | 'quiz' | 'explorer' | 'mastery';
  unlockedAt?: string;
}

export type StoryChoiceAction =
  | 'continue'
  | 'next-branch'
  | 'restart-branch'
  | 'choose-branch'
  | 'read-chapter';

export interface StoryChoice {
  text: string;
  next: string;
  action?: StoryChoiceAction;
}

export interface StoryBranch {
  id: string;
  chapter_id: number;
  title: string;
  dialogue: string;
  choices: StoryChoice[];
}

export interface StoryHistoryEntry {
  sceneId: string;
  userChoice: string;
  choiceNext: string;
  outcome: string;
}

export interface InteractiveScene {
  scene_id: string;
  outcome: string;
  historical_context: string;
  next_scene_title: string;
  dialogue: string;
  choices: StoryChoice[];
  is_conclusion?: boolean;
}

export interface UserProgress {
  lastReadChapterId: number;
  completedChapters: number[];
  quizScores: Record<number, { score: number; maxScore: number; date: string }>;
  bookmarkedChapters: number[];
  favoriteCharacterIds: string[];
  unlockedBadgeIds: string[];
  personalityQuizResult?: string;
}
