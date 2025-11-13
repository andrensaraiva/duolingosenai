import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import { AppDataProvider, useAppData } from './context/AppDataContext'
import AcademyPage from './pages/AcademyPage'
import ArenaPage from './pages/ArenaPage'
import ChallengePage from './pages/ChallengePage'
import LessonPage from './pages/LessonPage'
import './App.css'

function AppShell() {
  const { toast } = useAppData()
  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<AcademyPage />} />
        <Route path="/lesson/:lessonId" element={<LessonPage />} />
        <Route path="/arena" element={<ArenaPage />} />
        <Route path="/arena/:challengeId" element={<ChallengePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BottomNav />
      {toast && <div className={`toast ${toast.tone}`}>{toast.message}</div>}
    </div>
  )
}

export default function App() {
  return (
    <AppDataProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AppDataProvider>
  )
}
