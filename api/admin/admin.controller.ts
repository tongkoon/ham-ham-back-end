import { Request, Response } from "express";
import { DEFAULT_TIME_RANDOM, UNDEFINED } from "../constant";
import { RESPONSE_FALSE_READ_FILE, RESPONSE_FALSE_WRITE_FILE, RESPONSE_TRUE, RESPONSE_TRUE_TIME_DEFAULT } from "../constant.response";
import { readFile, writeFile } from "./admin.model";

export const insertTime = (req: Request, res: Response) => {
    const time = req.body.time ?? DEFAULT_TIME_RANDOM;
    const data = JSON.stringify({ setTime: time },null,2)
    writeFile(data,(err:any)=>{
        if(err){
            res.json({...RESPONSE_FALSE_WRITE_FILE})
        }
        else if(req.body.time == UNDEFINED){
            res.json({...RESPONSE_TRUE_TIME_DEFAULT})
        }
        else{
            res.json({...RESPONSE_TRUE})
        }
    })
}

export const getTime = (req:Request,res:Response)=> {
    readFile((err:any,result:any)=>{
        try {
            const jsonData = JSON.parse(result);
            res.json({...RESPONSE_TRUE,time:result.time})
        } catch (error) {
            res.json({...RESPONSE_FALSE_READ_FILE})
        }
    })
}