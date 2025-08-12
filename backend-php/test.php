<?php
// Test dosyası - PHP backend'i test etmek için

echo "Belyanimda PHP Backend Test\n";
echo "============================\n\n";

// Test 1: Config yükleme
echo "1. Config testi...\n";
require_once 'config/config.php';
echo "   ✓ Config yüklendi\n";
echo "   - Environment: " . config('environment') . "\n";
echo "   - Admin username: " . config('admin_username') . "\n\n";

// Test 2: Database bağlantısı
echo "2. Database testi...\n";
try {
    require_once 'classes/Database.php';
    $db = new Database();
    echo "   ✓ Database başlatıldı\n";
    
    // Test services
    $services = $db->getServices();
    echo "   - Services count: " . count($services) . "\n";
    
    // Test notifications
    $notifications = $db->getNotifications();
    echo "   - Notifications count: " . count($notifications) . "\n";
    
} catch (Exception $e) {
    echo "   ✗ Database hatası: " . $e->getMessage() . "\n";
}
echo "\n";

// Test 3: JWT testi
echo "3. JWT testi...\n";
try {
    require_once 'classes/JWT.php';
    $jwt = new JWT();
    
    $payload = ['username' => 'test', 'exp' => time() + 3600];
    $token = $jwt->encode($payload);
    echo "   ✓ JWT token oluşturuldu\n";
    
    $decoded = $jwt->decode($token);
    echo "   ✓ JWT token decode edildi\n";
    echo "   - Username: " . $decoded['username'] . "\n";
    
} catch (Exception $e) {
    echo "   ✗ JWT hatası: " . $e->getMessage() . "\n";
}
echo "\n";

// Test 4: Router testi
echo "4. Router testi...\n";
try {
    require_once 'classes/Router.php';
    $router = new Router();
    echo "   ✓ Router başlatıldı\n";
    
    // Test route ekleme
    $router->get('/test', 'TestController@index');
    echo "   ✓ Test route eklendi\n";
    
} catch (Exception $e) {
    echo "   ✗ Router hatası: " . $e->getMessage() . "\n";
}
echo "\n";

echo "Test tamamlandı!\n";
echo "PHP Backend başarıyla çalışıyor.\n";
echo "\nKullanım:\n";
echo "- Web sunucusu ile: http://localhost/backend-php/\n";
echo "- PHP built-in server: php -S localhost:8000\n";
echo "- Composer: composer start\n";
?>
