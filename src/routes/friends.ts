import { Router } from 'express';
import { getMyFriends, addFriend } from '../controllers/friendsController';
import { decodeAndAttachJWT } from '../middleware/decodeAndAttachJWT';

const friendsRouter = Router();

friendsRouter.get("/", decodeAndAttachJWT, getMyFriends);
friendsRouter.put("/:username", decodeAndAttachJWT, addFriend);

export { friendsRouter };