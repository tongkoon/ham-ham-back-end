import dotenv from 'dotenv';
import { conn } from '../../dbconn';

dotenv.config();

export const insert = (aid:number,time:number,callBack:Function) =>{
    const sql = 'INSERT INTO `TimeAdmin`(`aid`, `time`) VALUES (?,?)'
    conn.query(sql,[aid,time],(err,result)=>{
        callBack(err,result);
    })
}

export const update = (aid:number,time:number,callBack:Function) =>{
    const sql = 'UPDATE `TimeAdmin` SET `time`= ? WHERE aid = ?'
    conn.query(sql,[time,aid],(err,result)=>{
        callBack(err,result);
    })
}