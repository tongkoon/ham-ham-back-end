import multer from "multer";

export const upload = multer({ storage: multer.memoryStorage() })


export const AVATAR_DEFAULT = 'https://firebasestorage.googleapis.com/v0/b/test-upload-image-44e6d.appspot.com/o/files%2FDefaultPic.png?alt=media&token=d87a7086-a6e3-4814-bc01-bdf8722f4c7b'
export const UNDEFINED = undefined;
export const NOT_FOUND = 0;
export const BAD_PASSWORD = -1;

export const giveCurrentDateTime = () => {
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + (today.getDate())
    return date
}