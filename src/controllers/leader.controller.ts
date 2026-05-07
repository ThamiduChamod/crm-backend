import { isUint16Array } from "node:util/types";
import { db } from "../config/db.js";
import { AuthRequest } from "../middleware/auth.js";
import { Response } from "express";

export const saveLeader = async (req: AuthRequest, res: Response) => {
    console.log("method called");
    console.log(req.body);
    const { name, company, email, phone, source, status, dealValue } = req.body;
    // console.log(name, company, email, phone, source, status, dealValue);
    if(!name || !company || !email || !phone || !source || !status || !dealValue) {
        return res.status(400).json({ message: "All fields are required" });
    }
    
    console.log("User ID:", req.user?.sub);
    if(!req.user) {
        console.log("User is not authenticated");
        return res.status(401).json({ message: "Unauthorized" });

    }
    console.log("User is authenticated");
    try {
        const existingLeader = await db.leader.findUnique({
            where:{ email }
        })

        if(existingLeader){
            return res.status(405).json({message: "Leader are already existing"})
        }

        const newLeader = await db.leader.create({
            data: {
                name,
                company,
                email,
                phone,
                source,
                status,
                dealValue: Number(dealValue),
                assignedUserId: Number(req.user.sub)
            }
        });

        res.status(200).json({isAdded: true, message: "Leader saved successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

export const getAll = async (req: AuthRequest, res: Response) => {
    if(!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const leaders = await db.leader.findMany();
        console.log(leaders);
        res.status(200).json({data: { leaders } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

export const getLeaderDetails = async (req: AuthRequest, res: Response) => {
    if(!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const leader = await db.leader.findUnique({
            where: {
                id: Number(req.params.id)
            }
        });
        if(!leader) {
            return res.status(404).json({ message: "Leader not found" });
        }
        res.status(200).json({data: { leader } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

export const deleteLeader = async (req: AuthRequest, res: Response) => {
    if(!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const leader = await db.leader.findUnique({
            where: {
                id: Number(req.params.id)
            }
        });
        if(!leader) {
            return res.status(404).json({ message: "Leader not found" });
        }
        await db.leader.delete({
            where: {
                id: Number(req.params.id)
            }
        });
        res.status(200).json({ message: "Leader deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

export const updateLeader = async (req: AuthRequest, res: Response) => {
    if(!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const { name, email, status, dealValue } = req.body;
    try {
        const leader = await db.leader.findUnique({
            where: {
                id: Number(req.params.id)
            }
        });
        if(!leader) {
            return res.status(404).json({ message: "Leader not found" });
        }
        const updatedLeader = await db.leader.update({
            where: {
                id: Number(req.params.id)
            },
            data: {
                name,
                email,
                status,
                dealValue: Number(dealValue)
            }
        });
        res.status(200).json({isUpdated: true, message: "Leader updated successfully", data: { leader: updatedLeader } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}
