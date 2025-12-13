export let checklogin = async (req,res,next) => {
    let {lemail , lpassword} = req.body;
    if(lemail == '' || lpassword == '')
    {
        res.status(200).json({status:true,message:"Please Full Filled Value"})
    }
    next();
}