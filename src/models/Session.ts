import { Throttle } from 'stream-throttle';
import { ReadStream } from 'fs';
import { Response } from 'express';

export interface DownloadSession {
    id: string;
    fileId: string;
    token: string;
    boostMultiplier: number;
    fileStream: ReadStream | null;
    res?: Response; // mark as optional
    throttle: Throttle | null;
    intervalId: NodeJS.Timeout | null;
    startTime: Date;
    lastBoostTime: Date | null;
    challengesSolved: number;
    currentSpeed: number;   // Current speed in bytes/second
}

export interface ActiveSessions {
    [sessionId: string]: DownloadSession;
}
