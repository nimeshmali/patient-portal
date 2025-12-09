import { Router } from 'express';
import { DocumentController } from '../controllers/documentController';
import { upload, handleMulterError } from '../middleware/upload';
import { validateIdParam } from '../middleware/validator';
import { Request, Response, NextFunction } from 'express';

const router = Router();

// Upload document
router.post(
    '/upload',
    (req: Request, res: Response, next: NextFunction) => {
        upload.single('file')(req, res, (err: any) => {
            if (err) {
                const error = handleMulterError(err);
                return res.status(400).json({
                    success: false,
                    error: error.code,
                    message: error.message,
                });
            }
            next();
        });
    },
    DocumentController.uploadDocument
);

// Get all documents
router.get('/', DocumentController.getAllDocuments);

// Download document
router.get('/:id', validateIdParam, DocumentController.downloadDocument);

// Delete document
router.delete('/:id', validateIdParam, DocumentController.deleteDocument);

export default router;