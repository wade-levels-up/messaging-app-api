import { Router } from 'express';
import { signUp } from '../controllers/signUpController';

const signUpRouter = Router();

signUpRouter.post("/", ...signUp);

export { signUpRouter };