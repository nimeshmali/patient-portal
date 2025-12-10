import { Request, Response, NextFunction } from 'express';
import { DocumentModel } from '../models/documentModel';
import { AppError } from '../middleware/errorHandler';
import { ErrorCodes, ApiResponse, UploadResponse, DocumentResponse } from '../types';
import path from 'path';
import fs from 'fs';

export class DocumentController {
    // Upload document
    static async uploadDocument(req: Request, res: Response, next: NextFunction) {
        try {
            const file = req.file;

            if (!file) {
                throw new AppError(400, ErrorCodes.INVALID_REQUEST, 'No file uploaded');
            }

            // Allow duplicate uploads by generating a unique display filename.
            // The stored filepath (on disk) will remain the multer-generated filename
            // (req.file.filename) so files don't collide on disk.
            const originalName = file.originalname;
            const parsed = path.parse(originalName);

            let displayName = originalName;
            let counter = 1;
            // Loop until we find a filename that doesn't exist in DB
            while (await DocumentModel.findByFilename(displayName)) {
                displayName = `${parsed.name} (${counter})${parsed.ext}`;
                counter += 1;
            }

            // Save document metadata to database using the unique display name
            const document = await DocumentModel.create({
                filename: displayName,
                filepath: file.filename, // stored filename on disk
                filesize: file.size,
            });

            const response: ApiResponse = {
                success: true,
                message: 'File uploaded successfully',
                data: {
                    id: document.id,
                    filename: document.filename,
                    filesize: document.filesize,
                    created_at: document.created_at,
                },
            };

            res.status(201).json(response);
        } catch (error) {
            // Clean up file if database operation fails
            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }

            if (error instanceof AppError) {
                next(error);
            } else {
                next(
                    new AppError(
                        500,
                        ErrorCodes.DATABASE_ERROR,
                        'Failed to save document metadata'
                    )
                );
            }
        }
    }

    // Get all documents
    static async getAllDocuments(req: Request, res: Response, next: NextFunction) {
        try {
            const documents = await DocumentModel.findAll();

            const response: ApiResponse = {
                success: true,
                message: 'Documents retrieved successfully',
                data: documents.map((doc: DocumentResponse) => ({
                    id: doc.id,
                    filename: doc.filename,
                    filepath: doc.filepath,
                    filesize: doc.filesize,
                    created_at: doc.created_at,
                })),
            };

            res.status(200).json(response);
        } catch (error) {
            next(
                new AppError(
                    500,
                    ErrorCodes.DATABASE_ERROR,
                    'Failed to retrieve documents'
                )
            );
        }
    }

    // Download document
    static async downloadDocument(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);

            const document = await DocumentModel.findById(id);

            if (!document) {
                throw new AppError(404, ErrorCodes.FILE_NOT_FOUND, 'Document not found');
            }

            const uploadDir = process.env.UPLOAD_DIR || 'uploads';
            const filePath = path.join(uploadDir, document.filepath);

            // Check if file exists on disk
            if (!fs.existsSync(filePath)) {
                throw new AppError(
                    404,
                    ErrorCodes.FILE_NOT_FOUND,
                    'File not found on server'
                );
            }

            // Set headers for file download
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader(
                'Content-Disposition',
                `attachment; filename="${document.filename}"`
            );
            res.setHeader('Content-Length', document.filesize.toString());

            // Stream file to response
            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);

            fileStream.on('error', (error) => {
                console.error('File stream error:', error);
                if (!res.headersSent) {
                    next(
                        new AppError(
                            500,
                            ErrorCodes.FILE_NOT_FOUND,
                            'Error streaming file'
                        )
                    );
                }
            });
        } catch (error) {
            next(error);
        }
    }

    // Delete document
    static async deleteDocument(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);

            const document = await DocumentModel.findById(id);

            if (!document) {
                throw new AppError(404, ErrorCodes.FILE_NOT_FOUND, 'Document not found');
            }

            const uploadDir = process.env.UPLOAD_DIR || 'uploads';
            const filePath = path.join(uploadDir, document.filepath);

            // Delete file from disk
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            // Delete from database
            const deleted = await DocumentModel.deleteById(id);

            if (!deleted) {
                throw new AppError(
                    500,
                    ErrorCodes.DELETE_FAILED,
                    'Failed to delete document from database'
                );
            }

            const response: ApiResponse = {
                success: true,
                message: 'Document deleted successfully',
            };

            res.status(200).json(response);
        } catch (error) {
            if (error instanceof AppError) {
                next(error);
            } else {
                next(
                    new AppError(
                        500,
                        ErrorCodes.DELETE_FAILED,
                        'Failed to delete document'
                    )
                );
            }
        }
    }
}