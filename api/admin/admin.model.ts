import dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config();

export const writeFile = (json: string, callBack: Function) => {
    // const path = '/etc/secrets/time_random.env'
    fs.writeFile('etc/secrets/time_random.env', "json", (err) => {
        if (err) {
            callBack(err)
        } else {
            callBack(null)
            console.log('Data has been written to timeRandom.json');
        }
    });
}

export const readFile = (callBack:Function)=>{
    fs.readFile('/etc/secrets/my_secret_file.txt', 'utf8', (err, data) => {
        console.log(err);
        console.log(data);
        
        callBack(err,data)
    });
}