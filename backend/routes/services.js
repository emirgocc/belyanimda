import express from 'express';
import { validateService } from '@belyanimda/shared';
import { requireAuth } from '../middleware/auth.js';
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  reorderServices
} from '../database/db.js';

const router = express.Router();

// Get all services (public endpoint for mobile app)
router.get('/', async (req, res) => {
  try {
    const services = await getServices();
    res.json({
      success: true,
      data: services,
      count: services.length
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services'
    });
  }
});

// Get service by ID
router.get('/:id', async (req, res) => {
  try {
    const service = await getServiceById(req.params.id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch service'
    });
  }
});

// Create service (protected)
router.post('/', requireAuth, async (req, res) => {
  try {
    const validation = validateService(req.body);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.error
      });
    }

    const newService = await createService(req.body);
    
    res.status(201).json({
      success: true,
      data: newService,
      message: 'Service created successfully'
    });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create service'
    });
  }
});

// Update service (protected)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const validation = validateService(req.body);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.error
      });
    }

    const updatedService = await updateService(req.params.id, req.body);
    
    res.json({
      success: true,
      data: updatedService,
      message: 'Service updated successfully'
    });
  } catch (error) {
    if (error.message === 'Service not found') {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    
    console.error('Error updating service:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update service'
    });
  }
});

// Delete service (protected)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const deletedService = await deleteService(req.params.id);
    
    res.json({
      success: true,
      data: deletedService,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    if (error.message === 'Service not found') {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    
    console.error('Error deleting service:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete service'
    });
  }
});

// Reorder services (protected)
router.put('/reorder/batch', requireAuth, async (req, res) => {
  try {
    const { orderedIds } = req.body;
    
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({
        success: false,
        message: 'orderedIds must be an array'
      });
    }

    const updatedServices = await reorderServices(orderedIds);
    
    res.json({
      success: true,
      data: updatedServices,
      message: 'Services reordered successfully'
    });
  } catch (error) {
    console.error('Error reordering services:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reorder services'
    });
  }
});

export default router;
