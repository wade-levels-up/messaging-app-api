import { PrismaClient } from "@prisma/client";
import { verifyUserByToken } from "../src/controllers/usersController";

test('verifyUserByToken sets verified to true', async () => {
  const mockPrisma = {
    user: {
      update: jest.fn().mockResolvedValue({ id: 1, verified: true })
    }
  } as unknown as PrismaClient;
  
  const user = await verifyUserByToken(mockPrisma, 'sometoken');
  expect(mockPrisma.user.update).toHaveBeenCalledWith({
    data: { verified: true },
    where: { verificationToken: 'sometoken' }
  });
  expect(user.verified).toBe(true);
});