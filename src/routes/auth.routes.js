import {Router} from 'express';
import { register,
        login, 
        logout, 
        verifyToken,
        updateUser, 
        updatePassword, 
        checkEmail, checkAnswer
    } from '../controllers/auth.controller.js';
import { authRequiered } from '../middlewares/validateToken.js';
import { validateSchema   } from '../middlewares/validator.middleware.js';
import {registerSchema, loginSchema} from '../schemas/auth.schema.js'

const router=Router();

router.post('/register', validateSchema(registerSchema),register);
router.post('/login',validateSchema(loginSchema),login);
router.post('/logout',logout);
router.get('/verify', verifyToken);

//Parte Recuperacion
router.put("/updateUser/:email", authRequiered, updateUser);
router.put('/updatePassword', updatePassword);
router.post('/checkEmail', checkEmail); 
router.post('/checkAnswer', checkAnswer)


export default router; 