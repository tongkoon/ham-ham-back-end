import { Request, Response } from "express";
import { RESPONSE_FALSE, RESPONSE_TRUE } from "../constant.response";
import { insert, update } from "./admin.model";

export const insertTime = (req: Request, res: Response) => {
    const aid = req.body.uid
    const time = req.body.time

    insert(aid,time,(err:any,result:any)=>{
        if(err){
            res.json({...RESPONSE_FALSE})
        }else{
            res.json({...RESPONSE_TRUE,
                affected_row: result.affectedRows,
                last_idx: result.insertId,})
        }
    })
}

export const updateTime = (req:Request,res:Response)=> {
    const aid = req.body.uid
    const time = req.body.time
    update(aid,time,(err:any,result:any)=>{
        if(err){
            res.json({...RESPONSE_FALSE})
        }else{
            res.json({...RESPONSE_TRUE,
                affected_row: result.affectedRows})
        }
    })
}