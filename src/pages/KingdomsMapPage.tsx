import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, Users, Swords, BookOpen, Crown, Shield, ArrowRight, Network } from 'lucide-react';
import { KINGDOMS } from '../data/kingdoms';
import { CHARACTERS } from '../data/characters';
import { Kingdom, FactionId } from '../types';

export const KingdomsMapPage: React.FC = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'map' | 'relationships'>('map');
  const [selectedKingdom, setSelectedKingdom] = useState<Kingdom>(KINGDOMS[0]);

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-amber-950/80 p-8 rounded-3xl border border-amber-800/80 shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 bg-amber-900/80 border border-amber-700/80 text-amber-300 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest">
          <Map className="w-4 h-4 text-amber-400" />
          <span>Kingdoms & Alliances</span>
        </div>
        <h1 className="font-serif font-extrabold text-3xl sm:text-4xl text-amber-100">
          The Three Realms of Ancient China
        </h1>
        <p className="text-sm text-amber-200/90 max-w-2xl leading-relaxed">
          Explore the geographical strongholds, territories, alliances, and complex webs of relationships that bound the heroes together.
        </p>

        {/* View Switcher Tabs */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => setActiveTab('map')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'map'
                ? 'bg-amber-500 text-amber-950 shadow-md'
                : 'bg-amber-900/60 text-amber-200 border border-amber-700/80'
            }`}
          >
            <Map className="w-4 h-4" />
            <span>Interactive Kingdom Map</span>
          </button>

          <button
            onClick={() => setActiveTab('relationships')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'relationships'
                ? 'bg-amber-500 text-amber-950 shadow-md'
                : 'bg-amber-900/60 text-amber-200 border border-amber-700/80'
            }`}
          >
            <Network className="w-4 h-4" />
            <span>Character Relationship Web</span>
          </button>
        </div>
      </div>

      {activeTab === 'map' ? (
        <div className="space-y-8">
          {/* Kingdom Selector Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {KINGDOMS.map(k => {
              const isSelected = k.id === selectedKingdom.id;

              return (
                <div
                  key={k.id}
                  onClick={() => setSelectedKingdom(k)}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer shadow-lg space-y-3 ${
                    isSelected
                      ? 'border-amber-400 bg-amber-900/90 scale-105 shadow-2xl'
                      : 'border-amber-800/80 bg-amber-950/60 hover:border-amber-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{k.emblemSymbol}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${k.colorTheme.badge}`}>
                      {k.id}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif font-bold text-amber-100 text-base">{k.name}</h3>
                    <p className="text-xs text-amber-400 font-serif">{k.nameChinese}</p>
                  </div>

                  <p className="text-[11px] text-amber-300/80">Capital: {k.capital}</p>
                </div>
              );
            })}
          </div>

          {/* Kingdom Detail View Card */}
          {selectedKingdom && (
            <div className={`p-8 rounded-3xl border-2 shadow-2xl space-y-6 ${selectedKingdom.colorTheme.bg} ${selectedKingdom.colorTheme.border}`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-amber-700/60 pb-6">
                <div className="flex items-center gap-4">
                  <span className="text-5xl">{selectedKingdom.emblemSymbol}</span>
                  <div>
                    <span className="text-xs text-amber-300 font-bold uppercase tracking-wider">
                      Kingdom Profile
                    </span>
                    <h2 className="font-serif font-extrabold text-3xl text-amber-100">
                      {selectedKingdom.name} ({selectedKingdom.nameChinese})
                    </h2>
                    <p className="text-xs text-amber-200/80">
                      Founded by: <span className="font-bold text-amber-300">{selectedKingdom.founder}</span> • Capital: <span className="font-bold text-amber-300">{selectedKingdom.capital}</span>
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-sm sm:text-base text-amber-100 leading-relaxed font-sans">
                {selectedKingdom.description}
              </p>

              {/* Grid Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Leaders & Key Characters */}
                <div className="bg-black/30 p-5 rounded-2xl border border-amber-700/60 space-y-3">
                  <h4 className="font-serif font-bold text-amber-200 text-sm flex items-center gap-2">
                    <Crown className="w-4 h-4 text-amber-400" />
                    <span>Leaders & Key Characters</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedKingdom.keyCharacters.map(charName => {
                      const foundChar = CHARACTERS.find(c => c.name === charName);
                      return (
                        <button
                          key={charName}
                          onClick={() => {
                            if (foundChar) navigate('/characters', { state: { characterId: foundChar.id } });
                          }}
                          className="bg-amber-900/80 hover:bg-amber-800 border border-amber-700 text-amber-100 text-xs px-3 py-1 rounded-xl transition-all cursor-pointer"
                        >
                          {foundChar?.avatarSymbol || '👤'} {charName}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Major Territories */}
                <div className="bg-black/30 p-5 rounded-2xl border border-amber-700/60 space-y-3">
                  <h4 className="font-serif font-bold text-amber-200 text-sm flex items-center gap-2">
                    <Map className="w-4 h-4 text-amber-400" />
                    <span>Major Strongholds & Territories</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedKingdom.majorTerritories.map(terr => (
                      <span key={terr} className="bg-amber-950 border border-amber-800 text-amber-200 text-xs px-3 py-1 rounded-xl">
                        🏰 {terr}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Allies, Enemies & Important Battles */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-emerald-950/60 p-4 rounded-xl border border-emerald-800/80 text-xs space-y-1">
                  <span className="font-bold text-emerald-300">Allies:</span>
                  <p className="text-emerald-100">{selectedKingdom.allies.join(', ')}</p>
                </div>

                <div className="bg-red-950/60 p-4 rounded-xl border border-red-800/80 text-xs space-y-1">
                  <span className="font-bold text-red-300">Enemies:</span>
                  <p className="text-red-100">{selectedKingdom.enemies.join(', ')}</p>
                </div>

                <div className="bg-amber-950/60 p-4 rounded-xl border border-amber-800/80 text-xs space-y-1">
                  <span className="font-bold text-amber-300">Key Battles:</span>
                  <p className="text-amber-100">{selectedKingdom.importantBattles.join(', ')}</p>
                </div>
              </div>

              {/* Related Chapters */}
              <div className="pt-2 flex items-center gap-2 text-xs">
                <span className="text-amber-400 font-bold uppercase tracking-wider">Relevant Chapters:</span>
                {selectedKingdom.relatedChapterIds.map(chId => (
                  <button
                    key={chId}
                    onClick={() => navigate('/story', { state: { chapterId: chId } })}
                    className="bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold px-3 py-1 rounded-lg transition-all cursor-pointer"
                  >
                    Ch. {chId}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Character Relationship View */
        <div className="bg-stone-900/90 p-6 sm:p-8 rounded-3xl border border-amber-800/80 shadow-2xl space-y-6">
          <div className="border-b border-amber-800 pb-4 space-y-1">
            <h2 className="font-serif font-bold text-2xl text-amber-100 flex items-center gap-2">
              <Network className="w-6 h-6 text-amber-400" />
              <span>Character Relationship Matrix</span>
            </h2>
            <p className="text-xs text-amber-300/80">
              Brotherhood sworn in peach orchards, rivalries across battlefields, and loyalty tested by power.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CHARACTERS.map(char => (
              <div
                key={char.id}
                className="bg-amber-950/80 p-5 rounded-2xl border border-amber-800 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{char.avatarSymbol}</span>
                  <div>
                    <h3 className="font-serif font-bold text-amber-100 text-base">{char.name}</h3>
                    <p className="text-xs text-amber-400">{char.faction} Kingdom • {char.role}</p>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-amber-900">
                  {char.relationships.map((rel, idx) => (
                    <div key={idx} className="bg-stone-900/80 p-2 rounded-xl text-xs flex items-center justify-between">
                      <span className="font-medium text-amber-200">{rel.targetCharacterName}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        rel.type === 'Sworn Brother' ? 'bg-emerald-900 text-emerald-200' :
                        rel.type === 'Ally' ? 'bg-blue-900 text-blue-200' :
                        rel.type === 'Rival' ? 'bg-red-900 text-red-200' :
                        'bg-purple-900 text-purple-200'
                      }`}>
                        {rel.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
