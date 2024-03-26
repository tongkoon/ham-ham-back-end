import { Request, Response } from 'express';
import { User } from '../../model/User';
import { NOT_FOUND, UNDEFINED } from '../constant';
import { RESPONSE_FALSE, RESPONSE_FALSE_PICTURE_NOT_FOUND, RESPONSE_FALSE_USER_NOT_FOUND, RESPONSE_TRUE } from '../constant.response';
import { uploadPictureFirebase } from '../firebase';
import { getUserByUid } from '../user/user.model';
import { getAllPicture, getPictureByPid, getPictureByUid, getPictureRandom, getPictureRank, insert, removePicture } from './picture.model';

export const findAllPicture = (req: Request, res: Response) => {
    getAllPicture((err: any, result: any) => {
        res.status(200)
            .json({ ...RESPONSE_TRUE, pictures: result })
    })
}

export const findPictureByPid = (req: Request, res: Response) => {
    // parameter
    const pid = req.params.pid;

    getPictureByPid(+pid, (err: any, result: any) => {
        if (result.length === NOT_FOUND) {
            res.status(200)
                .json(RESPONSE_FALSE_PICTURE_NOT_FOUND)
        }
        else {
            res.status(200)
                .json({ ...RESPONSE_TRUE, picture: result })
        }
    })
}

export const findPictureByUid = (req: Request, res: Response) => {
    // patameter
    const uid = req.params.uid;

    getPictureByUid(+uid, (err: any, result: any) => {
        if (result.length === NOT_FOUND) {
            res.status(200)
                .json(RESPONSE_FALSE_PICTURE_NOT_FOUND)
        }
        else {
            res.status(200)
                .json({ ...RESPONSE_TRUE, pictures: result })
        }
    })
}

export const uploadPicture = (req: Request, res: Response) => {
    const user: User = req.body;
    const uid = user.uid;

    getUserByUid(uid, async (err: any, result: any) => {
        if (result.length === NOT_FOUND) {
            res.status(400)
                .json(RESPONSE_FALSE_USER_NOT_FOUND)
        } else {
            if (req.file?.originalname === UNDEFINED) {
                res.status(400)
                    .json(RESPONSE_FALSE_PICTURE_NOT_FOUND)
            } else {
                const downloadURL = await uploadPictureFirebase(req);
                insert(uid, downloadURL, (err: any, result: any) => {
                    res.json({
                        ...RESPONSE_TRUE, url: downloadURL,
                        affected_row: result.affectedRows,
                        last_idx: result.insertId
                    })
                })
            }
        }
    })
}

export const findPictureRandom = (req: Request, res: Response) => {
    const list: number[] = req.body.list
    getPictureRandom(list,(err: any, result: any) => {
        res.json({ ...RESPONSE_TRUE, pictures: result })
    })
}

export const findPictureRank = (req: Request, res: Response) => {
    getPictureRank((err: any, result: any) => {
        res.status(200)
            .json({ ...RESPONSE_TRUE, pictures: result })
    })
}


export const deletePicture = (req: Request, res: Response) => {
    const pid = req.params.pid
    removePicture(+pid, (err: any, result: any) => {
        if (err) {
            res.status(400)
                .json({ ...RESPONSE_FALSE, err })
        } else {
            res.status(200)
                .json({ ...RESPONSE_TRUE, affected_row: result.affectedRows });
        }
    })
}
