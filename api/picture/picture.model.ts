import mysql from 'mysql'
import { conn } from "../../dbconn"
import { giveCurrentDateTime } from "../constant"
import { removePictureFirebase } from '../firebase'
import { getTrends } from '../vote/vote.model'

const ALL = 'pid,uid,url,score,DATE_FORMAT(`date`, \'%Y-%m-%d\') AS date'

export const getAllPicture = (callBack: Function) => {
    const sql = 'SELECT ' + ALL + ' FROM pictures;'
    console.log(sql);

    conn.query(sql, (err, result, fields) => {
        callBack(err, result)
    })
}

export const getPictureByPid = (pid: number, callBack: Function) => {
    const sql = 'select ' + ALL + ' from pictures where pid = ?';
    conn.query(sql, [pid], (err, result, fields) => {
        callBack(err, result)
    })
}

export const getPictureByUid = (uid: number, callBack: Function) => {
    const sql = 'select ' + ALL + ' from pictures where uid = ?';
    conn.query(sql, [uid], (err, result, fields) => {
        let picturesWithTrends: any[] = [];
        let processedCount = 0;
        for (let i = 0; i < result.length; i++) {
            let pid = result[i].pid;
            getTrends(pid, (err: any, name_month: any, list_date: any, list_win: any, list_lose: any) => {
                let pictureWithTrends = {
                    picture: result[i],
                    detail: {
                        name_month: name_month,
                        list_date: list_date,
                        list_win: list_win,
                        list_lose: list_lose
                    }
                };
                picturesWithTrends.push(pictureWithTrends);
                // console.log(result[i]);
                // console.log(name_month);
                // console.log(list_date);
                // console.log(list_win);
                // console.log(list_lose);
                processedCount++;
                if (processedCount === result.length) {
                    callBack(null, picturesWithTrends);
                }
            })
        }
        // callBack(err,result);
    })
}

export const insert = (uid: number, url: string, callBack: Function) => {
    const date = giveCurrentDateTime();
    let sql = 'insert into pictures(uid, url, score, date) values(?,?,?,?)'
    sql = mysql.format(sql, [
        uid,
        url,
        0,
        date
    ])
    conn.query(sql, (err, result, fields) => {
        callBack(err, result)
    })
}

export const getPictureRandom = (callBack: Function) => {
    const sql = 'select ' + ALL + ' from pictures ORDER BY RAND() LIMIT 2'
    conn.query(sql, (err, result, fields) => {
        callBack(err, result)
    })
}

export const getPictureRank = (callBack: Function) => {
    const sql = 'SELECT pid,user.uid,user.username,user.avatar,url,score,DATE_FORMAT(`date`, \'%d %M %Y\') AS date FROM `pictures`,user where pictures.uid = user.uid ORDER BY score DESC LIMIT 10'
    conn.query(sql, (err, result) => {
        callBack(err, result)
    })
}

export const removePicture = (pid: number, callBack: Function) => {
    removePictureFirebase(pid)
    const sql = 'delete from pictures where pid = ?'
    conn.query(sql, [pid], (err, result) => {
        callBack(err, result)
    })
}

