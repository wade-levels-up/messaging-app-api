import { Router } from 'express';
import { getMyUserData, getAllUsersData, getUserData } from '../controllers/usersController';
import { decodeAndAttachJWT } from '../middleware/decodeAndAttachJWT';

const usersRouter = Router();

usersRouter.get("/me", decodeAndAttachJWT, getMyUserData);
usersRouter.get("/:username", getUserData);
usersRouter.get("/", getAllUsersData);

export { usersRouter };