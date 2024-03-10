import express from "express";
import { initializeApp } from 'firebase/app';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import multer from "multer";
import firebaseConfig from "../config/firebase.config";

export const router = express.Router();

initializeApp(firebaseConfig.firebaseConfig);

const storage = getStorage()

const upload = multer({storage: multer.memoryStorage()})

router.post('/',upload.single('image'),async (req,res) => {
    const dateTime = giveCurrentDateTime();

    const storageRef = ref(storage,`files/${req.file?.originalname+"    "+dateTime}`);

    const metadata = {
        contentType: req.file?.mimetype,
    }

    // Upload file in bucket storage
    const snapshot = await uploadBytesResumable(storageRef,req.file!.buffer,metadata);

    // Get Url Public
    const downloadUrl = await getDownloadURL(snapshot.ref);

    console.log("File successfully upload.");

    return res.send(
        {
            message:'file upload to firebase storage',
            name:req.file?.originalname,
            type:req.file?.mimetype,
            dateTime:dateTime,
            // downloadURL : downloadUrl
        }
    )
    
});

const giveCurrentDateTime = () => {
    const today = new Date();
    const date = today.getFullYear() + '-' +(today.getMonth()+1) + '-' + (today.getDay())
    return date
}
