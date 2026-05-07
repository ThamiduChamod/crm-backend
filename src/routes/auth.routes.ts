import {Router} from 'express';
import {getMyDetails, login, register } from '../controllers/auth.controllers.js';
import { authenticate } from '../middleware/auth.js';
const router = Router();


router.post('/register', register)
router.post('/login', login)
router.get('/me',authenticate, getMyDetails)

export default router;