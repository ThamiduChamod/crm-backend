import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { User } from "@prisma/client";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
}

export const signInAccessToken = (user: User): string => {
    return jwt.sign(
        { 
            sub: user.id.toString(), 
            email: user.email,
            role: user.role
        }, JWT_SECRET, { expiresIn: '1h' }
    );
    
};

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

if (!JWT_REFRESH_SECRET) {
    throw new Error("JWT_REFRESH_SECRET is not defined in the environment variables");
}

export const signInRefreshToken = (user: User): string => {
    return jwt.sign(
        { 
            sub: user.id.toString(),
        }
        , JWT_REFRESH_SECRET, { expiresIn: '7d' }
    );
}
