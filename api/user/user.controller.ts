import { Request, Response } from 'express';
import { User } from '../../model/User';
import { AVATAR_DEFAULT, BAD_PASSWORD, NOT_USER, UNDEFINED } from '../constant';
import { RESPONSE_FALSE_BAD_PASSWORD, RESPONSE_FALSE_DUPLICATE_USER, RESPONSE_FALSE_INTERNAL_SERVER_ERROR, RESPONSE_FALSE_USER_NOT_FOUND, RESPONSE_TRUE } from '../constant.response';
import { uploadPictureFirebase } from '../uploadFirebase';
import { authentication, getAllUser, getByUsername, insert } from './user.model';



export const findAllUsers = (req: Request, res: Response) => {
    getAllUser((err: any, result: any) => {
        if (err) {
            res.status(500)
                .json(RESPONSE_FALSE_INTERNAL_SERVER_ERROR);
        } else {
            res.status(200)
                .json({ ...RESPONSE_TRUE, user: result })
        }
    })
};

export const createUser = (req: Request, res: Response) => {
    let user: User = req.body;
    let downloadUrl;
    console.log("username" + user.username);

    getByUsername(user.username, async (err: any, result: any) => {
        // check username is duplicate
        if (result.length == 1) {
            res.status(400)
                .json(RESPONSE_FALSE_DUPLICATE_USER)
        } else {
            // check avatar is null
            if (req.file?.originalname == UNDEFINED) {
                // set image defaul
                downloadUrl = AVATAR_DEFAULT
            } else {
                downloadUrl = await uploadPictureFirebase(req);
            }

            insert(user, downloadUrl, (err: any, result: any) => {
                res.status(201)
                    .json({ ...RESPONSE_TRUE, affected_row: result.affectedRows, last_idx: result.insertId });
            })
        }
    })
}

export const login = (req:Request,res:Response) => {
    let user: User = req.body;
    authentication(user.username,user.password,(err:any,result:any)=>{
        if(result == NOT_USER){
            res.status(400)
            .json(RESPONSE_FALSE_USER_NOT_FOUND)
        }
        else if(result == BAD_PASSWORD){
            res.status(400)
            .json(RESPONSE_FALSE_BAD_PASSWORD)
        }
        else{
            res.json({...RESPONSE_TRUE,user:result})
        }
        
       
    })

}