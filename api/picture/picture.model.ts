import mysql from 'mysql'
import { conn } from "../../dbconn"
import { giveCurrentDateTime } from "../constant"


export const getAllPicture = (callBack:Function) => {
    const sql = 'select * from pictures'
    conn.query(sql,(err,result,fields)=>{
        callBack(err,result)
    })
}

export const getPictureByPid = (pid:number,callBack:Function) => {
    const sql = 'select * from pictures where pid = ?';
    conn.query(sql,[pid],(err,result,fields)=>{
        callBack(err,result)
    })
}

export const getPictureByUid = (uid:number,callBack:Function) => {
    const sql = 'select * from pictures where uid = ?';
    conn.query(sql,[uid],(err,result,fields)=>{
        callBack(err,result);
    })
}

export const insert = (uid:number,url:string,callBack:Function) => {
    const date = giveCurrentDateTime();
    let sql = 'insert into pictures(uid, url, score, date) values(?,?,?,?)'
    sql = mysql.format(sql,[
        uid,
        url,
        0,
        date
    ])
    conn.query(sql,(err,result,fields)=>{
        callBack(err,result)
    })
}

export const getPictureRandom = (callBack:Function) => {
    const sql = 'select * from pictures ORDER BY RAND() LIMIT 2'
    conn.query(sql,(err,result,fields)=>{
        callBack(err,result)
    })
}