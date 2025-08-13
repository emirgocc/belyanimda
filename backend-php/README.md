# Belyanimda PHP Backend

Bu proje, Belyanimda Belediye Hizmetleri uygulaması için PHP ile yazılmış backend API'dir. **Web admin panel ve mobil uygulama ile tam uyumlu** olarak tasarlanmıştır.

## 🎯 Uyumluluk

- ✅ **Web Admin Panel**: `http://localhost:5173` (Vite dev server)
- ✅ **Mobile App**: `http://localhost:19006` (Expo dev server)
- ✅ **API Base URL**: `http://localhost:3000` (Web ve mobil uygulamaların beklediği port)

## 🚀 Hızlı Başlangıç

### Windows
```bash
# Batch dosyası ile
start-server.bat

# Veya manuel olarak
php -S 0.0.0.0:3000 -t .
```

### Linux/Mac
```bash
# Shell script ile
chmod +x start-server.sh
./start-server.sh

# Veya manuel olarak
php -S 0.0.0.0:3000 -t .
```

### Composer ile
```bash
composer start
# veya
composer serve
```

## 📱 Uygulama Konfigürasyonları

### Web Admin Panel (`web/src/config/config.js`)
```javascript
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3000', // ✅ PHP Backend
  // ...
};
```

### Mobile App (`mobile/config/api.config.js`)
```javascript
const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:3000', // ✅ PHP Backend
    // ...
  },
  // ...
};
```

## 🔧 Konfigürasyon

### Çevre Değişkenleri
```bash
# Port (varsayılan: 3000)
export PORT=3000

# Environment
export NODE_ENV=development

# Admin bilgileri
export ADMIN_USERNAME=admin
export ADMIN_PASSWORD=admin123

# JWT Secret
export JWT_SECRET=your-super-secret-jwt-key

# CORS Origins
export ALLOWED_ORIGINS=http://localhost:5173,http://localhost:19006
```

### CORS Ayarları
PHP backend otomatik olarak şu origin'leri destekler:
- `http://localhost:5173` (Web Admin Panel)
- `http://localhost:19006` (Mobile App)
- `exp://192.168.1.100:19000` (Expo)
- `http://192.168.203.175:3000` (Local Network)

## 🧪 Test

### 1. Backend Test
```bash
php test.php
```

### 2. API Test
```bash
# Health Check
curl http://localhost:3000/health

# Services
curl http://localhost:3000/api/services

# Mobile Data
curl http://localhost:3000/mobile/data
```

### 3. Admin Girişi
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

## 📁 Dosya Yapısı

```
backend-php/
├── index.php              # Ana giriş noktası
├── start-server.php       # PHP server başlatma scripti
├── start-server.bat       # Windows batch dosyası
├── start-server.sh        # Linux/Mac shell script
├── config/
│   └── config.php         # Konfigürasyon
├── classes/               # PHP sınıfları
├── database/
│   └── data/             # JSON veri dosyaları
├── composer.json          # Composer konfigürasyonu
└── README.md             # Bu dosya
```

## 🔄 Mevcut Uygulamalarla Entegrasyon

### Web Admin Panel
1. PHP backend'i başlat: `php -S 0.0.0.0:3000 -t .`
2. Web uygulamasını başlat: `npm run dev`
3. Tarayıcıda `http://localhost:5173` aç
4. Admin girişi yap: `admin` / `admin123`

### Mobile App
1. PHP backend'i başlat: `php -S 0.0.0.0:3000 -t .`
2. Mobile uygulamasını başlat: `expo start`
3. QR kodu tarayıcıda aç veya emülatörde çalıştır

## 🚨 Sorun Giderme

### Port 3000 Kullanımda
```bash
# Port kullanımını kontrol et
netstat -an | findstr :3000  # Windows
lsof -i :3000                # Linux/Mac

# Farklı port kullan
export PORT=3001
php -S 0.0.0.0:3001 -t .
```

### CORS Hatası
- Backend'in `0.0.0.0:3000` adresinde çalıştığından emin ol
- Web uygulamasının `localhost:5173` adresinde çalıştığından emin ol
- Mobile uygulamanın doğru IP adresini kullandığından emin ol

### Database Hatası
```bash
# Database klasörü izinlerini kontrol et
chmod 755 database/data  # Linux/Mac
```

## 📋 API Endpoint'leri

| Endpoint | Method | Açıklama | Auth |
|----------|--------|----------|------|
| `/health` | GET | Sağlık kontrolü | ❌ |
| `/api/auth/login` | POST | Admin girişi | ❌ |
| `/api/auth/verify` | GET | Token doğrulama | ✅ |
| `/api/services` | GET | Tüm hizmetleri listele | ❌ |
| `/api/services` | POST | Yeni hizmet oluştur | ✅ |
| `/api/services/{id}` | GET | Hizmet detayı | ❌ |
| `/api/services/{id}` | PUT | Hizmet güncelle | ✅ |
| `/api/services/{id}` | DELETE | Hizmet sil (kalıcı) | ✅ |
| `/api/services/{id}/toggle` | PUT | Hizmet aktif/pasif yap | ✅ |
| `/api/services/{id}/soft-delete` | PUT | Hizmet yumuşak sil | ✅ |
| `/api/services/{id}/restore` | PUT | Silinen hizmeti geri yükle | ✅ |
| `/api/services/active` | GET | Sadece aktif hizmetler | ❌ |
| `/api/services/deleted` | GET | Silinen hizmetler | ✅ |
| `/api/services/reorder/batch` | PUT | Hizmetleri sırala | ✅ |
| `/api/notifications` | GET | Tüm bildirimleri listele | ❌ |
| `/api/notifications` | POST | Yeni bildirim oluştur | ✅ |
| `/api/notifications/{id}` | GET | Bildirim detayı | ❌ |
| `/api/notifications/{id}` | DELETE | Bildirim sil | ✅ |
| `/mobile/data` | GET | Mobil uygulama için optimize edilmiş veri | ❌ |

## 🎉 Başarı!

PHP backend başarıyla çalışıyor ve mevcut web/mobil uygulamalarla tam uyumlu! 

- 🌐 **Web Admin Panel**: `http://localhost:5173`
- 📱 **Mobile App**: Expo ile çalışıyor
- 🔗 **API Backend**: `http://localhost:3000`
- 🔐 **Admin Giriş**: `admin` / `admin123`
