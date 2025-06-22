import { Router } from 'express';
import { getUserFriends } from '../controllers/friendsController';
import { decodeAndAttachJWT } from '../middleware/decodeAndAttachJWT';

const friendsRouter = Router();

friendsRouter.get("/", decodeAndAttachJWT, getUserFriends);

export { friendsRouter };