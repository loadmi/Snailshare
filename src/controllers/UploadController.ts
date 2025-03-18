import { Request, Response } from 'express';

import path from 'path';
import fileService from '../services/FileService.js';
import { isValidFile } from '../middleware/fileValidation.js';
import config from '../config/index.js';

import pkg, {Fields, Files} from 'formidable';
const { IncomingForm } = pkg;
class UploadController {
    async showUploadPage(req: Request, res: Response): Promise<void> {
        res.render('home', {
            title: 'Snailshare - Secure File Hosting',
        });
    }

    async handleFileUpload(req: Request, res: Response): Promise<void> {
        try {
            // Configure formidable
            const uploadDir = path.resolve(config.files.uploadDir);
            const form = new IncomingForm({
                uploadDir,
                keepExtensions: true,
                maxFileSize: config.files.maxSize,
            });

            // Helper function to wrap form.parse in a promise
            const parseForm = (
                req: Request,
                form: InstanceType<typeof IncomingForm>
            ): Promise<[Fields, Files]> => {
                return new Promise((resolve, reject) => {
                    form.parse(req, (err: any, fields: Fields, files: Files) => {
                        if (err) return reject(err);
                        resolve([fields, files]);
                    });
                });
            };

            // Parse the form using the helper
            const [fields, files] = await parseForm(req, form);

            // Get the uploaded file
            const uploadedFile = Array.isArray(files.uploadfile)
                ? files.uploadfile[0]
                : files.uploadfile;

            if (!uploadedFile) {
                res.status(400).render('error', {
                    title: 'Upload Error',
                    message: 'No file was uploaded.'
                });
                return;
            }

            const originalName = uploadedFile.originalFilename || 'unknown';
            const tempPath = uploadedFile.filepath;
            const fileSize = uploadedFile.size;
            const mimeType = uploadedFile.mimetype || 'application/octet-stream';

            // Validate the file
            const validation = isValidFile(originalName, fileSize, mimeType);
            if (!validation.valid) {
                res.status(400).render('error', {
                    title: 'Upload Error',
                    message: validation.reason || 'Invalid file.'
                });
                return;
            }

            // Create file metadata
            const metadata = await fileService.createUploadMetadata(
                originalName,
                fileSize,
                mimeType
            );

            // Save the file
            const savedFile = await fileService.saveUploadedFile(tempPath, metadata);

            // Construct share URL
            const host = req.headers.host;
            const shareUrl = `https://${host}/start?file=${savedFile.metadata.token}`;

            // Render success page
            res.render('upload-success', {
                title: 'Upload Successful',
                fileName: originalName,
                shareUrl,
            });
        } catch (error) {
            console.error('Upload error:', error);
            res.status(500).render('error', {
                title: 'Upload Error',
                message: 'An error occurred while uploading your file.'
            });
        }
    }
}

export default new UploadController();
