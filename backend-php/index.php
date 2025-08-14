<?php
// Önce config dosyasını yükle
require_once __DIR__ . '/config/config.php';

// CORS ayarları - Web ve mobil uygulamalar için optimize edildi
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = getAllowedOrigins();

if (in_array($origin, $allowedOrigins) || empty($origin)) {
    header('Access-Control-Allow-Origin: ' . ($origin ?: '*'));
} else {
    header('Access-Control-Allow-Origin: http://localhost:5173'); // Default web origin
}

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Max-Age: 86400'); // 24 saat

// CORS preflight request handling
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Error handling
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Autoloader
spl_autoload_register(function ($class) {
    $file = __DIR__ . '/classes/' . $class . '.php';
    if (file_exists($file)) {
        require_once $file;
    }
});

// Initialize preparing database
$db = new Database();

// Router
$router = new Router();

// Auth routes
$router->post('/api/auth/login', 'AuthController@login');
$router->get('/api/auth/verify', 'AuthController@verify');

// Services routes
$router->get('/api/services', 'ServiceController@index');
$router->get('/api/services/{id}', 'ServiceController@show');
$router->post('/api/services', 'ServiceController@store');
$router->put('/api/services/{id}', 'ServiceController@update');
$router->delete('/api/services/{id}', 'ServiceController@destroy');
$router->put('/api/services/{id}/toggle', 'ServiceController@toggleActive');
$router->put('/api/services/{id}/soft-delete', 'ServiceController@softDelete');
$router->put('/api/services/{id}/restore', 'ServiceController@restore');
$router->get('/api/services/active', 'ServiceController@getActive');
$router->get('/api/services/deleted', 'ServiceController@getDeleted');
$router->put('/api/services/reorder/batch', 'ServiceController@reorder');

// Notifications routes
$router->get('/api/notifications', 'NotificationController@index');
$router->get('/api/notifications/{id}', 'NotificationController@show');
$router->post('/api/notifications', 'NotificationController@store');
$router->delete('/api/notifications/{id}', 'NotificationController@destroy');

// Activities routes
$router->get('/api/activities', 'ActivityController@index');
$router->get('/api/activities/{id}', 'ActivityController@show');
$router->post('/api/activities', 'ActivityController@store');
$router->put('/api/activities/{id}', 'ActivityController@update');
$router->delete('/api/activities/{id}', 'ActivityController@destroy');
$router->put('/api/activities/{id}/toggle', 'ActivityController@toggleActive');
$router->get('/api/activities/active', 'ActivityController@getActive');

// Mobile data endpoint
$router->get('/mobile/data', 'MobileController@data');

// Health check
$router->get('/health', 'HealthController@check');

// Handle request
$router->dispatch();
?>
