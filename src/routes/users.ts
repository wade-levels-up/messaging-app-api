import { Router } from 'express';
import { getUserData, getAllUsersData } from '../controllers/usersController';
import { decodeAndAttachJWT } from '../middleware/decodeAndAttachJWT';

const usersRouter = Router();

usersRouter.get("/me", decodeAndAttachJWT, getUserData);
usersRouter.get("/", getAllUsersData);

export { usersRouter };