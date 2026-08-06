import { useState, useEffect } from 'react';
import { UserProgress, AchievementBadge } from '../types';
import { CHAPTERS } from '../data/chapters';

export const ALL_BADGES: AchievementBadge[] = [
  { id: 'first-chapter', title: 'First Steps in History', description: 'Read your first story chapter.', iconName: 'BookOpen', category: 'reading' },
  { id: 'chapter-5', title: 'Warlord Apprentice', description: 'Completed 5 chapters.', iconName: 'Feather', category: 'reading' },
  { id: 'all-chapters', title: 'Grand Historian', description: `Read all ${CHAPTERS.length} chapters of the story!`, iconName: 'Award', category: 'reading' },
  { id: 'quiz-master', title: 'Tactical Genius', description: 'Scored 100% on 3 chapter quizzes.', iconName: 'Brain', category: 'quiz' },
  { id: 'character-fan', title: 'Hero Finder', description: 'Saved 3 favorite characters.', iconName: 'Heart', category: 'explorer' },
  { id: 'personality-done', title: 'Self Discovery', description: 'Completed the Three Kingdoms personality quiz.', iconName: 'Sparkles', category: 'mastery' }
];

const INITIAL_PROGRESS: UserProgress = {
  lastReadChapterId: 1,
  completedChapters: [],
  quizScores: {},
  bookmarkedChapters: [],
  favoriteCharacterIds: [],
  unlockedBadgeIds: ['first-chapter']
};

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem('3k_storybook_progress_v1');
      if (saved) {
        return { ...INITIAL_PROGRESS, ...JSON.parse(saved) };
      }
    } catch {
      // Ignore JSON error
    }
    return INITIAL_PROGRESS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('3k_storybook_progress_v1', JSON.stringify(progress));
    } catch {
      // Ignore quota error
    }
  }, [progress]);

  const markChapterRead = (chapterId: number) => {
    setProgress(prev => {
      const completed = new Set(prev.completedChapters);
      completed.add(chapterId);

      const badges = new Set(prev.unlockedBadgeIds);
      badges.add('first-chapter');
      if (completed.size >= 5) badges.add('chapter-5');
      if (completed.size >= CHAPTERS.length) badges.add('all-chapters');

      return {
        ...prev,
        lastReadChapterId: chapterId,
        completedChapters: Array.from(completed),
        unlockedBadgeIds: Array.from(badges)
      };
    });
  };

  const recordQuizResult = (chapterId: number, isCorrect: boolean) => {
    setProgress(prev => {
      const existing = prev.quizScores[chapterId] || { score: 0, maxScore: 1, date: '' };
      const newScore = isCorrect ? 1 : 0;
      const updatedScores = {
        ...prev.quizScores,
        [chapterId]: { score: Math.max(existing.score, newScore), maxScore: 1, date: new Date().toISOString() }
      };

      // Check perfect quiz count
      const perfectCount = Object.values(updatedScores).filter(s => s.score === s.maxScore).length;
      const badges = new Set(prev.unlockedBadgeIds);
      if (perfectCount >= 3) badges.add('quiz-master');

      return {
        ...prev,
        quizScores: updatedScores,
        unlockedBadgeIds: Array.from(badges)
      };
    });
  };

  const toggleBookmark = (chapterId: number) => {
    setProgress(prev => {
      const set = new Set(prev.bookmarkedChapters);
      if (set.has(chapterId)) set.delete(chapterId);
      else set.add(chapterId);
      return { ...prev, bookmarkedChapters: Array.from(set) };
    });
  };

  const toggleFavoriteCharacter = (characterId: string) => {
    setProgress(prev => {
      const set = new Set(prev.favoriteCharacterIds);
      if (set.has(characterId)) set.delete(characterId);
      else set.add(characterId);

      const badges = new Set(prev.unlockedBadgeIds);
      if (set.size >= 3) badges.add('character-fan');

      return {
        ...prev,
        favoriteCharacterIds: Array.from(set),
        unlockedBadgeIds: Array.from(badges)
      };
    });
  };

  const setPersonalityResult = (characterId: string) => {
    setProgress(prev => {
      const badges = new Set(prev.unlockedBadgeIds);
      badges.add('personality-done');
      return {
        ...prev,
        personalityQuizResult: characterId,
        unlockedBadgeIds: Array.from(badges)
      };
    });
  };

  return {
    progress,
    markChapterRead,
    recordQuizResult,
    toggleBookmark,
    toggleFavoriteCharacter,
    setPersonalityResult
  };
}
