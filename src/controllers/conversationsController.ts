import { Request, Response } from 'express';
import { handleError } from '../utils/handleError';
import asyncHandler from 'express-async-handler';
import prisma from '../utils/prismaClient';

export const getUserConversations = asyncHandler(async (req: Request, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: (req as any).userId },
            include: { conversations: { include: { users: { select: { username: true } } } } } // Only return usernames
        });

        res.status(200).json({ message: "Conversations retrieved", conversations: user?.conversations});
    } catch(error) {
        handleError(error);
    }    
})

export const getConversationMessages = asyncHandler(async (req: Request, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: (req as any).userId },
            include: { conversations: true }
        });

       let conversationFound = false;
       user?.conversations.forEach((conversation) => {
            if (conversation.id === Number(req.params["conversation_id"])) {
                conversationFound = true;
            }
       })

       if (!conversationFound) {
        res.status(404).json({ message: "Invalid conversation ID. No Conversation found" });
        return;
       }

        const conversation = await prisma.conversation.findUnique({
            where: {
                id: Number(req.params["conversation_id"])
            },
            include: { messages: true }
        })

        res.status(200).json({ message: "Conversations retrieved", conversationMessages: conversation?.messages});
    } catch(error) {
        handleError(error);
    }
})

interface NewConversationBody {
  sender: string;
  recipient: string;
  openingMessage: string;
}

export const createConversation = asyncHandler(async (req: Request<{}, {}, NewConversationBody>, res: Response) => {
    try {
        const { sender, recipient, openingMessage } = req.body

        const existingConversation = await prisma.conversation.findFirst({
            where: {
                AND: [
                    { users: { some: { username: sender } } },
                    { users: { some: { username: recipient } } }
                ]
            }
        });

        if (existingConversation) {
            res.status(400).json({ message: "Can't create new conversation. Conversation already exists between these users"});
            return;
        }

        await prisma.conversation.create({
            data: {
                users: {
                    connect: [
                        { username: sender},
                        { username: recipient}
                    ]
                },
                lastMessage: openingMessage,
                messages: {
                    create: [
                        {
                            content: openingMessage,
                            authorName: sender,
                            userId: (req as any).userId,
                        }
                    ]
                }
            }
        })

        res.status(201).json({ message: `New conversation started between JohnDoe and ${recipient}` });
    } catch(error) {
        handleError(error);
    }    
})

interface NewMessageBody {
  sender: string;
  content: string;
}

export const createMessage = asyncHandler(async (req: Request<Record<string, string>, {}, NewMessageBody>, res: Response) => {
    try {
        const { sender, content } = req.body
        const conversationId = Number(req.params.conversation_id);

        const existingConversation = await prisma.conversation.findUnique({ where: { id: conversationId } });
        if (!existingConversation) {
            res.status(400).json({ message: `Can't find conversation. Unable to create message`});
            return;
        }

        await prisma.message.create({
            data: {
                content: content,
                authorName: sender,
                user: { connect: { id: (req as any).userId } },
                conversation: { connect: { id: conversationId } }
            }
        });

        res.status(201).json({ message: `New message created by ${sender}`});
    } catch(error) {
        handleError(error);
    }    
})
