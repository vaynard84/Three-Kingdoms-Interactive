import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Scroll, Heart, Sparkles, BookOpen } from 'lucide-react';
import { CHAPTERS } from '../data/chapters';

export const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-amber-950 text-amber-200/80 border-t border-amber-800/80 py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-100 font-serif font-bold text-lg">
              <Scroll className="w-5 h-5 text-amber-400" />
              <span>Three Kingdoms Storybook</span>
            </div>
            <p className="text-xs text-amber-300/70 leading-relaxed">
              An exciting, child-friendly interactive adventure based on the classic epic Romance of the Three Kingdoms. Designed for young explorers aged 7–12.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="font-serif font-semibold text-amber-100 text-sm mb-3">Explore Story</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate('/story')} className="hover:text-amber-100 transition-colors flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>Read Chapters 1–{CHAPTERS.length}</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/characters')} className="hover:text-amber-100 transition-colors">
                  Character Profiles
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/events')} className="hover:text-amber-100 transition-colors">
                  Major Events & Battles
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/timeline')} className="hover:text-amber-100 transition-colors">
                  Interactive Timeline
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="font-serif font-semibold text-amber-100 text-sm mb-3">Learn & Play</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate('/kingdoms')} className="hover:text-amber-100 transition-colors">
                  Three Kingdoms Map
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/ask')} className="hover:text-amber-100 transition-colors">
                  Ask the AI Story Guide
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/progress')} className="hover:text-amber-100 transition-colors flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Personality Quiz & Badges</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="bg-amber-900/40 p-4 rounded-xl border border-amber-800/60">
            <h4 className="font-serif font-semibold text-amber-100 text-sm mb-2">Did You Know?</h4>
            <p className="text-xs text-amber-200/90 italic">
              "The Peach Garden Oath bound Liu Bei, Guan Yu, and Zhang Fei as sworn brothers forever."
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-amber-900/80 flex flex-col sm:flex-row items-center justify-between text-xs text-amber-400/60">
          <p>© {new Date().getFullYear()} Three Kingdoms Storybook for Children. All rights reserved.</p>
          <div className="flex items-center gap-1 mt-2 sm:mt-0">
            <span>Crafted with honor & courage</span>
            <Heart className="w-3.5 h-3.5 text-red-400 inline fill-red-400" />
          </div>
        </div>
      </div>
    </footer>
  );
};
