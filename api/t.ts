
// const today = new Date();
// const date = today.getFullYear() + '-' +(today.getMonth()+1) + '-' + (today.getDate())
// const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()
// const dateTime = date+' '+time
// console.log(dateTime);
// console.log(today.getDate());


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




