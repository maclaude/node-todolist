import express from 'express';

import * as userController from '../controllers/user';
import { isAuth } from '../middlewares/isAuth';

const router = express.Router();

/**
 * Routes
 */
// GET /user/todolists
router.get('/todolists', isAuth, userController.getUserTodolists);

export default router;
