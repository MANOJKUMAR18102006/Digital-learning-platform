import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connerDB from './config/db.js'
import errorHandler from './middleware/errorHandler.js'
I
// ES6 module_dirname alternative
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(__filename);
// Initialize express app
const app = express();
// Connect to MongoDB
connectDB();
// Middleware to handle CORS
app.use(
    cors({
        origin: "",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    }
    ));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));