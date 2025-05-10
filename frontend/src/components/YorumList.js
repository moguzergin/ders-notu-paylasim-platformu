import React, { useEffect, useState, useCallback } from 'react';
import { db, auth } from '../firebase';
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  deleteDoc,
  doc,
  getDoc,
} from 'firebase/firestore';

const YorumList = ({ notId, refresh }) => {
  const [yorumlar, setYorumlar] = useState([]);
  const [ortalama, setOrtalama] = useState(null);
  const user = auth.currentUser;

  const fetchYorumlar = useCallback(async () => {
    try {
      const q = query(
        collection(db, 'yorumlar'),
        where('notId', '==', notId),
        orderBy('tarih', 'desc')
      );
      const querySnapshot = await getDocs(q);

      const yorumList = await Promise.all(
        querySnapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();

          // Kullanıcı bilgisi getir
          const kullaniciEmail = data.kullaniciEmail;
          let adSoyad = kullaniciEmail;

          const usersSnapshot = await getDocs(
            query(collection(db, 'users'), where('email', '==', kullaniciEmail))
          );

          if (!usersSnapshot.empty) {
            adSoyad = usersSnapshot.docs[0].data().adSoyad || kullaniciEmail;
          }

          return {
            id: docSnap.id,
            ...data,
            adSoyad,
          };
        })
      );

      setYorumlar(yorumList);

      if (yorumList.length > 0) {
        const toplam = yorumList.reduce((acc, y) => acc + y.puan, 0);
        setOrtalama((toplam / yorumList.length).toFixed(1));
      } else {
        setOrtalama(null);
      }
    } catch (err) {
      console.error('Yorumlar alınamadı:', err);
    }
  }, [notId]);

  useEffect(() => {
    fetchYorumlar();
  }, [fetchYorumlar, refresh]);

  const handleYorumSil = async (yorumId) => {
    try {
      await deleteDoc(doc(db, 'yorumlar', yorumId));
      setYorumlar((prev) => prev.filter((y) => y.id !== yorumId));
    } catch (err) {
      console.error('Yorum silinirken hata:', err);
    }
  };

  return (
    <div className="mt-4 bg-green-50 p-3 rounded shadow text-sm">
      <h4 className="font-semibold mb-2 text-green-700">Yorumlar</h4>

      {ortalama !== null && (
        <p className="mb-2 text-green-800">Ortalama Puan: ⭐ {ortalama} / 5</p>
      )}

      {yorumlar.length === 0 ? (
        <p className="text-gray-500">Henüz yorum yapılmamış.</p>
      ) : (
        yorumlar.map((y) => (
          <div key={y.id} className="mb-3 border-b border-gray-200 pb-2">
            <p className="text-gray-800 font-medium">{y.adSoyad}</p>
            <p className="text-gray-600">{y.yorum}</p>
            <p className="text-yellow-700">Puan: {y.puan} ⭐</p>
            {user && user.email === y.kullaniciEmail && (
              <button
                onClick={() => handleYorumSil(y.id)}
                className="mt-1 text-red-600 hover:underline text-xs"
              >
                Yorumu Sil
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default YorumList;
