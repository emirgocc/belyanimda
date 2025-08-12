<?php
class JWT {
    private $secret;
    
    public function __construct($secret = null) {
        $this->secret = $secret ?: config('jwt_secret');
    }
    
    public function encode($payload) {
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
        $payload = json_encode($payload);
        
        $base64Header = $this->base64UrlEncode($header);
        $base64Payload = $this->base64UrlEncode($payload);
        
        $signature = hash_hmac('sha256', $base64Header . "." . $base64Payload, $this->secret, true);
        $base64Signature = $this->base64UrlEncode($signature);
        
        return $base64Header . "." . $base64Payload . "." . $base64Signature;
    }
    
    public function decode($token) {
        $parts = explode('.', $token);
        
        if (count($parts) !== 3) {
            throw new Exception('Invalid token format');
        }
        
        list($header, $payload, $signature) = $parts;
        
        $expectedSignature = hash_hmac('sha256', $header . "." . $payload, $this->secret, true);
        $expectedSignature = $this->base64UrlEncode($expectedSignature);
        
        if (!hash_equals($signature, $expectedSignature)) {
            throw new Exception('Invalid signature');
        }
        
        $decodedPayload = json_decode($this->base64UrlDecode($payload), true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception('Invalid payload');
        }
        
        return $decodedPayload;
    }
    
    public function verify($token) {
        try {
            $decoded = $this->decode($token);
            
            // Check if token is expired
            if (isset($decoded['exp']) && $decoded['exp'] < time()) {
                throw new Exception('Token expired');
            }
            
            return $decoded;
        } catch (Exception $e) {
            return false;
        }
    }
    
    private function base64UrlEncode($data) {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
    
    private function base64UrlDecode($data) {
        return base64_decode(strtr($data, '-_', '+/') . str_repeat('=', 3 - (3 + strlen($data)) % 4));
    }
}
?>
