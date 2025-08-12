<?php
class Router {
    private $routes = [];
    private $params = [];

    public function get($route, $handler) {
        $this->addRoute('GET', $route, $handler);
    }

    public function post($route, $handler) {
        $this->addRoute('POST', $route, $handler);
    }

    public function put($route, $handler) {
        $this->addRoute('PUT', $route, $handler);
    }

    public function delete($route, $handler) {
        $this->addRoute('DELETE', $route, $handler);
    }

    private function addRoute($method, $route, $handler) {
        $this->routes[$method][$route] = $handler;
    }

    public function dispatch() {
        $method = $_SERVER['REQUEST_METHOD'];
        $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        
        // Remove trailing slash
        $uri = rtrim($uri, '/');
        
        // Check if route exists
        if (isset($this->routes[$method])) {
            foreach ($this->routes[$method] as $route => $handler) {
                if ($this->matchRoute($route, $uri)) {
                    $this->executeHandler($handler);
                    return;
                }
            }
        }
        
        // Route not found
        $this->notFound();
    }

    private function matchRoute($route, $uri) {
        // Convert route parameters to regex pattern
        $pattern = preg_replace('/\{([^}]+)\}/', '([^/]+)', $route);
        $pattern = '#^' . $pattern . '$#';
        
        if (preg_match($pattern, $uri, $matches)) {
            // Extract parameters
            preg_match_all('/\{([^}]+)\}/', $route, $paramNames);
            array_shift($matches); // Remove first match (full string)
            
            foreach ($paramNames[1] as $index => $name) {
                $this->params[$name] = $matches[$index] ?? null;
            }
            
            return true;
        }
        
        return false;
    }

    private function executeHandler($handler) {
        list($controller, $method) = explode('@', $handler);
        $controllerClass = $controller;
        
        if (class_exists($controllerClass)) {
            $controllerInstance = new $controllerClass();
            if (method_exists($controllerInstance, $method)) {
                $controllerInstance->$method();
            } else {
                $this->serverError("Method $method not found in $controllerClass");
            }
        } else {
            $this->serverError("Controller $controllerClass not found");
        }
    }

    private function notFound() {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Route not found'
        ]);
    }

    private function serverError($message) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => $message
        ]);
    }

    public function getParams() {
        return $this->params;
    }
}
?>
