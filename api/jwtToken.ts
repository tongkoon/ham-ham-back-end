import { format } from 'date-fns';
import express from 'express';
import { expressjwt } from "express-jwt";
import jwt from "jsonwebtoken";
import { SECRET, giveCurrentDateTime } from './constant';
export const router = express.Router();

export const jwtAuthen = expressjwt({
    secret: SECRET,
    algorithms: ["HS256"],
})

export function generateToken(payload: any, secretKey: string): string {
    const token: string = jwt.sign(payload, secretKey, {
        issuer: "Ham-Ham"
    });

    return token;
}

export function verifyToken(token: string, secretKey: string): { valid: boolean; decoded?: any; error?: string } {
    try {
        const decodedPayload: any = jwt.verify(token, secretKey);
        return { valid: true, decoded: decodedPayload };
    } catch (error) {
        return { valid: false, error: JSON.stringify(error) };
    }
}

router.get('/', (req, res) => {
    const payload = { username: 'test01', password: '123$%6789' }
    const token_jwt = generateToken(payload, SECRET);

    const data = verifyToken(token_jwt, SECRET)
    res.json({ token: token_jwt, data })
})
router.get('/test', (req, res) => {
    const options = { timeZone: 'Asia/Bangkok' };
    const dateTime = new Date().toLocaleString('en-US', options)
    const date = format(dateTime, 'yyyy-MM-dd');
    const time = format(dateTime,'hh-mm')
    res.json({
        'giv': giveCurrentDateTime(),
        'date Serv': new Date(),
        'zone':dateTime,
        'date':date,
        'time':time
    })
})
