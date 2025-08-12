@echo off
echo 🚀 Belyanimda PHP Backend Başlatılıyor...
echo ==========================================
echo.

REM PHP yolu kontrolü
set PHP_PATH=C:\xampp\php\php.exe

REM PHP var mı kontrol et
if not exist "%PHP_PATH%" (
    echo ❌ PHP bulunamadı: %PHP_PATH%
    echo 📍 XAMPP kurulu mu kontrol edin
    echo 📍 Alternatif PHP yolları:
    echo    - C:\xampp\php\php.exe
    echo    - C:\wamp64\bin\php\php8.x.x\php.exe
    echo    - C:\laragon\bin\php\php8.x.x\php.exe
    echo.
    pause
    exit /b 1
)

echo ✅ PHP bulundu: %PHP_PATH%
echo 📍 Port: 3000
echo 🌐 Web Admin Panel: http://localhost:5173
echo 📱 Mobile App: http://localhost:19006
echo 🔗 API Base URL: http://localhost:3000
echo.

REM Database klasörü kontrolü
if not exist "database\data" (
    echo 📁 Database klasörü oluşturuluyor: database\data
    mkdir "database\data" 2>nul
)

echo 🧪 Test Endpoint'leri:
echo    - Health Check: http://localhost:3000/health
echo    - Services: http://localhost:3000/api/services
echo    - Mobile Data: http://localhost:3000/mobile/data
echo.

echo ✅ Backend hazır! PHP built-in server başlatılıyor...
echo ⏹️  Durdurmak için Ctrl+C
echo.

REM PHP built-in server'ı başlat
echo 🚀 Komut: %PHP_PATH% -S 0.0.0.0:3000 -t .
echo.

"%PHP_PATH%" -S 0.0.0.0:3000 -t .

pause
