import { Router } from 'express';
import { verifyUser } from '../controllers/usersController';

const verifyUserRouter = Router();

verifyUserRouter.get("/", verifyUser);

export { verifyUserRouter };