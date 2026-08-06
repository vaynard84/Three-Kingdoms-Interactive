import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, BookOpen, Users, Swords, Calendar, MessageSquare, Award, ArrowRight, Sparkles, Compass } from 'lucide-react';
import { useProgress } from '../hooks/useProgress';
import { CHAPTERS } from '../data/chapters';
import { CHARACTERS } from '../data/characters';
import { EVENTS } from '../data/events';
import { DAILY_FACTS } from '../data/dailyFacts';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { progress } = useProgress();
  const [quickQuestion, setQuickQuestion] = useState('');

  // Daily Fact based on today's day
  const todayIndex = new Date().getDate() % DAILY_FACTS.length;
  const dailyFact = DAILY_FACTS[todayIndex];

  // Featured Characters
  const featuredCharacters = CHARACTERS.filter(c => 
    ['liu-bei', 'guan-yu', 'cao-cao', 'zhuge-liang', 'sun-quan'].includes(c.id)
  );

  // Featured Events
  const featuredEvents = EVENTS.filter(e => 
    ['peach-garden-oath', 'battle-of-red-cliffs', 'three-visits-cottage'].includes(e.id)
  );

  const handleAskGuide = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickQuestion.trim()) {
      navigate('/ask', { state: { initialQuestion: quickQuestion } });
    } else {
      navigate('/ask');
    }
  };

  const handlePresetQuestion = (q: string) => {
    navigate('/ask', { state: { initialQuestion: q } });
  };

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-950 via-stone-900 to-red-950 text-amber-100 border-2 border-amber-800/80 shadow-2xl p-8 sm:p-12 lg:p-16">
        {/* Background decorative artwork texture */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(217,119,6,0.2),transparent_60%)] pointer-events-none" />
        <div className="absolute -right-12 -bottom-12 opacity-10 text-[200px] font-serif font-bold text-amber-200 select-none pointer-events-none">
          三国
        </div>

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 bg-amber-900/80 border border-amber-700/80 text-amber-300 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Interactive Children's Epic</span>
          </div>

          <h1 className="font-serif font-extrabold text-4xl sm:text-5xl lg:text-6xl text-amber-100 leading-tight tracking-wide drop-shadow-md">
            The Three Kingdoms: <br />
            <span className="text-amber-400">An Interactive Adventure</span>
          </h1>

          <p className="text-base sm:text-lg text-amber-200/90 leading-relaxed font-sans">
            Step into ancient China! Join sworn heroes, clever strategists, and ambitious rulers in the grandest story of courage, friendship, and wisdom ever told.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => navigate('/story')}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950 font-bold px-6 py-3.5 rounded-xl text-base shadow-lg hover:shadow-amber-500/20 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-amber-950" />
              <span>Begin the Story</span>
            </button>

            {progress.completedChapters.length > 0 && (
              <button
                onClick={() => navigate('/story', { state: { chapterId: progress.lastReadChapterId } })}
                className="bg-amber-900/80 hover:bg-amber-800 text-amber-100 font-semibold px-5 py-3.5 rounded-xl text-sm border border-amber-700 flex items-center gap-2 transition-all cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Continue Chapter {progress.lastReadChapterId}</span>
              </button>
            )}

            <button
              onClick={() => navigate('/ask')}
              className="bg-stone-900/80 hover:bg-stone-800 text-amber-200 px-5 py-3.5 rounded-xl text-sm border border-amber-800/80 flex items-center gap-2 transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span>Ask Story Guide</span>
            </button>
          </div>
        </div>
      </section>

      {/* Quick Reading Progress Tracker Banner */}
      <section className="bg-amber-950/60 p-6 rounded-2xl border border-amber-800/60 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-900/90 border border-amber-700/80 flex items-center justify-center text-amber-400 text-2xl font-bold">
            📖
          </div>
          <div>
            <h3 className="font-serif font-bold text-amber-100 text-lg">Your Adventure Progress</h3>
            <p className="text-xs text-amber-300/80">
              You've completed <span className="font-bold text-amber-300">{progress.completedChapters.length}</span> out of 15 chapters and earned <span className="font-bold text-amber-300">{progress.unlockedBadgeIds.length}</span> achievement badges.
            </p>
          </div>
        </div>

        <div className="w-full md:w-auto flex items-center gap-4">
          <div className="w-full md:w-48 bg-amber-900/60 rounded-full h-3 border border-amber-800 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-amber-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${(progress.completedChapters.length / 15) * 100}%` }}
            />
          </div>
          <button
            onClick={() => navigate('/progress')}
            className="text-xs text-amber-300 hover:text-amber-100 underline font-semibold shrink-0"
          >
            View Badges
          </button>
        </div>
      </section>

      {/* Ask the Story Guide Question Box */}
      <section className="bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 p-8 rounded-3xl border border-amber-800/80 shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-amber-100 text-xl">Ask the Story Guide</h2>
            <p className="text-xs text-amber-300/80">Have questions about heroes, battles, or strategies? Ask away!</p>
          </div>
        </div>

        <form onSubmit={handleAskGuide} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={quickQuestion}
            onChange={(e) => setQuickQuestion(e.target.value)}
            placeholder="e.g., Why were Liu Bei, Guan Yu, and Zhang Fei such close friends?"
            className="flex-1 bg-amber-950/80 border border-amber-800 text-amber-100 placeholder-amber-400/50 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            className="bg-amber-600 hover:bg-amber-500 text-amber-950 font-bold px-6 py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <span>Ask Guide</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-amber-400/80 font-medium">Try asking:</span>
          {[
            "Why did Cao Cao attack Yuan Shao?",
            "Was Cao Cao a bad person?",
            "Who was the smartest strategist?"
          ].map((q, idx) => (
            <button
              key={idx}
              onClick={() => handlePresetQuestion(q)}
              className="bg-amber-900/40 hover:bg-amber-900/80 border border-amber-800/60 text-amber-200 text-xs px-3 py-1 rounded-full transition-all cursor-pointer"
            >
              "{q}"
            </button>
          ))}
        </div>
      </section>

      {/* Featured Characters */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif font-bold text-2xl text-amber-100 flex items-center gap-2">
              <Users className="w-6 h-6 text-amber-400" />
              <span>Meet the Heroic Characters</span>
            </h2>
            <p className="text-xs text-amber-300/80">Rulers, warriors, and strategists who shaped history.</p>
          </div>
          <button
            onClick={() => navigate('/characters')}
            className="text-xs text-amber-400 hover:text-amber-200 font-semibold flex items-center gap-1"
          >
            <span>View All Characters</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {featuredCharacters.map((char) => (
            <div
              key={char.id}
              onClick={() => navigate('/characters', { state: { characterId: char.id } })}
              className="bg-amber-950/70 hover:bg-amber-900/80 border border-amber-800/70 hover:border-amber-600 rounded-2xl p-5 shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{char.avatarSymbol}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                    char.faction === 'Shu' ? 'bg-emerald-900 text-emerald-200 border-emerald-700' :
                    char.faction === 'Wei' ? 'bg-blue-900 text-blue-200 border-blue-700' :
                    char.faction === 'Wu' ? 'bg-red-900 text-red-200 border-red-700' :
                    'bg-purple-900 text-purple-200 border-purple-700'
                  }`}>
                    {char.faction}
                  </span>
                </div>
                <div>
                  <h3 className="font-serif font-bold text-amber-100 text-base">{char.name}</h3>
                  <p className="text-xs text-amber-300/70">{char.nameChinese} • {char.role}</p>
                </div>
                <p className="text-xs text-amber-200/80 line-clamp-2 leading-relaxed">
                  {char.personality}
                </p>
              </div>

              <div className="pt-4 border-t border-amber-900/60 flex items-center justify-between text-[11px] text-amber-400 font-medium">
                <span>Learn Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Events */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif font-bold text-2xl text-amber-100 flex items-center gap-2">
              <Swords className="w-6 h-6 text-amber-400" />
              <span>Famous Events & Battles</span>
            </h2>
            <p className="text-xs text-amber-300/80">Crucial turning points that decided the fate of China.</p>
          </div>
          <button
            onClick={() => navigate('/events')}
            className="text-xs text-amber-400 hover:text-amber-200 font-semibold flex items-center gap-1"
          >
            <span>View All Events</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredEvents.map((evt) => (
            <div
              key={evt.id}
              onClick={() => navigate('/events', { state: { eventId: evt.id } })}
              className="bg-stone-900/90 hover:bg-amber-950 border border-amber-800/80 hover:border-amber-500 p-6 rounded-2xl shadow-xl transition-all cursor-pointer space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs bg-amber-900/80 text-amber-300 px-2.5 py-1 rounded-full border border-amber-700/60 font-semibold">
                  {evt.when}
                </span>
                <span className="text-xs text-amber-300/80">{evt.where}</span>
              </div>

              <div>
                <h3 className="font-serif font-bold text-amber-100 text-lg">{evt.title}</h3>
                <p className="text-xs text-amber-300/70">{evt.titleChinese}</p>
              </div>

              <p className="text-xs text-amber-200/80 leading-relaxed line-clamp-3">
                {evt.whatHappened}
              </p>

              <div className="pt-2 flex items-center justify-between text-xs text-amber-400 font-semibold">
                <span>Explore Diagram & Details</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Visual Timeline Preview */}
      <section className="bg-amber-950/80 p-8 rounded-3xl border border-amber-800/80 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif font-bold text-2xl text-amber-100 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-amber-400" />
              <span>Three Kingdoms Timeline Preview</span>
            </h2>
            <p className="text-xs text-amber-300/80">From 184 AD (Yellow Turban Rebellion) to 280 AD (Reunification).</p>
          </div>
          <button
            onClick={() => navigate('/timeline')}
            className="bg-amber-800 hover:bg-amber-700 text-amber-100 text-xs font-bold px-4 py-2.5 rounded-xl border border-amber-600 transition-all cursor-pointer self-start sm:self-auto"
          >
            Open Interactive Timeline
          </button>
        </div>

        {/* Horizontal scroll preview */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-amber-700">
          {CHAPTERS.slice(0, 6).map((ch) => (
            <div
              key={ch.id}
              onClick={() => navigate('/story', { state: { chapterId: ch.id } })}
              className="w-60 shrink-0 bg-stone-900/90 border border-amber-800/80 hover:border-amber-500 p-4 rounded-xl cursor-pointer transition-all space-y-2"
            >
              <div className="flex items-center justify-between text-[11px] text-amber-400 font-semibold">
                <span>Ch. {ch.id}</span>
                <span>{ch.yearOrEra}</span>
              </div>
              <h4 className="font-serif font-bold text-amber-100 text-sm line-clamp-1">{ch.title}</h4>
              <p className="text-[11px] text-amber-300/70 line-clamp-2">{ch.shortIntro}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Daily Three Kingdoms Fact */}
      <section className="bg-gradient-to-r from-amber-900 via-amber-950 to-amber-900 p-6 rounded-2xl border-2 border-amber-600/60 shadow-xl flex flex-col sm:flex-row items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-3xl shrink-0">
          💡
        </div>
        <div className="space-y-1 text-center sm:text-left flex-1">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
            <Compass className="w-4 h-4" />
            <span>Daily Three Kingdoms Fact</span>
          </div>
          <h3 className="font-serif font-bold text-amber-100 text-lg">{dailyFact.title}</h3>
          <p className="text-xs text-amber-200/90 leading-relaxed">{dailyFact.fact}</p>
        </div>
        <button
          onClick={() => navigate('/progress')}
          className="bg-amber-800/80 hover:bg-amber-700 border border-amber-600 text-amber-100 px-4 py-2 rounded-xl text-xs font-semibold shrink-0 cursor-pointer"
        >
          More Facts & Quiz
        </button>
      </section>
    </div>
  );
};
