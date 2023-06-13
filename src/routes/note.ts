import express from 'express';

import * as noteController from '../controllers/note';
import { isAuth } from '../middlewares/isAuth';

const router = express.Router();

/**
 * Routes
 */
// GET /note/:id
router.get('/:id', isAuth, noteController.getNote);

// POST /note/new-note
router.post('/new-note', isAuth, noteController.postNewNote);

// PATCH /note/title/:id
router.patch('/title/:id', isAuth, noteController.updateNoteTitle);
// PATCH /note/content/:id
router.patch('/content/:id', isAuth, noteController.updateNoteContent);

export default router;
