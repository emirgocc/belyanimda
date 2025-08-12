import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { generateId } from '@belyanimda/shared';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database files
const dbDir = join(__dirname, 'data');
const servicesFile = join(dbDir, 'services.json');
const notificationsFile = join(dbDir, 'notifications.json');

let servicesDb;
let notificationsDb;

// Initialize database
export async function initializeDatabase() {
  // Create data directory if it doesn't exist
  if (!existsSync(dbDir)) {
    mkdirSync(dbDir, { recursive: true });
  }

  // Initialize services database
  const servicesAdapter = new JSONFile(servicesFile);
  servicesDb = new Low(servicesAdapter, { services: [] });
  await servicesDb.read();

  // Initialize notifications database
  const notificationsAdapter = new JSONFile(notificationsFile);
  notificationsDb = new Low(notificationsAdapter, { notifications: [] });
  await notificationsDb.read();

  // Add sample data if databases are empty
  await addSampleData();
}

// Add sample data for development
async function addSampleData() {
  // Sample services
  if (servicesDb.data.services.length === 0) {
    const sampleServices = [
      {
        id: generateId(),
        name: 'Güngören Akademi',
        icon: 'https://via.placeholder.com/64x64/4F46E5/FFFFFF?text=GA',
        url: 'https://gungorenakademi.com',
        active: true,
        order: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: generateId(),
        name: 'Spor Güngören',
        icon: 'https://via.placeholder.com/64x64/059669/FFFFFF?text=SG',
        url: 'https://sporgungoeren.com',
        active: true,
        order: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: generateId(),
        name: 'GKS - Kültür Sanat',
        icon: 'https://via.placeholder.com/64x64/DC2626/FFFFFF?text=GKS',
        url: 'https://gks.gov.tr',
        active: true,
        order: 3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: generateId(),
        name: 'Harunmeli Konağı',
        icon: 'https://via.placeholder.com/64x64/7C3AED/FFFFFF?text=HK',
        url: 'https://harunmelikonagi.com',
        active: true,
        order: 4,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: generateId(),
        name: 'Bilim Güngören',
        icon: 'https://via.placeholder.com/64x64/0891B2/FFFFFF?text=BG',
        url: 'https://bilimgungoeren.com',
        active: true,
        order: 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: generateId(),
        name: 'Aile Çocuk Kampüsü',
        icon: 'https://via.placeholder.com/64x64/EA580C/FFFFFF?text=AÇK',
        url: 'https://ailecocukkampusu.com',
        active: true,
        order: 6,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    servicesDb.data.services = sampleServices;
    await servicesDb.write();
  }

  // Sample notifications
  if (notificationsDb.data.notifications.length === 0) {
    const sampleNotifications = [
      {
        id: generateId(),
        title: 'Güngören Belediyesi Uygulamasına Hoş Geldiniz!',
        description: 'Belediye hizmetlerimize kolayca ulaşabileceğiniz yeni mobil uygulamamızı kullanmaya başladınız.',
        url: null,
        createdAt: new Date().toISOString()
      },
      {
        id: generateId(),
        title: 'Spor Tesisleri Açık',
        description: 'Tüm spor tesislerimiz hafta içi 08:00-22:00, hafta sonu 09:00-20:00 saatleri arasında hizmet vermektedir.',
        url: 'https://sporgungoeren.com',
        createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
      },
      {
        id: generateId(),
        title: 'Kültür Sanat Etkinlikleri',
        description: 'Bu ay düzenlenecek kültür ve sanat etkinlikleri için programı inceleyebilirsiniz.',
        url: 'https://gks.gov.tr',
        createdAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
      }
    ];

    notificationsDb.data.notifications = sampleNotifications;
    await notificationsDb.write();
  }
}

// Services CRUD operations
export async function getServices() {
  await servicesDb.read();
  return servicesDb.data.services;
}

export async function getServiceById(id) {
  await servicesDb.read();
  return servicesDb.data.services.find(service => service.id === id);
}

export async function createService(serviceData) {
  await servicesDb.read();
  
  const newService = {
    id: generateId(),
    ...serviceData,
    order: serviceData.order || servicesDb.data.services.length + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  servicesDb.data.services.push(newService);
  await servicesDb.write();
  
  return newService;
}

export async function updateService(id, updates) {
  await servicesDb.read();
  
  const serviceIndex = servicesDb.data.services.findIndex(service => service.id === id);
  if (serviceIndex === -1) {
    throw new Error('Service not found');
  }
  
  servicesDb.data.services[serviceIndex] = {
    ...servicesDb.data.services[serviceIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  await servicesDb.write();
  
  return servicesDb.data.services[serviceIndex];
}

export async function deleteService(id) {
  await servicesDb.read();
  
  const serviceIndex = servicesDb.data.services.findIndex(service => service.id === id);
  if (serviceIndex === -1) {
    throw new Error('Service not found');
  }
  
  const deletedService = servicesDb.data.services.splice(serviceIndex, 1)[0];
  await servicesDb.write();
  
  return deletedService;
}

export async function reorderServices(orderedIds) {
  await servicesDb.read();
  
  // Update order for each service
  orderedIds.forEach((id, index) => {
    const service = servicesDb.data.services.find(s => s.id === id);
    if (service) {
      service.order = index + 1;
      service.updatedAt = new Date().toISOString();
    }
  });
  
  await servicesDb.write();
  
  return servicesDb.data.services;
}

// Notifications CRUD operations
export async function getNotifications() {
  await notificationsDb.read();
  return notificationsDb.data.notifications;
}

export async function getNotificationById(id) {
  await notificationsDb.read();
  return notificationsDb.data.notifications.find(notification => notification.id === id);
}

export async function createNotification(notificationData) {
  await notificationsDb.read();
  
  const newNotification = {
    id: generateId(),
    ...notificationData,
    createdAt: new Date().toISOString()
  };
  
  notificationsDb.data.notifications.unshift(newNotification); // Add to beginning
  await notificationsDb.write();
  
  return newNotification;
}

export async function deleteNotification(id) {
  await notificationsDb.read();
  
  const notificationIndex = notificationsDb.data.notifications.findIndex(notification => notification.id === id);
  if (notificationIndex === -1) {
    throw new Error('Notification not found');
  }
  
  const deletedNotification = notificationsDb.data.notifications.splice(notificationIndex, 1)[0];
  await notificationsDb.write();
  
  return deletedNotification;
}
