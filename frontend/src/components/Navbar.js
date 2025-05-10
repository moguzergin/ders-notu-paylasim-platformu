import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import logo from '../assets/logo.png';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (u) => {
      setUser(u);

      if (u) {
        try {
          const docRef = doc(db, 'users', u.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserInfo(docSnap.data());
          }
        } catch (err) {
          console.error('Kullanıcı bilgisi alınamadı:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Çıkış sırasında hata:', error);
    }
  };

  if (!user) return null;

  return (
    <nav className="bg-green-700 text-white p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Sol: Logo + Başlık */}
        <div className="flex items-center space-x-3">
          <img src={logo} alt="Logo" className="w-8 h-8 rounded-full" />
          <h1 className="font-bold text-xl">Ders Notu Platformu</h1>
        </div>

        {/* Orta: Sayfa Linkleri */}
        <div className="space-x-4">
          <Link to="/upload" className="hover:text-yellow-200 transition">Not Yükle</Link>
          <Link to="/notlar" className="hover:text-yellow-200 transition">Tüm Notlar</Link>
          <Link to="/benim-notlarim" className="hover:text-yellow-200 transition">Benim Notlarım</Link>
        </div>

        {/* Sağ: Kullanıcı Dropdown */}
<div className="relative">
  <button
    onClick={() => setShowDropdown(!showDropdown)}
    className="flex items-center space-x-2 hover:text-yellow-200 transition"
  >
    <div className="w-8 h-8 bg-white text-green-700 font-bold rounded-full flex items-center justify-center">
      {userInfo?.adSoyad?.charAt(0).toUpperCase() || '?'}
    </div>
    <span>
      {userInfo?.adSoyad || 'Kullanıcı'}
    </span>
  </button>

  {showDropdown && (
    <div className="absolute right-0 mt-2 w-40 bg-white text-green-700 rounded shadow z-50">
      <button
        onClick={() => {
          setShowDropdown(false);
          navigate('/hesap-ayarlari');
        }}
        className="w-full text-left px-4 py-2 hover:bg-green-100"
      >
        Hesap Ayarları
      </button>
      <button
        onClick={handleLogout}
        className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
      >
        Çıkış Yap
      </button>
    </div>
  )}
</div>


      </div>
    </nav>
  );
};

export default Navbar;
