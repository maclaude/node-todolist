import express from 'express';

import * as userController from '../controllers/user';
import { isAuth } from '../middlewares/isAuth';

const router = express.Router();

/**
 * Routes
 */
// GET /user/todolists
router.get('/todolists', isAuth, userController.getUserTodolists);

// PATCH /user/todolists
router.patch('/todolists', isAuth, userController.updateTodolistsOrder);

// DELETE /user/todolists
router.delete('/todolists', isAuth, userController.deleteUserTodolists);

export default router;
