import { CHAPTERS } from '../data/chapters.ts';
import { STORY_BRANCHES } from '../data/storyBranches.ts';
import type {
  InteractiveScene,
  StoryBranch,
  StoryChoice,
  StoryHistoryEntry
} from '../types.ts';

export const MAX_STORY_DECISIONS = 5;

export interface StoryContinuationRequest {
  currentBranchId: string;
  chapterId: number;
  currentSceneId?: string;
  choiceText: string;
  choiceNext: string;
  history: StoryHistoryEntry[];
}

const CONTINUATION_CHOICES: ReadonlyArray<ReadonlyArray<StoryChoice>> = [
  [
    { text: 'Ask the strategists to compare the safest plans', next: 'compare-safe-plans', action: 'continue' },
    { text: 'Listen to the families affected by the conflict', next: 'listen-to-families', action: 'continue' }
  ],
  [
    { text: 'Prepare carefully and protect the supply route', next: 'protect-supply-route', action: 'continue' },
    { text: 'Build trust with a nearby ally before moving', next: 'build-trust-with-ally', action: 'continue' }
  ],
  [
    { text: 'Use patience and diplomacy to avoid more fighting', next: 'choose-patience-and-diplomacy', action: 'continue' },
    { text: 'Act quickly while keeping civilians out of danger', next: 'act-quickly-and-protect-civilians', action: 'continue' }
  ],
  [
    { text: 'Gather the team and agree on one final plan', next: 'agree-on-final-plan', action: 'continue' },
    { text: 'Review what history can teach the heroes', next: 'review-history-lesson', action: 'continue' }
  ]
];

const GRAPHIC_TERMS = [
  'guts',
  'gore',
  'decapitat',
  'dismember',
  'severed head',
  'blood sprayed',
  'blood gushed',
  'throat slit'
];

function cleanText(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return '';
  return value.replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

function slugPart(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || 'choice';
}

function getChapter(chapterId: number) {
  return CHAPTERS.find(chapter => chapter.id === chapterId) ?? CHAPTERS[0];
}

export function getBranch(branchId: string): StoryBranch {
  return STORY_BRANCHES.find(branch => branch.id === branchId) ?? STORY_BRANCHES[0];
}

export function sanitizeStoryHistory(value: unknown): StoryHistoryEntry[] {
  if (!Array.isArray(value)) return [];

  return value
    .slice(-MAX_STORY_DECISIONS)
    .map((entry): StoryHistoryEntry | null => {
      if (!entry || typeof entry !== 'object') return null;
      const item = entry as Record<string, unknown>;
      const userChoice = cleanText(item.userChoice, 180);
      const outcome = cleanText(item.outcome, 800);
      if (!userChoice || !outcome) return null;

      return {
        sceneId: cleanText(item.sceneId, 100) || 'unknown-scene',
        userChoice,
        choiceNext: cleanText(item.choiceNext, 100) || slugPart(userChoice),
        outcome
      };
    })
    .filter((entry): entry is StoryHistoryEntry => entry !== null);
}

export function parseStoryContinuationRequest(body: unknown): StoryContinuationRequest | null {
  if (!body || typeof body !== 'object') return null;
  const value = body as Record<string, unknown>;

  const currentBranchId = cleanText(value.current_branch_id, 100);
  const choiceText = cleanText(value.choice_text, 180);
  const choiceNext = cleanText(value.choice_next, 100) || slugPart(choiceText);
  const requestedChapterId = Number(value.chapter_id);
  const branch = STORY_BRANCHES.find(item => item.id === currentBranchId);

  if (!currentBranchId || !choiceText || !branch) return null;

  const chapterId = CHAPTERS.some(chapter => chapter.id === requestedChapterId)
    ? requestedChapterId
    : branch.chapter_id;

  return {
    currentBranchId,
    chapterId,
    currentSceneId: cleanText(value.current_scene_id, 100) || undefined,
    choiceText,
    choiceNext,
    history: sanitizeStoryHistory(value.history)
  };
}

export function shouldConcludeStory(request: StoryContinuationRequest): boolean {
  return request.history.length + 1 >= MAX_STORY_DECISIONS;
}

export function createStoryConclusion(request: StoryContinuationRequest): InteractiveScene {
  const branch = getBranch(request.currentBranchId);
  const chapter = getChapter(request.chapterId);

  return {
    scene_id: `${branch.id}-complete`,
    outcome: `Your decisions bring this chapter's adventure to a meaningful close. The heroes reflect on ${chapter.whyItMatters.toLowerCase()}`,
    historical_context: chapter.whatHappened,
    next_scene_title: `${branch.title}: Journey Complete`,
    dialogue: 'This branch has reached a proper conclusion, but your journey has not ended. Continue along the main storyline, revisit this chapter, or choose a different path.',
    is_conclusion: true,
    choices: [
      {
        text: 'Continue to the next interactive chapter',
        next: 'next-interactive-branch',
        action: 'next-branch'
      },
      {
        text: 'Read the full chapter and historical notes',
        next: 'read-current-chapter',
        action: 'read-chapter'
      },
      {
        text: 'Choose another adventure',
        next: 'choose-another-branch',
        action: 'choose-branch'
      }
    ]
  };
}

function hasGraphicContent(scene: InteractiveScene): boolean {
  const combined = [
    scene.outcome,
    scene.historical_context,
    scene.next_scene_title,
    scene.dialogue,
    ...scene.choices.map(choice => choice.text)
  ].join(' ').toLowerCase();

  return GRAPHIC_TERMS.some(term => combined.includes(term));
}

function createSafeChoices(request: StoryContinuationRequest): StoryChoice[] {
  const phaseIndex = Math.min(request.history.length, CONTINUATION_CHOICES.length - 1);
  return CONTINUATION_CHOICES[phaseIndex].map((choice, index) => ({
    ...choice,
    next: `${request.currentBranchId}-${request.history.length + 1}-${choice.next}-${index + 1}`
  }));
}

export function createLocalContinuation(request: StoryContinuationRequest): InteractiveScene {
  if (shouldConcludeStory(request)) return createStoryConclusion(request);

  const chapter = getChapter(request.chapterId);
  const decisionNumber = request.history.length + 1;
  const action = request.choiceText.replace(/[.!?]+$/, '');

  return {
    scene_id: `${request.currentBranchId}-step-${decisionNumber}-${slugPart(request.choiceNext)}`,
    outcome: `You choose to ${action.charAt(0).toLowerCase()}${action.slice(1)}. The heroes study the result, help the people around them, and prepare thoughtfully for the next challenge.`,
    historical_context: chapter.whyItMatters,
    next_scene_title: `${chapter.title.replace(/^\d+\.\s*/, '')}: Decision ${decisionNumber}`,
    dialogue: `${chapter.shortIntro} The situation now calls for teamwork, careful judgment, and a plan that protects ordinary people.`,
    choices: createSafeChoices(request),
    is_conclusion: false
  };
}

function normalizeChoices(rawChoices: unknown, request: StoryContinuationRequest): StoryChoice[] {
  const normalized: StoryChoice[] = [];
  const seen = new Set<string>();

  if (Array.isArray(rawChoices)) {
    for (const rawChoice of rawChoices) {
      if (!rawChoice || typeof rawChoice !== 'object') continue;
      const value = rawChoice as Record<string, unknown>;
      const text = cleanText(value.text, 140);
      if (!text || seen.has(text.toLowerCase())) continue;
      seen.add(text.toLowerCase());
      normalized.push({
        text,
        next: cleanText(value.next, 100) || `${request.currentBranchId}-${slugPart(text)}`,
        action: 'continue'
      });
      if (normalized.length === 2) break;
    }
  }

  for (const fallbackChoice of createSafeChoices(request)) {
    if (normalized.length === 2) break;
    if (seen.has(fallbackChoice.text.toLowerCase())) continue;
    seen.add(fallbackChoice.text.toLowerCase());
    normalized.push(fallbackChoice);
  }

  return normalized;
}

export function normalizeGeneratedScene(
  rawScene: unknown,
  request: StoryContinuationRequest
): InteractiveScene {
  if (shouldConcludeStory(request)) return createStoryConclusion(request);
  if (!rawScene || typeof rawScene !== 'object') return createLocalContinuation(request);

  const value = rawScene as Record<string, unknown>;
  const fallback = createLocalContinuation(request);
  const scene: InteractiveScene = {
    scene_id: cleanText(value.scene_id, 100) || fallback.scene_id,
    outcome: cleanText(value.outcome, 900) || fallback.outcome,
    historical_context: cleanText(value.historical_context, 500) || fallback.historical_context,
    next_scene_title: cleanText(value.next_scene_title, 160) || fallback.next_scene_title,
    dialogue: cleanText(value.dialogue, 700) || fallback.dialogue,
    choices: normalizeChoices(value.choices, request),
    is_conclusion: false
  };

  return hasGraphicContent(scene) ? fallback : scene;
}

export function buildGroundingContext(request: StoryContinuationRequest): string {
  const branch = getBranch(request.currentBranchId);
  const chapter = getChapter(request.chapterId);

  return JSON.stringify({
    branch: {
      id: branch.id,
      chapterId: branch.chapter_id,
      title: branch.title,
      openingSituation: branch.dialogue
    },
    chapter: {
      id: chapter.id,
      title: chapter.title,
      era: chapter.yearOrEra,
      summary: chapter.shortIntro,
      establishedEvents: chapter.whatHappened,
      significance: chapter.whyItMatters,
      keyTakeaways: chapter.keyTakeaways
    }
  });
}
