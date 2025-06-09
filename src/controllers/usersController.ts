import { Request, Response } from 'express';
import { handleControllerError } from '../utils/handleError';
import asyncHandler from 'express-async-handler';
import prisma from '../utils/prismaClient';
import { validationResult } from "express-validator";
import { validateUsername, validateEmail, validatePassword } from '../validators/signUpValidators';
import { sendVerificationEmail } from '../utils/sendEmail';
import crypto from 'crypto';
import bcrypt from "bcryptjs";

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
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                let errorMessageArray: string[] = [];
                let errorMessage: string;
                errors.array().forEach((error) => {
                    errorMessageArray.push(error.msg);
                });
                errorMessage = errorMessageArray.join(", ");
                throw new Error(errorMessage);
            }

            const { username, email, password } = req.body

            const existingUser = await prisma.user.findFirst({
                    where: {
                        OR: [
                            { email },
                            { username }
                        ]
                    }
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
            handleControllerError(error);
        }    
    })
];

export const verifyUser = asyncHandler(async (req: Request, res: Response) => {
    try {
        await prisma.user.update({
            data: { verified: true },
            where: { verificationToken: String(req.query.token) }
        })
  

        res.status(200).json({ message: "Email verified successfully." });
    } catch(error) {
        handleControllerError(error);
    }
});