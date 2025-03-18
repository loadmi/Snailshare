import express from 'express';
import uploadController from '../controllers/UploadController.js';
import { validateFileUpload } from '../middleware/fileValidation.js';

const router = express.Router();

// Home page with upload form
router.get('/', uploadController.showUploadPage);

// Handle file upload
router.post('/', validateFileUpload, uploadController.handleFileUpload);

export default router;
