import express from 'express';

import * as todoController from '../controllers/todo';
import { isAuth } from '../middlewares/isAuth';

const router = express.Router();

/**
 * Routes
 */
// POST /todo/new-todo
router.post('/new-todo', isAuth, todoController.postNewTodo);

// PATCH /todo/status/:id
router.patch('/status/:id', isAuth, todoController.updateTodoStatus);
// PATCH /todo/title/:id
router.patch('/title/:id', isAuth, todoController.updateTodoTitle);

export default router;
