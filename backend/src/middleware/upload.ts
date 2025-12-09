import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import { ErrorCodes } from '../types';

// Ensure uploads directory exists
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Generate unique filename to handle duplicates and concurrent uploads
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        const nameWithoutExt = path.basename(file.originalname, ext);
        // Sanitize filename
        const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9-_]/g, '_');
        cb(null, `${sanitizedName}-${uniqueSuffix}${ext}`);
    },
});

// File filter for PDF only
const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {
    const allowedMimeTypes = ['application/pdf'];
    const allowedExtensions = ['.pdf'];

    const ext = path.extname(file.originalname).toLowerCase();
    const mimeType = file.mimetype;

    if (allowedMimeTypes.includes(mimeType) && allowedExtensions.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error(ErrorCodes.INVALID_FILE_TYPE));
    }
};

// Configure multer
export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB default
    },
});

// Error handler for multer
export const handleMulterError = (error: any) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return {
                code: ErrorCodes.FILE_TOO_LARGE,
                message: 'File size exceeds the maximum limit of 5MB',
            };
        }
        if (error.code === 'LIMIT_UNEXPECTED_FILE') {
            return {
                code: ErrorCodes.INVALID_REQUEST,
                message: 'Unexpected field in file upload',
            };
        }
    }

    if (error.message === ErrorCodes.INVALID_FILE_TYPE) {
        return {
            code: ErrorCodes.INVALID_FILE_TYPE,
            message: 'Only PDF files are allowed',
        };
    }

    return {
        code: ErrorCodes.UPLOAD_FAILED,
        message: 'File upload failed',
    };
};