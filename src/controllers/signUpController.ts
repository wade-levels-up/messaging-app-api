import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import executeWithPrisma from '../utils/executeWithPrisma';
import { validationResult } from "express-validator";
import { validateUsername, validateEmail, validatePassword } from '../validators/signUpValidators';

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

            const existingUser = await executeWithPrisma(async (prisma) => {
                return prisma.user.findFirst({
                    where: {
                        OR: [
                            { email },
                            { username }
                        ]
                    }
                });
            });


            if (existingUser) {
                res.status(400).json({ message: "A user with this email or username already exists." });
                return;
            }

            await executeWithPrisma(async (prisma) => {
                await prisma.user.create({
                    data: { username, email, password }
                })
            })

            res.status(201).json({ message: "User created successfully" });
        } catch(error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error(String(error));
            }
        }    
    })
];