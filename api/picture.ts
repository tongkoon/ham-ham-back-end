import express from 'express';

export const router = express.Router();

router.get('/picture',(req,res)=>{

    res.send("picture");
})
