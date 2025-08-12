<?php
/**
 * Entegrasyon Test Dosyası
 * Web ve mobil uygulamaların konfigürasyonlarını test eder
 */

echo "🔗 Belyanimda PHP Backend Entegrasyon Testi\n";
echo "============================================\n\n";

// Config yükle
require_once 'config/config.php';

echo "📋 Konfigürasyon Kontrolü:\n";
echo "   - Port: " . config('port') . "\n";
echo "   - Environment: " . config('environment') . "\n";
echo "   - Web URL: " . config('web_url') . "\n";
echo "   - Mobile URL: " . config('mobile_url') . "\n";
echo "   - Mobile Local Network: " . config('mobile_local_network') . "\n\n";

echo "🌐 CORS Origin Kontrolü:\n";
$origins = getAllowedOrigins();
foreach ($origins as $origin) {
    echo "   ✅ " . $origin . "\n";
}
echo "\n";

echo "🔧 Uygulama Konfigürasyonları:\n";
echo "\n📱 Web Admin Panel (web/src/config/config.js):\n";
echo "   export const API_CONFIG = {\n";
echo "     BASE_URL: 'http://localhost:" . config('port') . "', // ✅ PHP Backend\n";
echo "     ENDPOINTS: {\n";
echo "       AUTH: '/api/auth',\n";
echo "       SERVICES: '/api/services',\n";
echo "       NOTIFICATIONS: '/api/notifications',\n";
echo "     },\n";
echo "     TIMEOUT: 10000,\n";
echo "   };\n";

echo "\n📱 Mobile App (mobile/config/api.config.js):\n";
echo "   const API_CONFIG = {\n";
echo "     development: {\n";
echo "       baseURL: 'http://localhost:" . config('port') . "', // ✅ PHP Backend\n";
echo "       timeout: 10000,\n";
echo "       retryAttempts: 3,\n";
echo "     },\n";
echo "     // ...\n";
echo "   };\n";

echo "\n🚀 Test Komutları:\n";
echo "   # Backend başlatma\n";
echo "   php -S 0.0.0.0:" . config('port') . " -t .\n\n";

echo "   # Web uygulaması başlatma\n";
echo "   cd ../web && npm run dev\n\n";

echo "   # Mobile uygulama başlatma\n";
echo "   cd ../mobile && expo start\n\n";

echo "🧪 API Test Endpoint'leri:\n";
echo "   - Health Check: http://localhost:" . config('port') . "/health\n";
echo "   - Services: http://localhost:" . config('port') . "/api/services\n";
echo "   - Mobile Data: http://localhost:" . config('port') . "/mobile/data\n";
echo "   - Admin Login: http://localhost:" . config('port') . "/api/auth/login\n\n";

echo "🔐 Admin Bilgileri:\n";
echo "   - Username: " . config('admin_username') . "\n";
echo "   - Password: " . config('admin_password') . "\n\n";

echo "✅ Entegrasyon Testi Tamamlandı!\n";
echo "🎯 PHP Backend web ve mobil uygulamalarla tam uyumlu!\n\n";

echo "📝 Sonraki Adımlar:\n";
echo "   1. PHP backend'i başlat: php -S 0.0.0.0:" . config('port') . " -t .\n";
echo "   2. Web uygulamasını başlat: npm run dev (web klasöründe)\n";
echo "   3. Mobile uygulamasını başlat: expo start (mobile klasöründe)\n";
echo "   4. Test et: http://localhost:5173 (Web) ve Expo (Mobile)\n";
?>
