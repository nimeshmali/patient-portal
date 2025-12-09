import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/api/health', (req: Request, res: Response) => {
    res.json({
        status: 'success',
        message: 'Backend server is running!',
        timestamp: new Date().toISOString(),
    });
});

// Test route with data
app.get('/api/test', (req: Request, res: Response) => {
    res.json({
        status: 'success',
        data: {
            message: 'Frontend and Backend are connected successfully!',
            backend: 'Node.js + TypeScript',
            frontend: 'React + TypeScript + Vite',
        },
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
    console.log(`✅ Test the API at http://localhost:${PORT}/api/health`);
});