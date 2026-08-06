import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Swords, Search, MapPin, Calendar, BookOpen, Users, ArrowRight, ShieldAlert, Sparkles, ChevronRight } from 'lucide-react';
import { EVENTS } from '../data/events';
import { CHARACTERS } from '../data/characters';
import { HistoricalEvent, FactionId } from '../types';
import { RelationshipDiagram } from '../components/RelationshipDiagram';

export const EventExplorerPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedFaction, setSelectedFaction] = useState<FactionId | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeEvent, setActiveEvent] = useState<HistoricalEvent>(() => {
    if (location.state && (location.state as { eventId?: string }).eventId) {
      const found = EVENTS.find(e => e.id === (location.state as { eventId: string }).eventId);
      if (found) return found;
    }
    return EVENTS[0];
  });

  useEffect(() => {
    if (location.state && (location.state as { eventId?: string }).eventId) {
      const found = EVENTS.find(e => e.id === (location.state as { eventId: string }).eventId);
      if (found) {
        setActiveEvent(found);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [location.state]);

  const filteredEvents = EVENTS.filter(evt => {
    if (selectedFaction !== 'All' && !evt.factionInvolved.includes(selectedFaction)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        evt.title.toLowerCase().includes(q) ||
        evt.titleChinese.includes(q) ||
        evt.where.toLowerCase().includes(q) ||
        evt.whatHappened.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-amber-950/80 p-8 rounded-3xl border border-amber-800/80 shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 bg-amber-900/80 border border-amber-700/80 text-amber-300 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest">
          <Swords className="w-4 h-4 text-amber-400" />
          <span>Event & Battle Explorer</span>
        </div>
        <h1 className="font-serif font-extrabold text-3xl sm:text-4xl text-amber-100">
          Major Historic Campaigns
        </h1>
        <p className="text-sm text-amber-200/90 max-w-2xl leading-relaxed">
          From the fiery naval clash at Red Cliffs to the secret food depot raid at Guandu, explore the turning points that reshaped China.
        </p>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar: Events List & Filters */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-stone-900/90 p-4 rounded-2xl border border-amber-800/80 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-amber-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search event or battle..."
                className="w-full bg-amber-950/80 border border-amber-800 text-amber-100 placeholder-amber-400/50 pl-9 pr-3 py-1.5 rounded-xl text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Faction Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {(['All', 'Shu', 'Wei', 'Wu', 'Han', 'Other'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setSelectedFaction(f)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    selectedFaction === f
                      ? 'bg-amber-500 text-amber-950'
                      : 'bg-amber-950 text-amber-300/80 border border-amber-800 hover:text-amber-100'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-amber-800">
            {filteredEvents.map(evt => {
              const isActive = evt.id === activeEvent.id;

              return (
                <div
                  key={evt.id}
                  onClick={() => {
                    setActiveEvent(evt);
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isActive
                      ? 'bg-amber-900/90 border-amber-500 text-amber-100 shadow-lg ring-1 ring-amber-500'
                      : 'bg-amber-950/60 hover:bg-amber-900/50 border-amber-800/80 text-amber-200/90'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-semibold text-amber-400">
                    <span>{evt.when}</span>
                    <span>📍 {evt.where.split(' ')[0]}</span>
                  </div>
                  <h3 className="font-serif font-bold text-sm leading-tight">{evt.title}</h3>
                  <p className="text-[11px] text-amber-300/70 line-clamp-2">{evt.whatHappened}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Area: Active Event Details */}
        <div className="lg:col-span-8 space-y-6">
          <article className="bg-gradient-to-b from-stone-900 via-amber-950/60 to-stone-900 p-6 sm:p-8 rounded-3xl border-2 border-amber-800/80 shadow-2xl space-y-6">
            {/* Header info */}
            <div className="border-b border-amber-800/80 pb-6 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs bg-amber-900/80 border border-amber-700 text-amber-300 px-3 py-1 rounded-full font-bold">
                  🗓️ {activeEvent.when}
                </span>
                <span className="text-xs text-amber-300/90 font-medium flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{activeEvent.where}</span>
                </span>
              </div>

              <h2 className="font-serif font-extrabold text-3xl sm:text-4xl text-amber-100">
                {activeEvent.title}
              </h2>
              <p className="text-sm font-serif text-amber-400">{activeEvent.titleChinese}</p>
            </div>

            {/* Causes & What Happened */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-amber-950/80 p-5 rounded-2xl border border-amber-800/80 space-y-2">
                <h4 className="font-serif font-bold text-amber-300 text-sm flex items-center gap-2">
                  <span>🔥</span> What Caused It?
                </h4>
                <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
                  {activeEvent.cause}
                </p>
              </div>

              <div className="bg-amber-950/80 p-5 rounded-2xl border border-amber-800/80 space-y-2">
                <h4 className="font-serif font-bold text-amber-300 text-sm flex items-center gap-2">
                  <span>👑</span> Who Won or Benefited?
                </h4>
                <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
                  {activeEvent.whoWonOrBenefited}
                </p>
              </div>
            </div>

            {/* What Happened Full */}
            <div className="bg-stone-900 p-6 rounded-2xl border border-amber-800/80 space-y-2">
              <h4 className="font-serif font-bold text-amber-100 text-base flex items-center gap-2">
                <span>⚔️</span> What Happened
              </h4>
              <p className="text-sm text-amber-200/90 leading-relaxed">
                {activeEvent.whatHappened}
              </p>
            </div>

            {/* Why It Mattered & What Happened Next */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-amber-900/40 p-5 rounded-2xl border border-amber-800/80 space-y-2">
                <h4 className="font-serif font-bold text-amber-300 text-sm flex items-center gap-2">
                  <span>🌟</span> Why It Mattered
                </h4>
                <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
                  {activeEvent.whyItMattered}
                </p>
              </div>

              <div className="bg-amber-900/40 p-5 rounded-2xl border border-amber-800/80 space-y-2">
                <h4 className="font-serif font-bold text-amber-300 text-sm flex items-center gap-2">
                  <span>⏩</span> What Happened Next
                </h4>
                <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
                  {activeEvent.whatHappenedNext}
                </p>
              </div>
            </div>

            {/* Visual Relationship Diagram */}
            <RelationshipDiagram
              nodes={activeEvent.diagram.nodes}
              links={activeEvent.diagram.links}
            />

            {/* Related Characters & Chapters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-amber-800/80">
              {/* Characters */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  <span>Key Characters Involved</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeEvent.involvedCharacterIds.map(cId => {
                    const char = CHARACTERS.find(c => c.id === cId);
                    if (!char) return null;

                    return (
                      <button
                        key={char.id}
                        onClick={() => navigate('/characters', { state: { characterId: char.id } })}
                        className="bg-amber-900/80 hover:bg-amber-800 border border-amber-700 text-amber-100 text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <span>{char.avatarSymbol}</span>
                        <span>{char.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Chapters */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  <span>Related Story Chapters</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeEvent.relatedChapterIds.map(chId => (
                    <button
                      key={chId}
                      onClick={() => navigate('/story', { state: { chapterId: chId } })}
                      className="bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                    >
                      <span>Read Ch. {chId}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};
