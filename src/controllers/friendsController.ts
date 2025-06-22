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

export const addFriend = asyncHandler(async (req: Request, res: Response) => {
    try {
        // Collect a list of the logged in user's current friends
        const user = await prisma.user.findUnique({
            where: { id: (req as any).userId },
            include: { friends: true, friendsOf: true },
        });

        // Check that the friend to be added doesn't already exist in the list
        user?.friends.forEach((friend) => {
            if (friend.username === req.params[`username`]) {
                res.status(404).json({ message: `Cannot update friends list. User: ${req.params[`username`]} is already a friend` })     
            }
        })

        // Retrieve the friend to be added to access their ID
        const recipient = await prisma.user.findUnique({
            where: { username: req.params[`username`] }
        });

        if (!recipient) {
            res.status(404).json({ message: `Cannot update friends list. Unable to retrieve ID of recipient` });
            return;
        }

        // If the friend doesn't already exist, update the friend's list to include them
        await prisma.user.update({
            where: { id: (req as any).userId },
            data: { friends: { connect: { id: recipient.id } } }
        });
        
        res.status(201).json({ message: `Succesfully added ${req.params[`username`]} as a friend` })
    } catch(error) {
        handleError(error)
    }
})
