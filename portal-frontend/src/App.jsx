import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout.jsx';
import { LandingPage } from './pages/LandingPage.jsx';
import { TeamPage } from './pages/TeamPage.jsx';
import { PlayPage } from './pages/PlayPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/"            element={<LandingPage />} />
        <Route path="/team"        element={<TeamPage />} />
        <Route path="/play/:slug"  element={<PlayPage />} />
        <Route path="*"            element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
