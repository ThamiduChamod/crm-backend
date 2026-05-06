import {Request, Response} from 'express';
import bcrypt from "bcrypt";
import { db } from "../config/db.js";



export const register = async (req: Request, res: Response) => {
    try {
        const {name, email, password} = req.body;
        console.log(name);

        const existingUser = await db.user.findUnique({
            where:{email}
        })

        if (existingUser){
            res.status(400).json({message: "User already exists"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await db.user.create({
            data:{
                name,
                email,
                password: hashedPassword
            }
        })

        res.status(201).json({
            message: "User Create successfully",
            user: newUser
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
    

    
    
}

export const login = async (req: Request, res: Response) => {
    const {username, password} = req.body;

    // Here you would typically check the username and password against your database
    if (username === 'admin' && password === 'password') {
        res.json({message: 'Login successful', token: 'fake-jwt-token'});
    } else {
        res.status(401).json({message: 'Invalid credentials'});
    }
}