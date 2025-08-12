<?php
class NotificationController {
    private $db;
    private $router;
    
    public function __construct() {
        $this->db = new Database();
        $this->router = new Router();
    }
    
    public function index() {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->methodNotAllowed();
            return;
        }
        
        try {
            $notifications = $this->db->getNotifications();
            $this->success($notifications, count($notifications));
        } catch (Exception $e) {
            $this->serverError('Failed to fetch notifications');
        }
    }
    
    public function show() {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->methodNotAllowed();
            return;
        }
        
        $params = $this->router->getParams();
        $id = $params['id'] ?? null;
        
        if (!$id) {
            $this->badRequest('Notification ID is required');
            return;
        }
        
        try {
            $notification = $this->db->getNotificationById($id);
            
            if (!$notification) {
                $this->notFound('Notification not found');
                return;
            }
            
            $this->success($notification);
        } catch (Exception $e) {
            $this->serverError('Failed to fetch notification');
        }
    }
    
    public function store() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->methodNotAllowed();
            return;
        }
        
        // Check authentication
        if (!$this->requireAuth()) {
            return;
        }
        
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input) {
            $this->badRequest('Invalid JSON data');
            return;
        }
        
        // Validate required fields
        if (empty($input['title']) || empty($input['description'])) {
            $this->badRequest('Title and description are required');
            return;
        }
        
        try {
            $newNotification = $this->db->createNotification($input);
            $this->created($newNotification, 'Notification created and sent successfully');
        } catch (Exception $e) {
            $this->serverError('Failed to create notification');
        }
    }
    
    public function destroy() {
        if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
            $this->methodNotAllowed();
            return;
        }
        
        // Check authentication
        if (!$this->requireAuth()) {
            return;
        }
        
        $params = $this->router->getParams();
        $id = $params['id'] ?? null;
        
        if (!$id) {
            $this->badRequest('Notification ID is required');
            return;
        }
        
        try {
            $deletedNotification = $this->db->deleteNotification($id);
            $this->success($deletedNotification, 'Notification deleted successfully');
        } catch (Exception $e) {
            if ($e->getMessage() === 'Notification not found') {
                $this->notFound('Notification not found');
            } else {
                $this->serverError('Failed to delete notification');
            }
        }
    }
    
    private function requireAuth() {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        $token = str_replace('Bearer ', '', $authHeader);
        
        if (empty($token)) {
            $this->unauthorized('Authentication required');
            return false;
        }
        
        $jwt = new JWT();
        $decoded = $jwt->verify($token);
        
        if (!$decoded) {
            $this->unauthorized('Invalid or expired token');
            return false;
        }
        
        return true;
    }
    
    private function success($data, $count = null) {
        $response = [
            'success' => true,
            'data' => $data
        ];
        
        if ($count !== null) {
            $response['count'] = $count;
        }
        
        http_response_code(200);
        echo json_encode($response);
    }
    
    private function created($data, $message = '') {
        http_response_code(201);
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
    
    private function notFound($message) {
        http_response_code(404);
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
    
    private function serverError($message) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => $message
        ]);
    }
}
?>
