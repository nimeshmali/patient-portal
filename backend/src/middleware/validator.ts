import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';
import { ErrorCodes } from '../types';

export const validateIdParam = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const id = parseInt(req.params.id);

    if (isNaN(id) || id <= 0) {
        throw new AppError(400, ErrorCodes.INVALID_REQUEST, 'Invalid document ID');
    }

    next();
};