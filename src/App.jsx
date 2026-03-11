import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import StudySection from './pages/StudySection';
import Explore from './pages/Explore';
import EntryScreen from './components/EntryScreen';
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
import About from './pages/About';
import Pricing from './pages/Pricing';
import Payment from './pages/Payment';

// A wrapper component to access the current location
const AppLayout = () => {
  const location = useLocation();
  const isAdminPage = /^\/admin/i.test(location.pathname);

  useEffect(() => {
    const handleViewportChange = () => {
      if (window.innerWidth <= 768) {
        const activeElem = document.activeElement;
        const isInputFocused = activeElem && (activeElem.tagName === 'INPUT' || activeElem.tagName === 'TEXTAREA');
        if (isInputFocused) {
          document.body.classList.add('keyboard-open');
        } else {
          document.body.classList.remove('keyboard-open');
        }
      } else {
        document.body.classList.remove('keyboard-open');
      }
    };

    window.addEventListener('resize', handleViewportChange);
    document.addEventListener('focusin', handleViewportChange);
    document.addEventListener('focusout', handleViewportChange);

    return () => {
      window.removeEventListener('resize', handleViewportChange);
      document.removeEventListener('focusin', handleViewportChange);
      document.removeEventListener('focusout', handleViewportChange);
    };
  }, []);

  // ── Scroll to top on every page navigation ──
  // Chat is excluded: it uses a fixed inner scroll container, not window scroll.
  useEffect(() => {
    if (location.pathname !== '/chat') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [location.pathname]);


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
          <Route path="/about" element={<About />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/settings/theme" element={<Appearance />} />
          <Route path="/settings/password" element={<Security />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/payment" element={<Payment />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  const [showEntry, setShowEntry] = React.useState(true);

  return (
    <Router>
      {showEntry ? (
        <EntryScreen onComplete={() => setShowEntry(false)} />
      ) : (
        <AppLayout />
      )}
    </Router>
  );
}

export default App;
