import express from 'express';
import { insertTime, updateTime } from './admin.controller';
export const router = express.Router();

router.post('/setTimeRandom',insertTime)
router.put('/updateTimeRandom',updateTime)
// router.get('/getTimeRandom',getTime)

