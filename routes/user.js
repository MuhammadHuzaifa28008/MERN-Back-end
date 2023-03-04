import express from 'express'
const router = express.Router();
import { isUserAuth, login, signUp, editUser, deleteUser } from '../controllers/user.js';
import { authentication } from './middlewares/auth.js';

router.post('/login', login);
router.post('/signup', signUp);
router.get('/isUserAuth', isUserAuth);
router.patch('/update/:id', authentication, editUser);
router.delete('/delete/:id', authentication, deleteUser);

export default router;