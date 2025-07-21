import prisma from '../utils/prismaClient';
import { Socket, Server } from "socket.io";

type CreateMessageArgs = {
    content: string;
    conversationId: number;
    sender: string;
}

export const createMessage = async (
    io: Server,
    socket: Socket,
    { conversationId, content, sender }: CreateMessageArgs
) => {
    try {
        const existingConversation = await prisma.conversation.findUnique({ where: { id: conversationId } });
        if (!existingConversation) {
            socket.to(String(conversationId)).emit('error', { message: `Can't find conversation. Unable to create message` });
            return;
        }

        await prisma.message.create({
            data: {
                content: content,
                authorName: sender,
                user: { connect: { username: sender } },
                conversation: { connect: { id: conversationId } }
            }
        });

        io.to(String(conversationId)).emit("refresh");
    } catch(error) {
        socket.to(String(conversationId)).emit('error', { message: 'Internal server error' });
    }    
}