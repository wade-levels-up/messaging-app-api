import dotenv from 'dotenv';
dotenv.config();
import server from './app';
import prisma from './utils/prismaClient';

// Run The Server

const PORT: number = Number(process.env.PORT) || 3000;
server.listen(PORT, () => { console.log(`Server is running on http://localhost:${PORT}`)});


// Shutdown handlers

process.on('SIGINT', async () => {
  console.log('SIGINT received. Shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});