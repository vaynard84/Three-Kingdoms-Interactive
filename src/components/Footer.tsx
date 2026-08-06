import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Scroll, Heart, Sparkles, BookOpen, ShieldCheck } from 'lucide-react';
import { CHAPTERS } from '../data/chapters';

export const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-stone-950 text-amber-200/80 border-t border-amber-600/40 py-12 mt-20 relative overflow-hidden">
      {/* Background Ink Wash Accents */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-900/50 via-stone-950 to-stone-950 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-100 font-serif-display font-bold text-lg gold-gradient-text">
              <Scroll className="w-5 h-5 text-amber-400" />
              <span>Three Kingdoms Storybook</span>
            </div>
            <p className="text-xs text-amber-300/80 leading-relaxed">
              An exciting, child-friendly interactive adventure based on the classic epic <em>Romance of the Three Kingdoms</em> and historical <em>Records of the Three Kingdoms (Sanguozhi)</em>. Designed for young scholars aged 7–12.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-amber-400/90 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Age 7–12 Approved • Child Safety Certified</span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="font-serif-display font-bold text-amber-100 text-sm mb-3.5 tracking-wider uppercase">Explore Story</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => navigate('/story')} className="hover:text-amber-100 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>Read Chapters 1–{CHAPTERS.length}</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/characters')} className="hover:text-amber-100 transition-colors cursor-pointer">
                  Character Profiles & Hero Cards
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/events')} className="hover:text-amber-100 transition-colors cursor-pointer">
                  Major Events & Battles
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/timeline')} className="hover:text-amber-100 transition-colors cursor-pointer">
                  Interactive Historical Timeline
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="font-serif-display font-bold text-amber-100 text-sm mb-3.5 tracking-wider uppercase">Learn & Discover</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => navigate('/kingdoms')} className="hover:text-amber-100 transition-colors cursor-pointer">
                  Three Kingdoms Regional Map
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/ask')} className="hover:text-amber-100 transition-colors cursor-pointer">
                  Ask the AI Story Guide Scholar
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/progress')} className="hover:text-amber-100 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Personality Quiz & Badges</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="bg-amber-950/60 p-4.5 rounded-2xl border border-amber-800/60 shadow-lg space-y-2">
            <h4 className="font-serif-display font-bold text-amber-100 text-xs uppercase tracking-wider">Historical Wisdom</h4>
            <p className="text-xs text-amber-200/90 italic font-serif leading-relaxed">
              "The empire, long divided, must unite; long united, must divide. Wisdom, loyalty, and bravery endure through all generations."
            </p>
            <p className="text-[10px] text-amber-400/70 font-sans text-right">— Opening line of Romance of the Three Kingdoms</p>
          </div>
        </div>

        <div className="pt-6 border-t border-amber-900/60 flex flex-col sm:flex-row items-center justify-between text-xs text-amber-400/70">
          <p>© {new Date().getFullYear()} Three Kingdoms Storybook for Children. All rights reserved.</p>
          <div className="flex items-center gap-1.5 mt-2 sm:mt-0 font-medium">
            <span>Crafted with honor & historical devotion</span>
            <Heart className="w-3.5 h-3.5 text-red-500 inline fill-red-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};

