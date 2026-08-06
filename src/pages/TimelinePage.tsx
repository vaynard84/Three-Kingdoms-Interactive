import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Filter, ArrowRight, BookOpen, Swords, CheckCircle2 } from 'lucide-react';
import { TIMELINE } from '../data/timeline';
import { FactionId, TimelineEntry } from '../types';
import { useProgress } from '../hooks/useProgress';

export const TimelinePage: React.FC = () => {
  const navigate = useNavigate();
  const { progress } = useProgress();

  const [selectedFaction, setSelectedFaction] = useState<FactionId | 'All'>('All');
  const [selectedEntry, setSelectedEntry] = useState<TimelineEntry>(TIMELINE[0]);

  const filteredTimeline = TIMELINE.filter(entry => {
    if (selectedFaction !== 'All' && entry.faction !== selectedFaction) return false;
    return true;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-amber-950/80 p-8 rounded-3xl border border-amber-800/80 shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 bg-amber-900/80 border border-amber-700/80 text-amber-300 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest">
          <Calendar className="w-4 h-4 text-amber-400" />
          <span>Interactive Timeline</span>
        </div>
        <h1 className="font-serif font-extrabold text-3xl sm:text-4xl text-amber-100">
          Chronology of the Three Kingdoms (184–280 AD)
        </h1>
        <p className="text-sm text-amber-200/90 max-w-2xl leading-relaxed">
          Follow the century-long journey from the fall of the Han Dynasty through epic battles to the grand reunification under the Jin Dynasty.
        </p>
      </div>

      {/* Faction Filter Bar */}
      <div className="bg-stone-900/90 p-4 rounded-2xl border border-amber-800/80 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-amber-200 uppercase tracking-wider">Filter by Kingdom:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(['All', 'Shu', 'Wei', 'Wu', 'Han', 'Other'] as const).map(f => (
            <button
              key={f}
              onClick={() => setSelectedFaction(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedFaction === f
                  ? 'bg-amber-500 text-amber-950 shadow-md ring-2 ring-amber-300'
                  : 'bg-amber-950 text-amber-300 border border-amber-800 hover:text-amber-100'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Active Timeline Entry Preview Card */}
      {selectedEntry && (
        <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 p-6 sm:p-8 rounded-3xl border-2 border-amber-600 shadow-2xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold bg-amber-500 text-amber-950 px-3 py-1 rounded-full uppercase tracking-wider">
              Year: {selectedEntry.year}
            </span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
              selectedEntry.faction === 'Shu' ? 'bg-emerald-900 text-emerald-200 border-emerald-700' :
              selectedEntry.faction === 'Wei' ? 'bg-blue-900 text-blue-200 border-blue-700' :
              selectedEntry.faction === 'Wu' ? 'bg-red-900 text-red-200 border-red-700' :
              selectedEntry.faction === 'Han' ? 'bg-amber-900 text-amber-200 border-amber-700' :
              'bg-purple-900 text-purple-200 border-purple-700'
            }`}>
              {selectedEntry.faction} Faction
            </span>
          </div>

          <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-amber-100">
            {selectedEntry.title}
          </h2>

          <p className="text-sm sm:text-base text-amber-200/90 leading-relaxed font-sans">
            {selectedEntry.shortSummary}
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-3">
            {selectedEntry.chapterId && (
              <button
                onClick={() => navigate('/story', { state: { chapterId: selectedEntry.chapterId } })}
                className="bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-md transition-all"
              >
                <BookOpen className="w-4 h-4" />
                <span>Read Story Chapter {selectedEntry.chapterId}</span>
              </button>
            )}

            {selectedEntry.eventId && (
              <button
                onClick={() => navigate('/events', { state: { eventId: selectedEntry.eventId } })}
                className="bg-amber-900/80 hover:bg-amber-800 text-amber-100 font-semibold px-4 py-2 rounded-xl text-xs border border-amber-700 flex items-center gap-2 cursor-pointer transition-all"
              >
                <Swords className="w-4 h-4 text-amber-400" />
                <span>View Event Diagram</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Visual Timeline Stream (Vertical with Connected Line) */}
      <div className="relative border-l-4 border-amber-700/80 ml-4 sm:ml-8 pl-6 sm:pl-8 space-y-8 my-8">
        {filteredTimeline.map((item) => {
          const isCurrentChapter = item.chapterId === progress.lastReadChapterId;
          const isSelected = selectedEntry.id === item.id;

          return (
            <div
              key={item.id}
              onClick={() => setSelectedEntry(item)}
              className="relative group cursor-pointer"
            >
              {/* Timeline Node Icon */}
              <div
                className={`absolute -left-[35px] sm:-left-[43px] top-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                  isCurrentChapter
                    ? 'bg-amber-400 border-amber-100 ring-4 ring-amber-500/50 scale-110'
                    : isSelected
                    ? 'bg-amber-600 border-amber-200'
                    : 'bg-amber-950 border-amber-700 group-hover:border-amber-400'
                }`}
              >
                {isCurrentChapter ? (
                  <CheckCircle2 className="w-4 h-4 text-amber-950" />
                ) : (
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-200" />
                )}
              </div>

              {/* Timeline Item Box */}
              <div
                className={`p-5 rounded-2xl border transition-all ${
                  isSelected
                    ? 'bg-amber-900/90 border-amber-500 text-amber-100 shadow-xl'
                    : 'bg-amber-950/60 hover:bg-amber-900/50 border-amber-800/80 text-amber-200/90'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                    {item.year}
                  </span>
                  {isCurrentChapter && (
                    <span className="text-[10px] bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      Currently Reading Here
                    </span>
                  )}
                </div>

                <h3 className="font-serif font-bold text-base sm:text-lg">{item.title}</h3>
                <p className="text-xs text-amber-300/80 mt-1 line-clamp-2">{item.shortSummary}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
