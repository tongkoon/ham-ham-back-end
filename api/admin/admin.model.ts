import dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config();

export const writeFile = (time: string, callBack: Function) => {
    // const path = '/etc/secrets/time_random.env'
    fs.writeFile('/etc/secrets/timerandom.txt', time, (err) => {
        if (err) {
            callBack(err)
        } else {
            callBack(null)
        }
    });
}

export const readFile = (callBack:Function)=>{
    fs.readFile('/etc/secrets/timerandom.txt', 'utf8', (err, data) => {
        callBack(err,data)
    });
}