#!/bin/bash

echo "🚀 Belyanimda PHP Backend Başlatılıyor..."
echo "=========================================="
echo

# Port kontrolü
PORT=${PORT:-3000}
echo "📍 Port: $PORT"
echo "🌐 Web Admin Panel: http://localhost:5173"
echo "📱 Mobile App: http://localhost:19006"
echo "🔗 API Base URL: http://localhost:$PORT"
echo

# Database klasörü kontrolü
if [ ! -d "database/data" ]; then
    echo "📁 Database klasörü oluşturuluyor: database/data"
    mkdir -p database/data
fi

echo "🧪 Test Endpoint'leri:"
echo "   - Health Check: http://localhost:$PORT/health"
echo "   - Services: http://localhost:$PORT/api/services"
echo "   - Mobile Data: http://localhost:$PORT/mobile/data"
echo

echo "✅ Backend hazır! PHP built-in server başlatılıyor..."
echo "⏹️  Durdurmak için Ctrl+C"
echo

# PHP built-in server'ı başlat
echo "🚀 Komut: php -S 0.0.0.0:$PORT -t ."
echo

php -S 0.0.0.0:$PORT -t .
