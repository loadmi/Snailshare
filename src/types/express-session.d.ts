import 'express-session';

declare module 'express-session' {
    interface SessionData {
        isAdmin?: boolean;
        // You can add other custom session properties here
    }
}