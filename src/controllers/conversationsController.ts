import { Request, Response } from 'express';
import { handleError } from '../utils/handleError';
import asyncHandler from 'express-async-handler';
import prisma from '../utils/prismaClient';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();
import crypto from 'crypto';
import bcrypt from "bcryptjs";
import { default as jwt } from 'jsonwebtoken';


export const getUserConversations = asyncHandler(async (req: Request, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: (req as any).userId },
            include: { conversations: true }
        });

        res.status(200).json({ message: "Conversations retrieved", conversations: user?.conversations});
    } catch(error) {
        handleError(error);
    }    
})
