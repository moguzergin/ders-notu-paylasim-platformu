import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const YorumForm = ({ notId, onYorumEklendi }) => {
  const [yorum, setYorum] = useState('');
  const [puan, setPuan] = useState(0);
  const [mesaj, setMesaj] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMesaj('');

    try {
      const user = auth.currentUser;
      if (!user) {
        setMesaj('Yorum yapmak için giriş yapmalısınız.');
        return;
      }

      if (!yorum.trim() || puan === 0) {
        setMesaj('Yorum ve puan zorunludur.');
        return;
      }

      await addDoc(collection(db, 'yorumlar'), {
        notId,
        kullaniciEmail: user.email,
        yorum,
        puan,
        tarih: Timestamp.now(),
      });

      setYorum('');
      setPuan(0);
      setMesaj('Yorum başarıyla eklendi.');
      if (onYorumEklendi) onYorumEklendi(); // yorumlar güncellensin
    } catch (err) {
      console.error('Yorum eklenemedi:', err);
      setMesaj('Yorum eklenirken hata oluştu.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 bg-green-50 p-3 rounded shadow">
      <label className="block mb-1 text-sm font-medium">Yorumunuz:</label>
      <textarea
        value={yorum}
        onChange={(e) => setYorum(e.target.value)}
        className="w-full p-2 border rounded mb-2"
        required
      />

      <label className="block mb-1 text-sm font-medium">Puan:</label>
      <select
        value={puan}
        onChange={(e) => setPuan(Number(e.target.value))}
        className="w-full p-2 border rounded mb-2"
        required
      >
        <option value={0}>Seçiniz</option>
        {[1, 2, 3, 4, 5].map((sayi) => (
          <option key={sayi} value={sayi}>{sayi} Yıldız</option>
        ))}
      </select>

      <button
        type="submit"
        className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition"
      >
        Yorum Yap
      </button>

      {mesaj && <p className="mt-2 text-sm text-green-700">{mesaj}</p>}
    </form>
  );
};

export default YorumForm;
