export interface Document {
    id: number;
    filename: string;
    filepath: string;
    filesize: number;
    created_at: string;
}

export interface UploadResponse {
    message: string;
    document: Document;
}

export interface ErrorResponse {
    error: string;
}