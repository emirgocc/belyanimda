import express from 'express';
import { validateNotification } from '@belyanimda/shared';
import { requireAuth } from '../middleware/auth.js';
import {
  getNotifications,
  getNotificationById,
  createNotification,
  deleteNotification
} from '../database/db.js';

const router = express.Router();

// Get all notifications (public endpoint for mobile app)
router.get('/', async (req, res) => {
  try {
    const notifications = await getNotifications();
    res.json({
      success: true,
      data: notifications,
      count: notifications.length
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications'
    });
  }
});

// Get notification by ID
router.get('/:id', async (req, res) => {
  try {
    const notification = await getNotificationById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    console.error('Error fetching notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notification'
    });
  }
});

// Create notification (protected)
router.post('/', requireAuth, async (req, res) => {
  try {
    const validation = validateNotification(req.body);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.error
      });
    }

    const newNotification = await createNotification(req.body);
    
    res.status(201).json({
      success: true,
      data: newNotification,
      message: 'Notification created and sent successfully'
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create notification'
    });
  }
});

// Delete notification (protected)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const deletedNotification = await deleteNotification(req.params.id);
    
    res.json({
      success: true,
      data: deletedNotification,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    if (error.message === 'Notification not found') {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification'
    });
  }
});

export default router;
