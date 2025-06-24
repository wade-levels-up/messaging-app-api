import { Router } from 'express';
import { getMyFriends, addFriend, removeFriend } from '../controllers/friendsController';
import { decodeAndAttachJWT } from '../middleware/decodeAndAttachJWT';

const friendsRouter = Router();

friendsRouter.delete("/:username", decodeAndAttachJWT, removeFriend)
friendsRouter.get("/", decodeAndAttachJWT, getMyFriends);
friendsRouter.put("/:username", decodeAndAttachJWT, addFriend);

export { friendsRouter };