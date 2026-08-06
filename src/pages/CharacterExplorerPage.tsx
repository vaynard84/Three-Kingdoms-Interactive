import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Users, Search, Heart, Star, BookOpen, Shield, Sword, Crown, Scroll, Sparkles, X, ChevronRight } from 'lucide-react';
import { CHARACTERS } from '../data/characters';
import { Character, FactionId, CharacterRole } from '../types';
import { useProgress } from '../hooks/useProgress';
import { ASSETS } from '../data/assets';

// Faction frame visual themes according to storybook guidelines
const getFactionFrame = (faction: FactionId) => {
  switch (faction) {
    case 'Wei':
      return {
        bg: 'bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950',
        border: 'border-blue-500/70',
        badge: 'bg-blue-900/90 text-blue-200 border-blue-400',
        accent: 'text-blue-300',
        emblem: '魏'
      };
    case 'Shu':
      return {
        bg: 'bg-gradient-to-br from-emerald-950 via-stone-900 to-teal-950',
        border: 'border-emerald-500/70',
        badge: 'bg-emerald-900/90 text-emerald-200 border-emerald-400',
        accent: 'text-emerald-300',
        emblem: '蜀'
      };
    case 'Wu':
      return {
        bg: 'bg-gradient-to-br from-red-950 via-stone-900 to-amber-950',
        border: 'border-rose-500/70',
        badge: 'bg-rose-900/90 text-rose-200 border-rose-400',
        accent: 'text-rose-300',
        emblem: '吳'
      };
    case 'Han':
      return {
        bg: 'bg-gradient-to-br from-amber-950 via-stone-900 to-yellow-950',
        border: 'border-amber-400/80',
        badge: 'bg-amber-900/90 text-amber-200 border-amber-400',
        accent: 'text-amber-300',
        emblem: '漢'
      };
    default:
      return {
        bg: 'bg-gradient-to-br from-purple-950 via-stone-900 to-stone-950',
        border: 'border-purple-500/70',
        badge: 'bg-purple-900/90 text-purple-200 border-purple-400',
        accent: 'text-purple-300',
        emblem: '群'
      };
  }
};

export const CharacterExplorerPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { progress, toggleFavoriteCharacter } = useProgress();

  const [selectedFaction, setSelectedFaction] = useState<FactionId | 'All'>('All');
  const [selectedRole, setSelectedRole] = useState<CharacterRole | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  // Active selected character for detail modal/drawer
  const [activeCharacter, setActiveCharacter] = useState<Character | null>(null);

  useEffect(() => {
    if (location.state && (location.state as { characterId?: string }).characterId) {
      const charId = (location.state as { characterId: string }).characterId;
      const found = CHARACTERS.find(c => c.id === charId);
      if (found) setActiveCharacter(found);
    }
  }, [location.state]);

  const filteredCharacters = CHARACTERS.filter(char => {
    if (selectedFaction !== 'All' && char.faction !== selectedFaction) return false;
    if (selectedRole !== 'All' && char.role !== selectedRole) return false;
    if (onlyFavorites && !progress.favoriteCharacterIds.includes(char.id)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        char.name.toLowerCase().includes(q) ||
        char.nameChinese.includes(q) ||
        char.personality.toLowerCase().includes(q) ||
        char.biography.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-amber-950/80 p-8 rounded-3xl border border-amber-800/80 shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 bg-amber-900/80 border border-amber-700/80 text-amber-300 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest">
          <Users className="w-4 h-4 text-amber-400" />
          <span>Character Explorer</span>
        </div>
        <h1 className="font-serif font-extrabold text-3xl sm:text-4xl text-amber-100">
          Heroes, Rulers & Strategists
        </h1>
        <p className="text-sm text-amber-200/90 max-w-2xl leading-relaxed">
          Discover the legendary figures of Romance of the Three Kingdoms! Explore their personalities, loyalties, epic duels, and historical roles.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="bg-stone-900/90 p-5 rounded-2xl border border-amber-800/80 shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-amber-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or keyword..."
              className="w-full bg-amber-950/80 border border-amber-800 text-amber-100 placeholder-amber-400/50 pl-9 pr-4 py-2 rounded-xl text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Favorites Filter Toggle */}
          <button
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              onlyFavorites
                ? 'bg-amber-500 text-amber-950 border-amber-400'
                : 'bg-amber-950 text-amber-300 border-amber-800 hover:border-amber-600'
            }`}
          >
            <Heart className={`w-4 h-4 ${onlyFavorites ? 'fill-amber-950' : ''}`} />
            <span>Favorites ({progress.favoriteCharacterIds.length})</span>
          </button>
        </div>

        {/* Faction Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-amber-900/80">
          <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider mr-2">Kingdom:</span>
          {(['All', 'Shu', 'Wei', 'Wu', 'Han', 'Other'] as const).map(f => (
            <button
              key={f}
              onClick={() => setSelectedFaction(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedFaction === f
                  ? f === 'Shu' ? 'bg-emerald-700 text-emerald-100 ring-2 ring-emerald-400' :
                    f === 'Wei' ? 'bg-blue-700 text-blue-100 ring-2 ring-blue-400' :
                    f === 'Wu' ? 'bg-red-700 text-red-100 ring-2 ring-red-400' :
                    f === 'Han' ? 'bg-amber-600 text-amber-950 ring-2 ring-amber-300' :
                    f === 'Other' ? 'bg-purple-700 text-purple-100 ring-2 ring-purple-400' :
                    'bg-amber-500 text-amber-950'
                  : 'bg-amber-950/80 text-amber-300 border border-amber-800 hover:bg-amber-900'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Role Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider mr-2">Role:</span>
          {(['All', 'Ruler', 'Warrior', 'Strategist', 'Official'] as const).map(r => (
            <button
              key={r}
              onClick={() => setSelectedRole(r)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedRole === r
                  ? 'bg-amber-700 text-amber-100 border border-amber-500'
                  : 'bg-amber-950/50 text-amber-300/80 border border-amber-900 hover:text-amber-100'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Characters Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCharacters.map(char => {
          const isFav = progress.favoriteCharacterIds.includes(char.id);
          const frame = getFactionFrame(char.faction);

          return (
            <div
              key={char.id}
              onClick={() => setActiveCharacter(char)}
              className={`relative overflow-hidden rounded-3xl p-6 border-2 shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between space-y-4 ${frame.bg} ${frame.border}`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl p-2 bg-stone-950/80 rounded-2xl border border-amber-700/60 shadow-inner">
                      {char.avatarSymbol}
                    </span>
                    <div>
                      <h3 className="font-serif font-bold text-amber-100 text-lg leading-tight">{char.name}</h3>
                      <p className={`text-xs font-serif ${frame.accent}`}>{char.nameChinese}</p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavoriteCharacter(char.id);
                    }}
                    className={`p-2 rounded-xl transition-all ${
                      isFav ? 'text-amber-400 bg-stone-900/80' : 'text-stone-400 hover:text-amber-300'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border uppercase tracking-wider ${frame.badge}`}>
                    {frame.emblem} {char.faction} Kingdom
                  </span>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-stone-900/90 text-amber-300 border border-amber-700/60">
                    {char.role}
                  </span>
                </div>

                <p className="text-xs text-amber-100/90 leading-relaxed line-clamp-3 font-sans">
                  {char.personality}
                </p>
              </div>

              <div className="pt-4 border-t border-amber-800/40 flex items-center justify-between text-xs font-semibold text-amber-300">
                <span>View Full Profile & Biography</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>

      {filteredCharacters.length === 0 && (
        <div className="text-center py-12 bg-amber-950/40 rounded-3xl border border-amber-800/60 text-amber-300/80">
          <p className="text-base font-serif">No characters matched your filter.</p>
          <button
            onClick={() => { setSelectedFaction('All'); setSelectedRole('All'); setSearchQuery(''); setOnlyFavorites(false); }}
            className="mt-3 text-xs text-amber-400 underline font-semibold"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Character Detail Modal */}
      {activeCharacter && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-gradient-to-b from-amber-950 to-stone-900 border-2 border-amber-600 max-w-2xl w-full rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl my-8 relative">
            <button
              onClick={() => setActiveCharacter(null)}
              className="absolute top-4 right-4 p-2 text-amber-400 hover:text-amber-100 bg-amber-900/60 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Header */}
            <div className="flex items-start gap-4">
              <span className="text-5xl p-3 bg-stone-900 rounded-2xl border border-amber-700 shadow-lg">
                {activeCharacter.avatarSymbol}
              </span>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-serif font-bold text-2xl text-amber-100">{activeCharacter.name}</h2>
                  <span className="text-lg font-serif text-amber-400">{activeCharacter.nameChinese}</span>
                </div>
                {activeCharacter.courtesyName && (
                  <p className="text-xs text-amber-300/80">Courtesy Name: {activeCharacter.courtesyName}</p>
                )}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-xs px-3 py-1 rounded-full font-bold bg-amber-900 text-amber-200 border border-amber-700">
                    {activeCharacter.faction} • {activeCharacter.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Personality & Quote */}
            {activeCharacter.quote && (
              <p className="text-xs sm:text-sm text-amber-200 italic font-serif bg-amber-900/40 p-3.5 rounded-xl border-l-4 border-amber-500">
                "{activeCharacter.quote}"
              </p>
            )}

            {/* Personality Summary */}
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Personality</h4>
              <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">{activeCharacter.personality}</p>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-emerald-950/60 p-3.5 rounded-xl border border-emerald-800/80 space-y-1">
                <h5 className="text-xs font-bold text-emerald-300 uppercase">Strengths</h5>
                <ul className="text-xs text-emerald-100 space-y-1 list-disc list-inside">
                  {activeCharacter.strengths.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>

              <div className="bg-red-950/60 p-3.5 rounded-xl border border-red-800/80 space-y-1">
                <h5 className="text-xs font-bold text-red-300 uppercase">Weaknesses</h5>
                <ul className="text-xs text-red-100 space-y-1 list-disc list-inside">
                  {activeCharacter.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </div>
            </div>

            {/* Why This Character Matters */}
            <div className="bg-amber-900/50 p-4 rounded-2xl border border-amber-700/60 space-y-1">
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Why This Character Matters to Kids</span>
              </h4>
              <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
                {activeCharacter.whyThisCharacterMatters}
              </p>
            </div>

            {/* Character Relationships */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Important Relationships</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeCharacter.relationships.map((rel, idx) => (
                  <div key={idx} className="bg-stone-900 p-2.5 rounded-xl border border-amber-800/60 text-xs text-amber-100 space-y-0.5">
                    <div className="flex items-center justify-between font-bold text-amber-300">
                      <span>{rel.targetCharacterName}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-900/80 text-amber-200">
                        {rel.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-200/80">{rel.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Character Timeline */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Character Timeline</h4>
              <div className="space-y-1.5 border-l-2 border-amber-700 pl-3">
                {activeCharacter.timeline.map((item, idx) => (
                  <div key={idx} className="text-xs">
                    <span className="font-bold text-amber-300">{item.year}: </span>
                    <span className="text-amber-100">{item.event}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Jump to Relevant Story Chapters Button */}
            <div className="pt-2 border-t border-amber-800 flex items-center justify-between">
              <button
                onClick={() => {
                  const firstChId = activeCharacter.chapterIds[0] || 1;
                  setActiveCharacter(null);
                  navigate('/story', { state: { chapterId: firstChId } });
                }}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <BookOpen className="w-4 h-4" />
                <span>Jump to Story Chapters ({activeCharacter.chapterIds.join(', ')})</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
