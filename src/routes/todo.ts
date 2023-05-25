import express from 'express';

import * as todoController from '../controllers/todo';
import { isAuth } from '../middlewares/isAuth';

const router = express.Router();

/**
 * Routes
 */
// POST /todolist/new-todo
router.post('/new-todo', isAuth, todoController.postNewTodo);

export default router;
