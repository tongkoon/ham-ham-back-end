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

        // ผลแพ้ชนะ
        const S_a = pic1.result
        const S_b = pic2.result

        // เรทคะแนนที่ควรได้
        const E_a: number = +(1 / (1 + (10 ** ((S_a - Sc_a) / 400)))).toFixed(2)
        const E_b: number = +(1 / (1 + (10 ** ((S_b - Sc_b) / 400)))).toFixed(2)

        // ค่า K ที่คำนวณจากคะแนนเดิม
        const k_a = K(S_a);
        const k_b = K(S_b);

        // คะแนนที่ได้
        const point1 = k_a * (pic1.result - E_a)
        const point2 = k_b * (pic2.result - E_b)

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

export const getTrends = (pid: number, callBack: Function) => {
    // เวลาใน node js และ database ไม่ตีงกัน 1 วัน
    const sql = 'SELECT pid,result,SUM(point) as totalPoint,DATE_FORMAT(`date`, \'%Y-%m-%d\') AS date ' +
        'FROM `vote` ' +
        'WHERE `date` >= DATE_SUB(CURDATE(), INTERVAL 6 DAY) and pid = ? ' +
        'GROUP BY result,date ' +
        'ORDER BY `date`,`result`'

    conn.query(sql, pid, (err, result) => {
        console.log(result);

        let currentDate = null;
        let list_date=[];
        let list_win: null[]=[];

        console.log(result.length);
        let c = 0;
        for (let i = 0; i < result.length; i++) {
            console.log(result[i].date+' result:'+result[i].result);
            
            let date = result[i].date;
            let formattedDate = new Date(date).toISOString().split('T')[0];

            if (currentDate !== formattedDate) {
                list_date[c] = formattedDate;
                if(currentDate == formattedDate){
                    list_win[c] = result[i].totalPoint
                }

                console.log('p'+date);
                currentDate = formattedDate;
                c=c+1;
            }

            

            // if(result[i].result == 1){list_win[c]=result[c].totalPoint}
            
        }

        // let jsonData = [];
        // let currentDate = null;
        // let currentData: any = { '0': 0, '1': 0 };

        // for (let i = 0; i < result.length; i++) {

        //     // แปล date ให้อยู่ในรูป 2024-03-15
        //     let date = result[i].date;
        //     let formattedDate = new Date(date).toISOString().split('T')[0];

        //     let result_ = result[i].result;
        //     let totalPoint = result[i].totalPoint;
        
        //     // หากมีวันที่ใหม่ ให้เพิ่มข้อมูลใหม่เข้าไปในอาร์เรย์ jsonData
        //     if (currentDate !== formattedDate) {
        //         // เพิ่มข้อมูลของวันที่เก่าเข้าในอาร์เรย์ jsonData หากมี
        //         if (currentDate !== null) {
        //             jsonData.push(currentData);
        //         }
        //         currentDate = formattedDate;
        //         // สร้างข้อมูลใหม่สำหรับวันที่ใหม่
        //         currentData = { date: formattedDate,'0': 0, '1': 0 };
        //     }

        //     // กำหนดค่า totalPoint ตาม result_ ในอ็อบเจกต์ของวันนั้น
        //     currentData[result_] = totalPoint;
        // }

        // // เพิ่มข้อมูลของวันที่สุดท้ายเข้าในอาร์เรย์ jsonData
        // if (currentDate !== null) {
        //     jsonData.push(currentData);
        // }

        // console.log(jsonData);
        // jsonData.forEach(element => {
        //     console.log(element['date']);
        //     console.log("Day "+new Date(element['date']).getDate());
        //     console.log("Lose "+element['0']);
        //     console.log("Win "+element['1']+"\n");
        // });

        callBack(err, list_date,list_win)
    })
}