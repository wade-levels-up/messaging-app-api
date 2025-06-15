import { Router } from 'express';
import { getUserData } from '../controllers/usersController';
import { decodeAndAttachJWT } from '../middleware/decodeAndAttachJWT';

const dashboardRouter = Router();

dashboardRouter.get("/", decodeAndAttachJWT, getUserData);

export { dashboardRouter };