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
import { createMessage } from './socket/chatHandlers';
import { default as jwt } from "jsonwebtoken"
import 'socket.io';
import compression from "compression";

declare module 'socket.io' {
  interface Socket {
    user?: any; 
  }
}

const allowedOrigins = [                
  'https://www.buddingmessenger.com',
  'https://buddingmessenger.com',
]

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins, 
    credentials: true
  }
});

// Server Configuration

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(compression());

// Routes

app.use('/signup', signUpRouter);
app.use('/signin', signInRouter);
app.use('/verify-user', verifyUserRouter);
app.use('/users', usersRouter);
app.use('/conversations', conversationsRouter);
app.use('/friends', friendsRouter);
app.use('/messages', messagesRouter);

// Websockets / Socket.io

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error ('Authentication error'));
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY!, (err: Error | null, user: unknown) => {
    if (err) return next(new Error("Authentication error"));
    socket.user = user;
    next();
  })
})

io.on('connection', (socket) => {
  socket.on("join conversation", (conversationId: string) => {
    socket.join(String(conversationId));
  });

  socket.on("leave conversation", (conversationId: string) => {
    socket.leave(String(conversationId));
  });

  socket.on('chat message', (data) => {
    createMessage(io, socket, data);
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
