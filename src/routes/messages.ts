import { Router } from 'express';
import { deleteMessage } from '../controllers/messagesController';
import { decodeAndAttachJWT } from '../middleware/decodeAndAttachJWT';

const messagesRouter = Router();

messagesRouter.delete("/:message_id", decodeAndAttachJWT, deleteMessage)

export { messagesRouter };