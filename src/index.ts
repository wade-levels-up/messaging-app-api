import express, { Request, Response } from 'express';
require ("dotenv").config();

const app = express();
const PORT = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
    res.send("Hello, TypeScript + Node.js!");
});

app.listen(PORT, () => { console.log(`Server is running on http://localhost:${PORT}`)});