import { Request, Response } from 'express';
import { User } from '../../model/User';
import { AVATAR_DEFAULT, BAD_PASSWORD, NOT_FOUND, SECRET, UNDEFINED } from '../constant';
import { RESPONSE_FALSE_BAD_PASSWORD, RESPONSE_FALSE_DUPLICATE_USER, RESPONSE_FALSE_INTERNAL_SERVER_ERROR, RESPONSE_FALSE_TOKEN, RESPONSE_FALSE_USER_NOT_FOUND, RESPONSE_TRUE } from '../constant.response';
import { uploadPictureFirebase } from '../firebase';
import { generateToken, verifyToken } from '../jwtToken';
import { authentication, getAllUser, getUserByUsername, insert } from './user.model';



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
    let downloadUrl;
    const user: User = req.body;

    const username = user.username;
    const filePic = req.file;

    console.log("username" + username);

    getUserByUsername(username, async (err: any, result: any) => {
        // check username is duplicate
        if (result.length == 1) {
            res.status(400)
                .json(RESPONSE_FALSE_DUPLICATE_USER)
        } else {
            // check avatar is null
            if (filePic?.originalname == UNDEFINED) {
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
    
    // parameter
    const username = user.username;
    const password = user.password;

    authentication(username,password,(err:any,result:any)=>{
        if(result == NOT_FOUND){
            res.status(400)
            .json(RESPONSE_FALSE_USER_NOT_FOUND)
        }
        else if(result == BAD_PASSWORD){
            res.status(400)
            .json(RESPONSE_FALSE_BAD_PASSWORD)
        }
        else{
            const payload = {username:result.username,password:result.password}
            const user = {
                uid:result.uid,
                name: result.name,
                username : result.username,
                avatar : result.avatar,
                role : result.role
            }
            const token_jwt = generateToken(payload, SECRET);
            res.status(200)
            .json({...RESPONSE_TRUE,token:token_jwt,user:user})
        }
    })
}

export const findUserByToken = (req:Request,res:Response) => {
    const token = req.body.token
    const data = verifyToken(token,SECRET);

    if(data.valid){
        getUserByUsername(data.decoded.username,(err:any,result:any)=>{
            res.status(200)
            .json({...RESPONSE_TRUE,user:result[0]})
        })
    }else{
        res.status(400)
        .json({...RESPONSE_FALSE_TOKEN})
    }
}
