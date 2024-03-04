import express from 'express';
import { conn } from '../dbconn';

export const router = express.Router();

router.get('/',(req,res)=>{
    const sql = "select * from user";
    conn.query(sql,(err,result,fields)=>{
        if(err){
            res.send("Error"+err);
        }else{
            res.json(result);
        }
    });
})
