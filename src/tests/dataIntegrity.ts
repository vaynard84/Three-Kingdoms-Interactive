import { CHAPTERS } from '../data/chapters';
import { CHARACTERS } from '../data/characters';
import { EVENTS } from '../data/events';
import { TIMELINE } from '../data/timeline';
import { isChildSafe } from '../lib/safety';

export interface IntegrityReport {
  totalChapters: number;
  totalCharacters: number;
  totalEvents: number;
  totalTimelineItems: number;
  errors: string[];
  warnings: string[];
  passed: boolean;
}

export function runDataIntegrityCheck(): IntegrityReport {
  const errors: string[] = [];
  const warnings: string[] = [];

  const maxChapterId = CHAPTERS.length;
  const validChapterIds = new Set(CHAPTERS.map(c => c.id));

  // 1. Validate Chapter IDs
  if (CHAPTERS.length === 0) {
    errors.push('No chapters defined in CHAPTERS array.');
  }

  CHAPTERS.forEach((ch, idx) => {
    if (ch.id !== idx + 1) {
      errors.push(`Chapter ID mismatch: expected ${idx + 1}, got ${ch.id}`);
    }
    if (!ch.title || !ch.story || ch.story.length === 0) {
      errors.push(`Chapter ${ch.id} has missing title or empty story.`);
    }
    if (!ch.quiz || !ch.quiz.question || ch.quiz.options.length < 2) {
      errors.push(`Chapter ${ch.id} has invalid quiz structure.`);
    }
    ch.story.forEach((p, pIdx) => {
      if (!isChildSafe(p)) {
        warnings.push(`Chapter ${ch.id} paragraph ${pIdx + 1} contains words adjusted for age suitability.`);
      }
    });
  });

  // 2. Validate Character Chapter Associations
  CHARACTERS.forEach(char => {
    char.chapterIds.forEach(chId => {
      if (!validChapterIds.has(chId)) {
        errors.push(`Character '${char.name}' references non-existent chapterId ${chId}. Max is ${maxChapterId}.`);
      }
    });
  });

  // 3. Validate Events
  EVENTS.forEach(ev => {
    if (Array.isArray(ev.relatedChapterIds)) {
      ev.relatedChapterIds.forEach(chId => {
        if (!validChapterIds.has(chId)) {
          errors.push(`Event '${ev.title}' references invalid chapterId ${chId}.`);
        }
      });
    }
  });

  // 4. Validate Timeline Items
  TIMELINE.forEach(tl => {
    if (tl.chapterId && !validChapterIds.has(tl.chapterId)) {
      errors.push(`Timeline item '${tl.title}' references invalid chapterId ${tl.chapterId}.`);
    }
  });

  const passed = errors.length === 0;

  return {
    totalChapters: CHAPTERS.length,
    totalCharacters: CHARACTERS.length,
    totalEvents: EVENTS.length,
    totalTimelineItems: TIMELINE.length,
    errors,
    warnings,
    passed
  };
}
