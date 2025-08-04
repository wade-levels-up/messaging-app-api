import { Request, Response } from 'express';
import { handleError } from '../utils/handleError';
import asyncHandler from 'express-async-handler';
import prisma from '../utils/prismaClient';
import { validateContent, validateGroupChat } from '../validators/validators';
import { handleValidationError } from '../utils/handleValidationError';
import { User } from '@prisma/client';

export const getUserConversations = asyncHandler(async (req: Request, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: (req as any).userId },
            include: { conversations: { where: { groupChat: false }, include: { users: { select: { username: true } } } } }
        });

        res.status(200).json({ message: "Conversations retrieved", conversations: user?.conversations});
    } catch(error) {
        handleError(error);
    }    
})

export const getUserConversationByRecipientName = asyncHandler(async (req: Request, res: Response) => {
    try {
        const recipientName = req.params.recipient_name;

        const user = await prisma.user.findUnique({
            where: { id: (req as any).userId },
            include: { 
                conversations: { 
                    where: { 
                        AND: [
                            { groupChat: false },
                            { users: { some: { username: recipientName } } }
                        ]
                    }, 
                    include: { users: { select: { username: true } } } 
                } 
            }
        });

        res.status(200).json({ message: `Conversation with ${recipientName} retrieved`, conversations: user?.conversations});
    } catch(error) {
        handleError(error);
    }    
})

export const getUserGroupConversations = asyncHandler(async (req: Request, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: (req as any).userId },
            include: { conversations: { where: { groupChat: true }, select: { name: true } } }
        });

        res.status(200).json({ message: "Conversations retrieved", conversations: user?.conversations});
    } catch(error) {
        handleError(error);
    }    
})
 
export const getUserGroupConversationByName = asyncHandler(async (req: Request, res: Response) => {
    try {
        const conversation = await prisma.conversation.findUnique({
            where: { name: req.params.name, AND: { groupChat: true } },
            include: { users: { select: { username: true, profile_picture_path: true }}}
        });

        const conversations = conversation ? [conversation] : [];

        res.status(200).json({ message: "Group conversation retrieved", conversations: conversations});
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
            include: { messages: { select: { content: true, authorName: true, createdAt: true, conversationId: true} } }
        })

        res.status(200).json({ message: "Conversations retrieved", conversationMessages: conversation?.messages});
    } catch(error) {
        handleError(error);
    }
})

interface NewConversationBody {
  sender: string;
  recipient: string;
  content: string;
}

export const createConversation = [
    validateContent,
    asyncHandler(async (req: Request<{}, {}, NewConversationBody>, res: Response) => {
    try {
        handleValidationError(req)
        const { sender, recipient, content } = req.body

        const existingConversation = await prisma.conversation.findFirst({
            where: {
                groupChat: false,
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
                name: `${sender} and ${recipient}`,
                users: {
                    connect: [
                        { username: sender},
                        { username: recipient}
                    ]
                },
                lastMessage: content,
                messages: {
                    create: [
                        {
                            content: content,
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
]

interface NewGroupConversationBody {
    name: string;
    users: User[];
    creator: string;
}

export const createGroupConversation = [
    validateGroupChat,
    asyncHandler(async (req: Request<{}, {}, NewGroupConversationBody>, res: Response) => {
    try {
        handleValidationError(req)

        const { name, creator } = req.body;

        if (!req.body.users) {
            res.status(400).json({ message: "Users field is required" });
            return;
        }

        let users = req.body.users.map(user => user.username); 
        users.push(creator);

        if (users.length <=2 || users.length > 5) {
            res.status(400).json({ message: "Can't create group chat. Minimum of 3 users and maximum of 5 users allowed."});
            return;
        }

        const foundUsers = await prisma.user.findMany({
            where: { username: { in: users } },
            select: { username: true }
        });

        if (foundUsers.length !== users.length) {
            res.status(400).json({ message: `Can't create group chat. Couldn't find all users.` });
            return;
        }

 
        await prisma.conversation.create({
            data: {
                name: name,
                groupChat: true,
                users: {
                    connect: foundUsers.map(user => ({ username: user.username }))
                }
            }
        })

        res.status(200).json({ message: `New group chat - ${name} - created.`})
    } catch(error) {
        handleError(error)
    }
})
]

interface NewMessageBody {
  sender: string;
  content: string;
}

export const createMessage = [
    validateContent,
    asyncHandler(async (req: Request<Record<string, string>, {}, NewMessageBody>, res: Response) => {
    try {
        handleValidationError(req)
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
]
