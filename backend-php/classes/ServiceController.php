<?php
class ServiceController {
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
            $services = $this->db->getServices();
            $this->success($services, count($services));
        } catch (Exception $e) {
            $this->serverError('Failed to fetch services');
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
            $this->badRequest('Service ID is required');
            return;
        }
        
        try {
            $service = $this->db->getServiceById($id);
            
            if (!$service) {
                $this->notFound('Service not found');
                return;
            }
            
            $this->success($service);
        } catch (Exception $e) {
            $this->serverError('Failed to fetch service');
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
        if (empty($input['name']) || empty($input['url'])) {
            $this->badRequest('Name and URL are required');
            return;
        }
        
        try {
            $newService = $this->db->createService($input);
            $this->created($newService, 'Service created successfully');
        } catch (Exception $e) {
            $this->serverError('Failed to create service');
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
            $this->badRequest('Service ID is required');
            return;
        }
        
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input) {
            $this->badRequest('Invalid JSON data');
            return;
        }
        
        try {
            $updatedService = $this->db->updateService($id, $input);
            $this->success($updatedService, 'Service updated successfully');
        } catch (Exception $e) {
            if ($e->getMessage() === 'Service not found') {
                $this->notFound('Service not found');
            } else {
                $this->serverError('Failed to update service');
            }
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
            $this->badRequest('Service ID is required');
            return;
        }
        
        try {
            $deletedService = $this->db->deleteService($id);
            $this->success($deletedService, 'Service deleted successfully');
        } catch (Exception $e) {
            if ($e->getMessage() === 'Service not found') {
                $this->notFound('Service not found');
            } else {
                $this->serverError('Failed to delete service');
            }
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
            $this->badRequest('Service ID is required');
            return;
        }
        
        try {
            $service = $this->db->getServiceById($id);
            if (!$service) {
                $this->notFound('Service not found');
                return;
            }
            
            // Toggle active status
            $newStatus = !($service['active'] ?? true);
            $updatedService = $this->db->updateService($id, ['active' => $newStatus]);
            
            $message = $newStatus ? 'Service activated successfully' : 'Service deactivated successfully';
            $this->success($updatedService, $message);
        } catch (Exception $e) {
            $this->serverError('Failed to toggle service status');
        }
    }
    
    public function softDelete() {
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
            $this->badRequest('Service ID is required');
            return;
        }
        
        try {
            $updatedService = $this->db->softDeleteService($id);
            $this->success($updatedService, 'Service soft deleted successfully');
        } catch (Exception $e) {
            if ($e->getMessage() === 'Service not found') {
                $this->notFound('Service not found');
            } else {
                $this->serverError('Failed to soft delete service');
            }
        }
    }
    
    public function restore() {
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
            $this->badRequest('Service ID is required');
            return;
        }
        
        try {
            $updatedService = $this->db->restoreService($id);
            $this->success($updatedService, 'Service restored successfully');
        } catch (Exception $e) {
            if ($e->getMessage() === 'Service not found') {
                $this->notFound('Service not found');
            } else {
                $this->serverError('Failed to restore service');
            }
        }
    }
    
    public function getActive() {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->methodNotAllowed();
            return;
        }
        
        try {
            $services = $this->db->getActiveServices();
            $this->success($services, count($services));
        } catch (Exception $e) {
            $this->serverError('Failed to fetch active services');
        }
    }
    
    public function getDeleted() {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->methodNotAllowed();
            return;
        }
        
        // Check authentication
        if (!$this->requireAuth()) {
            return;
        }
        
        try {
            $services = $this->db->getDeletedServices();
            $this->success($services, count($services));
        } catch (Exception $e) {
            $this->serverError('Failed to fetch deleted services');
        }
    }
    
    public function reorder() {
        if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
            $this->methodNotAllowed();
            return;
        }
        
        // Check authentication
        if (!$this->requireAuth()) {
            return;
        }
        
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input || !isset($input['orderedIds']) || !is_array($input['orderedIds'])) {
            $this->badRequest('orderedIds must be an array');
            return;
        }
        
        try {
            $updatedServices = $this->db->reorderServices($input['orderedIds']);
            $this->success($updatedServices, 'Services reordered successfully');
        } catch (Exception $e) {
            $this->serverError('Failed to reorder services');
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
