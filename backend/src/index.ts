import express, { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';

// App configuration
const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(cors());

// API endpoints
// Server health
app.get('/', (req: Request, res: Response) => {
  res.send('API WORKING');
});

// Listener
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
