/**
 * Generates a unique session ID.
 */
export function generateSessionId(): string {
    return Date.now() + '-' + Math.random().toString(36).substring(2);
}

/**
 * Generates a random file ID.
 */
export function generateRandomId(): string {
    return Date.now() + '-' + Math.random().toString(36).substring(2, 10);
}

/**
 * Generates a 15-character download token consisting of uppercase letters,
 * lowercase letters, and digits.
 */
export function generateDownloadToken(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 15; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
}

/**
 * Generates a JWT token for admin authentication.
 */
export function generateAdminToken(): string {
    // This would be implemented with JWT
    return 'admin_token';
}
