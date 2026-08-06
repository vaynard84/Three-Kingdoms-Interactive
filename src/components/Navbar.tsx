import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { BookOpen, Users, Swords, Calendar, Map, MessageSquare, Award, Home, Menu, X } from 'lucide-react';
import { useProgress } from '../hooks/useProgress';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { progress } = useProgress();
  const navigate = useNavigate();

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/story', label: 'Story Mode', icon: BookOpen },
    { to: '/characters', label: 'Characters', icon: Users },
    { to: '/events', label: 'Events', icon: Swords },
    { to: '/timeline', label: 'Timeline', icon: Calendar },
    { to: '/kingdoms', label: 'Kingdoms', icon: Map },
    { to: '/ask', label: 'Ask Guide', icon: MessageSquare },
    { to: '/progress', label: 'My Progress', icon: Award },
  ];

  return (
    <header className="sticky top-0 z-50 bg-amber-950/95 backdrop-blur border-b border-amber-800/60 text-amber-100 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Title */}
          <div 
            onClick={() => navigate('/')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center text-xl font-bold shadow-md ring-2 ring-amber-400/40 group-hover:scale-105 transition-transform">
              三国
            </div>
            <div>
              <span className="font-serif font-bold text-lg sm:text-xl text-amber-100 tracking-wide block leading-tight">
                Three Kingdoms
              </span>
              <span className="text-xs text-amber-300/80 font-sans tracking-wider block">
                Interactive Children's Storybook
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-amber-800/90 text-amber-200 shadow-inner border border-amber-600/50'
                        : 'text-amber-200/80 hover:text-amber-100 hover:bg-amber-900/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 text-amber-400" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Quick Progress Badge */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => navigate('/progress')}
              className="flex items-center gap-2 bg-amber-900/80 hover:bg-amber-800 text-amber-200 px-3 py-1.5 rounded-full border border-amber-700/60 text-xs font-semibold shadow-sm transition-all"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Ch. {progress.lastReadChapterId}/15</span>
              <span className="bg-amber-600/80 text-amber-100 px-1.5 py-0.5 rounded-full text-[10px]">
                {progress.completedChapters.length} read
              </span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-amber-300 hover:text-amber-100 hover:bg-amber-900 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-amber-950 border-b border-amber-800 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-md text-base font-medium ${
                    isActive
                      ? 'bg-amber-800 text-amber-100 font-bold'
                      : 'text-amber-200 hover:bg-amber-900'
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
