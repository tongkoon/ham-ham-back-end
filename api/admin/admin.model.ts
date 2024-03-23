import * as fs from 'fs';

export const writeFile = (json: string, callBack: Function) => {
    fs.writeFile('timeRandom.json', json, (err) => {
        if (err) {
            callBack(err)
        } else {
            callBack(null)
            console.log('Data has been written to data.json');
        }
    });
}

export const readFile = (callBack:Function)=>{
    fs.readFile('timeRandom.json', 'utf8', (err, data) => {
        callBack(err,data)
    });
}