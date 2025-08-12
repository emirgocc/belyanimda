<?php
class AuthController {
    private $jwt;
    private $db;
    
    public function __construct() {
        $this->jwt = new JWT();
        $this->db = new Database();
    }
    
    public function login() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->methodNotAllowed();
            return;
        }
        
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input) {
            $this->badRequest('Invalid JSON data');
            return;
        }
        
        $username = $input['username'] ?? '';
        $password = $input['password'] ?? '';
        
        if (empty($username) || empty($password)) {
            $this->badRequest('Username and password are required');
            return;
        }
        
        // Check credentials
        if ($username !== config('admin_username')) {
            $this->unauthorized('Invalid credentials');
            return;
        }
        
        if ($password !== config('admin_password')) {
            $this->unauthorized('Invalid credentials');
            return;
        }
        
        // Generate JWT token
        $payload = [
            'username' => $username,
            'exp' => time() + (24 * 60 * 60) // 24 hours
        ];
        
        $token = $this->jwt->encode($payload);
        
        $this->success([
            'token' => $token,
            'username' => $username
        ], 'Login successful');
    }
    
    public function verify() {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->methodNotAllowed();
            return;
        }
        
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        $token = str_replace('Bearer ', '', $authHeader);
        
        if (empty($token)) {
            $this->unauthorized('No token provided');
            return;
        }
        
        $decoded = $this->jwt->verify($token);
        
        if (!$decoded) {
            $this->unauthorized('Invalid token');
            return;
        }
        
        $this->success([
            'username' => $decoded['username']
        ]);
    }
    
    private function success($data, $message = '') {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'data' => $data,
            'message' => $message
        ]);
    }
    
    private function badRequest($message) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => $message
        ]);
    }
    
    private function unauthorized($message) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => $message
        ]);
    }
    
    private function methodNotAllowed() {
        http_response_code(405);
        echo json_encode([
            'success' => false,
            'message' => 'Method not allowed'
        ]);
    }
}
?>
