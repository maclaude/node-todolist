import express from 'express';

import * as authController from '../controllers/auth';

const router = express.Router();

/**
 * Routes
 */
// POST /auth/signup
router.post('/signup', authController.signup);
// POST /auth/signin
router.post('/signin', authController.signin);

export default router;
