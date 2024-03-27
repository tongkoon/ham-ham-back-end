import { Request } from 'express';
import { initializeApp } from 'firebase/app';
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import firebaseConfig from '../config/firebase.config';
import { AVATAR_DEFAULT, PATH_FIREBASE_STORAGE, giveCurrentDateTime, giveCurrentTime } from './constant';
import { getPictureByPid } from './picture/picture.model';
import { getUserByUid } from './user/user.model';

initializeApp(firebaseConfig.firebaseConfig);
const storage = getStorage()

export async function uploadPictureFirebase(req: Request) {
    const date = giveCurrentDateTime();
    const time = giveCurrentTime();
    const name = generatePictureName(20);
    const storageRef = ref(storage, `files/${name}` + date + '-' + time);
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


export function removeAvatarFirebase(uid: number) {
    let avatarUrl;
    getUserByUid(+uid, async (err: any, result: any) => {
        avatarUrl = await result.avatar;
        if (avatarUrl != AVATAR_DEFAULT) {
            console.log(avatarUrl);

            const fileName = convert_url_namefile(avatarUrl);
            const imagePath = PATH_FIREBASE_STORAGE + fileName;
            const imageRef = ref(storage, imagePath);

            try {
                // ทำการลบไฟล์
                await deleteObject(imageRef);
                console.log(`Image at ${imagePath} has been deleted successfully.`);
            } catch (error) {
                console.error('Error deleting image:', error);
            }
        }
    })
}

function generatePictureName(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}