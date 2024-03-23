import express from 'express';
import { getTime, insertTime } from './admin.controller';
export const router = express.Router();

router.post('/setTimeRandom',insertTime)

router.get('/getTimeRandom',getTime)

