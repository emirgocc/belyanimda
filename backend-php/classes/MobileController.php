<?php
class MobileController {
    private $db;
    
    public function __construct() {
        $this->db = new Database();
    }
    
    public function data() {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->methodNotAllowed();
            return;
        }
        
        try {
            $services = $this->db->getServices();
            $notifications = $this->db->getNotifications();
            
            // Filter active services and sort by order
            $activeServices = array_filter($services, function($service) {
                return $service['active'] ?? true;
            });
            
            usort($activeServices, function($a, $b) {
                return ($a['order'] ?? 0) - ($b['order'] ?? 0);
            });
            
            // Get recent notifications (last 50)
            usort($notifications, function($a, $b) {
                return strtotime($b['createdAt']) - strtotime($a['createdAt']);
            });
            
            $recentNotifications = array_slice($notifications, 0, 50);
            
            $this->success([
                'services' => $activeServices,
                'notifications' => $recentNotifications
            ]);
            
        } catch (Exception $e) {
            $this->serverError('Failed to fetch mobile data');
        }
    }
    
    private function success($data) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'data' => $data,
            'timestamp' => date('c')
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
