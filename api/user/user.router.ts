import express from 'express';
import { upload } from '../constant';
import { createUser, findAllUsers, findUserByToken, login } from './user.controller';
export const router = express.Router();

router.get('/',findAllUsers); //Get All User
router.post('/register', upload.single('avatar'),createUser); //Register User
router.post('/login',login);
router.post('/getUser',findUserByToken)

export default router;