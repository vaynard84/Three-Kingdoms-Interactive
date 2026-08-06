/**
 * Child Safety and Content Moderation Utility
 * Ensures all historical descriptions and AI-generated outputs remain educational,
 * inspiring, and suitable for ages 8-14 without graphic violence or gore.
 */

const BANNED_GRAPHIC_TERMS: { pattern: RegExp; replacement: string }[] = [
  { pattern: /behead(ed|ing)?/gi, replacement: 'defeated' },
  { pattern: /decapitat(ed|ing|e)?/gi, replacement: 'subdued' },
  { pattern: /severed head/gi, replacement: 'trophy of victory' },
  { pattern: /bloodbath|blood bath/gi, replacement: 'fierce battle' },
  { pattern: /slaughtered|massacred/gi, replacement: 'overwhelmed' },
  { pattern: /mutilat(ed|ing)/gi, replacement: 'injured' },
  { pattern: /disembowel(ed)?/gi, replacement: 'struck down' },
  { pattern: /tortur(ed|ing)/gi, replacement: 'punished' },
  { pattern: /executed viciously/gi, replacement: 'sentenced under law' },
];

/**
 * Sanitizes any raw string content to replace graphic violence terms with age-appropriate language.
 */
export function sanitizeChildText(text: string): string {
  if (!text) return '';
  let sanitized = text;
  for (const item of BANNED_GRAPHIC_TERMS) {
    sanitized = sanitized.replace(item.pattern, item.replacement);
  }
  return sanitized;
}

/**
 * Checks whether text contains inappropriate graphic violence.
 */
export function isChildSafe(text: string): boolean {
  if (!text) return true;
  for (const item of BANNED_GRAPHIC_TERMS) {
    if (item.pattern.test(text)) {
      return false;
    }
  }
  return true;
}

export interface ValidatedAIChoiceResponse {
  outcome: string;
  historical_context?: string;
  next_scene_title?: string;
  dialogue?: string;
  choices?: { text: string; next?: string }[];
}

/**
 * Validates and sanitizes structure returned by AI endpoints to guarantee fallback consistency.
 */
export function validateAndSanitizeAIStory(rawData: any): { isValid: boolean; sanitized: ValidatedAIChoiceResponse } {
  if (!rawData || typeof rawData !== 'object') {
    return {
      isValid: false,
      sanitized: { outcome: 'The heroes pressed forward with courage and wisdom.' }
    };
  }

  const outcome = sanitizeChildText(String(rawData.outcome || rawData.answer || ''));
  const historical_context = rawData.historical_context ? sanitizeChildText(String(rawData.historical_context)) : undefined;
  const next_scene_title = rawData.next_scene_title ? sanitizeChildText(String(rawData.next_scene_title)) : undefined;
  const dialogue = rawData.dialogue ? sanitizeChildText(String(rawData.dialogue)) : undefined;

  let choices: { text: string; next?: string }[] | undefined = undefined;
  if (Array.isArray(rawData.choices)) {
    choices = rawData.choices
      .slice(0, 3)
      .map((c: any) => ({
        text: sanitizeChildText(String(c?.text || c || '')),
        next: c?.next ? String(c.next) : undefined
      }))
      .filter((c: any) => c.text.trim().length > 0);
  }

  const isValid = outcome.length >= 10;

  return {
    isValid,
    sanitized: {
      outcome: outcome || 'The story continues with heroic bravery and strategic wisdom.',
      historical_context,
      next_scene_title,
      dialogue,
      choices
    }
  };
}
