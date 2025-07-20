import express, { Request, Response, NextFunction } from 'express';
import cors from "cors";
import dotenv from 'dotenv';
dotenv.config();
import { signUpRouter } from './routes/signUp';
import { signInRouter } from './routes/signIn';
import { verifyUserRouter } from './routes/verifyUser';
import { usersRouter } from './routes/users';
import { conversationsRouter } from './routes/conversations';
import { friendsRouter } from './routes/friends';
import { messagesRouter } from './routes/messages';
import { Server } from "socket.io"
import { createServer } from 'node:http';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT,
  }
});

// Server Configuration

app.use(
  cors({
    origin: `${process.env.CLIENT}`,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes

app.use('/signup', signUpRouter);
app.use('/signin', signInRouter);
app.use('/verify-user', verifyUserRouter);
app.use('/users', usersRouter);
app.use('/conversations', conversationsRouter);
app.use('/friends', friendsRouter);
app.use('/messages', messagesRouter);

// Websocket 

io.on('connection', (socket) => {
  console.log(`A user connected on socket id:${socket.id}`);
    socket.on('chat message', (msg) => io.emit('chat message', msg + " server dust..."))
    socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Catch missed routes
app.use((req, res) => {
  console.log('Missed route:', req.method, req.originalUrl);
  res.status(404).send('Not found');
});

// Error Handling

app.use((error: any, req: Request, res: Response, next:NextFunction) => {
  console.error(error);
  res.status(error.statusCode || 500).json({ message: error.message });
});

export default server;
