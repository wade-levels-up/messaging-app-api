import { Request, Response } from 'express';
import { handleError } from '../utils/handleError';
import asyncHandler from 'express-async-handler';
import prisma from '../utils/prismaClient';


export const getMyFriends = asyncHandler(async (req: Request, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: (req as any).userId },
            include: { friends: true, friendsOf: true },
        });

        if (!user) { res.send(404).json({ message: "User not found. Cannot retrieve friends" }); }
        
        const rawUserFriendsData = user?.friends
        const safeUserFriendsData = rawUserFriendsData?.map((data) => {
            return data.username
        })

        res.status(200).json({ message: 'Retrieved your friends', friends: safeUserFriendsData})
    } catch(error) {
        handleError(error);
    }
})
