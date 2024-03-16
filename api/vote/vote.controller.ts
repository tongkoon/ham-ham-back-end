import { Request, Response } from 'express';
import { Vote } from '../../model/Vote';
import { RESPONSE_FALSE, RESPONSE_TRUE } from '../constant.response';
import { getTrends, insert } from './vote.model';

export const votePicture = (req: Request, res: Response) => {
    const vote: Vote[] = req.body;
    const pic1 = vote[0];
    const pic2 = vote[1];
    insert(pic1, pic2, (err: any, p1: any, p2: any) => {
        res.json({ ...RESPONSE_TRUE, p1, p2 })
    })
}

export const trends = (req:Request,res:Response) => {
    const pid = req.params.pid;
    getTrends(+pid,(err:any,date:any,win:any)=>{
        if(err){
            res.status(400)
            .json({...RESPONSE_FALSE,error:err})
        }else{
            res.status(200)
            .json({...RESPONSE_TRUE,date:date,win:win})
        }
    })
}