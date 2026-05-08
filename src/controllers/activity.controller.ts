import { db } from "../config/db.js";
import { AuthRequest } from "../middleware/auth.js";
import { Response } from "express";

export const getActivities = async (req:AuthRequest, res: Response) => {
  try {
    console.log("Fetching activities...");
    const notes = await db.note.findMany({
      include: {
        user: true,
        lead: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    const leads = await db.leader.findMany({
      include: {
        assignedUser: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    // NOTES → activity
    const noteActivities = notes.map(n => ({
      id: `note-${n.id}`,
      type: "note",
      user: n.user.name,
      action: "added a note to",
      target: n.lead.name,
      content: n.content,
      time: n.createdAt,
      icon: "MessageSquare",
      color: "text-blue-600",
      bg: "bg-blue-50"
    }));

    // LEADS → activity
    const leadActivities = leads.map(l => ({
      id: `lead-${l.id}`,
      type: "lead",
      user: l.assignedUser.name,
      action: "created a lead",
      target: l.name,
      content: `Source: ${l.source} | Value: ${l.dealValue}`,
      time: l.createdAt,
      icon: "UserPlus",
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    }));

    const activities = [...noteActivities, ...leadActivities]
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

    res.status(200).json({ activities });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching activities" });
  }
};