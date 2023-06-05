import express from 'express';

import * as todolistController from '../controllers/todolist';
import { isAuth } from '../middlewares/isAuth';

const router = express.Router();

/**
 * Routes
 */
// POST /todolist/new-todolist
router.post('/new-todolist', isAuth, todolistController.postNewTodolist);
// PATCH /todolist/status/:id
router.patch('/status/:id', isAuth, todolistController.updateTodolistStatus);
// PATCH /todolist/status/:id
router.patch('/title/:id', isAuth, todolistController.updateTodolistTitle);

export default router;
