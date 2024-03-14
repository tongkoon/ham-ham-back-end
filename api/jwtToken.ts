import express from 'express';
import { expressjwt } from "express-jwt";
import jwt from "jsonwebtoken";
import { SECRET } from './constant';
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

export function verifyToken(token: string,secretKey: string): { valid: boolean; decoded?: any; error?: string } {
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
    res.json({ token: token_jwt, data})
})
