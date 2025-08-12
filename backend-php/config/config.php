<?php
// Environment variables
$env = getenv('NODE_ENV') ?: 'development';

// Configuration array
$config = [
    'port' => getenv('PORT') ?: 3000, // Web ve mobil uygulamalar 3000 portunu bekliyor
    'environment' => $env,
    'admin_username' => getenv('ADMIN_USERNAME') ?: 'admin',
    'admin_password' => getenv('ADMIN_PASSWORD') ?: 'admin123',
    'jwt_secret' => getenv('JWT_SECRET') ?: 'your-super-secret-jwt-key-change-in-production',
    'allowed_origins' => getenv('ALLOWED_ORIGINS') ?: 'http://localhost:5173,http://localhost:19006,exp://192.168.1.100:19000',
    'db_path' => getenv('DB_PATH') ?: './database/data',
    'timezone' => 'Europe/Istanbul',
    // Web ve mobil uygulamalar için özel ayarlar
    'web_url' => 'http://localhost:5173', // Vite dev server
    'mobile_url' => 'http://localhost:19006', // Expo dev server
    'mobile_local_network' => 'http://192.168.203.175:3000' // Mobil local network IP
];

// Set timezone
date_default_timezone_set($config['timezone']);

// Helper function to get config value
function config($key) {
    global $config;
    return $config[$key] ?? null;
}

// Helper function to check if in development
function isDevelopment() {
    return config('environment') === 'development';
}

// Helper function to get allowed origins as array
function getAllowedOrigins() {
    $origins = config('allowed_origins');
    if (is_string($origins)) {
        return explode(',', $origins);
    }
    return ['http://localhost:5173', 'http://localhost:19006'];
}
?>
