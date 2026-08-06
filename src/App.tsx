import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { StoryModePage } from './pages/StoryModePage';
import { CharacterExplorerPage } from './pages/CharacterExplorerPage';
import { EventExplorerPage } from './pages/EventExplorerPage';
import { TimelinePage } from './pages/TimelinePage';
import { KingdomsMapPage } from './pages/KingdomsMapPage';
import { AskGuidePage } from './pages/AskGuidePage';
import { MyProgressPage } from './pages/MyProgressPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-stone-950 text-amber-100 flex flex-col font-sans selection:bg-amber-500 selection:text-amber-950">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/story" element={<StoryModePage />} />
            <Route path="/characters" element={<CharacterExplorerPage />} />
            <Route path="/events" element={<EventExplorerPage />} />
            <Route path="/timeline" element={<TimelinePage />} />
            <Route path="/kingdoms" element={<KingdomsMapPage />} />
            <Route path="/ask" element={<AskGuidePage />} />
            <Route path="/progress" element={<MyProgressPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
