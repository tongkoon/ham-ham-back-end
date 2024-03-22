
// const today = new Date();
// const date = today.getFullYear() + '-' +(today.getMonth()+1) + '-' + (today.getDate())
// const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()
// const dateTime = date+' '+time
// console.log(dateTime);
// console.log(today.getDate());

import { K } from "./vote/vote.model";




// const today = new Date();
//     const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + (today.getDate())
// console.log(date);









// const imageUrl = "https://firebasestorage.googleapis.com/v0/b/test-upload-image-44e6d.appspot.com/o/files%2Fcolor.png?alt=media&token=b7f20bf9-cd6b-4a9e-951e-aa8a531ac7de";

// // Decode the URL
// const decodedUrl = decodeURIComponent(imageUrl);

// // Create a URL object from the decoded URL
// const urlObject = new URL(decodedUrl);

// // Get the pathname from the URL
// const pathname = urlObject.pathname;

// // Extract the file name from the pathname
// const fileName = pathname.substring(pathname.lastIndexOf('/') + 1);

// console.log("File name:", fileName);



// // ตัวอย่างการลบ
// import { initializeApp } from 'firebase/app';
// import { deleteObject, getStorage, ref } from 'firebase/storage';
// import firebaseConfig from '../config/firebase.config';


// // กำหนดค่า Firebase
// initializeApp(firebaseConfig.firebaseConfig);

// // ให้คุณพยายามทำการลบไฟล์ใน storage
// async function deleteImage(imagePath: string): Promise<void> {
//   const storage = getStorage();
//   const imageRef = ref(storage, imagePath);

//   try {
//     // ทำการลบไฟล์
//     await deleteObject(imageRef);
//     console.log(`Image at ${imagePath} has been deleted successfully.`);
//   } catch (error) {
//     console.error('Error deleting image:', error);
//   }
// }

// //firebasestorage.googleapis.com/v0/b/test-upload-image-44e6d.appspot.com/o/files%2Fd9348f10-7ef8-4174-9b7b-85b767a93f7b?alt=media&token=3f35b10d-e712-4b1d-87f5-a384ae94314f";
// // เรียกใช้ฟังก์ชันเพื่อลบรูปภาพ
// deleteImage('gs://test-upload-image-44e6d.appspot.com/files/'+fileName);
// // 'gs://test-upload-image-44e6d.appspot.com/files/2eaa8a7e-d172-41f7-abed-763fb343a11f'



// console.log(giveCurrentDateTime());


// const date = new Date('2024-3-15');
// const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date)
// console.log(monthName);

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

// function elo(scoreA:number,resA:number,scoreB:number,resB:number) {
//     const Sc_a = scoreA;
//     const Sc_b = scoreB;
//     console.log('scA'+Sc_a);
//     console.log('scB'+Sc_b);
//     // ผลแพ้ชนะ
//     const S_a = resA
//     const S_b = resB
// console.log('reA'+S_a);
// console.log('reB'+S_b);


//     // เรทคะแนนที่ควรได้
//     const E_a: number = +(1 / (1 + (10 ** ((Sc_b - Sc_a) / 400)))).toFixed(3)
//     const E_b: number = +(1 / (1 + (10 ** ((Sc_a - Sc_b) / 400)))).toFixed(3)
// console.log('EA'+E_a);
// console.log('EB'+E_b);



//     // ค่า K ที่คำนวณจากคะแนนเดิม
//     const k_a = K(Sc_a);
//     const k_b = K(Sc_b);

//     // คะแนนที่ได้
//     const point1 = k_a * (resA - E_a)
//     const point2 = k_b * (resB - E_b)

//     // ผลรวมคะแนนล่าสุด
//     const R_a: number = Sc_a + point1
//     const R_b: number = Sc_b + point2

//     const date = giveCurrentDateTime();

//     const picture1 = {  score: Sc_a, K: k_a, result: S_a, E: E_a, point: point1, total: R_a }
//     const picture2 = {  score: Sc_b, K: k_b, result: S_b, E: E_b, point: point2, total: R_b }
//     console.log(picture1);
//     console.log(picture2);
    
// }

// elo(2600,1,2300,0)

// console.log(giveCurrentDateTime());
        const Sc_a = 3;
        const Sc_b = -134;
        console.log('scA'+Sc_a);
        console.log('scB'+Sc_b);

        // ผลแพ้ชนะ
        const S_a = 0
        const S_b = 1
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
        const point1 = +(k_a * (S_a - E_a)).toFixed(3)
        const point2 = +(k_b * (S_b - E_b)).toFixed(3)
        console.log('pointA : '+point1);
        console.log('pointB : '+point2);
        

        // ผลรวมคะแนนล่าสุด
        const R_a: number = +(Sc_a + point1).toFixed(3)
        const R_b: number = +(Sc_b + point2).toFixed(3)
        console.log('rA : '+R_a);
        console.log('rB : '+R_b);
        

