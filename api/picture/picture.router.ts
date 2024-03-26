import express from 'express';
import { upload } from '../constant';
import { deletePicture, findAllPicture, findPictureByPid, findPictureByUid, findPictureRandom, findPictureRank, uploadPicture } from './picture.controller';
export const router = express.Router();

// /picture
router.get('/',findAllPicture);
router.get('/pid/:pid',findPictureByPid);
router.get('/uid/:uid',findPictureByUid);
router.get('/rank', findPictureRank)
router.post('/random',findPictureRandom)

router.post('/upload', upload.single('picture'),uploadPicture); //upload picture

router.delete('/:pid',deletePicture)

export default router;