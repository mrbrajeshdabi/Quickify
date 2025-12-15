export const verifyOTP = (req,res,next) =>{
    let otp = req.headers["x-verify-otp"];
    let email = req.headers['x-email'];
    if(email == "") res.status(200).json({status:false,message:'Please Hacking Close'});
    if(otp == "")res.status(200).json({status:false,message:'Please Filled Otp'});
    if(otp.length != 6)res.status(200).json({status:false,message:'Please Insert All Number'});
    req.otp = otp;
    req.email = email;
    next();
}