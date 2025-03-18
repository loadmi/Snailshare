import { verifyAdminPassword } from '../utils/security.js';
/**
 * Middleware to check for admin authentication.
 */
export async function requireAdmin(req, res, next) {
    // For simple admin auth, we'll use a session approach
    if (req.session && req.session.isAdmin === true) {
        return next();
    }
    // Check for password in query params (for dashboard)
    const queryPassword = req.query.pass;
    if (queryPassword && await verifyAdminPassword(queryPassword)) {
        if (req.session) {
            req.session.isAdmin = true;
        }
        return next();
    }
    res.status(401).render('admin-login', {
        error: req.query.error ? 'Invalid credentials' : null
    });
}
/**
 * Middleware to protect API routes with a simple API key
 * (This could be enhanced with JWT in a production environment)
 */
export function requireApiKey(req, res, next) {
    const apiKey = req.headers['x-api-key'];
    // In production, you'd validate against a stored key
    if (apiKey === 'YOUR_API_KEY') {
        return next();
    }
    res.status(401).json({ error: 'Unauthorized' });
}
/**
 * Middleware to check for valid download session
 */
export function requireValidSession(req, res, next) {
    const sessionId = req.query.session;
    if (!sessionId) {
        return res.status(400).json({ error: 'Session ID required' });
    }
    // The actual session validation will happen in the controller
    // This middleware just ensures the parameter exists
    next();
}
