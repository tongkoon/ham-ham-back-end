import bcrypt from 'bcrypt';
import mysql from "mysql";
import { conn } from "../../dbconn";
import { User } from "../../model/User";
import { BAD_PASSWORD, NOT_USER } from '../constant';



export const getAllUser = (callback: Function) => {
    const sql = "SELECT * FROM user";
    conn.query(sql, (err, result, fields) => {
        callback(err, result);
    })
}

export const getByUsername = (username: string, callback: Function) => {
    const sql = "SELECT * FROM user where username = ?";
    conn.query(sql, [username], (err, result, fields) => {
        callback(err, result);
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
            callback(err, NOT_USER)
        }
    })
}
