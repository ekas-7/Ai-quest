// src/app.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import authRouter from './routes/authRouter';
import postRouter from './routes/postRouter';

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(cors());

// API endpoints
app.get('/', (req: Request, res: Response) => {
  res.send('API WORKING');
});

// Use Auth Router for authentication routes
app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);

// Listener
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
