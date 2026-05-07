import { User } from "@prisma/client";
import { AuthRequest } from "./auth.js";
import { NextFunction, Response } from "express";

export const requireRole = (roles: User["role"][]) => {
    return( req:AuthRequest, res:Response, next:NextFunction) => {
        if(!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const hasRole = roles.some((role) => req.user.role?.includes(role))

        if (!hasRole) {
            return res.status(403).json({ message: "Forbidden: Insufficient role" });
        }
        next();
    }
}