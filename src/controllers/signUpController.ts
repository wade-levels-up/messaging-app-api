import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';

export const signUp = (req: Request, res: Response) => {
    res.send("This is the Sign Up Controller Route")
}