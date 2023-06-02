import express from 'express';

import * as todolistController from '../controllers/todolist';
import { isAuth } from '../middlewares/isAuth';

const router = express.Router();

/**
 * Routes
 */
// POST /todolist/new-todolist
router.post('/new-todolist', isAuth, todolistController.postNewTodolist);
// PATCH /todolist/:id
router.patch('/:id', isAuth, todolistController.updateTodolistStatus);

export default router;
