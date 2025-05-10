import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
} from 'firebase/firestore';
import YorumForm from '../components/YorumForm';
import YorumList from '../components/YorumList';

const NotList = () => {
  const [notlar, setNotlar] = useState([]);
  const [filtreliNotlar, setFiltreliNotlar] = useState([]);
  const [seciliDers, setSeciliDers] = useState('Tümü');
  const [dersler, setDersler] = useState([]);
  const [refreshFlags, setRefreshFlags] = useState({});

  const getAveragePuan = async (notId) => {
    const q = query(collection(db, 'yorumlar'), where('notId', '==', notId));
    const snapshot = await getDocs(q);
    const yorumlar = snapshot.docs.map(doc => doc.data());
    if (yorumlar.length === 0) return 0;
    const toplam = yorumlar.reduce((sum, y) => sum + y.puan, 0);
    return toplam / yorumlar.length;
  };

  useEffect(() => {
    const fetchNotlar = async () => {
      try {
        const notlarRef = collection(db, 'notlar');
        const q = query(notlarRef, orderBy('yuklemeTarihi', 'desc'));
        const querySnapshot = await getDocs(q);

        const notListesi = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const data = doc.data();
            const avg = await getAveragePuan(doc.id);
            return {
              id: doc.id,
              ...data,
              ortalamaPuan: avg,
            };
          })
        );

        const sortedList = [...notListesi].sort((a, b) => b.ortalamaPuan - a.ortalamaPuan);

        setNotlar(sortedList);
        setFiltreliNotlar(sortedList);

        const dersAdlari = Array.from(new Set(notListesi.map(not => not.ders)));
        setDersler(dersAdlari);
      } catch (error) {
        console.error('Notları çekerken hata:', error);
      }
    };

    fetchNotlar();
  }, []);

  const handleFilterChange = (e) => {
    const ders = e.target.value;
    setSeciliDers(ders);
    if (ders === 'Tümü') {
      setFiltreliNotlar(notlar);
    } else {
      const filtre = notlar.filter(not => not.ders === ders);
      setFiltreliNotlar(filtre);
    }
  };

  const handleYorumEklendi = (notId) => {
    setRefreshFlags(prev => ({ ...prev, [notId]: !prev[notId] }));
  };

  return (
    <div className="min-h-screen bg-green-100 p-8">
      <h2 className="text-2xl font-semibold mb-6 text-center text-green-800">Yüklenen Notlar</h2>

      <div className="max-w-md mx-auto mb-6">
        <select
          value={seciliDers}
          onChange={handleFilterChange}
          className="w-full p-2 rounded border border-green-400"
        >
          <option value="Tümü">Tüm Dersler</option>
          {dersler.map((ders, i) => (
            <option key={i} value={ders}>{ders}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtreliNotlar.map((not) => (
          <div key={not.id} className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-bold text-green-700">{not.ders}</h3>
            <p className="text-sm text-gray-600 mb-1">
              Yükleyen: <span className="font-medium">{not.adSoyad || not.kullaniciEmail}</span>
            </p>
            {not.ortalamaPuan > 0 && (
              <p className="text-yellow-600 text-sm mb-1">
                Ortalama Puan: {not.ortalamaPuan.toFixed(1)} ⭐
              </p>
            )}
            <p className="text-sm text-gray-500 mb-3">
              Tarih: {new Date(not.yuklemeTarihi.seconds * 1000).toLocaleString()}
            </p>
            <a
              href={not.dosyaURL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition mb-4"
            >
              Dosyayı Görüntüle / İndir
            </a>
            <YorumForm notId={not.id} onYorumEklendi={() => handleYorumEklendi(not.id)} />
            <YorumList notId={not.id} refresh={refreshFlags[not.id]} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotList;
