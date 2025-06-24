import { Request, Response } from 'express';
import { handleError } from '../utils/handleError';
import asyncHandler from 'express-async-handler';
import prisma from '../utils/prismaClient';


export const deleteMessage = asyncHandler(async (req: Request, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: (req as any).userId },
            include: { friends: true, friendsOf: true },
        });

        if (!user) { 
            res.status(404).json({ message: "User not found. Cannot delete messages" });
            return;
        }

        const messageIdToDelete = Number(req.params.message_id);

        const messageToDelete = await prisma.message.findUnique({
            where: { id: messageIdToDelete }
        });

        if (
        !messageToDelete ||
        messageToDelete.authorName !== user.username ||
        messageToDelete.userId !== user.id
        ) {
        res.status(404).json({ message: "Unable to delete message" });
        return;
        }

        await prisma.message.delete({
            where: { id: messageIdToDelete }
        });

        res.status(200).json({ message: 'Message succesfully deleted' })
    } catch(error) {
        handleError(error);
    }
})