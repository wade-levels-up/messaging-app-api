import { Request, Response } from 'express';
import { handleError } from '../utils/handleError';
import asyncHandler from 'express-async-handler';
import prisma from '../utils/prismaClient';
import { PrismaClient } from '@prisma/client';
import { validateUsername, validateEmail, validatePassword } from '../validators/signUpValidators';
import { handleValidationError } from '../utils/handleValidationError';
import { sendVerificationEmail } from '../utils/sendEmail';
import dotenv from 'dotenv';
dotenv.config();
import crypto from 'crypto';
import bcrypt from "bcryptjs";
import { default as jwt } from 'jsonwebtoken';



interface SignUpBody {
  email: string;
  username: string;
  password: string;
}

export const signUp = [
    validateUsername,
    validateEmail,
    validatePassword,
    asyncHandler(async (req: Request<{}, {}, SignUpBody>, res: Response) => {
        try {
            handleValidationError(req)

            const { username, email, password } = req.body

            const existingUser = await prisma.user.findFirst({
                    where: { OR: [{ email }, { username }] }
                });

            if (existingUser) {
                res.status(400).json({ message: "A user with this email or username already exists." });
                return;
            }

            const verificationToken = crypto.randomBytes(32).toString('hex');
            const hashedPassword: string = await bcrypt.hash(password, 10);

            await prisma.user.create({
                data: { username, email, password: hashedPassword, verificationToken }
            })
        
            await sendVerificationEmail(email, verificationToken);

            res.status(201).json({ message: "User created successfully" });
        } catch(error) {
            handleError(error);
        }    
    })
];


export async function verifyUserByToken(prismaClient: PrismaClient, token: string) {
    return prismaClient.user.update({
        data: { verified: true },
        where: { verificationToken: token }
    });
}

export const verifyUser = asyncHandler(async (req: Request, res: Response) => {
    try {
        await verifyUserByToken(prisma, String(req.query.token));
        res.status(200).json({ message: "Email verified successfully." });
    } catch(error) {
        handleError(error);
    }
});



interface SignInBody {
  email: string;
  password: string;
}

export const signIn = asyncHandler(async (req: Request<{}, {}, SignInBody>, res: Response) => {
        try {

            const { email, password } = req.body
            const user = await prisma.user.findUnique({ where: { email } })
            if (!user) {
                res.status(404).json({ message: "Invalid email address. No user found" });
                return
            }
        
            if (!user.verified) {
                res.status(401).json({ message: "Unverified account. Please verify your account via the link sent to your email" });
                return
            }

            const passwordsMatch = await bcrypt.compare(password, user.password)
            if (!passwordsMatch) {
                res.status(401).json({ message: "Invalid password" });
                return
            }

            jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY!, { expiresIn: '5 minutes'}, (error, token) => {
                if (error || !token) {
                    res.status(500).json({ message: "Failed to generate token" });
                    return;
                }
                res.status(200).json({ message: "sign in successful", token });
            })

        } catch(error) {
            handleError(error);
        }    
})



export const getUserData = asyncHandler(async (req: Request, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: (req as any).userId
            }
        });

        const safeUser = user
            ? {
                id: user.id,
                username: user.username,
                email: user.email,
                joined: user.joined,
                verified: user.verified
            }
            : null;

        res.status(200).json({ 
            message: "Welcome to your dashboard.",
            userData: safeUser
        });
    } catch(error) {
        handleError(error);
    }    
});