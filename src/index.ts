import express, { Request, Response, NextFunction } from 'express';
import cors from "cors";
import dotenv from 'dotenv';
dotenv.config();
import { signUpRouter } from './routes/signUp';
const app = express();

// Server Configuration

app.use(
  cors({
    origin: `${process.env.CLIENT}`,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes

app.use('/signup', signUpRouter);

app.get('/', (req: Request, res: Response) => {
    res.send("Hello, TypeScript + Node.js!");
});

// Error Handling

app.use((error: any, req: Request, res: Response, next:NextFunction) => {
  console.error(error);
  res.status(error.statusCode || 500).json({ message: error.message });
});

// Run The Server

const PORT: number = Number(process.env.PORT) || 3000;
app.listen(PORT, () => { console.log(`Server is running on http://localhost:${PORT}`)});