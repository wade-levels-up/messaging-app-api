import { Router } from 'express';
import { getUserData } from '../controllers/usersController';
import { decodeAndAttachJWT } from '../middleware/decodeAndAttachJWT';

const usersRouter = Router();

usersRouter.get("/", decodeAndAttachJWT, getUserData);

export { usersRouter };