import express from 'express';
import multer from 'multer';
import { createUser, findAllUsers, login } from './user.controller';
export const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() })

router.get('/',findAllUsers); //Get All User
router.post('/register', upload.single('avatar'),createUser); //Register User
router.post('/login',login);

export default router;