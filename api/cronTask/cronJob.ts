import fs from 'fs';
import cron from 'node-cron';

const logStream = fs.createWriteStream('C:\\Users\\User\\Desktop\\CS 3\\AdvWeb\\Project Adv Web\\Project Web (Back-End)\\api\\cronTask\\cron_log.txt', { flags: 'a' });
export const scheduledTask = cron.schedule('*/1 * * * *',()=>{
    const logMessage = `Scheduled task ran at ${new Date().toISOString()}\n`;
  logStream.write(logMessage);
    console.log("selcet");
    
})
