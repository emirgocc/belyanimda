<?php
/**
 * PHP Built-in Server Başlatma Scripti
 * Web ve mobil uygulamaların beklediği 3000 portunda çalışır
 */

echo "🚀 Belyanimda PHP Backend Başlatılıyor...\n";
echo "==========================================\n\n";

// Port kontrolü
$port = config('port') ?: 3000;
echo "📍 Port: $port\n";
echo "🌐 Web Admin Panel: http://localhost:5173\n";
echo "📱 Mobile App: http://localhost:19006\n";
echo "🔗 API Base URL: http://localhost:$port\n\n";

// Database klasörü kontrolü
$dbPath = config('db_path');
if (!is_dir($dbPath)) {
    echo "📁 Database klasörü oluşturuluyor: $dbPath\n";
    mkdir($dbPath, 0755, true);
}

// Test endpoint'leri
echo "🧪 Test Endpoint'leri:\n";
echo "   - Health Check: http://localhost:$port/health\n";
echo "   - Services: http://localhost:$port/api/services\n";
echo "   - Mobile Data: http://localhost:$port/mobile/data\n\n";

echo "✅ Backend hazır! PHP built-in server başlatılıyor...\n";
echo "⏹️  Durdurmak için Ctrl+C\n\n";

// PHP built-in server'ı başlat
$command = "php -S 0.0.0.0:$port -t .";
echo "🚀 Komut: $command\n\n";

// Server'ı başlat
system($command);
?>
