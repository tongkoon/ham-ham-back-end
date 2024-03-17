import express from 'express';
import { upload } from '../constant';
import { createUser, editUser, findAllUsers, findByUserId, findUserByToken, login } from './user.controller';
export const router = express.Router();

router.get('/',findAllUsers); //Get All User
router.get('/getById/:uid',findByUserId) // Get By User ID

router.post('/register', upload.single('avatar'),createUser); //Register User
router.post('/login',login); //Login
router.post('/getUser',findUserByToken) //Get User By Token

router.put('/edit/:uid',upload.single('avatar'),editUser)

export default router;