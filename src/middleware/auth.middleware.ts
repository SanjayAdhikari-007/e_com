import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config();

const JWT_SECRET:string = process.env.JWT_SECRET as string;

export interface AuthRequest extends Request {
    userId?: string
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (token == null) {
        return res.sendStatus(401); // Unauthorized
    }

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
        if (err) {
            console.log(JWT_SECRET);
            console.log(err);
            return res.sendStatus(403); // Forbidden (invalid token)
        }

        req.userId = user.userId; // Attach user ID to the request object
        next(); // Proceed to the next middleware or route handler
    });
};