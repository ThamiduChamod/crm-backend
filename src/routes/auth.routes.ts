import {Router} from 'express';
import {getMyDetails, login, register, handleRefreshToken } from '../controllers/auth.controllers.js';
import { authenticate } from '../middleware/auth.js';
const router = Router();


router.post('/register', register)
router.post('/login', login)
router.get('/me',authenticate, getMyDetails)
router.post('/refresh', handleRefreshToken)

export default router;