import { Router } from 'express';
import { getUserConversations, getConversationMessages } from '../controllers/conversationsController';
import { decodeAndAttachJWT } from '../middleware/decodeAndAttachJWT';

const conversationsRouter = Router();

conversationsRouter.get("/:conversation-id/messages", decodeAndAttachJWT, getConversationMessages);
conversationsRouter.get("/", decodeAndAttachJWT, getUserConversations);

export { conversationsRouter };