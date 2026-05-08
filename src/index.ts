import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { execSync } from "child_process";
import authRouter from "./routes/auth.routes.js";
import leaderRouter from "./routes/leader.routes.js";
import noteRouter from "./routes/note.routes.js";
import activityRouter from "./routes/activity.routs.js";
import { createDB, db } from "./config/db.js";

dotenv.config();

const SERVER_PORT = process.env.SERVER_PORT || 5000;

const app = express();

app.use(express.json());

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.use("/api/auth", authRouter);
app.use("/api/leader", leaderRouter);
app.use("/api/note", noteRouter);
app.use("/api/activity", activityRouter);

console.log("Starting server...");

// async function testDBConnection() {
//     try {
//         await db.query("SELECT 1");
//         console.log("Database connection successful");
//     } catch (error) {
//         console.error("Error connecting to DB:", error);
//     }
// }

if (process.env.NODE_ENV !== "production") {
    try {
        console.log("Syncing DB with Prisma...");
        execSync("npx prisma db push", { stdio: "inherit" });
    } catch (err) {
        console.error("Prisma sync failed:", err);
    }
}

async function startServer() {
    try {
        await createDB();
        // await testDBConnection();

        app.listen(SERVER_PORT, () => {
            console.log(`Server running on port ${SERVER_PORT}`);
        });
    } catch (err) {
        console.error("Startup error:", err);
    }
}

startServer();