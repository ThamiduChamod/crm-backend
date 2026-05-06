import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { PrismaClient } from "@prisma/client";
dotenv.config();


export const db = new PrismaClient();

export async function createDB() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  await conn.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
  console.log("DB ready 🚀");

  await conn.end();
}
