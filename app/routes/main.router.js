import express from 'express';
import { addCustomUser, changepass, deactivateaccount, deleteCustomUser, deleteroom,getCustomUser,getuserdata,logincheckgoogle,quickify, quicklogin, quickroom, quickshowroom, quicksign, searchUser, sendemailotp, showallroom, updateprofile, updateroom, verifyotp } from '../controller/main.controller.js';
import { checklogin } from '../middleware/checklogin.js';
import { upload } from '../middleware/upload.js';
import { veryfiTokan } from '../middleware/tokan.js';
import { googleproceess, googleredirect } from '../middleware/googleAuth.js';
import passport from 'passport';
import pkg from "passport-google-oauth20";
import { verifyOTP } from '../middleware/verify.otp.js';
const { Strategy: GoogleStrategy } = pkg;
export const router = express.Router();
// Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_REDIRECT_URL
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));

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
router.delete('/delete-custom-room',deleteCustomUser);
router.get('/search-user',searchUser);
router.delete('/de-activate-account',deactivateaccount);
router.get('/auth/google',passport.authenticate("google", { scope: ["profile", "email"],session:false }));
router.get("/auth/google/callback",passport.authenticate("google", {session:false, prompt:"select_account consent", failureRedirect: "/" }),logincheckgoogle);
router.post('/get-user',veryfiTokan,getuserdata);
router.put('/verify-otp',verifyOTP,verifyotp);
router.get('/sendotp',sendemailotp);
//http://localhost:3000/api/auth/google/callback