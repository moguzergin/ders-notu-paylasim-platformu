import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const HesapAyarlari = () => {
  const [adSoyad, setAdSoyad] = useState('');
  const [ogrNo, setOgrNo] = useState('');
  const [bolum, setBolum] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchKullaniciBilgi = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate('/login');
        return;
      }

      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setAdSoyad(data.adSoyad || '');
        setOgrNo(data.ogrNo || '');
        setBolum(data.bolum || '');
      }
    };

    fetchKullaniciBilgi();
  }, [navigate]);

  const handleGuncelle = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    try {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, {
        adSoyad,
        ogrNo,
        bolum,
      });

      // Kullanıcının notlarındaki adSoyad bilgisini güncelle
      const q = query(collection(db, 'notlar'), where('ogrNo', '==', ogrNo));
      const querySnapshot = await getDocs(q);
      const updatePromises = querySnapshot.docs.map((notDoc) =>
        updateDoc(doc(db, 'notlar', notDoc.id), {
          adSoyad,
        })
      );
      await Promise.all(updatePromises);

      setMessage('Bilgiler başarıyla güncellendi.');
    } catch (err) {
      console.error('Güncelleme hatası:', err);
      setMessage('Hata oluştu. Tekrar deneyin.');
    }
  };

  return (
    <div className="min-h-screen bg-green-100 flex justify-center items-center p-6">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-green-700 text-center">Hesap Ayarları</h2>
        <form onSubmit={handleGuncelle} className="space-y-4">
          <input
            type="text"
            placeholder="Ad Soyad"
            value={adSoyad}
            onChange={(e) => setAdSoyad(e.target.value)}
            className="w-full p-3 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Öğrenci Numarası"
            value={ogrNo}
            onChange={(e) => setOgrNo(e.target.value)}
            className="w-full p-3 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Bölüm / Fakülte"
            value={bolum}
            onChange={(e) => setBolum(e.target.value)}
            className="w-full p-3 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Güncelle
          </button>
        </form>
        {message && <p className="mt-4 text-center text-green-700">{message}</p>}
      </div>
    </div>
  );
};

export default HesapAyarlari;
