import express from 'express';
import { conn } from '../dbconn';
// import { TripGetResponse } from '../model/TripGetResponse';
import bcrypt from 'bcrypt';
import mysql from "mysql";
import { User } from '../model/User';

export const router = express.Router();

router.get('/', (req, res) => {
    const sql = "select * from user";
    conn.query(sql, (err, result, fields) => {
        if (err) {
            res.send("Error" + err);
        } else {
            res.json(result);
        }
    });
})

router.post('/register', async (req, res) => {
    let user: User = req.body;

    const saltRounds = 10
    const password = user.password;
    let pwdHash = "";

    await bcrypt.hash(password, saltRounds)
        .then((hash: string) => {
            pwdHash = hash;
        })
        .catch(err => console.error(err.message))

    let sql = 'insert into user(name,username,password,avatar,role) values(?,?,?,?,?)';
    sql = mysql.format(sql, [
        user.name,
        user.username,
        pwdHash,
        user.avatar,
        user.role
    ])

    console.log(sql);

    conn.query(sql, (err, result) => {
        if (err) {
            conn.query("ALTER TABLE user AUTO_INCREMENT = 1")
            res.status(400)
                .json(err)
        }
        else {
            res.status(201)
                .json({ affected_row: result.affectedRows, last_idx: result.insertId });
        }
    })
})

router.post('/login', (req, res) => {
    let user: User = req.body;
    let sql = 'select * from user where username = ?';
    conn.query(sql, [user.username], async (err, result) => {
        let data: User = result[0];
        let isUser: boolean = false;
        if (data) {
            await bcrypt
                .compare(user.password, data.password)
                .then(result => {
                    isUser = result;
                    if (isUser) {
                        res.json(data)
                    } else {
                        res.json({} as User)
                    }
                })
                .catch(err => console.error(err.message))
        } else {
            res.json({} as User)
        }
    })
})



