import express from 'express';
import { votePicture } from './vote.controller';
export const router = express.Router();

router.post('/',votePicture)
