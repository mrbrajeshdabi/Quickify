// import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import {readFileSync} from 'fs';
import path from 'path';
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// dotenv.config();

export async function sendTokan(email) {
    let payload = {email};
    let file = path.join(__dirname,'private.key');
    let privateKey = readFileSync(file,'utf-8');
    let tokan = jwt.sign(payload,privateKey,{algorithm: 'RS256',expiresIn: '8760h'}); //1m 1s 8760h 1saal
    return tokan;
}

export async function veryfiTokan(req,res,next) {
    let file = path.join(__dirname,'public.key');
    let token = req.headers.authorization.split('Bearer ')[1];
    if(token == '')res.status(200).json({status:false,message:'Please Insert Tokan'});
    try {
        let publicKey = readFileSync(file,'utf-8');
        let user = jwt.verify(token, publicKey, {
            algorithms: ['RS256']
        });
        req.userEmail = user;
        next();
    } catch (error) {
        res.status(200).json({status:false,message:'Expire Your Tokan Please Login Again'});
    }
}