import express from 'express';
import uploadRoutes from './upload.js';
import downloadRoutes from './download.js';
import adminRoutes from './admin.js';

const router = express.Router();

// Home route
router.use('/', uploadRoutes);

// Download routes
router.use('/', downloadRoutes);

// Admin routes
router.use('/admin', adminRoutes);

export default router;
