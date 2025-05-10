import React, { useState, useEffect } from 'react';
import { db, auth, storage } from '../firebase';
import {
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import { ref, deleteObject, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';

const MyNotes = () => {
  const [notlar, setNotlar] = useState([]);
  const [duzenlenenId, setDuzenlenenId] = useState(null);
  const [duzenlenenDers, setDuzenlenenDers] = useState('');
  const [yeniDosya, setYeniDosya] = useState(null);
  const [silinmisDosya, setSilinmisDosya] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyNotes = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate('/login');
        return;
      }

      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (!userDocSnap.exists()) return;

      const ogrNo = userDocSnap.data().ogrNo;

      const snapshot = await getDocs(query(collection(db, 'notlar'), orderBy('yuklemeTarihi', 'desc')));
      const allNotlar = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const filtreli = allNotlar.filter(not => not.ogrNo === ogrNo);

      setNotlar(filtreli);
    };

    fetchMyNotes();
  }, [navigate]);

  const handleDelete = async (id, dosyaURL) => {
    try {
      if (dosyaURL) {
        const fileRef = ref(storage, decodeURIComponent(new URL(dosyaURL).pathname.split('/o/')[1].split('?')[0]));
        await deleteObject(fileRef);
      }
      await deleteDoc(doc(db, 'notlar', id));
      setNotlar(prev => prev.filter(not => not.id !== id));
    } catch (err) {
      console.error('Silme hatası:', err);
    }
  };

  const handleUpdate = async (not) => {
    try {
      if (!duzenlenenDers.trim()) return alert('Ders adı boş olamaz.');
      if (silinmisDosya && !yeniDosya) return alert('Yeni dosya yüklemeniz gerekiyor.');

      let updatedFields = { ders: duzenlenenDers };

      if (silinmisDosya && yeniDosya) {
        const yeniRef = ref(storage, `notlar/${Date.now()}_${yeniDosya.name}`);
        await uploadBytes(yeniRef, yeniDosya);
        const yeniURL = await getDownloadURL(yeniRef);
        updatedFields.dosyaURL = yeniURL;
      }

      await updateDoc(doc(db, 'notlar', not.id), updatedFields);
      setDuzenlenenId(null);
      setSilinmisDosya(false);
      setYeniDosya(null);
      setNotlar(prev => prev.map(n => (n.id === not.id ? { ...n, ...updatedFields } : n)));
    } catch (err) {
      console.error('Güncelleme hatası:', err);
    }
  };

  const handleDosyaSil = async (url) => {
    try {
      const fileRef = ref(storage, decodeURIComponent(new URL(url).pathname.split('/o/')[1].split('?')[0]));
      await deleteObject(fileRef);
      setSilinmisDosya(true);
    } catch (err) {
      console.error('Dosya silinemedi:', err);
    }
  };

  return (
    <div className="min-h-screen bg-green-100 p-8">
      <h2 className="text-2xl font-semibold mb-6 text-center text-green-800">Yüklediğim Notlar</h2>
      {notlar.length === 0 ? (
        <p className="text-center text-red-600 font-semibold">
          Yüklediğiniz not bulunmamaktadır.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {notlar.map((not) => (
            <div key={not.id} className="bg-white rounded-lg shadow p-4">
              {duzenlenenId === not.id ? (
                <>
                  <input
                    type="text"
                    value={duzenlenenDers}
                    onChange={(e) => setDuzenlenenDers(e.target.value)}
                    className="w-full p-2 mb-2 border rounded"
                  />

                  {!silinmisDosya && not.dosyaURL && (
                    <div className="mb-2">
                      <a href={not.dosyaURL} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                        Mevcut Dosyayı Görüntüle
                      </a>
                      <button
                        onClick={() => handleDosyaSil(not.dosyaURL)}
                        className="ml-2 text-red-600 hover:underline"
                      >
                        Sil
                      </button>
                    </div>
                  )}

                  {silinmisDosya && (
                    <input
                      type="file"
                      onChange={(e) => setYeniDosya(e.target.files[0])}
                      className="w-full mb-2"
                    />
                  )}

                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleUpdate(not)}
                      className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                    >
                      Kaydet
                    </button>
                    <button
                      onClick={() => setDuzenlenenId(null)}
                      className="bg-gray-400 text-white px-4 py-1 rounded hover:bg-gray-500"
                    >
                      İptal
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-bold text-green-700">{not.ders}</h3>
                  <p className="text-sm text-gray-600 mb-2">E-posta: {not.kullaniciEmail}</p>
                  <p className="text-sm text-gray-500 mb-3">
                    Tarih: {new Date(not.yuklemeTarihi.seconds * 1000).toLocaleString()}
                  </p>
                  <a
                    href={not.dosyaURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                  >
                    Dosyayı Görüntüle / İndir
                  </a>
                  <div className="flex justify-between items-center mt-3">
                    <button
                      onClick={() => {
                        setDuzenlenenId(not.id);
                        setDuzenlenenDers(not.ders);
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDelete(not.id, not.dosyaURL)}
                      className="text-red-600 hover:underline"
                    >
                      Sil
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyNotes;
