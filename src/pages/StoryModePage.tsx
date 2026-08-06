import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Bookmark,
  CheckCircle,
  HelpCircle,
  Volume2,
  VolumeX,
  MapPin,
  Users,
  Award,
  Sparkles,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { CHAPTERS } from '../data/chapters';
import { CHARACTERS } from '../data/characters';
import { useProgress } from '../hooks/useProgress';

export const StoryModePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { progress, markChapterRead, recordQuizResult, toggleBookmark } = useProgress();

  // Determine active chapter from location state or progress
  const [currentChapterId, setCurrentChapterId] = useState<number>(() => {
    if (location.state && (location.state as { chapterId?: number }).chapterId) {
      return (location.state as { chapterId: number }).chapterId;
    }
    return progress.lastReadChapterId || 1;
  });

  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [isReadingAloud, setIsReadingAloud] = useState<boolean>(false);

  const chapter = CHAPTERS.find(c => c.id === currentChapterId) || CHAPTERS[0];
  const isBookmarked = progress.bookmarkedChapters.includes(chapter.id);
  const isCompleted = progress.completedChapters.includes(chapter.id);

  // Update read progress when chapter opens
  useEffect(() => {
    markChapterRead(chapter.id);
    setSelectedQuizOption(null);
    setQuizSubmitted(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [chapter.id]);

  // Audio Speech synthesis simulation / Web Speech API
  const handleToggleSpeech = () => {
    if ('speechSynthesis' in window) {
      if (isReadingAloud) {
        window.speechSynthesis.cancel();
        setIsReadingAloud(false);
      } else {
        const textToRead = `${chapter.title}. ${chapter.shortIntro}. ${chapter.story.join(' ')}`;
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.rate = 0.9;
        utterance.onend = () => setIsReadingAloud(false);
        utterance.onerror = () => setIsReadingAloud(false);
        window.speechSynthesis.speak(utterance);
        setIsReadingAloud(true);
      }
    } else {
      alert("Speech synthesis is not supported on your browser, but you can read along!");
    }
  };

  const handleNextChapter = () => {
    if (currentChapterId < CHAPTERS.length) {
      if (isReadingAloud) window.speechSynthesis?.cancel();
      setCurrentChapterId(currentChapterId + 1);
    }
  };

  const handlePrevChapter = () => {
    if (currentChapterId > 1) {
      if (isReadingAloud) window.speechSynthesis?.cancel();
      setCurrentChapterId(currentChapterId - 1);
    }
  };

  const handleQuizSubmit = (optionId: string) => {
    if (quizSubmitted) return;
    setSelectedQuizOption(optionId);
    setQuizSubmitted(true);
    const isCorrect = optionId === chapter.quiz.correctOptionId;
    recordQuizResult(chapter.id, isCorrect);
  };

  const handleAskQuestion = (q: string) => {
    navigate('/ask', { state: { initialQuestion: q } });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Chapter Selection Header & Timeline Slider */}
      <div className="bg-amber-950/80 p-6 rounded-3xl border border-amber-800/80 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-amber-900 border border-amber-700 flex items-center justify-center font-bold text-amber-300 text-lg">
              {chapter.id}
            </span>
            <div>
              <span className="text-xs text-amber-400 font-semibold tracking-wider uppercase">
                Story Chapter {chapter.id} of {CHAPTERS.length}
              </span>
              <h2 className="font-serif font-bold text-amber-100 text-xl sm:text-2xl">
                {chapter.title}
              </h2>
            </div>
          </div>

          {/* Chapter Selector Dropdown & Bookmark */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={chapter.id}
              onChange={(e) => setCurrentChapterId(Number(e.target.value))}
              className="flex-1 md:flex-none bg-stone-900 border border-amber-700/80 text-amber-100 rounded-xl px-4 py-2 text-sm font-semibold focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              {CHAPTERS.map((c) => (
                <option key={c.id} value={c.id}>
                  Ch. {c.id}: {c.title.replace(/^\d+\.\s*/, '')}
                </option>
              ))}
            </select>

            <button
              onClick={() => toggleBookmark(chapter.id)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                isBookmarked
                  ? 'bg-amber-500 text-amber-950 border-amber-400'
                  : 'bg-stone-900 text-amber-300 border-amber-800 hover:border-amber-600'
              }`}
              title={isBookmarked ? 'Bookmarked' : 'Bookmark this chapter'}
            >
              <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-amber-950' : ''}`} />
            </button>
          </div>
        </div>

        {/* Timeline Slider */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between text-xs text-amber-300/80 font-medium">
            <span>Era: {chapter.yearOrEra}</span>
            <span>Reading Progress: {Math.round((currentChapterId / CHAPTERS.length) * 100)}%</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
            {CHAPTERS.map((c) => (
              <button
                key={c.id}
                onClick={() => setCurrentChapterId(c.id)}
                className={`flex-1 min-w-[28px] h-3 rounded-full transition-all cursor-pointer ${
                  c.id === chapter.id
                    ? 'bg-amber-400 ring-2 ring-amber-300'
                    : progress.completedChapters.includes(c.id)
                    ? 'bg-amber-700'
                    : 'bg-amber-950 border border-amber-800'
                }`}
                title={`Chapter ${c.id}: ${c.title}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Chapter Content Card */}
      <article className="bg-gradient-to-b from-stone-900 via-amber-950/60 to-stone-900 rounded-3xl border-2 border-amber-800/80 p-6 sm:p-10 shadow-2xl space-y-8">
        {/* Title & Introduction */}
        <div className="border-b border-amber-800/60 pb-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs bg-amber-900/80 border border-amber-700/80 text-amber-300 px-3 py-1 rounded-full font-bold uppercase tracking-widest">
              {chapter.yearOrEra}
            </span>

            <button
              onClick={handleToggleSpeech}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                isReadingAloud
                  ? 'bg-red-900 text-red-200 border-red-600 animate-pulse'
                  : 'bg-amber-900/80 text-amber-200 border-amber-700 hover:bg-amber-800'
              }`}
            >
              {isReadingAloud ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isReadingAloud ? 'Stop Reading' : 'Listen Read Aloud'}</span>
            </button>
          </div>

          <h1 className="font-serif font-extrabold text-3xl sm:text-4xl text-amber-100 tracking-wide">
            {chapter.title}
          </h1>
          <p className="text-sm font-serif text-amber-400">{chapter.titleChinese}</p>

          <p className="text-base sm:text-lg text-amber-200 italic font-serif bg-amber-900/30 p-4 rounded-2xl border-l-4 border-amber-500">
            "{chapter.shortIntro}"
          </p>
        </div>

        {/* Story Paragraphs */}
        <div className="space-y-6 text-amber-100 text-base sm:text-lg font-sans leading-relaxed">
          {chapter.story.map((para, idx) => (
            <p key={idx} className="first-letter:text-3xl first-letter:font-serif first-letter:font-bold first-letter:text-amber-400 first-letter:mr-1">
              {para}
            </p>
          ))}
        </div>

        {/* Involvements Bar: Characters & Locations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-amber-800/60">
          {/* Important Characters */}
          <div className="bg-amber-950/80 p-4 rounded-2xl border border-amber-800/80 space-y-2">
            <h4 className="font-serif font-bold text-amber-100 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-400" />
              <span>Important Characters Involved</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {chapter.charactersInvolved.map((charName) => {
                const foundChar = CHARACTERS.find(c => c.name.toLowerCase() === charName.toLowerCase() || charName.includes(c.name));
                return (
                  <button
                    key={charName}
                    onClick={() => {
                      if (foundChar) {
                        navigate('/characters', { state: { characterId: foundChar.id } });
                      }
                    }}
                    className="bg-amber-900/60 hover:bg-amber-800 border border-amber-700/60 text-amber-200 text-xs px-2.5 py-1 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>{foundChar?.avatarSymbol || '👤'}</span>
                    <span>{charName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Important Locations */}
          <div className="bg-amber-950/80 p-4 rounded-2xl border border-amber-800/80 space-y-2">
            <h4 className="font-serif font-bold text-amber-100 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Key Historic Locations</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {chapter.locations.map((loc) => (
                <span
                  key={loc}
                  className="bg-stone-900 border border-amber-800/80 text-amber-300 text-xs px-2.5 py-1 rounded-xl"
                >
                  📍 {loc}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Summary & Impact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* What Happened */}
          <div className="bg-gradient-to-br from-amber-950 to-stone-900 p-6 rounded-2xl border border-amber-700/60 space-y-2">
            <h4 className="font-serif font-bold text-amber-200 text-base flex items-center gap-2">
              <span>📝</span> What Happened?
            </h4>
            <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
              {chapter.whatHappened}
            </p>
          </div>

          {/* Why It Matters */}
          <div className="bg-gradient-to-br from-red-950/60 to-amber-950 p-6 rounded-2xl border border-amber-700/60 space-y-2">
            <h4 className="font-serif font-bold text-amber-200 text-base flex items-center gap-2">
              <span>🌟</span> Why It Matters
            </h4>
            <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
              {chapter.whyItMatters}
            </p>
          </div>
        </div>

        {/* 3 Key Takeaways */}
        <div className="bg-stone-900/90 p-6 rounded-2xl border border-amber-800/80 space-y-3">
          <h4 className="font-serif font-bold text-amber-100 text-sm uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Three Key Things to Remember</span>
          </h4>
          <ul className="space-y-2">
            {chapter.keyTakeaways.map((takeaway, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-amber-200/90">
                <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Interactive Quiz */}
        <div className="bg-amber-950 p-6 rounded-3xl border-2 border-amber-600/80 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h4 className="font-serif font-bold text-amber-100 text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Chapter {chapter.id} Quick Quiz</span>
            </h4>
            {quizSubmitted && (
              <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                selectedQuizOption === chapter.quiz.correctOptionId
                  ? 'bg-emerald-900 text-emerald-200 border border-emerald-600'
                  : 'bg-red-900 text-red-200 border border-red-600'
              }`}>
                {selectedQuizOption === chapter.quiz.correctOptionId ? 'Correct! 🎉' : 'Nice try!'}
              </span>
            )}
          </div>

          <p className="text-sm font-semibold text-amber-200">
            {chapter.quiz.question}
          </p>

          <div className="space-y-2">
            {chapter.quiz.options.map((opt) => {
              const isSelected = selectedQuizOption === opt.id;
              const isCorrectOpt = opt.id === chapter.quiz.correctOptionId;

              let btnStyle = "bg-stone-900 hover:bg-amber-900/80 border-amber-800 text-amber-100";
              if (quizSubmitted) {
                if (isCorrectOpt) btnStyle = "bg-emerald-950 border-emerald-500 text-emerald-100 ring-2 ring-emerald-500";
                else if (isSelected) btnStyle = "bg-red-950 border-red-500 text-red-100";
                else btnStyle = "bg-stone-900/50 border-amber-900 text-amber-300/50";
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleQuizSubmit(opt.id)}
                  disabled={quizSubmitted}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all cursor-pointer ${btnStyle}`}
                >
                  <div className="font-semibold">{opt.text}</div>
                  {quizSubmitted && (isSelected || isCorrectOpt) && (
                    <p className="text-xs mt-1.5 opacity-90 italic">
                      {opt.explanation}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Suggested Questions */}
        <div className="bg-stone-900/80 p-6 rounded-2xl border border-amber-800/80 space-y-3">
          <h4 className="font-serif font-bold text-amber-100 text-sm flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>Questions You Can Ask the Story Guide</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {chapter.suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleAskQuestion(q)}
                className="bg-amber-900/50 hover:bg-amber-800 border border-amber-700/60 text-amber-200 text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>"{q}"</span>
                <ArrowRight className="w-3 h-3 text-amber-400" />
              </button>
            ))}
          </div>
        </div>
      </article>

      {/* Bottom Chapter Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-amber-950/90 p-4 rounded-2xl border border-amber-800/80 shadow-lg">
        <button
          onClick={handlePrevChapter}
          disabled={currentChapterId === 1}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-amber-900/80 hover:bg-amber-800 disabled:opacity-40 disabled:cursor-not-allowed border border-amber-700 text-amber-100 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Previous Chapter</span>
        </button>

        <span className="text-xs text-amber-300 font-medium">
          Chapter {currentChapterId} of {CHAPTERS.length}
        </span>

        <button
          onClick={handleNextChapter}
          disabled={currentChapterId === CHAPTERS.length}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-amber-950 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
        >
          <span>Next Chapter</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
