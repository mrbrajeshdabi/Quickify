import passport from 'passport';
import pkg from "passport-google-oauth20";
// import {config} from 'dotenv';
// config();

export let googleproceess = (req,res,next) =>{
    passport.authenticate("google", { scope: ["profile", "email"],session:false });
    next();
}

export let googleredirect = (req,res,next) =>{
    passport.authenticate("google", {session:false, failureRedirect: "/" }),
      (req, res) => {
        res.send(`
          <h2>Login Success</h2>
          <p>Name: ${req.user.displayName}</p>
          <p>Email: ${req.user.emails[0].value}</p>
          <p>Photo: ${req.user.photos[0].value}</p>
        `);
      }
      next();
}