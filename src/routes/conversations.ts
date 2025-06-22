import { Router } from 'express';
import { getConversationMessages, getUserConversations, createConversation } from '../controllers/conversationsController';
import { decodeAndAttachJWT } from '../middleware/decodeAndAttachJWT';

const conversationsRouter = Router();

conversationsRouter.post("/", decodeAndAttachJWT, createConversation)
conversationsRouter.get("/:conversation_id/messages", decodeAndAttachJWT, getConversationMessages);
conversationsRouter.get("/", decodeAndAttachJWT, getUserConversations);

export { conversationsRouter };