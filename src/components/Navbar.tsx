import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { BookOpen, Users, Swords, Calendar, Map, MessageSquare, Award, Home, Menu, X, Sparkles } from 'lucide-react';
import { useProgress } from '../hooks/useProgress';
import { CHAPTERS } from '../data/chapters';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { progress } = useProgress();
  const navigate = useNavigate();

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/story', label: 'Story', icon: BookOpen },
    { to: '/characters', label: 'Characters', icon: Users },
    { to: '/events', label: 'Events', icon: Swords },
    { to: '/timeline', label: 'Timeline', icon: Calendar },
    { to: '/kingdoms', label: 'Kingdoms', icon: Map },
    { to: '/ask', label: 'Story Guide', icon: MessageSquare },
    { to: '/progress', label: 'Progress', icon: Award },
  ];

  return (
    <header className="sticky top-0 z-50 bg-stone-950/95 backdrop-blur-md border-b border-amber-600/40 text-amber-100 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Title */}
          <div 
            onClick={() => navigate('/')} 
            className="flex items-center gap-3 cursor-pointer group focus-visible:ring-2 focus-visible:ring-amber-400 rounded-lg p-1"
            tabIndex={0}
            role="button"
            aria-label="Go to Homepage"
            onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-amber-700 to-red-900 flex items-center justify-center text-xl font-bold font-chinese text-amber-100 shadow-lg ring-2 ring-amber-400/50 group-hover:scale-105 transition-transform">
              三国
            </div>
            <div>
              <span className="font-serif-display font-extrabold text-base sm:text-lg text-amber-100 tracking-wide block leading-tight gold-gradient-text">
                Three Kingdoms
              </span>
              <span className="text-[10px] sm:text-xs text-amber-300/80 font-medium tracking-wider block">
                Interactive Children's Storybook
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                      isActive
                        ? 'bg-amber-900/90 text-amber-100 shadow-inner border border-amber-500/60 ring-1 ring-amber-400/30'
                        : 'text-amber-200/80 hover:text-amber-100 hover:bg-stone-900/80'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 text-amber-400" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Quick Progress Badge Shortcut */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => navigate('/ask')}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-900/90 to-red-950/90 hover:from-amber-800 hover:to-red-900 text-amber-200 px-3 py-1.5 rounded-xl border border-amber-600/60 text-xs font-bold shadow-md transition-all cursor-pointer"
              title="Ask AI Story Scholar"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>Ask Scholar</span>
            </button>

            <button
              onClick={() => navigate('/progress')}
              className="flex items-center gap-2 bg-stone-900/90 hover:bg-amber-950/80 text-amber-200 px-3 py-1.5 rounded-xl border border-amber-700/60 text-xs font-semibold shadow-sm transition-all cursor-pointer"
              title="View your reading badges and achievements"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Ch. {progress.lastReadChapterId}/{CHAPTERS.length}</span>
              <span className="bg-amber-600/90 text-amber-100 px-1.5 py-0.5 rounded-md text-[10px] font-bold">
                {progress.completedChapters.length} read
              </span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-amber-300 hover:text-amber-100 hover:bg-stone-900 focus:outline-none ring-1 ring-amber-600/40"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-stone-950/98 border-b border-amber-700 px-4 pt-3 pb-5 space-y-1.5 shadow-2xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold ${
                    isActive
                      ? 'bg-amber-900/90 text-amber-100 font-bold border border-amber-500/60'
                      : 'text-amber-200 hover:bg-stone-900'
                  }`
                }
              >
                <Icon className="w-5 h-5 text-amber-400" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      )}
    </header>
  );
};

