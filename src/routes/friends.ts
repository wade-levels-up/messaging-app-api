import { Router } from 'express';
import { getMyFriends } from '../controllers/friendsController';
import { decodeAndAttachJWT } from '../middleware/decodeAndAttachJWT';

const friendsRouter = Router();

friendsRouter.get("/", decodeAndAttachJWT, getMyFriends);

export { friendsRouter };