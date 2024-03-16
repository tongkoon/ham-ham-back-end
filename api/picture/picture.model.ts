import mysql from 'mysql'
import { conn } from "../../dbconn"
import { giveCurrentDateTime } from "../constant"
import { removePictureFirebase } from '../firebase'

const ALL = 'pid,uid,url,score,DATE_FORMAT(`date`, \'%Y-%m-%d\') AS date'

export const getAllPicture = (callBack:Function) => {
    const sql = 'SELECT '+ALL+' FROM pictures;'
    console.log(sql);
    
    conn.query(sql,(err,result,fields)=>{
        callBack(err,result)
    })
}

export const getPictureByPid = (pid:number,callBack:Function) => {
    const sql = 'select '+ALL+' from pictures where pid = ?';
    conn.query(sql,[pid],(err,result,fields)=>{ 
        callBack(err,result)
    })
}

export const getPictureByUid = (uid:number,callBack:Function) => {
    const sql = 'select '+ALL+' from pictures where uid = ?';
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
    const sql = 'select '+ALL+' from pictures ORDER BY RAND() LIMIT 2'
    conn.query(sql,(err,result,fields)=>{
        callBack(err,result)
    })
}

export const getPictureRank = (callBack:Function) => {
    const sql = 'SELECT pid,user.uid,user.avatar,url,score,DATE_FORMAT(`date`, \'%d %M %Y\') AS date FROM `pictures`,user where pictures.uid = user.uid ORDER BY score DESC LIMIT 10'
    conn.query(sql,(err,result)=>{
        callBack(err,result)
    })
}

export const removePicture = (pid:number,callBack:Function) => {
    removePictureFirebase(pid)
    const sql = 'delete from pictures where pid = ?'
    conn.query(sql,[pid], (err,result)=>{
        callBack(err,result)
    })
}

