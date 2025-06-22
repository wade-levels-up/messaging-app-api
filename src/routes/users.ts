import { Router } from 'express';
import { getMyUserData, getAllUsersData, getUserData, getUserFriends } from '../controllers/usersController';
import { decodeAndAttachJWT } from '../middleware/decodeAndAttachJWT';

const usersRouter = Router();

usersRouter.get("/me", decodeAndAttachJWT, getMyUserData);
usersRouter.get("/:username/friends", getUserFriends)
usersRouter.get("/:username", getUserData);
usersRouter.get("/", getAllUsersData);

export { usersRouter };