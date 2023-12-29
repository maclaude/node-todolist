import express from 'express';

import * as emailController from '../controllers/email';
import { isAuth } from '../middlewares/isAuth';

const router = express.Router();

// POST /email/send
router.post('/send', isAuth, emailController.sendEmail);

export default router;
