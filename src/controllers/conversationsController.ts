import { Request, Response } from 'express';
import { handleError } from '../utils/handleError';
import asyncHandler from 'express-async-handler';
import prisma from '../utils/prismaClient';
import dotenv from 'dotenv';
dotenv.config();


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

export const getConversationMessages = asyncHandler(async (req: Request, res: Response) => {
    try {
        console.log('Inside getConversationMessages function')

        const user = await prisma.user.findUnique({
            where: { id: (req as any).userId },
            include: { conversations: true }
        });

       let conversationFound = false;
       user?.conversations.forEach((conversation) => {
            if (conversation.id === Number(req.params["conversation-id"])) {
                conversationFound = true;
            }
       })

       console.log(`conversation-id param: ${req.params["conversation-id"]}`)

       if (!conversationFound) {
        res.status(404).json({ message: "Invalid conversation ID. No Conversation found" });
        return;
       }

        const messages = await prisma.conversation.findUnique({
            where: {
                id: Number(req.params["conversation-id"])
            }
        })

        res.status(200).json({ message: "Conversations retrieved", conversations: messages});
    } catch(error) {
        handleError(error);
    }
})
