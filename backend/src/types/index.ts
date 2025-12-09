export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}

export interface DocumentResponse {
    id: number;
    filename: string;
    filepath: string;
    filesize: number;
    created_at: Date;
}

export interface UploadResponse {
    id: number;
    filename: string;
    filesize: number;
    created_at: Date;
}

export enum ErrorCodes {
    FILE_TOO_LARGE = 'FILE_TOO_LARGE',
    INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
    DUPLICATE_FILE = 'DUPLICATE_FILE',
    UPLOAD_FAILED = 'UPLOAD_FAILED',
    FILE_NOT_FOUND = 'FILE_NOT_FOUND',
    DELETE_FAILED = 'DELETE_FAILED',
    DATABASE_ERROR = 'DATABASE_ERROR',
    INVALID_REQUEST = 'INVALID_REQUEST',
}