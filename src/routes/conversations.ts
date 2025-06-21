import { Router } from 'express';
import { getConversationMessages, getUserConversations } from '../controllers/conversationsController';
import { decodeAndAttachJWT } from '../middleware/decodeAndAttachJWT';

const conversationsRouter = Router();

conversationsRouter.get("/:conversation_id/messages", decodeAndAttachJWT, getConversationMessages);
conversationsRouter.get("/", decodeAndAttachJWT, getUserConversations);

export { conversationsRouter };