import express from 'express';

import * as todoController from '../controllers/todo';
import { isAuth } from '../middlewares/isAuth';

const router = express.Router();

/**
 * Routes
 */
// GET /todo/:id
router.get('/:id', isAuth, todoController.getTodo);

// POST /todo/new-todo
router.post('/new-todo', isAuth, todoController.postNewTodo);

// PATCH /todo/status/:id
router.patch('/status/:id', isAuth, todoController.updateTodoStatus);
// PATCH /todo/title/:id
router.patch('/title/:id', isAuth, todoController.updateTodoTitle);
// PATCH /todo/details/:id
router.patch('/details/:id', isAuth, todoController.updateTodoDetails);

export default router;
