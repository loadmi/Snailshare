import databaseService from '../services/DatabaseService.js';
import fileService from '../services/FileService.js';
import throttleService from '../services/ThrottleService.js';
import { verifyAdminPassword } from '../utils/security.js';
class AdminController {
    async showLoginPage(req, res) {
        res.render('admin-login', {
            title: 'Admin Login',
            error: null
        });
    }
    async handleLogin(req, res) {
        try {
            const { password } = req.body;
            if (!password) {
                return res.status(400).render('admin-login', {
                    title: 'Admin Login',
                    error: 'Password is required'
                });
            }
            const isValid = await verifyAdminPassword(password);
            if (isValid) {
                // Set admin session
                if (req.session) {
                    req.session.isAdmin = true;
                }
                // Redirect to dashboard
                return res.redirect('/admin/dashboard');
            }
            else {
                return res.status(401).render('admin-login', {
                    title: 'Admin Login',
                    error: 'Invalid password'
                });
            }
        }
        catch (error) {
            console.error('Admin login error:', error);
            res.status(500).render('admin-login', {
                title: 'Admin Login Error',
                error: 'An error occurred during login'
            });
        }
    }
    async showDashboard(req, res) {
        try {
            // Get all files
            const files = await databaseService.getAllFiles();
            // Get throttle settings
            const baseRate = await throttleService.getBaseRate();
            // Format files for display
            const formattedFiles = files.map((file) => {
                return {
                    ...file,
                    formattedSize: formatFileSize(file.metadata.size),
                    timeAgo: formatTimeAgo(file.metadata.createdAt),
                    expiresIn: formatTimeAgo(file.metadata.expiresAt, true)
                };
            });
            // Get active download sessions
            const sessions = throttleService.getActiveSessions();
            const sessionCount = throttleService.getActiveSessionCount();
            function formatFileSize(bytes) {
                if (bytes < 1024)
                    return bytes + ' bytes';
                if (bytes < 1024 * 1024)
                    return (bytes / 1024).toFixed(2) + ' KB';
                if (bytes < 1024 * 1024 * 1024)
                    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
                return (bytes / 1024 / 1024 / 1024).toFixed(2) + ' GB';
            }
            // Helper function to format time ago
            function formatTimeAgo(dateString, isExpiry = false) {
                const date = new Date(dateString);
                const now = new Date();
                const diffMs = now - date;
                const diffSec = Math.floor(diffMs / 1000);
                if (diffSec < 60)
                    return `${diffSec} sec ago`;
                if (diffSec < 3600)
                    return `${Math.floor(diffSec / 60)} min ago`;
                if (diffSec < 86400)
                    return `${Math.floor(diffSec / 3600)} hours ago`;
                return `${Math.floor(diffSec / 86400)} days ago`;
            }
            res.render('admin-dashboard', {
                title: 'Admin Dashboard',
                files: formattedFiles,
                sessions,
                sessionCount,
                baseRate,
                formatFileSize,
                formatTimeAgo
            });
        }
        catch (error) {
            console.error('Error loading admin dashboard:', error);
            res.status(500).render('error', {
                title: 'Dashboard Error',
                message: 'Failed to load admin dashboard'
            });
        }
    }
    async handleDeleteFile(req, res) {
        try {
            const { fileId } = req.params;
            if (!fileId) {
                return res.status(400).json({
                    success: false,
                    message: 'File ID is required'
                });
            }
            const deleted = await fileService.deleteFile(fileId);
            if (deleted) {
                return res.json({ success: true });
            }
            else {
                return res.status(404).json({
                    success: false,
                    message: 'File not found'
                });
            }
        }
        catch (error) {
            console.error('Delete file error:', error);
            res.status(500).json({
                success: false,
                message: 'An error occurred while deleting the file'
            });
        }
    }
    async updateBaseRate(req, res) {
        try {
            const { rate } = req.body;
            const newRate = parseInt(rate, 10);
            if (isNaN(newRate) || newRate <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid rate value'
                });
            }
            await throttleService.setBaseRate(newRate);
            res.json({ success: true });
        }
        catch (error) {
            console.error('Update rate error:', error);
            res.status(500).json({
                success: false,
                message: 'An error occurred while updating the rate'
            });
        }
    }
    async clearDatabase(req, res) {
        try {
            // Delete all files
            const files = await databaseService.getAllFiles();
            for (const file of files) {
                await fileService.deleteFile(file.id);
            }
            // Clear database
            await databaseService.clearDatabase();
            res.json({ success: true });
        }
        catch (error) {
            console.error('Error clearing database:', error);
            res.status(500).render('error', {
                title: 'Error',
                message: 'An error occurred while clearing the database'
            });
        }
    }
    async downloadBackup(req, res) {
        try {
            const backup = await databaseService.getBackup();
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Disposition', 'attachment; filename="db_backup.json"');
            res.send(backup);
        }
        catch (error) {
            console.error('Backup error:', error);
            res.status(500).render('error', {
                title: 'Server Error',
                message: 'An error occurred while creating the backup.'
            });
        }
    }
    async cleanupExpiredFiles(req, res) {
        try {
            const deletedCount = await fileService.cleanupExpiredFiles();
            res.json({
                success: true,
                message: `Cleaned up ${deletedCount} expired files`
            });
        }
        catch (error) {
            console.error('Cleanup error:', error);
            res.status(500).json({
                success: false,
                message: 'An error occurred during cleanup'
            });
        }
    }
}
export default new AdminController();
