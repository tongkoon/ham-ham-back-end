import { Request } from 'express';
import { initializeApp } from 'firebase/app';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import firebaseConfig from '../config/firebase.config';

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
