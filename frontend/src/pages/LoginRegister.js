import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adSoyad, setAdSoyad] = useState('');
  const [ogrNo, setOgrNo] = useState('');
  const [bolum, setBolum] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Giriş yapılmışsa login sayfasına erişilmesini engelle
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate('/upload');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        setMessage('Giriş başarılı!');
        navigate('/upload');
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, 'users', user.uid), {
          adSoyad,
          ogrNo,
          bolum,
          email,
        });

        setMessage('Kayıt başarılı, şimdi giriş yapabilirsiniz.');
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-md p-8">
        <div className="flex justify-around mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`px-4 py-2 rounded-t-md font-semibold ${
              isLogin ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500'
            }`}
          >
            Giriş Yap
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`px-4 py-2 rounded-t-md font-semibold ${
              !isLogin ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500'
            }`}
          >
            Kayıt Ol
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Ad Soyad"
                className="w-full p-3 border border-gray-300 rounded-md"
                value={adSoyad}
                onChange={(e) => setAdSoyad(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Öğrenci Numarası"
                className="w-full p-3 border border-gray-300 rounded-md"
                value={ogrNo}
                onChange={(e) => setOgrNo(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Bölüm / Fakülte"
                className="w-full p-3 border border-gray-300 rounded-md"
                value={bolum}
                onChange={(e) => setBolum(e.target.value)}
                required
              />
            </>
          )}

          <input
            type="email"
            placeholder="E-posta"
            className="w-full p-3 border border-gray-300 rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Şifre"
            className="w-full p-3 border border-gray-300 rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
          </button>
        </form>

        {error && <p className="mt-4 bg-red-100 text-red-700 p-2 rounded">{error}</p>}
        {message && <p className="mt-4 bg-green-100 text-green-700 p-2 rounded">{message}</p>}
      </div>
    </div>
  );
};

export default LoginRegister;
