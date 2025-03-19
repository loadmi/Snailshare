import 'dotenv/config';

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import express from 'express';
import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import compression from 'compression';
import session from 'express-session';
import morgan from 'morgan';
import cors from 'cors';
import { Server as SocketServer } from 'socket.io';
import expressLayouts from 'express-ejs-layouts';
import config from './config';
import DatabaseService from './services/DatabaseService';
import router from './routes';
import FileService from './services/FileService';
import helmet from 'helmet';

// Initialize the app
const app = express();

// Security middleware
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
                styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
                fontSrc: ["'self'", 'https://fonts.gstatic.com'],
                imgSrc: ["'self'", 'data:'],
                connectSrc: ["'self'", 'wss:'],
            },
        },
    })
);

// Enable CORS for development
if (config.server.env === 'development') {
    app.use(cors());
}

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan('dev'));

// Body parsing middleware
app.use(express.json({ limit: '2gb' }));
app.use(express.urlencoded({ extended: true, limit: '2gb' }));

// Session middleware
app.use(
    session({
        secret: config.security.sessionSecret,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: config.server.env === 'production',
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        },
    })
);

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Add express-ejs-layouts
app.use(expressLayouts);
app.set('layout', 'layouts/main');
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// Initialize database
DatabaseService.initialize().catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
});

// Set up scheduled cleanup of expired files
const ONE_HOUR = 60 * 60 * 1000;
setInterval(async () => {
    try {
        const count = await FileService.cleanupExpiredFiles();
        if (count > 0) {
            console.log(`Cleaned up ${count} expired files`);
        }
    } catch (error) {
        console.error('Error during scheduled cleanup:', error);
    }
}, ONE_HOUR);

// Routes
app.use('/', router);

// 404 handler
app.use((req, res) => {
    res.status(404).render('error', {
        title: 'Not Found',
        message: 'The page you are looking for does not exist.',
    });
});

// Error handler
app.use(
    (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.error('Unhandled error:', err);
        res.status(500).render('error', {
            title: 'Server Error',
            message:
                config.server.env === 'production'
                    ? 'An unexpected error occurred.'
                    : err.message || 'Unknown error',
        });
    }
);

// Create HTTPS server
let server;
try {
    const sslOptions = {
        key: fs.readFileSync(config.ssl.keyPath),
        cert: fs.readFileSync(config.ssl.certPath),
    };
    server = https.createServer(sslOptions, app);
} catch (error) {
    console.error('Failed to load SSL certificates:', error);
    console.log('Falling back to HTTP server (not recommended for production)');
    server = http.createServer(app);
}

// Set up Socket.IO for real-time updates
const io = new SocketServer(server);

io.on('connection', (socket) => {
    console.log('New WebSocket connection:', socket.id);

    socket.on('joinDownloadSession', (sessionId) => {
        socket.join(`download-${sessionId}`);
        console.log(`Socket ${socket.id} joined download session ${sessionId}`);
    });

    socket.on('disconnect', () => {
        console.log('WebSocket disconnected:', socket.id);
    });
});

// Add Socket.IO to app for use in controllers
app.set('io', io);

// Start the server
const PORT = config.server.port;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${config.server.env} mode`);
    console.log(`Visit: https://localhost:${PORT} (if running locally)`);
});

// Handle uncaught exceptions and rejections
process.on('uncaughtException', (err) => {
    console.error('Uncaught exception:', err);
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled rejection:', err);
});

export default app;
