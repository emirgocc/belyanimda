# Backend Bağlantı Rehberi

Bu rehber, mobil uygulamayı backend'e nasıl bağlayacağınızı açıklar.

## 🚀 Hızlı Başlangıç

### 1. Backend'i Başlatın

```bash
cd backend
npm install
npm run dev
```

Backend varsayılan olarak `http://localhost:3000` adresinde çalışacaktır.

### 2. Mobil Uygulamayı Başlatın

```bash
cd mobile
npm install
npm start
```

## 🔧 Konfigürasyon

### API Konfigürasyonu

`mobile/config/api.config.js` dosyasında farklı ortamlar için ayarlar bulunur:

```javascript
const CURRENT_ENV = 'localNetwork'; // 'development', 'production', 'localNetwork'
```

#### Geliştirme Ortamı (Development)
- **URL**: `http://localhost:3000`
- **Timeout**: 10 saniye
- **Retry**: 3 deneme

#### Yerel Ağ (Local Network)
- **URL**: `http://192.168.203.175:3000` (IP adresinizi güncelleyin)
- **Timeout**: 10 saniye
- **Retry**: 3 deneme

#### Üretim Ortamı (Production)
- **URL**: `https://your-production-api.com` (gerçek URL'yi güncelleyin)
- **Timeout**: 15 saniye
- **Retry**: 2 deneme

## 📱 Mobil Uygulama Özellikleri

### Veri Yükleme
- **Efficient Loading**: `/mobile/data` endpoint'i ile tek seferde tüm veriler yüklenir
- **Fallback**: Ana endpoint başarısız olursa ayrı ayrı servis çağrıları yapılır
- **Retry Logic**: Sunucu hatalarında otomatik yeniden deneme

### Hata Yönetimi
- Ağ hatalarında kullanıcı dostu mesajlar
- Detaylı console logları

## 🔍 Test Etme

### 1. Backend Sağlık Kontrolü
```bash
curl http://localhost:3000/health
```

### 2. Mobil Veri Endpoint'i
```bash
curl http://localhost:3000/mobile/data
```

### 3. Servisler
```bash
curl http://localhost:3000/api/services
```

### 4. Bildirimler
```bash
curl http://localhost:3000/api/notifications
```

## 🐛 Sorun Giderme

### Bağlantı Hatası
1. Backend'in çalıştığından emin olun
2. Port 3000'in açık olduğunu kontrol edin
3. Firewall ayarlarını kontrol edin
4. `mobile/config/api.config.js` dosyasındaki URL'yi kontrol edin

### CORS Hatası
Backend'de CORS ayarları zaten yapılandırılmıştır:
- `http://localhost:5173` (Web)
- `http://localhost:19006` (Expo)
- `exp://192.168.1.100:19000` (Expo Go)

### Veri Yapısı Hatası
Backend ve mobil uygulama arasındaki veri yapısı uyumludur:

#### Servisler
```javascript
{
  id: "string",
  name: "string",
  icon: "string (URL)",
  url: "string (URL)",
  active: "boolean",
  order: "number"
}
```

#### Bildirimler
```javascript
{
  id: "string",
  title: "string",
  description: "string",
  url: "string (URL) | null",
  createdAt: "string (ISO date)"
}
```

## 📱 Fiziksel Cihazda Test

1. Bilgisayarınızın IP adresini öğrenin:
   ```bash
   # Windows
   ipconfig
   
   # macOS/Linux
   ifconfig
   ```

2. `mobile/config/api.config.js` dosyasında `localNetwork` URL'sini güncelleyin:
   ```javascript
   localNetwork: {
     baseURL: 'http://YOUR_IP_ADDRESS:3000',
     // ...
   }
   ```

3. Ortamı değiştirin:
   ```javascript
   const CURRENT_ENV = 'localNetwork';
   ```

4. Mobil uygulamayı yeniden başlatın

## 🔄 Güncellemeler

### Backend Güncellemeleri
- Yeni endpoint'ler ekleyin
- Veri yapısını güncelleyin
- CORS ayarlarını kontrol edin

### Mobil Uygulama Güncellemeleri
- API servislerini güncelleyin
- Veri yapısı mapping'lerini kontrol edin
- Hata yönetimini güncelleyin

## 📚 Ek Kaynaklar

- [Backend API Documentation](./../backend/README.md)
- [Mobile App Structure](./README.md)
- [Expo Networking Guide](https://docs.expo.dev/guides/networking/)
- [React Native Network Security](https://reactnative.dev/docs/network-security)
