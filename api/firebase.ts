import { Request } from 'express';
import { initializeApp } from 'firebase/app';
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import firebaseConfig from '../config/firebase.config';
import { PATH_FIREBASE_STORAGE } from './constant';
import { getPictureByPid } from './picture/picture.model';

initializeApp(firebaseConfig.firebaseConfig);
const storage = getStorage()

export async function uploadPictureFirebase(req: Request) {
    const storageRef = ref(storage, `files/${req.file?.originalname}`);
    const metadata = {
        contentType: req.file?.mimetype,
    }
    // Upload file in bucket storage
    const snapshot = await uploadBytesResumable(storageRef, req.file!.buffer, metadata);
    // Get Url Public
    return getDownloadURL(snapshot.ref);
}

export function removePictureFirebase(pid: number) {
    let imageUrl;
    getPictureByPid(+pid, async (err: any, result: any) => {
        imageUrl = await result[0].url;
        console.log(imageUrl);

        const fileName = convert_url_namefile(imageUrl); 
        const imagePath = PATH_FIREBASE_STORAGE + fileName;
        const imageRef = ref(storage, imagePath);
        try {
            // ทำการลบไฟล์
            await deleteObject(imageRef);
            console.log(`Image at ${imagePath} has been deleted successfully.`);
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    })
}

function convert_url_namefile(url: string) {
    const decodedUrl = decodeURIComponent(url);
    const urlObject = new URL(decodedUrl);
    const pathname = urlObject.pathname;
    const fileName = pathname.substring(pathname.lastIndexOf('/') + 1);

    return fileName;
}