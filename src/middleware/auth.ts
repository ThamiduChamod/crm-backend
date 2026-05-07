import { Request, Response, NextFunction } from 'express';
import Jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export interface AuthRequest extends Request {
    user?: any; // You can replace 'any' with your User type if you have one
}
export const authenticate = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    try {
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const payload = Jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = payload; // Attach user info to the request object
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Unauthorized' });
    }
}