import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from './config/config.js';
import { initializeDatabase } from './database/db.js';
import servicesRouter from './routes/services.js';
import notificationsRouter from './routes/notifications.js';
import authRouter from './routes/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = config.PORT || 3000;

// Initialize database
await initializeDatabase();

// Middleware
app.use(helmet());
app.use(cors({
  origin: config.NODE_ENV === 'development' 
    ? ['http://localhost:5173', 'http://localhost:19006', 'exp://192.168.1.100:19000']
    : config.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/public', express.static(join(__dirname, 'public')));

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/services', servicesRouter);
app.use('/api/notifications', notificationsRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV 
  });
});

// Mobile app data endpoint (simplified for mobile consumption)
app.get('/mobile/data', async (req, res) => {
  try {
    const { getServices } = await import('./database/db.js');
    const { getNotifications } = await import('./database/db.js');
    
    const services = await getServices();
    const notifications = await getNotifications();
    
    // Filter active services and sort by order
    const activeServices = services
      .filter(service => service.active)
      .sort((a, b) => a.order - b.order);
    
    // Get recent notifications (last 50)
    const recentNotifications = notifications
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 50);
    
    res.json({
      success: true,
      data: {
        services: activeServices,
        notifications: recentNotifications
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching mobile data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch mobile data'
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    message: config.NODE_ENV === 'development' ? error.message : 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📱 Mobile data endpoint: http://localhost:${PORT}/mobile/data`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});
