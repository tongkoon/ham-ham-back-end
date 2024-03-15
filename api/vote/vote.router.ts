import express from 'express';
import { historyTrends, votePicture } from './vote.controller';
export const router = express.Router();

router.post('/',votePicture)
router.get('/trend/:pid',historyTrends)
