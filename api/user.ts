import express from 'express';
import { conn } from '../dbconn';
// import { TripGetResponse } from '../model/TripGetResponse';
import bcrypt from 'bcrypt';
import { initializeApp } from 'firebase/app';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import multer from 'multer';
import mysql from "mysql";
import firebaseConfig from '../config/firebase.config';
import { User } from '../model/User';

export const router = express.Router();
initializeApp(firebaseConfig.firebaseConfig);

const storage = getStorage()

const upload = multer({ storage: multer.memoryStorage() })

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

router.post('/register', upload.single('avatar'), async (req, res) => {
    let user: User = req.body;

    const storageRef = ref(storage, `files/${req.file?.originalname}`);

    const metadata = {
        contentType: req.file?.mimetype,
    }

    // Upload file in bucket storage
    const snapshot = await uploadBytesResumable(storageRef, req.file!.buffer, metadata);

    // Get Url Public
    const downloadUrl = await getDownloadURL(snapshot.ref);

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
        downloadUrl,
        'user'
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

router.put('/register/:uid', upload.single('avatar'), async (req, res) => {
    let uid = +req.params.uid;

    const storageRef = ref(storage, `files/${req.file?.originalname}`);

    const metadata = {
        contentType: req.file?.mimetype,
    }

    // Upload file in bucket storage
    const snapshot = await uploadBytesResumable(storageRef, req.file!.buffer, metadata);

    // Get Url Public
    const downloadUrl = await getDownloadURL(snapshot.ref);

    let sql = 'update user set avatar = ? where uid = ?';
    sql = mysql.format(sql, [
        downloadUrl,
        uid
    ]);
    conn.query(sql, (err, result) => {
        if (err) {
            res.status(400)
                .json(err)
        }
        else {
            res.status(201)
                .json({ affected_row: result.affectedRows });
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
                        res.json({respones:false})
                    }
                })
                .catch(err => console.error(err.message))
        } else {
            res.json({respones:false})
        }
    })
})

const giveCurrentDateTime = () => {
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + (today.getDay())
    // const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()
    // const dateTime = date
    return date
}


router.post("/test", upload.single('avatar'), async (req, res) => {
    let user: User = req.body;

    const storageRef = ref(storage, `files/${req.file?.originalname}`);

    const metadata = {
        contentType: req.file?.mimetype,
    }

    // Upload file in bucket storage
    const snapshot = await uploadBytesResumable(storageRef, req.file!.buffer, metadata);

    // Get Url Public
    const downloadUrl = await getDownloadURL(snapshot.ref);
    console.log(downloadUrl);
    
    
    res.json({ username:user.username,url:downloadUrl})
        

})

