import { Router } from 'express';
import { getConversationMessages, getUserConversations, createConversation, createMessage, createGroupConversation, getUserGroupConversations, getUserConversationByRecipientName, getUserGroupConversationByName } from '../controllers/conversationsController';
import { decodeAndAttachJWT } from '../middleware/decodeAndAttachJWT';

const conversationsRouter = Router();

conversationsRouter.get("/group_conversation/:name", decodeAndAttachJWT, getUserGroupConversationByName);
conversationsRouter.get("/group_conversation", decodeAndAttachJWT, getUserGroupConversations);
conversationsRouter.post("/group_conversation", decodeAndAttachJWT, ...createGroupConversation)
conversationsRouter.post("/", decodeAndAttachJWT, ...createConversation)
conversationsRouter.post("/:conversation_id/messages", decodeAndAttachJWT, ...createMessage);
conversationsRouter.get("/:conversation_id/messages", decodeAndAttachJWT, getConversationMessages);
conversationsRouter.get("/:recipient_name", decodeAndAttachJWT, getUserConversationByRecipientName);
conversationsRouter.get("/", decodeAndAttachJWT, getUserConversations);

export { conversationsRouter };