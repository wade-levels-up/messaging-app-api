import { Router } from 'express';
import { getUserData } from '../controllers/usersController';

const dashboardRouter = Router();

dashboardRouter.get("/", getUserData);

export { dashboardRouter };