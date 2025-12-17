import rateLimit from 'express-rate-limit';

export let checklogin = async (req,res,next) => {
    let {lemail , lpassword} = req.body;
    if(lemail == '' || lpassword == '')
    {
        res.status(200).json({status:true,message:"Please Full Filled Value"})
    }ś
    next();
}

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 3, // max 100 requests per IP
  message: "Too many requests, try later"
});