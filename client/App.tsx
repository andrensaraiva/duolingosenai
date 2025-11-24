import React from 'react';
import { HashRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AppDataProvider } from './contexts/AppDataContext';
import BottomNav from './components/layout/BottomNav';
import PlayerHud from './components/layout/PlayerHud';
import AcademyPage from './pages/AcademyPage';
import LessonPage from './pages/LessonPage';
import ArenaPage from './pages/ArenaPage';
import ChallengePage from './pages/ChallengePage';
import MissionsPage from './pages/MissionsPage';
import ProfilePage from './pages/ProfilePage';

const MainLayout = () => (
  <>
    <PlayerHud />
    <Outlet />
    <BottomNav />
  </>
);

const App = () => {
  return (
    <AppDataProvider>
      <HashRouter>
        <div className="antialiased text-slate-900 bg-white min-h-screen">
          <Routes>
            {/* Main Routes with Navigation */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<AcademyPage />} />
              <Route path="/arena" element={<ArenaPage />} />
              <Route path="/missions" element={<MissionsPage />} />
            </Route>

            {/* Fullscreen Routes (No Nav) */}
            <Route path="/lesson/:lessonId" element={<LessonPage />} />
            <Route path="/challenge/:id" element={<ChallengePage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </div>
      </HashRouter>
    </AppDataProvider>
  );
};

export default App;