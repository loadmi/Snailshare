export interface FileMetadata {
    id: string;              // Random filename used in storage
    originalName: string;    // Original filename from user
    size: number;            // File size in bytes
    mimeType: string;        // File MIME type
    uploadDate: Date;        // When the file was uploaded
    expiryDate: Date;        // When the file will expire
    downloadCount: number;   // Number of times the file has been downloaded
    token: string;           // Public download token
    isEncrypted: boolean;    // Whether the file is encrypted
}

export interface UploadedFile {
    metadata: FileMetadata;
    path: string;            // Full path to the file on disk
}
