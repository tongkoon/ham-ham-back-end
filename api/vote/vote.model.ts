import { conn } from "../../dbconn";
import { Vote } from "../../model/Vote";
import { giveCurrentDateTime } from "../constant";

export const insert = (pic1: Vote, pic2: Vote, callBack: Function) => {
    const pid1 = pic1.pid;
    const pid2 = pic2.pid;

    let sql = 'select pid,score from pictures where pid = ? UNION select pid,score from pictures where pid = ?'
    conn.query(sql, [pid1, pid2], async (err, result) => {
        const data = await result;

        // Score เดิม
        const Sc_a = data[0].score;
        const Sc_b = data[1].score;
        console.log('scA'+Sc_a);
        console.log('scB'+Sc_b);

        // ผลแพ้ชนะ
        const S_a = pic1.result
        const S_b = pic2.result
        console.log('reA'+S_a);
        console.log('reB'+S_b);

        // เรทคะแนนที่ควรได้
        const E_a: number = +(1 / (1 + (10 ** ((Sc_b - Sc_a) / 400)))).toFixed(3)
        const E_b: number = +(1 / (1 + (10 ** ((Sc_a - Sc_b) / 400)))).toFixed(3)
        console.log('EA'+E_a);
        console.log('EB'+E_b);
        // ค่า K ที่คำนวณจากคะแนนเดิม
        const k_a = K(Sc_a);
        const k_b = K(Sc_b);

        // คะแนนที่ได้
        const point1 = k_a * (S_a - E_a)
        const point2 = k_b * (S_b - E_b)

        // ผลรวมคะแนนล่าสุด
        const R_a: number = Sc_a + point1
        const R_b: number = Sc_b + point2

        const date = giveCurrentDateTime();

        updateScore(pic1.pid, R_a)
        updateScore(pic2.pid, R_b)

        insertPoint(pic1.pid, pic1.result, point1, date,)
        insertPoint(pic2.pid, pic2.result, point2, date)

        const picture1 = { pid: pid1, score: Sc_a, K: k_a, result: S_a, E: E_a, point: point1, total: R_a }
        const picture2 = { pid: pid2, score: Sc_b, K: k_b, result: S_b, E: E_b, point: point2, total: R_b }

        callBack(err, picture1, picture2)
    })
}


export function K(score: number) {
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

export const getTrends = (pid: number, callBack: Function) => {
    // เวลาใน node js และ database ไม่ตีงกัน 1 วัน
    const sql = 'SELECT pid,result,SUM(point) as totalPoint,DATE_FORMAT(`date`, \'%Y-%m-%d\') AS date ' +
        'FROM `vote` ' +
        'WHERE `date` >= DATE_SUB(CURDATE(), INTERVAL 6 DAY) and pid = ? ' +
        'GROUP BY result,date ' +
        'ORDER BY `date`,`result`'

    conn.query(sql, pid, (err, result) => {
        // console.log(result);

        let currentDate = null;
        let list_date = [];
        let list_win = [];
        let list_lose = [];

        let tmp = null;
        let name_month = "";
        let m = 0;

        let c = 0;
        for (let i = 0; i < result.length; i++) {
            // console.log(result[i].date + ' result:' + result[i].result);
            let res = result[i].result;
            let totalPoint = result[i].totalPoint;
            let date = result[i].date;
            let formattedDate = new Date(date).getDate();

            let month = new Date(date).getMonth() + 1;
            // console.log('month : ' + month);

            if (tmp == null) {
                tmp = month;
                name_month = setnameMonth(date)
                m = m + 1;
            }

            if (tmp != month) {
                tmp = month;
                name_month = name_month + '-' + setnameMonth(date)
                m = m + 1
            }

            if (currentDate !== formattedDate) {
                list_date[c] = formattedDate;
                currentDate = formattedDate;

                list_lose[c] = 0;
                if (res == 0) {
                    list_lose[c] = Math.abs(totalPoint);
                }
                c = c + 1;
            }

            if (currentDate == formattedDate) {
                list_win[c - 1] = 0
                if (res == 1) {
                    list_win[c - 1] = totalPoint;
                }
            }
        }
        // console.log(list_win);
        // console.log(list_lose);
        // console.log(name_month);
        callBack(err, name_month, list_date, list_win, list_lose)
    })
}

function setnameMonth(date: string) {
    const name_month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(date));
    return name_month;
}
