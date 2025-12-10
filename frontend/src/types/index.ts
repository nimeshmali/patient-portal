export interface Document {
  id: number;
  filename: string;
  filepath: string;
  filesize: number;
  created_at: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface UploadResponse {
  id: number;
  filename: string;
  filesize: number;
  created_at: string;
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

export const ErrorMessages: Record<ErrorCodes, string> = {
  [ErrorCodes.FILE_TOO_LARGE]: 'File size exceeds the maximum limit of 5MB',
  [ErrorCodes.INVALID_FILE_TYPE]: 'Only PDF files are allowed',
  [ErrorCodes.DUPLICATE_FILE]: 'A file with this name already exists',
  [ErrorCodes.UPLOAD_FAILED]: 'File upload failed. Please try again',
  [ErrorCodes.FILE_NOT_FOUND]: 'Document not found',
  [ErrorCodes.DELETE_FAILED]: 'Failed to delete document',
  [ErrorCodes.DATABASE_ERROR]: 'Database error occurred',
  [ErrorCodes.INVALID_REQUEST]: 'Invalid request',
};