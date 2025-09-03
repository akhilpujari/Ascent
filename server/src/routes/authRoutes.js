import express from 'express'
import { registerUser } from '../controllers/registerUser.js'
import { validateRegister } from '../middleware/validateRegister.js';
import { loginUser } from '../controllers/loginUser.js'
import { verifyUser } from '../controllers/verifyUser.js'
import { validateLogin} from '../middleware/validateLogin.js';
import {auth} from '../middleware/auth.js'
import { logout } from '../controllers/logout.js';


const router = express.Router()

router.post('/register',validateRegister,registerUser);

router.post('/login',validateLogin,loginUser);

router.get('/me',auth,verifyUser)

router.post('/logout',auth,logout)

export default router