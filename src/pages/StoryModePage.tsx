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
  RotateCcw,
  Compass,
  GitBranch,
  Loader2,
  Flame,
  Feather
} from 'lucide-react';
import { CHAPTERS } from '../data/chapters';
import { CHARACTERS } from '../data/characters';
import { STORY_BRANCHES } from '../data/storyBranches';
import { useProgress } from '../hooks/useProgress';
import {
  InteractiveScene,
  StoryBranch,
  StoryChoice,
  StoryHistoryEntry
} from '../types';
import {
  MAX_STORY_DECISIONS,
  createLocalContinuation,
  normalizeGeneratedScene
} from '../services/interactiveStory';

export const StoryModePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { progress, markChapterRead, recordQuizResult, toggleBookmark } = useProgress();

  // Mode state: 'chapters' or 'interactive'
  const [activeTab, setActiveTab] = useState<'chapters' | 'interactive'>('chapters');

  // Interactive Branching State
  const initialBranches = STORY_BRANCHES;
  const [selectedBranch, setSelectedBranch] = useState<StoryBranch>(STORY_BRANCHES[0]);
  const [currentScene, setCurrentScene] = useState<InteractiveScene | null>(null);
  const [choiceHistory, setChoiceHistory] = useState<StoryHistoryEntry[]>([]);
  const [isGeneratingStory, setIsGeneratingStory] = useState<boolean>(false);
  const [storyError, setStoryError] = useState<string | null>(null);
  const [selectedChapterFilter, setSelectedChapterFilter] = useState<number | 'all'>('all');

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

  // Apply navigation state when arriving from the home page or another explorer.
  useEffect(() => {
    const state = location.state as { tab?: 'chapters' | 'interactive'; branchId?: string } | null;
    if (state?.tab) setActiveTab(state.tab);
    if (state?.branchId) {
      const match = STORY_BRANCHES.find(branch => branch.id === state.branchId);
      if (match) {
        setSelectedBranch(match);
        setSelectedChapterFilter(match.chapter_id);
      }
    }
  }, [location.state]);

  const handleSelectBranch = (branch: StoryBranch) => {
    setSelectedBranch(branch);
    setCurrentScene(null);
    setChoiceHistory([]);
    setStoryError(null);
  };

  const moveToNextBranch = () => {
    const currentIndex = initialBranches.findIndex(branch => branch.id === selectedBranch.id);
    const nextBranch = initialBranches[currentIndex + 1] ?? initialBranches[0];
    setSelectedChapterFilter(nextBranch.chapter_id);
    handleSelectBranch(nextBranch);
    requestAnimationFrame(() => {
      document.getElementById('active-interactive-scene')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const handleStoryAction = (choice: StoryChoice): boolean => {
    switch (choice.action) {
      case 'next-branch':
        moveToNextBranch();
        return true;
      case 'restart-branch':
        handleSelectBranch(selectedBranch);
        return true;
      case 'choose-branch':
        handleSelectBranch(selectedBranch);
        setSelectedChapterFilter('all');
        requestAnimationFrame(() => {
          document.getElementById('interactive-branch-selector')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        return true;
      case 'read-chapter':
        setCurrentChapterId(selectedBranch.chapter_id);
        setActiveTab('chapters');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return true;
      default:
        return false;
    }
  };

  // Continue through the server when available. The same validated local
  // continuation is used when the network or AI service is unavailable.
  const handleMakeChoice = async (choice: StoryChoice) => {
    if (handleStoryAction(choice)) return;

    setIsGeneratingStory(true);
    setStoryError(null);

    const requestContext = {
      currentBranchId: selectedBranch.id,
      chapterId: selectedBranch.chapter_id,
      currentSceneId: currentScene?.scene_id,
      choiceText: choice.text,
      choiceNext: choice.next,
      history: choiceHistory
    };

    let nextScene: InteractiveScene;

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch('/api/story/continue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          current_branch_id: requestContext.currentBranchId,
          chapter_id: requestContext.chapterId,
          current_scene_id: requestContext.currentSceneId,
          choice_text: requestContext.choiceText,
          choice_next: requestContext.choiceNext,
          history: requestContext.history
        })
      });

      if (!response.ok) {
        throw new Error(`Story continuation failed with status ${response.status}`);
      }

      const data: unknown = await response.json();
      nextScene = normalizeGeneratedScene(data, requestContext);
    } catch (err) {
      console.error('Story choice generation error:', err);
      nextScene = createLocalContinuation(requestContext);
      setStoryError('The online Story Guide could not be reached, so the built-in story path continued your adventure safely.');
    } finally {
      window.clearTimeout(timeoutId);
      setIsGeneratingStory(false);
    }

    setCurrentScene(nextScene);
    setChoiceHistory(prev => [
      ...prev,
      {
        sceneId: nextScene.scene_id,
        userChoice: choice.text,
        choiceNext: choice.next,
        outcome: nextScene.outcome
      }
    ]);
  };

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
      {/* Top Mode Toggle: Chapters vs Interactive Decision Branches */}
      <div className="flex justify-center">
        <div className="bg-amber-950/90 p-1.5 rounded-2xl border border-amber-800/80 shadow-lg flex items-center gap-2">
          <button
            onClick={() => setActiveTab('chapters')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'chapters'
                ? 'bg-amber-500 text-amber-950 shadow-md'
                : 'text-amber-200 hover:text-amber-100 hover:bg-amber-900/50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Chapter Storybook</span>
          </button>

          <button
            onClick={() => setActiveTab('interactive')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'interactive'
                ? 'bg-gradient-to-r from-red-600 to-amber-600 text-amber-100 shadow-md ring-2 ring-amber-400/50'
                : 'text-amber-200 hover:text-amber-100 hover:bg-amber-900/50'
            }`}
          >
            <GitBranch className="w-4 h-4 text-amber-300" />
            <span>Interactive Decision Mode</span>
            <span className="text-[10px] bg-amber-400 text-amber-950 font-extrabold px-2 py-0.5 rounded-full uppercase">
              AI Story
            </span>
          </button>
        </div>
      </div>

      {/* INTERACTIVE DECISION MODE */}
      {activeTab === 'interactive' ? (
        <div className="space-y-8">
          {/* Branch Selector Header */}
          <div id="interactive-branch-selector" className="bg-amber-950/90 p-6 rounded-3xl border border-amber-800/80 shadow-xl space-y-4 scroll-mt-24">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-900 rounded-2xl border border-amber-700 text-amber-300">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-amber-400 font-semibold tracking-wider uppercase">
                  Choose Your Historical Path
                </span>
                <h2 className="font-serif font-bold text-amber-100 text-2xl">
                  Interactive Three Kingdoms Branches
                </h2>
              </div>
            </div>

            <p className="text-sm text-amber-200/90">
              Select a starting historical branch and make choices to forge your own story outcomes! Powered by AI storytelling.
            </p>

            {/* Chapter Filter & Starting Branch Tabs */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-900/90 p-3 rounded-2xl border border-amber-800/80">
                <span className="text-xs text-amber-300 font-bold uppercase tracking-wider flex items-center gap-2">
                  <Compass className="w-4 h-4 text-amber-400" />
                  <span>Filter Branches by Chapter:</span>
                </span>
                <select
                  value={selectedChapterFilter}
                  onChange={(e) => setSelectedChapterFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                  className="bg-amber-950 border border-amber-700 text-amber-100 text-xs font-semibold px-3 py-1.5 rounded-xl cursor-pointer focus:outline-none"
                >
                  <option value="all">🌟 All {initialBranches.length} Chapters (Interactive)</option>
                  {CHAPTERS.map((c) => (
                    <option key={c.id} value={c.id}>
                      Chapter {c.id}: {c.title.replace(/^\d+\.\s*/, '')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-1">
                {initialBranches
                  .filter((b) => selectedChapterFilter === 'all' || b.chapter_id === selectedChapterFilter)
                  .map((b) => (
                    <button
                      key={b.id}
                      onClick={() => handleSelectBranch(b)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                        selectedBranch.id === b.id
                          ? 'bg-gradient-to-br from-amber-900 via-red-950 to-amber-950 border-amber-400 ring-2 ring-amber-400/60 shadow-lg'
                          : 'bg-stone-900/80 hover:bg-amber-950/60 border-amber-800/80 text-amber-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] bg-amber-900/80 border border-amber-700/80 text-amber-300 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                          Chapter {b.chapter_id}
                        </span>
                        {selectedBranch.id === b.id && (
                          <span className="text-[10px] bg-amber-400 text-amber-950 font-extrabold px-1.5 py-0.5 rounded">
                            PLAYING
                          </span>
                        )}
                      </div>
                      <div className="font-serif font-bold text-amber-100 text-sm line-clamp-1">
                        {b.title}
                      </div>
                      <p className="text-xs text-amber-300/80 line-clamp-2 mt-1">
                        {b.dialogue}
                      </p>
                    </button>
                  ))}
              </div>
            </div>
          </div>

          {/* Active Interactive Decision Stage */}
          <div id="active-interactive-scene" className="bg-gradient-to-b from-stone-900 via-amber-950/80 to-stone-900 rounded-3xl border-2 border-amber-700/80 p-6 sm:p-10 shadow-2xl space-y-8 scroll-mt-24">
            <div className="border-b border-amber-800/60 pb-4 flex items-center justify-between">
              <div>
                <span className="text-xs bg-amber-900/80 border border-amber-700 text-amber-300 px-3 py-1 rounded-full font-bold uppercase tracking-widest">
                  {currentScene?.is_conclusion
                    ? 'Branch Complete'
                    : `Decision ${Math.min(choiceHistory.length + 1, MAX_STORY_DECISIONS)} of ${MAX_STORY_DECISIONS}`}
                </span>
                <h3 className="font-serif font-extrabold text-2xl sm:text-3xl text-amber-100 mt-2">
                  {currentScene ? currentScene.next_scene_title : selectedBranch.title}
                </h3>
              </div>

              {choiceHistory.length > 0 && (
                <button
                  onClick={() => handleSelectBranch(selectedBranch)}
                  className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-200 bg-stone-900 border border-amber-800 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restart Branch</span>
                </button>
              )}
            </div>

            {storyError && (
              <div role="status" aria-live="polite" className="bg-sky-950/70 p-4 rounded-2xl border border-sky-700 text-sky-100 text-sm">
                <strong>Built-in story mode:</strong> {storyError}
              </div>
            )}

            {/* Historical Context or Narration */}
            {currentScene?.historical_context && (
              <div className="bg-amber-900/40 p-4 rounded-2xl border-l-4 border-amber-400 text-amber-200 text-sm font-serif italic">
                📜 <strong>Historical Context:</strong> {currentScene.historical_context}
              </div>
            )}

            {/* Outcome narrative from last choice */}
            {currentScene?.outcome && (
              <div aria-live="polite" className="bg-gradient-to-r from-amber-950 via-red-950/50 to-amber-950 p-6 rounded-2xl border border-amber-600/80 space-y-2">
                <h4 className="text-xs uppercase font-bold tracking-widest text-amber-400 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>Outcome of Your Choice</span>
                </h4>
                <p className="text-base sm:text-lg text-amber-100 font-sans leading-relaxed">
                  {currentScene.outcome}
                </p>
              </div>
            )}

            {/* Scene Narration / Dialogue */}
            <div className="bg-stone-900/90 p-6 rounded-2xl border border-amber-800/80 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Feather className="w-4 h-4" />
                <span>Story Narration</span>
              </div>
              <p className="text-lg text-amber-100 font-serif leading-relaxed">
                {currentScene ? currentScene.dialogue : selectedBranch.dialogue}
              </p>
            </div>

            {/* Choices Section */}
            <div className="space-y-4 pt-4 border-t border-amber-800/60">
              <h4 className="font-serif font-bold text-amber-100 text-lg flex items-center gap-2">
                <Compass className="w-5 h-5 text-amber-400" />
                <span>{currentScene?.is_conclusion ? 'Where will your adventure go next?' : 'What will you do next?'}</span>
              </h4>

              {isGeneratingStory ? (
                <div className="p-8 text-center bg-stone-900 rounded-2xl border border-amber-800/80 space-y-3">
                  <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
                  <p className="text-amber-200 text-sm font-medium">
                    Consulting the ancient scrolls and weaving the next story chapter...
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(currentScene ? currentScene.choices : selectedBranch.choices).map((choice, idx) => (
                    <button
                      key={`${choice.next}-${idx}`}
                      onClick={() => handleMakeChoice(choice)}
                      disabled={isGeneratingStory}
                      className="p-5 rounded-2xl bg-amber-900/50 hover:bg-amber-800/90 disabled:opacity-60 disabled:cursor-not-allowed border-2 border-amber-700/80 text-amber-100 font-bold text-sm sm:text-base text-left transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-lg flex items-center justify-between group"
                    >
                      <span>{choice.text}</span>
                      <ArrowRight className="w-5 h-5 text-amber-400 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Decision History Log */}
            {choiceHistory.length > 0 && (
              <div className="bg-stone-900/60 p-5 rounded-2xl border border-amber-800/60 space-y-3">
                <h5 className="text-xs uppercase font-bold tracking-wider text-amber-400">
                  Your Journey Choices ({choiceHistory.length})
                </h5>
                <div className="space-y-2">
                  {choiceHistory.map((h, i) => (
                    <div key={i} className="text-xs text-amber-200/90 bg-amber-950/50 p-3 rounded-xl border border-amber-900">
                      <span className="font-bold text-amber-300">Step {i + 1}:</span> Chose "{h.userChoice}"
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* STANDARD CHAPTER STORYBOOK MODE */
        <>
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

              {/* Interactive Decision Callout Banner */}
              <div className="bg-gradient-to-r from-red-950/80 via-amber-950 to-red-950/80 p-4 rounded-2xl border border-amber-600/80 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-900/80 rounded-xl border border-amber-700 text-amber-300">
                    <GitBranch className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-amber-100 text-sm sm:text-base flex items-center gap-2">
                      <span>Interactive Decision Branch</span>
                      <span className="text-[10px] bg-amber-400 text-amber-950 font-extrabold px-1.5 py-0.5 rounded uppercase">
                        AI Choice
                      </span>
                    </h4>
                    <p className="text-xs text-amber-200/80">
                      Forge your own story outcomes for Chapter {chapter.id} by making key decisions!
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('interactive');
                    const match = initialBranches.find(b => (b as any).chapter_id === chapter.id || b.id.includes(`ch${chapter.id}_`));
                    if (match) {
                      handleSelectBranch(match);
                    }
                  }}
                  className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950 font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shadow"
                >
                  <span>Play Interactive Branch</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
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
        </>
      )}
    </div>
  );
};

