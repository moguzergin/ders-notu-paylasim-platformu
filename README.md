# 📚 Ders Notu Paylaşım Platformu

Bu proje, öğrencilerin kendi ders notlarını kolayca yükleyip paylaşabileceği, yorumlayabileceği ve puanlayabileceği web tabanlı bir sistemdir. Kullanıcı dostu arayüzü ve bulut tabanlı teknolojileri sayesinde hem katkı sağlamak hem de akademik kaynaklara erişmek çok daha kolay hale gelir.

---

## 🚀 Özellikler

- 🔐 Kullanıcı kayıt ve giriş sistemi (Firebase Authentication)
- 📤 Ders notu yükleme (PDF, Word, Görsel)
- 🗃 Notları kategoriye göre filtreleme
- 📝 Yorum yapma ve 1-5 yıldız arasında puan verme
- 🧾 Kendi yüklenen notları listeleme, düzenleme ve silme
- 🌐 AWS S3 üzerinden canlı olarak yayında
- 🎨 Tailwind CSS ile modern ve responsive tasarım

---

## 🌍 Canlı Demo

👉 [Uygulamayı Görüntüle](http://ders-notlari-platformu.s3-website.eu-north-1.amazonaws.com/)

---

## 🧰 Kullanılan Teknolojiler

- **React.js** – Frontend framework
- **Firebase Authentication** – Kullanıcı yönetimi
- **Firebase Firestore** – Veritabanı
- **Firebase Storage** – Dosya barındırma
- **Tailwind CSS** – Tasarım ve stillendirme
- **AWS S3** – Statik web barındırma

---

## 🔧 Kurulum (Geliştirici Modu)

1. Bu repoyu klonla:
   ```bash
   git clone https://github.com/moguzergin/ders-notlari-platformu.git
   cd ders-notlari-platformu/frontend
   ```

2. Bağımlılıkları yükle:
   ```bash
   npm install
   ```

3. Uygulamayı başlat:
   ```bash
   npm start
   ```

---

## 📦 Build ve Yayınlama

1. Build işlemi:
   ```bash
   npm run build
   ```

2. Oluşan `build/` klasörü içeriğini AWS S3’e yükle ve **statik barındırma** ayarlarını yap.

---

## 📁 Proje Yapısı

```
frontend/
├── src/
│   ├── pages/
│   ├── components/
│   └── App.js
├── public/
│   └── index.html
├── .gitignore
├── package.json
```

---

## ✍️ Katkıda Bulunma

Pull request'lere ve katkılara her zaman açığız. Lütfen önce bir issue oluşturun ve hangi geliştirme üzerinde çalıştığınızı belirtin.

---

## 📝 Lisans

Bu proje eğitim amaçlıdır. Herhangi bir ticari kullanım için izin alınması gereklidir.
