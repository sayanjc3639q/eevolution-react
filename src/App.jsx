import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import StudySection from './pages/StudySection';
import Explore from './pages/Explore';
import './App.css';

import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Appearance from './pages/Appearance';
import Security from './pages/Security';
import Routine from './pages/Routine';
import Holidays from './pages/Holidays';
import Donators from './pages/Donators';
import Contributors from './pages/Contributors';
import Admin from './pages/Admin';
import Notices from './pages/Notices';
import Events from './pages/Events';
import WhatsAppLinks from './pages/WhatsAppLinks';
import Syllabus from './pages/Syllabus';
import Memories from './pages/Memories';
import Chat from './pages/Chat';
import Support from './pages/Support';
import MAR from './pages/MAR';
import MOOCS from './pages/MOOCS';

// A wrapper component to access the current location
const AppLayout = () => {
  const location = useLocation();
  const isAdminPage = /^\/admin/i.test(location.pathname);

  return (
    <div className="app-container">
      {!isAdminPage && <Navbar />}
      <main className={`content-wrapper ${isAdminPage ? 'admin-mode' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/study" element={<StudySection />} />
          <Route path="/study/:categoryId" element={<StudySection />} />
          <Route path="/study/:categoryId/:subjectId" element={<StudySection />} />
          <Route path="/study/:categoryId/:subjectId/:chapterId" element={<StudySection />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/routine" element={<Routine />} />
          <Route path="/holidays" element={<Holidays />} />
          <Route path="/donators" element={<Donators />} />
          <Route path="/contributors" element={<Contributors />} />
          <Route path="/notices" element={<Notices />} />
          <Route path="/events" element={<Events />} />
          <Route path="/whatsapp-links" element={<WhatsAppLinks />} />
          <Route path="/syllabus" element={<Syllabus />} />
          <Route path="/memories" element={<Memories />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/support" element={<Support />} />
          <Route path="/tracker/mar" element={<MAR />} />
          <Route path="/tracker/moocs" element={<MOOCS />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/settings/theme" element={<Appearance />} />
          <Route path="/settings/password" element={<Security />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
