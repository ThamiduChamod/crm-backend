import { Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
import { db } from "../config/db.js";

export const saveNote = async (req:AuthRequest, res:Response) =>{
    const { content, leadId } = req.body;
    if(!content || !leadId) {
        return res.status(400).json({ message: "Content and Lead ID are required" });
    }
    try {
        const newNote =await db.note.create({
            data: {
                content,
                leadId: Number(leadId),
                userId: Number(req.user?.sub)
            }
        });
        console.log(newNote);
        res.status(200).json({isAdded: true, message: "Note saved successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error saving note" });
    }
}

export const getNotesByLeadId = async (req:AuthRequest, res:Response) => {
    const { leadId } = req.params;
    if (!leadId) {
        return res.status(400).json({ message: "Lead ID is required" });
    }
    try {
        const notes = await db.note.findMany({
            where: {
                leadId: Number(leadId)
            }
        });
        console.log(notes);
        res.status(200).json({ notes });
    } catch (error) {
        res.status(500).json({ message: "Error fetching notes" });
    }
}