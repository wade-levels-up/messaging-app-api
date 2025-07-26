import prisma from '../utils/prismaClient';
import { Socket, Server } from "socket.io";
import validator from 'validator';

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
        // Validate content
        if (typeof content !== 'string' || validator.isEmpty(content.trim())) {
            socket.emit('error', { message: 'Message content cannot be empty.' });
            return;
        }
        if (!validator.matches(content, /^[^<>]*$/)) {
            socket.emit('error', { message: 'Message content cannot contain < or > characters.' });
            return;
        }

        // Trim content
        const trimmedContent = content.trim();


        const existingConversation = await prisma.conversation.findUnique({ where: { id: conversationId } });
        if (!existingConversation) {
            socket.to(String(conversationId)).emit('error', { message: `Can't find conversation. Unable to create message` });
            return;
        }

        await prisma.message.create({
            data: {
                content: trimmedContent,
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