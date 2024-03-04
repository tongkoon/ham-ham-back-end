import express from "express";
import { conn } from "../dbconn";

export const router = express.Router();

router.get('/', (req, res)=>{
    if(req.query.id){
        res.send('Query Get in index.ts id:'+req.query.id);
    }else{
        res.send('Get in index.ts');
    }
});

router.get('/:id', (req, res)=>{
    res.send('Path Get in index.ts id:'+req.params.id);
});

router.post('/',(req,res)=>{
    let body = req.body;
    res.send('body => '+JSON.stringify(body));
});

router.get('/testdb/t',(req,res)=>{
    const sql = "select * from user";
    conn.query(sql,(error,result,fields)=>{
        res.json(result);
        if (error) {
            console.error(error);
          } else {
            res.json(result);
          }
    });
});