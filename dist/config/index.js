import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
// Compute __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Load environment variables
dotenv.config();
// Create userfiles directory if it doesn't exist
const uploadDir = process.env.UPLOAD_DIR || './userfiles';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
const config = {
    server: {
        port: process.env.PORT || 443,
        env: process.env.NODE_ENV || 'development',
    },
    security: {
        adminPasswordHash: process.env.ADMIN_PASSWORD_HASH,
        jwtSecret: process.env.JWT_SECRET || 'default_jwt_secret_change_me',
        sessionSecret: process.env.SESSION_SECRET || 'default_session_secret_change_me',
    },
    files: {
        maxSize: parseInt(process.env.MAX_FILE_SIZE || '1000000000', 10), // 1GB default
        uploadDir: uploadDir,
        expiryDays: parseInt(process.env.FILE_EXPIRY_DAYS || '7', 10),
    },
    download: {
        baseRate: parseInt(process.env.BASE_DOWNLOAD_RATE || '102400', 10), // 100KB/s default
        maxSessions: parseInt(process.env.MAX_DOWNLOAD_SESSIONS || '100', 10),
    },
    ssl: {
        keyPath: process.env.SSL_KEY_PATH || join(__dirname, '../../key.pem'),
        certPath: process.env.SSL_CERT_PATH || join(__dirname, '../../cert.pem'),
    },
};
export default config;
