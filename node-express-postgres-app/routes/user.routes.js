
import express from 'express';
import { register, login, getUser, update, remove, list } from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/:id', authenticate, getUser);
router.put('/:id', authenticate, update);
router.delete('/:id', authenticate, remove);
router.get('/', authenticate, list);

export default router;
