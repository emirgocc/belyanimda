# Belyanımda Mobil Uygulaması

React Native (Expo) ile geliştirilmiş mobil uygulama.

## Özellikler

- **Ana Sayfa**: Hizmetleri grid formatında görüntüleme
- **Bildirimler**: Sistem bildirimlerini listeleme
- **Navigation**: Alt sekme navigation (Home ve Bildirimler)
- **API Entegrasyonu**: Backend ile axios üzerinden iletişim

## Kurulum

1. Dependencies yükleyin:
```bash
cd mobile
npm install
```

2. Expo CLI'yi yükleyin (gerekiyorsa):
```bash
npm install -g @expo/cli
```

3. Uygulamayı başlatın:
```bash
npx expo start
```

## Gereksinimler

- Node.js (16+ önerilir)
- Expo CLI
- iOS Simulator veya Android Emulator (ya da fiziksel cihaz)

## Proje Yapısı

```
mobile/
├── App.js                     # Ana uygulama dosyası
├── assets/                    # Görsel varlıklar
│   ├── logo-instructions.txt  # Logo dosyası talimatları
│   └── README.md             # Assets açıklaması
├── navigation/
│   └── BottomTabNavigator.js  # Alt sekme navigation
├── screens/
│   ├── HomeScreen.js         # Ana sayfa - hizmetler grid
│   └── NotificationsScreen.js # Bildirimler sayfası
└── services/
    └── api.js                # API servis katmanı
```

## API Konfigürasyonu

`services/api.js` dosyasında API base URL'ini güncelleyin:

```javascript
const API_BASE_URL = 'http://localhost:3001'; // Backend adresinizi girin
```

### API Endpoints

- `GET /services` - Hizmetleri getirir
- `GET /notifications` - Bildirimleri getirir

## Assets

`assets/` klasörüne aşağıdaki dosyaları eklemeyi unutmayın:

- `logo.png` - Ana logo (32x32 px)
- `icon.png` - Uygulama ikonu (1024x1024 px)
- `adaptive-icon.png` - Android adaptif ikon (1024x1024 px)
- `splash.png` - Açılış ekranı (1284x2778 px)
- `favicon.png` - Web favicon (32x32 px)

## Geliştirme Notları

- Fallback verileri API hatası durumunda gösterilir
- Logo.png eksikse placeholder kullanılır
- Hizmet kartlarına tıklandığında webview açılır
- Bildirimler pull-to-refresh destekler

## Güncelleme

Backend API'nize göre API base URL'ini ve gerekiyorsa authentication header'larını güncelleyin.
