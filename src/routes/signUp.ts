import { Router } from 'express';
import { signUp } from '../controllers/usersController';

const signUpRouter = Router();

signUpRouter.post("/", ...signUp);

export { signUpRouter };