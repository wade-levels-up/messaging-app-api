import { Router } from 'express';
import { getUserConversations } from '../controllers/conversationsController';

const conversationsRouter = Router();

conversationsRouter.post("/", getUserConversations);

export { conversationsRouter };