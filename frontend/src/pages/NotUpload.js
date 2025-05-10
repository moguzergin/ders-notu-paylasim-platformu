import React, { useState, useEffect } from 'react';
import { storage, db, auth } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, Timestamp, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const NotUpload = () => {
  const [ders, setDers] = useState('');
  const [dosya, setDosya] = useState(null);
  const [mesaj, setMesaj] = useState('');
  const [kullaniciBilgi, setKullaniciBilgi] = useState(null);
  const navigate = useNavigate();

  // Kullanıcı giriş ve bilgilerini kontrol et
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        navigate('/login');
        return;
      }

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setKullaniciBilgi(userDoc.data());
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleUpload = async (e) => {
    e.preventDefault();
    setMesaj('');

    if (!ders || !dosya) {
      setMesaj('Lütfen tüm alanları doldurun.');
      return;
    }

    try {
      const user = auth.currentUser;
      const dosyaAdi = `${Date.now()}_${dosya.name}`;
      const storageRef = ref(storage, `notlar/${dosyaAdi}`);

      // Firebase Storage'a yükleme
      await uploadBytes(storageRef, dosya);

      // Dosya URL'sini al
      const downloadURL = await getDownloadURL(storageRef);

      // Firestore'a kayıt ekle
      await addDoc(collection(db, 'notlar'), {
        ders,
        dosyaURL: downloadURL,
        kullaniciEmail: user.email,
        yuklemeTarihi: Timestamp.now(),
        adSoyad: kullaniciBilgi?.adSoyad || '',
        ogrNo: kullaniciBilgi?.ogrNo || '',
        bolum: kullaniciBilgi?.bolum || '',
      });

      setMesaj('Dosya başarıyla yüklendi!');
      setDers('');
      setDosya(null);
    } catch (err) {
      console.error(err);
      setMesaj('Yükleme sırasında hata oluştu.');
    }
  };

  return (
    <div className="min-h-screen bg-green-100 flex justify-center items-center p-6">
      <form onSubmit={handleUpload} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-green-700">Not Yükle</h2>

        <label className="block mb-2 text-sm font-medium text-gray-700">Ders Adı:</label>
        <input
          type="text"
          value={ders}
          onChange={(e) => setDers(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          placeholder="Örnek: Veri Yapıları"
        />

        <label className="block mb-2 text-sm font-medium text-gray-700">Dosya:</label>
        <input
          type="file"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          onChange={(e) => setDosya(e.target.files[0])}
          className="w-full mb-4 p-2 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Yükle
        </button>

        {mesaj && (
          <p className="mt-4 text-center text-green-700 bg-green-100 border border-green-300 p-2 rounded">
            {mesaj}
          </p>
        )}
      </form>
    </div>
  );
};

export default NotUpload;
