import bcrypt from 'bcrypt';
import mysql from "mysql";
import { conn } from "../../dbconn";
import { User } from "../../model/User";
import { BAD_PASSWORD, NOT_FOUND } from '../constant';



export const getAllUser = (callback: Function) => {
    const sql = "SELECT * FROM user";
    conn.query(sql, (err, result, fields) => {
        callback(err, result);
    })
}

export const getUserByUid = (uid:number,callBack:Function) => {
    const sql = 'select * from user where uid = ?'
    conn.query(sql,[uid],(err,result,fields) => {
        callBack(err,result[0])
    })
}

export const getUserByUsername = (username:string,callBack:Function) => {
    const sql = 'select uid,name,username,avatar,role from user where username = ?'
    conn.query(sql,[username],(err,result,fields)=>{
        callBack(err,result)
    })
}


export const insert = async (user: User, avatar: string, callback: Function) => {
    const hPwd = await bcrypt.hash(user.password, 10)
    let sql = 'insert into user(name,username,password,avatar,role) values(?,?,?,?,?)';
    sql = mysql.format(sql, [
        user.name,
        user.username,
        hPwd,
        avatar,
        'user'
    ])

    conn.query(sql, (err, result, fields) => {
        callback(err, result);
    })
}

export const authentication = (username: string, password: string, callback: Function) => {
    let sql = 'select * from user where username = ?'
    conn.query(sql, [username], async (err, result, fields) => {
        let data: User = result[0];
        if (data) {
            const pwdDB = data.password;
            await bcrypt
                .compare(password, pwdDB)
                .then(isPwd => {
                    if (isPwd) {
                        callback(err, data);
                    }
                    else {
                        callback(err, BAD_PASSWORD);
                    }
                })
        }
        else {
            callback(err, NOT_FOUND)
        }
    })
}

export const update = async (uid:number,name:string,username:string,avatar:string,password:string,callBack:Function) => {
    let sql = 'update user set name = ?,username = ?,password = ?, avatar = ? where uid = ?'   
    const hPwd = await bcrypt.hash(password, 10)
    conn.query(sql, [name,username,hPwd, avatar,uid], (err, result) => {
        callBack(err,result)
    });
}


export const updatePassword = async (new_pwd:string,uid:number,callBack:Function) => {
    const sql = 'update user set password = ? where uid = ?'
    const hPwd = await bcrypt.hash(new_pwd, 10)
    conn.query(sql,[hPwd,uid],(err,result)=>{
        callBack(err,hPwd)
    })
}
