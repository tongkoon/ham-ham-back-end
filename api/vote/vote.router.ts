import express from 'express';
import { trends, votePicture } from './vote.controller';
export const router = express.Router();

router.post('/',votePicture)
router.get('/trend/:pid',trends)
