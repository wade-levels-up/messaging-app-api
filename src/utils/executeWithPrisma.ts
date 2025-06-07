import { PrismaClient } from '@prisma/client';
import prisma from "./prismaClient";

export default async function executeWithPrisma<T>(
    callback: (prisma: PrismaClient) => Promise<T>
): Promise<T | undefined> {
    try {
        return await callback(prisma);
    } catch(error) {
        console.error(error)
    } finally {
        await prisma.$disconnect()
    }
}