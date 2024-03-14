import bcrypt from 'bcrypt';
import express from 'express';
import { initializeApp } from 'firebase/app';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import multer from 'multer';
import mysql from "mysql";
import firebaseConfig from '../config/firebase.config';
import { conn } from '../dbconn';
import { User } from '../model/User';

export const router = express.Router();
initializeApp(firebaseConfig.firebaseConfig);


const storage = getStorage()

const upload = multer({ storage: multer.memoryStorage() })

router.get('/', (req, res) => {
    const sql = "select * from user";
    conn.query(sql, (err, result, fields) => {
        if (err) {
            res.json({ response: false, Error: err });
        } else {

            res.json(result);
        }
    });
})

router.post('/register', upload.single('avatar'), async (req, res) => {
    let user: User = req.body;
    let downloadUrl;

    let sql = 'select * from user where username = ?';
    sql = mysql.format(sql, [user.username])
    conn.query(sql, async (err, result) => {
        // check username is duplicate
        if (err) {
            res.status(400)
                .json({ response: false, error: err })
        }
        else {
            // check avatar is null
            if (req.file?.originalname == undefined) {
                // set image defaul
                downloadUrl = 'https://firebasestorage.googleapis.com/v0/b/test-upload-image-44e6d.appspot.com/o/files%2FDefaultPic.png?alt=media&token=d87a7086-a6e3-4814-bc01-bdf8722f4c7b'
            } else {
                const storageRef = ref(storage, `files/${req.file?.originalname}`);
                const metadata = {
                    contentType: req.file?.mimetype,
                }
                // Upload file in bucket storage
                const snapshot = await uploadBytesResumable(storageRef, req.file!.buffer, metadata);
                // Get Url Public
                downloadUrl = await getDownloadURL(snapshot.ref);
            }

            const saltRounds = 10
            const password = user.password;
            let pwdHash = "";

            await bcrypt.hash(password, saltRounds)
                .then((hash: string) => {
                    pwdHash = hash;
                })
                .catch(err => console.error(err.message))

            sql = 'insert into user(name,username,password,avatar,role) values(?,?,?,?,?)';
            sql = mysql.format(sql, [
                user.name,
                user.username,
                pwdHash,
                downloadUrl,
                'user'
            ])

            conn.query(sql, (err, result) => {
                if (err) {
                    conn.query("ALTER TABLE user AUTO_INCREMENT = 1")
                    res.status(400)
                        .json({ respones: false, error: err })
                }
                else {
                    res.status(201)
                        .json({ respones: true, affected_row: result.affectedRows, last_idx: result.insertId });
                }
            })
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
                        res.json({ respones: false })
                    }
                })
                .catch(err => console.error(err.message))
        } else {
            res.json({ respones: false })
        }
    })
})




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


    res.json({ username: user.username, url: downloadUrl })


})

