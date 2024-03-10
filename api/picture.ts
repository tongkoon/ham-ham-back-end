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

router.get('/uid/:uid',(req,res)=>{
    let uid = req.params.uid;
    conn.query('select * from pictures where uid = ?',[uid],(err,result)=>{
        if (err) {
            res.json({respones:false,error: err});
        } else {
            res.json({respones:true,data: result});
        }
    })
})

router.post('/upload', upload.single('picture'), async (req, res) => {
    let user: User = req.body;
    let downloadUrl: string;
    let sql = 'SELECT *  FROM `user` WHERE uid = ?';
    sql = mysql.format(sql, [user.uid])
    conn.query(sql, async (err, result) => {
        if (result.length != 0) {
            if (req.file?.originalname == undefined) {
                res.json({ respones: false, error: 'no picture' })
            } else {
                const storageRef = ref(storage, `files/${req.file?.originalname}`);
                const metadata = {
                    contentType: req.file?.mimetype,
                }
                // Upload file in bucket storage
                const snapshot = await uploadBytesResumable(storageRef, req.file!.buffer, metadata);
                // Get Url Public
                downloadUrl = await getDownloadURL(snapshot.ref);
                const date = giveCurrentDateTime();
                sql = 'insert into pictures(uid, url, score, date) values(?,?,?,?)'
                sql = mysql.format(sql, [
                    user.uid,
                    downloadUrl,
                    0,
                    date
        
                ])
                conn.query(sql, (err, result) => {
                    if (err) {
                        conn.query("ALTER TABLE pictures AUTO_INCREMENT = 1")
                        res.status(400)
                            .json({ respones: false, error: err })
                    } else {
                        res.status(201)
                            .json({ respones: true,url:downloadUrl, affected_row: result.affectedRows, last_idx: result.insertId });
                    }
                })
            }
        } else {
            res.status(400)
                .json({ respones: false })
        }
    });
})

router.get('/random',(req,res)=>{
    conn.query('SELECT * FROM pictures ORDER BY RAND() LIMIT 2',async (err,result)=>{
        if (err) {
            res.json({respones:false,error: err});
        } else {
            res.json({respones:true,pictures: await result});
        }
    })
})

router.get('/test',(req,res)=>{
    res.send("Test")
})

const giveCurrentDateTime = () => {
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + (today.getDate())
    // const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()
    // const dateTime = date
    return date
}
