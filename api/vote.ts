import express from 'express';
import { conn } from '../dbconn';
import { Vote } from '../model/Vote';
import { giveCurrentDateTime } from './constant';


export const router = express.Router();

router.post('/', (req, res) => {
    const vote: Vote[] = req.body;
    const pic1 = vote[0];
    const pic2 = vote[1];


    conn.query('select pid,score from pictures where pid = ? UNION select pid,score from pictures where pid = ?', [pic1.pid, pic2.pid], async (err, result) => {
        const data = await result;

        const Sc1 = data[0].score;
        const Sc2 = data[1].score;

        const Sa1 = pic1.result
        const Sa2 = pic2.result
        console.log(Sa1);
        console.log(Sa2);

        const Ea1: number = +(1 / (1 + (10 ** ((Sc2 - Sc1) / 400)))).toFixed(2)
        const Ea2: number = +(1 / (1 + (10 ** ((Sc1 - Sc2) / 400)))).toFixed(2)
        console.log(Ea1);
        console.log(Ea2);

        const point1 = K(Sc1) * (pic1.result - Ea1)
        const point2 = K(Sc2) * (pic2.result - Ea2)

        const Ra1: number = Sc1 + point1
        const Ra2: number = Sc2 + point2
        console.log(Ra1);
        console.log(Ra2);

        const date = giveCurrentDateTime();
        updateScore(pic1.pid, Ra1)
        updateScore(pic2.pid, Ra2)

        insertPoint(pic1.pid, pic1.result,point1,date,)
        insertPoint(pic2.pid,pic2.result,point2,date)
        
        const picture1 = {pid:pic1.pid,result:pic1.result,point:point1}
        const picture2 = {pid:pic2.pid,result:pic2.result,point:point2}
        res.status(201)
        .json({ respones: true,picture1,picture2});
    })
})




function K(score: number) {
    if (score < 2100) {
        return 32;
    } else if (score <= 2400) {
        return 24;
    } else {
        return 16;
    }
}

function updateScore(pid: number, point: number) {
    conn.query('update pictures set score = ? where pid = ?', [point, pid])
}

function insertPoint(pid: number, result: number, point: number, date: string) {
    conn.query('INSERT INTO vote(pid, result, point, date) VALUES (?, ?, ?, ?)',
        [pid, result, point, date])
}
