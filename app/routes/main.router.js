import express from 'express';
import { addCustomUser, changepass, deleteroom, getCustomUser, quickify, quicklogin, quickroom, quickshowroom, quicksign, showallroom, updateprofile, updateroom } from '../controller/main.controller.js';
import { checklogin } from '../middleware/checklogin.js';
import { upload } from '../middleware/upload.js';
export const router = express.Router();

router.get('/quickify',quickify);
router.post('/quicksign',upload.single('profilepic'),quicksign);
router.post('/quicklogin',checklogin,quicklogin);
router.post('/quickroom',upload.single('roompic'),quickroom);
router.get('/quickshowroom',quickshowroom);
router.delete('/delete-room',deleteroom);
router.get('/qshowAroom',showallroom);
router.put('/updateroom',updateroom);
router.put('/change-password',changepass);
router.put('/update-profile',upload.single('profilepic'),updateprofile);
router.post('/add-custom-user',addCustomUser);
router.post('/get-custom-user',getCustomUser);