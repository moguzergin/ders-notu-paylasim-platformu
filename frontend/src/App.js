import React from 'react';
import NotUpload from './pages/NotUpload';
import NotList from './pages/NotList';
import MyNotes from './pages/MyNotes';
import Navbar from './components/Navbar';
import HesapAyarlari from './pages/HesapAyarlari';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginRegister from './pages/LoginRegister';

function App() {
  return (
    <Router>
      <Navbar /> {/* 🟦 Tüm sayfalarda üstte görünecek */}
      <Routes>
        <Route path="/" element={<Navigate to="/notlar" replace />} /> {/* ✅ Ana sayfa yönlendirmesi */}
        <Route path="/login" element={<LoginRegister />} />
        <Route path="/upload" element={<NotUpload />} />
        <Route path="/notlar" element={<NotList />} />
        <Route path="/benim-notlarim" element={<MyNotes />} />
        <Route path="/hesap-ayarlari" element={<HesapAyarlari />} />
      </Routes>
    </Router>
  );
}

export default App;
