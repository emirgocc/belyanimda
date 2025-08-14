<?php
class ActivityController {
    private $db;
    private $router;
    
    public function __construct() {
        $this->db = new Database();
        // Router instance'ını dışarıdan al
        global $router;
        $this->router = $router;
    }
    
    public function index() {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->methodNotAllowed();
            return;
        }
        
        try {
            $activities = $this->db->getActivities();
            $this->success($activities, count($activities));
        } catch (Exception $e) {
            $this->serverError('Failed to fetch activities');
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
            $this->badRequest('Activity ID is required');
            return;
        }
        
        try {
            $activity = $this->db->getActivityById($id);
            
            if (!$activity) {
                $this->notFound('Activity not found');
                return;
            }
            
            $this->success($activity);
        } catch (Exception $e) {
            $this->serverError('Failed to fetch activity');
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
        if (empty($input['name']) || empty($input['location']) || 
            empty($input['startDate']) || empty($input['endDate']) || 
            empty($input['department'])) {
            $this->badRequest('Name, location, start date, end date and department are required');
            return;
        }
        
        // Validate dates
        if (strtotime($input['startDate']) > strtotime($input['endDate'])) {
            $this->badRequest('Start date cannot be after end date');
            return;
        }
        
        try {
            $newActivity = $this->db->createActivity($input);
            $this->created($newActivity, 'Activity created successfully');
        } catch (Exception $e) {
            $this->serverError('Failed to create activity');
        }
    }
    
    public function update() {
        if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
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
            $this->badRequest('Activity ID is required');
            return;
        }
        
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input) {
            $this->badRequest('Invalid JSON data');
            return;
        }
        
        // Validate dates if provided
        if (isset($input['startDate']) && isset($input['endDate'])) {
            if (strtotime($input['startDate']) > strtotime($input['endDate'])) {
                $this->badRequest('Start date cannot be after end date');
                return;
            }
        }
        
        try {
            $updatedActivity = $this->db->updateActivity($id, $input);
            
            if (!$updatedActivity) {
                $this->notFound('Activity not found');
                return;
            }
            
            $this->success($updatedActivity, 'Activity updated successfully');
        } catch (Exception $e) {
            $this->serverError('Failed to update activity');
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
            $this->badRequest('Activity ID is required');
            return;
        }
        
        try {
            $deleted = $this->db->deleteActivity($id);
            
            if (!$deleted) {
                $this->notFound('Activity not found');
                return;
            }
            
            $this->success(null, 'Activity deleted successfully');
        } catch (Exception $e) {
            $this->serverError('Failed to delete activity');
        }
    }
    
    public function toggleActive() {
        if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
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
            $this->badRequest('Activity ID is required');
            return;
        }
        
        try {
            $updatedActivity = $this->db->toggleActivityActive($id);
            
            if (!$updatedActivity) {
                $this->notFound('Activity not found');
                return;
            }
            
            $this->success($updatedActivity, 'Activity status updated successfully');
        } catch (Exception $e) {
            $this->serverError('Failed to update activity status');
        }
    }
    
    public function getActive() {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->methodNotAllowed();
            return;
        }
        
        try {
            // Debug: Tüm faaliyetleri al
            $allActivities = $this->db->getActivities();
            error_log("All activities count: " . count($allActivities));
            
            // Debug: Her faaliyetin active durumunu logla
            foreach ($allActivities as $activity) {
                error_log("Activity: " . $activity['name'] . " - Active: " . ($activity['active'] ? 'true' : 'false'));
            }
            
            $activities = $this->db->getActiveActivities();
            error_log("Active activities count: " . count($activities));
            
            $this->success($activities, count($activities));
        } catch (Exception $e) {
            error_log("Error in getActive: " . $e->getMessage());
            $this->serverError('Failed to fetch active activities');
        }
    }
    
    // Helper methods for response handling
    private function requireAuth() {
        $headers = getallheaders();
        $token = $headers['Authorization'] ?? '';
        
        if (empty($token) || !str_starts_with($token, 'Bearer ')) {
            $this->unauthorized('Authentication required');
            return false;
        }
        
        $token = substr($token, 7);
        $jwt = new JWT();
        
        try {
            $decoded = $jwt->verify($token);
            if (!$decoded) {
                $this->unauthorized('Invalid token');
                return false;
            }
            return true;
        } catch (Exception $e) {
            $this->unauthorized('Invalid token');
            return false;
        }
    }
    
    private function success($data, $message = 'Success') {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => $message,
            'data' => $data
        ]);
    }
    
    private function created($data, $message = 'Created successfully') {
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => $message,
            'data' => $data
        ]);
    }
    
    private function badRequest($message = 'Bad request') {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => $message
        ]);
    }
    
    private function unauthorized($message = 'Unauthorized') {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => $message
        ]);
    }
    
    private function notFound($message = 'Not found') {
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
    
    private function serverError($message = 'Internal server error') {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => $message
        ]);
    }
}
?>
