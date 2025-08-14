<?php
class Database {
    private $dbPath;
    private $servicesFile;
    private $notificationsFile;
    private $activitiesFile;

    public function __construct() {
        $this->dbPath = config('db_path');
        $this->servicesFile = $this->dbPath . '/services.json';
        $this->notificationsFile = $this->dbPath . '/notifications.json';
        $this->activitiesFile = $this->dbPath . '/activities.json';
        
        $this->initialize();
    }

    private function initialize() {
        // Create database directory if it doesn't exist
        if (!is_dir($this->dbPath)) {
            mkdir($this->dbPath, 0755, true);
        }

        // Initialize services file
        if (!file_exists($this->servicesFile)) {
            $this->writeServices([]);
            $this->addSampleServices();
        }

        // Initialize notifications file
        if (!file_exists($this->notificationsFile)) {
            $this->writeNotifications([]);
            $this->addSampleNotifications();
        }

        // Initialize activities file
        if (!file_exists($this->activitiesFile)) {
            $this->writeActivities([]);
            $this->addSampleActivities();
        }
    }

    private function addSampleServices() {
        $sampleServices = [
            [
                'id' => $this->generateId(),
                'name' => 'Güngören Akademi',
                'icon' => 'https://via.placeholder.com/64x64/4F46E5/FFFFFF?text=GA',
                'url' => 'https://gungorenakademi.com',
                'active' => true,
                'order' => 1,
                'createdAt' => date('c'),
                'updatedAt' => date('c')
            ],
            [
                'id' => $this->generateId(),
                'name' => 'Spor Güngören',
                'icon' => 'https://via.placeholder.com/64x64/059669/FFFFFF?text=SG',
                'url' => 'https://sporgungoeren.com',
                'active' => true,
                'order' => 2,
                'createdAt' => date('c'),
                'updatedAt' => date('c')
            ],
            [
                'id' => $this->generateId(),
                'name' => 'GKS - Kültür Sanat',
                'icon' => 'https://via.placeholder.com/64x64/DC2626/FFFFFF?text=GKS',
                'url' => 'https://gks.gov.tr',
                'active' => true,
                'order' => 3,
                'createdAt' => date('c'),
                'updatedAt' => date('c')
            ],
            [
                'id' => $this->generateId(),
                'name' => 'Harunmeli Konağı',
                'icon' => 'https://via.placeholder.com/64x64/7C3AED/FFFFFF?text=HK',
                'url' => 'https://harunmelikonagi.com',
                'active' => true,
                'order' => 4,
                'createdAt' => date('c'),
                'updatedAt' => date('c')
            ],
            [
                'id' => $this->generateId(),
                'name' => 'Bilim Güngören',
                'icon' => 'https://via.placeholder.com/64x64/0891B2/FFFFFF?text=BG',
                'url' => 'https://bilimgungoeren.com',
                'active' => true,
                'order' => 5,
                'createdAt' => date('c'),
                'updatedAt' => date('c')
            ],
            [
                'id' => $this->generateId(),
                'name' => 'Aile Çocuk Kampüsü',
                'icon' => 'https://via.placeholder.com/64x64/EA580C/FFFFFF?text=AÇK',
                'url' => 'https://ailecocukkampusu.com',
                'active' => true,
                'order' => 6,
                'createdAt' => date('c'),
                'updatedAt' => date('c')
            ]
        ];

        $this->writeServices($sampleServices);
    }

    private function addSampleActivities() {
        $sampleActivities = [
            [
                'id' => $this->generateId(),
                'name' => 'Yol Çalışması - Merkez Mahalle',
                'location' => 'Merkez Mahalle, Ana Caddesi',
                'startDate' => date('Y-m-d'),
                'endDate' => date('Y-m-d', strtotime('+15 days')),
                'department' => 'Fen İşleri Müdürlüğü',
                'active' => true,
                'createdAt' => date('c'),
                'updatedAt' => date('c')
            ],
            [
                'id' => $this->generateId(),
                'name' => 'Park Düzenleme Çalışması',
                'location' => 'Şehir Parkı',
                'startDate' => date('Y-m-d'),
                'endDate' => date('Y-m-d', strtotime('+20 days')),
                'department' => 'Park ve Bahçeler Müdürlüğü',
                'active' => true,
                'createdAt' => date('c'),
                'updatedAt' => date('c')
            ]
        ];

        $this->writeActivities($sampleActivities);
    }

    private function addSampleNotifications() {
        $sampleNotifications = [
            [
                'id' => $this->generateId(),
                'title' => 'Güngören Belediyesi Uygulamasına Hoş Geldiniz!',
                'description' => 'Belediye hizmetlerimize kolayca ulaşabileceğiniz yeni mobil uygulamamızı kullanmaya başladınız.',
                'url' => null,
                'createdAt' => date('c')
            ],
            [
                'id' => $this->generateId(),
                'title' => 'Spor Tesisleri Açık',
                'description' => 'Tüm spor tesislerimiz hafta içi 08:00-22:00, hafta sonu 09:00-20:00 saatleri arasında hizmet vermektedir.',
                'url' => 'https://sporgungoeren.com',
                'createdAt' => date('c', time() - 86400) // 1 day ago
            ],
            [
                'id' => $this->generateId(),
                'title' => 'Kültür Sanat Etkinlikleri',
                'description' => 'Bu ay düzenlenecek kültür ve sanat etkinlikleri için programı inceleyebilirsiniz.',
                'url' => 'https://gks.gov.tr',
                'createdAt' => date('c', time() - 172800) // 2 days ago
            ]
        ];

        $this->writeNotifications($sampleNotifications);
    }

    // Services methods
    public function getServices() {
        return $this->readServices();
    }

    public function getServiceById($id) {
        $services = $this->readServices();
        foreach ($services as $service) {
            if ($service['id'] === $id) {
                return $service;
            }
        }
        return null;
    }

    public function createService($serviceData) {
        $services = $this->readServices();
        
        $newService = [
            'id' => $this->generateId(),
            'name' => $serviceData['name'],
            'icon' => $serviceData['icon'],
            'url' => $serviceData['url'],
            'active' => $serviceData['active'] ?? true,
            'order' => $serviceData['order'] ?? count($services) + 1,
            'createdAt' => date('c'),
            'updatedAt' => date('c')
        ];
        
        $services[] = $newService;
        $this->writeServices($services);
        
        return $newService;
    }

    public function updateService($id, $updates) {
        $services = $this->readServices();
        
        foreach ($services as &$service) {
            if ($service['id'] === $id) {
                $service = array_merge($service, $updates);
                $service['updatedAt'] = date('c');
                $this->writeServices($services);
                return $service;
            }
        }
        
        throw new Exception('Service not found');
    }

    public function deleteService($id) {
        $services = $this->readServices();
        
        foreach ($services as $index => $service) {
            if ($service['id'] === $id) {
                $deletedService = array_splice($services, $index, 1)[0];
                $this->writeServices($services);
                return $deletedService;
            }
        }
        
        throw new Exception('Service not found');
    }

    public function softDeleteService($id) {
        $services = $this->readServices();
        
        foreach ($services as &$service) {
            if ($service['id'] === $id) {
                $service['deletedAt'] = date('c');
                $service['active'] = false;
                $service['updatedAt'] = date('c');
                $this->writeServices($services);
                return $service;
            }
        }
        
        throw new Exception('Service not found');
    }

    public function restoreService($id) {
        $services = $this->readServices();
        
        foreach ($services as &$service) {
            if ($service['id'] === $id) {
                unset($service['deletedAt']);
                $service['active'] = true;
                $service['updatedAt'] = date('c');
                $this->writeServices($services);
                return $service;
            }
        }
        
        throw new Exception('Service not found');
    }

    public function getActiveServices() {
        $services = $this->readServices();
        return array_filter($services, function($service) {
            return ($service['active'] ?? true) && !isset($service['deletedAt']);
        });
    }

    public function getDeletedServices() {
        $services = $this->readServices();
        return array_filter($services, function($service) {
            return isset($service['deletedAt']);
        });
    }

    public function reorderServices($orderedIds) {
        $services = $this->readServices();
        
        foreach ($orderedIds as $index => $id) {
            foreach ($services as &$service) {
                if ($service['id'] === $id) {
                    $service['order'] = $index + 1;
                    $service['updatedAt'] = date('c');
                    break;
                }
            }
        }
        
        $this->writeServices($services);
        return $services;
    }

    // Notifications methods
    public function getNotifications() {
        return $this->readNotifications();
    }

    public function getNotificationById($id) {
        $notifications = $this->readNotifications();
        foreach ($notifications as $notification) {
            if ($notification['id'] === $id) {
                return $notification;
            }
        }
        return null;
    }

    public function createNotification($notificationData) {
        $notifications = $this->readNotifications();
        
        $newNotification = [
            'id' => $this->generateId(),
            'title' => $notificationData['title'],
            'description' => $notificationData['description'],
            'url' => $notificationData['url'] ?? null,
            'createdAt' => date('c')
        ];
        
        array_unshift($notifications, $newNotification); // Add to beginning
        $this->writeNotifications($notifications);
        
        return $newNotification;
    }

    public function deleteNotification($id) {
        $notifications = $this->readNotifications();
        
        foreach ($notifications as $index => $notification) {
            if ($notification['id'] === $id) {
                $deletedNotification = array_splice($notifications, $index, 1)[0];
                $this->writeNotifications($notifications);
                return $deletedNotification;
            }
        }
        
        throw new Exception('Notification not found');
    }

    // Activities methods
    public function getActivities() {
        return $this->readActivities();
    }

    public function getActivityById($id) {
        $activities = $this->readActivities();
        foreach ($activities as $activity) {
            if ($activity['id'] === $id) {
                return $activity;
            }
        }
        return null;
    }

    public function createActivity($activityData) {
        $activities = $this->readActivities();
        
        $newActivity = [
            'id' => $this->generateId(),
            'name' => $activityData['name'],
            'location' => $activityData['location'],
            'startDate' => $activityData['startDate'],
            'endDate' => $activityData['endDate'],
            'department' => $activityData['department'],
            'active' => $activityData['active'] ?? true,
            'createdAt' => date('c'),
            'updatedAt' => date('c')
        ];
        
        array_unshift($activities, $newActivity); // Add to beginning
        $this->writeActivities($activities);
        
        return $newActivity;
    }

    public function updateActivity($id, $updateData) {
        $activities = $this->readActivities();
        
        foreach ($activities as &$activity) {
            if ($activity['id'] === $id) {
                $activity = array_merge($activity, $updateData);
                $activity['updatedAt'] = date('c');
                $this->writeActivities($activities);
                return $activity;
            }
        }
        
        return null;
    }

    public function deleteActivity($id) {
        $activities = $this->readActivities();
        
        foreach ($activities as $index => $activity) {
            if ($activity['id'] === $id) {
                $deletedActivity = array_splice($activities, $index, 1)[0];
                $this->writeActivities($activities);
                return $deletedActivity;
            }
        }
        
        throw new Exception('Activity not found');
    }

    public function toggleActivityActive($id) {
        $activities = $this->readActivities();
        
        foreach ($activities as &$activity) {
            if ($activity['id'] === $id) {
                $activity['active'] = !($activity['active'] ?? true);
                $activity['updatedAt'] = date('c');
                $this->writeActivities($activities);
                return $activity;
            }
        }
        
        return null;
    }

    public function getActiveActivities() {
        $activities = $this->readActivities();
        return array_filter($activities, function($activity) {
            return ($activity['active'] ?? true);
        });
    }

    // Helper methods
    private function readServices() {
        $data = file_get_contents($this->servicesFile);
        return json_decode($data, true) ?: [];
    }

    private function writeServices($services) {
        file_put_contents($this->servicesFile, json_encode($services, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }

    private function readNotifications() {
        $data = file_get_contents($this->notificationsFile);
        return json_decode($data, true) ?: [];
    }

    private function writeNotifications($notifications) {
        file_put_contents($this->notificationsFile, json_encode($notifications, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }

    private function readActivities() {
        $data = file_get_contents($this->activitiesFile);
        return json_decode($data, true) ?: [];
    }

    private function writeActivities($activities) {
        file_put_contents($this->activitiesFile, json_encode($activities, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }

    private function generateId() {
        return uniqid() . '_' . mt_rand(1000, 9999);
    }
}
?>
