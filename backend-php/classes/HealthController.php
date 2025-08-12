<?php
class HealthController {
    public function check() {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->methodNotAllowed();
            return;
        }
        
        $this->success([
            'status' => 'OK',
            'timestamp' => date('c'),
            'environment' => config('environment')
        ]);
    }
    
    private function success($data) {
        http_response_code(200);
        echo json_encode($data);
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
