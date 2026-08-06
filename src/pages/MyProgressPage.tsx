import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, BookOpen, Heart, Bookmark, Brain, Sparkles, Book, Compass, CheckCircle2, Lock, ArrowRight, RotateCcw } from 'lucide-react';
import { useProgress, ALL_BADGES } from '../hooks/useProgress';
import { CHAPTERS } from '../data/chapters';
import { CHARACTERS } from '../data/characters';
import { GLOSSARY_TERMS } from '../data/glossary';
import { DAILY_FACTS } from '../data/dailyFacts';
import { PERSONALITY_QUESTIONS } from '../data/personalityQuiz';

export const MyProgressPage: React.FC = () => {
  const navigate = useNavigate();
  const { progress, setPersonalityResult } = useProgress();

  const [activeTab, setActiveTab] = useState<'progress' | 'quiz' | 'glossary' | 'facts'>('progress');

  // Personality Quiz State
  const [personalityCurrentQ, setPersonalityCurrentQ] = useState(0);
  const [personalityScores, setPersonalityScores] = useState<Record<string, number>>({});
  const [quizFinished, setQuizFinished] = useState(false);

  const handlePersonalityOptionSelect = (characterScores: Record<string, number>) => {
    const updatedScores = { ...personalityScores };
    Object.entries(characterScores).forEach(([charId, score]) => {
      updatedScores[charId] = (updatedScores[charId] || 0) + score;
    });
    setPersonalityScores(updatedScores);

    if (personalityCurrentQ < PERSONALITY_QUESTIONS.length - 1) {
      setPersonalityCurrentQ(personalityCurrentQ + 1);
    } else {
      // Find character with max score
      let bestCharId = 'liu-bei';
      let maxScore = -1;
      Object.entries(updatedScores).forEach(([charId, total]) => {
        if (total > maxScore) {
          maxScore = total;
          bestCharId = charId;
        }
      });
      setPersonalityResult(bestCharId);
      setQuizFinished(true);
    }
  };

  const resetPersonalityQuiz = () => {
    setPersonalityCurrentQ(0);
    setPersonalityScores({});
    setQuizFinished(false);
  };

  // Glossary Search
  const [glossarySearch, setGlossarySearch] = useState('');
  const filteredGlossary = GLOSSARY_TERMS.filter(g =>
    g.term.toLowerCase().includes(glossarySearch.toLowerCase()) ||
    g.definition.toLowerCase().includes(glossarySearch.toLowerCase())
  );

  const matchedPersonalityChar = CHARACTERS.find(c => c.id === progress.personalityQuizResult) || CHARACTERS[0];

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-amber-950/80 p-8 rounded-3xl border border-amber-800/80 shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 bg-amber-900/80 border border-amber-700/80 text-amber-300 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest">
          <Award className="w-4 h-4 text-amber-400" />
          <span>My Progress & Learning Hub</span>
        </div>
        <h1 className="font-serif font-extrabold text-3xl sm:text-4xl text-amber-100">
          Achievements, Games & Glossary
        </h1>
        <p className="text-sm text-amber-200/90 max-w-2xl leading-relaxed">
          Track your storybook achievements, discover which Three Kingdoms hero matches your personality, and explore ancient terms!
        </p>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 pt-2">
          {[
            { id: 'progress', label: 'My Progress & Badges', icon: Award },
            { id: 'quiz', label: 'Which Hero Are You?', icon: Sparkles },
            { id: 'glossary', label: 'Story Glossary', icon: Book },
            { id: 'facts', label: 'Daily Fun Facts', icon: Compass }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-amber-500 text-amber-950 shadow-md'
                    : 'bg-amber-900/60 text-amber-200 border border-amber-700/80 hover:bg-amber-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Progress & Badges */}
      {activeTab === 'progress' && (
        <div className="space-y-8">
          {/* Progress Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-amber-950/80 p-6 rounded-2xl border border-amber-800/80 shadow-lg space-y-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Chapters Completed</span>
              <div className="flex items-baseline justify-between">
                <span className="font-serif font-extrabold text-3xl text-amber-100">
                  {progress.completedChapters.length} / {CHAPTERS.length}
                </span>
                <span className="text-xs text-amber-300 font-bold">
                  {Math.round((progress.completedChapters.length / CHAPTERS.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-amber-900/60 h-2.5 rounded-full overflow-hidden border border-amber-800">
                <div
                  className="bg-amber-400 h-full rounded-full transition-all"
                  style={{ width: `${(progress.completedChapters.length / CHAPTERS.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-amber-950/80 p-6 rounded-2xl border border-amber-800/80 shadow-lg space-y-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Badges Unlocked</span>
              <div className="flex items-baseline justify-between">
                <span className="font-serif font-extrabold text-3xl text-amber-100">
                  {progress.unlockedBadgeIds.length} / {ALL_BADGES.length}
                </span>
                <span className="text-xs text-amber-300 font-bold">
                  {Math.round((progress.unlockedBadgeIds.length / ALL_BADGES.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-amber-900/60 h-2.5 rounded-full overflow-hidden border border-amber-800">
                <div
                  className="bg-amber-400 h-full rounded-full transition-all"
                  style={{ width: `${(progress.unlockedBadgeIds.length / ALL_BADGES.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-amber-950/80 p-6 rounded-2xl border border-amber-800/80 shadow-lg space-y-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Saved Favorites</span>
              <div className="flex items-center justify-between">
                <span className="font-serif font-extrabold text-3xl text-amber-100">
                  {progress.favoriteCharacterIds.length}
                </span>
                <span className="text-xs text-amber-300">Heroes Bookmarked</span>
              </div>
            </div>
          </div>

          {/* Achievement Badges Grid */}
          <div className="bg-stone-900/90 p-6 sm:p-8 rounded-3xl border border-amber-800/80 shadow-xl space-y-4">
            <h2 className="font-serif font-bold text-2xl text-amber-100 flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-400" />
              <span>Achievement Badges</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {ALL_BADGES.map(badge => {
                const isUnlocked = progress.unlockedBadgeIds.includes(badge.id);

                return (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-2xl border flex items-start gap-3 transition-all ${
                      isUnlocked
                        ? 'bg-amber-900/80 border-amber-500 text-amber-100 shadow-lg'
                        : 'bg-amber-950/40 border-amber-900 text-amber-300/40'
                    }`}
                  >
                    <div className={`p-3 rounded-xl text-xl ${isUnlocked ? 'bg-amber-500/20 border border-amber-400' : 'bg-black/30'}`}>
                      {isUnlocked ? '🎖️' : <Lock className="w-5 h-5 text-amber-700" />}
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-serif font-bold text-sm">{badge.title}</h4>
                      <p className="text-xs opacity-80 leading-relaxed">{badge.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bookmarked Chapters & Favorite Characters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bookmarked Chapters */}
            <div className="bg-amber-950/80 p-6 rounded-3xl border border-amber-800/80 space-y-3">
              <h3 className="font-serif font-bold text-amber-100 text-lg flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-amber-400" />
                <span>Bookmarked Story Chapters</span>
              </h3>
              {progress.bookmarkedChapters.length === 0 ? (
                <p className="text-xs text-amber-300/60 italic">No chapters bookmarked yet. Click the bookmark icon while reading!</p>
              ) : (
                <div className="space-y-2">
                  {progress.bookmarkedChapters.map(chId => {
                    const ch = CHAPTERS.find(c => c.id === chId);
                    if (!ch) return null;
                    return (
                      <div
                        key={chId}
                        onClick={() => navigate('/story', { state: { chapterId: chId } })}
                        className="p-3 bg-stone-900 hover:bg-amber-900 rounded-xl border border-amber-800/80 text-xs text-amber-100 flex items-center justify-between cursor-pointer"
                      >
                        <span className="font-bold">Ch. {ch.id}: {ch.title.replace(/^\d+\.\s*/, '')}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Favorite Characters */}
            <div className="bg-amber-950/80 p-6 rounded-3xl border border-amber-800/80 space-y-3">
              <h3 className="font-serif font-bold text-amber-100 text-lg flex items-center gap-2">
                <Heart className="w-5 h-5 text-amber-400" />
                <span>Favorite Characters</span>
              </h3>
              {progress.favoriteCharacterIds.length === 0 ? (
                <p className="text-xs text-amber-300/60 italic">No favorite characters saved yet. Click the heart star on character cards!</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {progress.favoriteCharacterIds.map(cId => {
                    const char = CHARACTERS.find(c => c.id === cId);
                    if (!char) return null;
                    return (
                      <button
                        key={cId}
                        onClick={() => navigate('/characters', { state: { characterId: cId } })}
                        className="bg-amber-900/80 hover:bg-amber-800 border border-amber-700 text-amber-100 text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>{char.avatarSymbol}</span>
                        <span>{char.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Personality Quiz */}
      {activeTab === 'quiz' && (
        <div className="bg-stone-900/90 p-6 sm:p-10 rounded-3xl border-2 border-amber-600/80 shadow-2xl space-y-6 max-w-3xl mx-auto">
          {!quizFinished ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs text-amber-400 font-bold uppercase tracking-wider border-b border-amber-800 pb-3">
                <span>Which Three Kingdoms Character Are You?</span>
                <span>Question {personalityCurrentQ + 1} of {PERSONALITY_QUESTIONS.length}</span>
              </div>

              <h3 className="font-serif font-bold text-xl sm:text-2xl text-amber-100">
                {PERSONALITY_QUESTIONS[personalityCurrentQ].question}
              </h3>

              <div className="space-y-3">
                {PERSONALITY_QUESTIONS[personalityCurrentQ].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePersonalityOptionSelect(opt.characterScores)}
                    className="w-full text-left p-4 rounded-2xl bg-amber-950/80 hover:bg-amber-900 border border-amber-800 hover:border-amber-500 text-xs sm:text-sm text-amber-100 transition-all cursor-pointer font-medium leading-relaxed"
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center space-y-6 py-4">
              <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 text-amber-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Your Personality Result</span>
              </div>

              <div className="space-y-3">
                <span className="text-6xl p-4 bg-amber-950 rounded-3xl border border-amber-700 inline-block shadow-2xl">
                  {matchedPersonalityChar.avatarSymbol}
                </span>
                <h2 className="font-serif font-extrabold text-3xl sm:text-4xl text-amber-100">
                  You are {matchedPersonalityChar.name}! ({matchedPersonalityChar.nameChinese})
                </h2>
                <p className="text-sm text-amber-300/90 font-serif font-semibold">
                  {matchedPersonalityChar.faction} Kingdom • {matchedPersonalityChar.role}
                </p>
              </div>

              <p className="text-sm text-amber-200/90 max-w-xl mx-auto leading-relaxed bg-amber-950/60 p-4 rounded-2xl border border-amber-800">
                {matchedPersonalityChar.personality}
              </p>

              <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={() => navigate('/characters', { state: { characterId: matchedPersonalityChar.id } })}
                  className="bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold px-6 py-3 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>Explore {matchedPersonalityChar.name}'s Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={resetPersonalityQuiz}
                  className="bg-amber-900/80 hover:bg-amber-800 text-amber-100 font-semibold px-5 py-3 rounded-xl text-xs border border-amber-700 flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake Quiz</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Glossary */}
      {activeTab === 'glossary' && (
        <div className="space-y-6">
          <div className="bg-stone-900/90 p-4 rounded-2xl border border-amber-800/80 space-y-3">
            <input
              type="text"
              value={glossarySearch}
              onChange={(e) => setGlossarySearch(e.target.value)}
              placeholder="Search ancient terms, roles, or concepts..."
              className="w-full bg-amber-950/80 border border-amber-800 text-amber-100 placeholder-amber-400/50 px-4 py-2 rounded-xl text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredGlossary.map((term, idx) => (
              <div key={idx} className="bg-amber-950/80 p-5 rounded-2xl border border-amber-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-amber-100 text-base">{term.term}</h3>
                  {term.chinese && (
                    <span className="text-xs font-serif text-amber-400">
                      {term.chinese} ({term.pinyin})
                    </span>
                  )}
                </div>
                <p className="text-xs text-amber-200/90 leading-relaxed">{term.definition}</p>
                <p className="text-[11px] text-amber-300/70 italic bg-black/30 p-2 rounded-lg border border-amber-900/60">
                  e.g., "{term.example}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Daily Facts */}
      {activeTab === 'facts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {DAILY_FACTS.map(f => (
            <div key={f.id} className="bg-stone-900/90 p-6 rounded-2xl border border-amber-800/80 space-y-2 shadow-lg">
              <span className="text-[10px] bg-amber-900/80 border border-amber-700 text-amber-300 px-2.5 py-0.5 rounded-full font-bold">
                {f.characterOrEvent}
              </span>
              <h3 className="font-serif font-bold text-amber-100 text-lg">{f.title}</h3>
              <p className="text-xs text-amber-200/90 leading-relaxed">{f.fact}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
