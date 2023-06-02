import express from 'express';

import * as todoController from '../controllers/todo';
import { isAuth } from '../middlewares/isAuth';

const router = express.Router();

/**
 * Routes
 */
// POST /todo/new-todo
router.post('/new-todo', isAuth, todoController.postNewTodo);
// PATCH /todo/:id
router.patch('/:id', isAuth, todoController.updateTodoStatus);

export default router;
