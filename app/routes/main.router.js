import express from 'express';
import { addCustomUser, changepass, deleteroom, getCustomUser, quickify, quicklogin, quickroom, quickshowroom, quicksign, showallroom, updateprofile, updateroom } from '../controller/main.controller.js';
import multer from 'multer';
import { checklogin } from '../middleware/checklogin.js';
export const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./usersprofilepic`)
  },
  filename: function (req, file, cb) {
    cb(null,`${Date.now()}-${file.originalname}`);
  }
})
const upload = multer({ storage: storage });

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