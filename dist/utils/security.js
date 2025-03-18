import bcrypt from 'bcrypt';
import crypto from 'crypto';
import config from '../config/index.js';
/**
 * Hash a password using bcrypt.
 */
export async function hashPassword(password) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
}
/**
 * Compare a password with a hash.
 */
export async function comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
}
/**
 * Generate a secure random string of specified length.
 */
export function generateSecureToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
}
/**
 * Verify admin password against stored hash.
 */
export async function verifyAdminPassword(password) {
    const storedHash = config.security.adminPasswordHash;
    if (!storedHash) {
        console.error('Admin password hash not configured!');
        return false;
    }
    return bcrypt.compare(password, storedHash);
}
