import { Router } from 'express';
import { signIn } from '../controllers/usersController';

const signInRouter = Router();

signInRouter.post("/", signIn);

export { signInRouter };