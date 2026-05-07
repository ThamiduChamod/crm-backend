import {Request, Response} from 'express';
import bcrypt from "bcrypt";
import { db } from "../config/db.js";
import { signInAccessToken, signInRefreshToken } from '../util/token.js';



export const register = async (req: Request, res: Response) => {
    try {
        const {name, email, password} = req.body;
        console.log(name);

        const existingUser = await db.user.findUnique({
            where:{email}
        })

        if (existingUser){
            console.log("User already exists with email:", email);
            res.status(400).json({message: "User already exists"})
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await db.user.create({
            data:{
                name,
                email,
                password: hashedPassword
            }
        })

        const accessToken = signInAccessToken(newUser);
        const refreshToken = signInRefreshToken(newUser);
        res.status(200).json({
            login: true,
            message: "Register successfully",
            data: {
                accessToken,
                refreshToken,
                email: newUser.email,
                role: newUser.role
            }
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
    

    
    
}

export const login = async (req: Request, res: Response) => {
    const {email, password} = req.body;
    console.log(email);
    try {
        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return;
        }

        const user = await db.user.findUnique({
            where:{email}
        })

        if (!user){
            res.status(401).json({message: "Invalid credentials"})
            return;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid){
            res.status(401).json({message: "Invalid credentials"})
            return;
        }

        const accessToken = signInAccessToken(user);
        const refreshToken = signInRefreshToken(user);
        res.status(200).json({
            login: true,
            message: "Login successfully",
            data: {
                accessToken,
                refreshToken,
                email: user.email,
                role: user.role
            }
        })
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
        return;
    }

}

