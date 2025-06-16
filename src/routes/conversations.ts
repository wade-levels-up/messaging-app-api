import { Router } from 'express';
import { getUserConversations } from '../controllers/conversationsController';
import { decodeAndAttachJWT } from '../middleware/decodeAndAttachJWT';

const conversationsRouter = Router();

conversationsRouter.get("/", decodeAndAttachJWT, getUserConversations);

export { conversationsRouter };