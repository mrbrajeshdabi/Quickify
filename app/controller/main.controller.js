import { Quickusers } from "../model/users.model.js";
import bcrypt from "bcryptjs";
import { QroomUsers } from "../model/room.model.js";
import path from 'path'; 
import {unlinkSync} from 'fs';
import { qcustomUserAdd } from "../model/custom.user.model.js";
import cloudinary from "../middleware/config.js";
import { generateOTP, sendOTP } from "../middleware/email.js";
import { sendTokan } from "../middleware/tokan.js";

export const quickify = async (req,res) => {
    res.status(200).json({status:true,message:"QuickiFy Is On"});
}

export const quicksign = async (req,res) => {
    try {
        let {username,email,mobilenumber,password} = req.body;
        let otp =  await sendOTP(email);
        const profilePicUrl = req.file?.path || "";
        let pass = password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(`${pass}`, salt);
        let insertuser = new Quickusers({profilepic:profilePicUrl,username,email,mobilenumber,otp,password:hash,accountstatus:'null',userstatus:true});
        insertuser.save().then(() =>{
            res.status(200).json({status:true,message:'success',email});
        }).catch((err)=>{res.status(200).json({status:false,message:'Email Already Exit',err})})
    } catch (error) {
        res.status(500).json({status:false,message:'internal server error',error});
    }
}

export const quicklogin = async (req,res) => {
    let {lemail,lpassword} = req.body;
    let getuser = await Quickusers.findOne({email:lemail});
    if(!getuser)
    {
        res.status(200).json({status:false,message:'Wrong Email / Password'});
    }
    else
    {
        //check password
        let hashpass = getuser.password;
        let checkdisabled = getuser.otp;
        let compare = bcrypt.compareSync(lpassword, hashpass); // true
        if(compare == true)
        {
            if(checkdisabled != "disabled")
            {
                let tokan = await sendTokan(lemail);
                res.status(200).json({status:true,message:'success',session:getuser._id,user:getuser,tokan});
            }
            else{
                res.status(200).json({status:false,message:"user account disabled"});
            }
        }
        else
        {
             res.status(200).json({status:false,message:'Wrong Email / Password'});
        }
    }
}

export const quickroom = async (req,res) => {
    let {roomname,roomlimit,roomtype,roompass,createrid} = req.body;
    let roompic = req.file?.path || "";
    let roompasss;
    if(roomtype == 'public')
    {
        roompasss = 'none';
    }
    else
    {
        roompasss = roompass;
    }

    let insertroom = new QroomUsers({
        createrid,roompic,roomname,roomlimit,roomtype,roompassword:roompasss,roomstartorclose:'close',roomstatus:'none'
    });
    insertroom.save().then(()=>{
        res.status(200).json({status:true,message:'room created success'});
    }).catch((err) => { res.status(500).json({status:false,message:err}); })
}

export const quickshowroom = async (req,res) => {
    try {
        let createrid = req.query.createrid;
        let getcreaterroom = await QroomUsers.find({createrid});
        if(getcreaterroom)
        {
            res.status(200).json({status:true,message:'success',rooms:getcreaterroom});
        }
        else
        {
            res.status(200).json({status:false,message:'No Created Room'});
        }
    } catch (error) {
        res.status(500).json({status:false,message:error});
    }
}

export const deleteroom = async (req,res) => {
    try {
        // cloudinary.uploader.destroy("uploads/profile_123");
        let fetchpic = await QroomUsers.findOne({createrid:req.query.delid});
        if(fetchpic)
        {
            let picname = fetchpic.roompic.split('https://res.cloudinary.com/dqfrjev7k/image/upload/v1764928311/quickify_profiles/')[1];
            let removepic = cloudinary.uploader.destroy(`quickify_profiles/${picname}`);
            if(removepic)
            {
                let deleterooM = await QroomUsers.deleteOne({createrid:req.query.delid});
                if(deleterooM)
                {
                    res.status(200).json({status:true,message:'delete success'});
                }
            }
        }
    } catch (error) {
        res.status(500).json({status:false,message:error});
    }   
}

export const updateroom = async (req,res) => {
    let roomid = req.query.roomid;
    let type = req.query.type;
    let update = await QroomUsers.updateOne({_id:roomid},{$set:{roomstartorclose:type}}); 
    if(update)
    {
        res.status(200).json({status:true,message:"room updated"});
    }
    else
    {
        res.status(200).json({status:false,message:"room Not updated"});
    }
}

export const showallroom = async (req,res) => {
    let getroom = await QroomUsers.find().sort();
    if(getroom)
    {
        res.status(200).json({status:true,message:"get all room",getroom});
    }
    else
    {
        res.status(200).json({status:false,message:"No room"});
    }
}

export const changepass = async (req,res) => {
    let {userid,oldpassword,newpassword} = req.body;
    let getuserid = await Quickusers.findOne({_id:userid});
    if(getuserid)
    {
        let hashpass = getuserid.password;
        let compare = bcrypt.compareSync(oldpassword, hashpass);
        if(compare == true)
        {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(`${newpassword}`, salt);
            try {
                let updatepass = await Quickusers.updateOne({_id:userid},{$set:{password:hash}});
                if(updatepass) res.status(200).json({status:true,message:'success',hashpass});
            } catch (error) {
                res.status(500).json({status:false,message:error});
            }
        }
        else
        {
            res.status(200).json({status:false,message:'Wrong Password'});
        }
        
    }
}

export const updateprofile = async (req,res) => {
    //update-profile
    try {
        let userpicname = req.file?.path || "";
        let {mobilenumber,username,updateuserid} = req.body;
        let getuser = await Quickusers.findOne({_id:updateuserid});
        if(getuser)
        {
            let picname = getuser.profilepic.split('https://res.cloudinary.com/dqfrjev7k/image/upload/v1764928311/quickify_profiles/')[1];
            let removepic = cloudinary.uploader.destroy(`quickify_profiles/${picname}`);
            if(removepic)
            {
                let updateuser = await Quickusers.updateOne({_id:updateuserid},{$set:{profilepic:userpicname,username,mobilenumber}});
                if(updateuser)
                {
                    let getprofile = await Quickusers.findOne({_id:updateuserid});
                    res.status(200).json({status:true,message:'success',data:getprofile});
                }
                else
                {
                    res.status(200).json({status:false,message:'user not update'});
                }
            }
            else
            {
                res.status(200).json({status:false,message:'cloudnary pic not deleted'});
            }
        }
        else
        {
            res.status(200).json({status:true,message:'user not found'});
        }
    } catch (error) {
        res.status(500).json({status:false,message:error});
    }
}

export const addCustomUser = async (req,res)=>{
        let {type,sid,rid} = req.body;
        let getrid;
        if(type == "email") getrid = await Quickusers.findOne({email:rid});
        if(type == "number") getrid = await Quickusers.findOne({mobilenumber:rid});
        if(type == "id") getrid = await Quickusers.findOne({_id:rid});
        if(getrid == null) res.status(200).json({status:false,message:"user not found"});
        let {profilepic,username} = getrid;
        let insertuser = new qcustomUserAdd({
            sid,rid,rusername:username,rpic:profilepic,rstatus:false
        });
        insertuser.save().then(()=>{
            res.status(200).json({status:true,message:'success'});
        });

}

export const getCustomUser = async (req,res)=>{
    try {
        let {sid} = req.body;
        let getsid = await qcustomUserAdd.find({sid});
        if(getsid != null)
        {
            res.status(200).json({status:true,message:'success',data:getsid});
        }
        else
        {
            res.status(200).json({status:false,message:'User Not Found'});
        }
    } catch (error) {
        res.status(500).json({status:false,message:error});
    }
}

export const deleteCustomUser = async (req,res) => {
    try {
        let delid = req.query.delid;
        let deleteuser = await qcustomUserAdd.deleteOne({_id:delid});
        if(deleteuser)res.status(200).json({status:true,message:'Deleted users successfully'});
    } catch (error) {
        res.status(500).json({status:false,message:'Error',error});
    }   
}

export const searchUser = async (req,res) => {
    try {
        let username = req.query.username;
        let getuser = await Quickusers.find({ username: new RegExp(username, 'i') });
        if(getuser != '')
        {
            let array = new Array();
            let i = 0;
            while(i < getuser.length)
            {
                let username = getuser[i].username;
                let userpic = getuser[i].profilepic;
                let inviteid = getuser[i]._id;
                array.push([{username,userpic,inviteid}])
                i++;
            }
            setTimeout(() => {
                res.status(200).json({status:true,message:"search users",array});
            }, 1000);
        }
        else
        {
            res.status(200).json({status:false,message:"no users"});
        }
    } catch (error) {
        res.status(500).json({status:false,message:error});
    }
}

export const deactivateaccount = async (req,res) => {
    let {id,pass} = req.query;
    let checkpasswithid = await Quickusers.findOne({_id:id});
    if(checkpasswithid)
    {
        let hashpass = checkpasswithid.password;
        let comparepass = await bcrypt.compare(pass,hashpass);
        if(comparepass == true)
        {
            let deactivated = await Quickusers.updateOne({_id:id},{$set:{otp:'disabled'}});
            if(deactivated)
            {
                res.status(200).json({status:true,message:'success'});
            }
            else
            {
                res.status(200).json({status:false,message:'Not Updated'});
            }
        }
        else
        {
            res.status(200).json({status:false,message:'Wrong Password'});
        }
    }
}

export const logincheckgoogle = async (req,res) => {
    console.log(req.user.emails[0].value);
    Quickusers.findOne({email:req.user.emails[0].value}).then(async(data)=>{
        if(data == null)
        {
            //create user
            try {
                //googleId: req.user.googleId,
                //accessToken: req.user.accessToken
                const salt = await bcrypt.genSalt(10);
                const hash = await bcrypt.hash(`${1234}`, salt);
                    let insertuser = new Quickusers({profilepic:req.user.photos[0].value,username:req.user.displayName,email:req.user.emails[0].value,mobilenumber:'null',otp:'null',password:hash,accountstatus:'null',userstatus:true});
                    insertuser.save().then(async ()=>{
                        await Quickusers.findOne({email:req.user.emails[0].value}).then(async(user)=>{
                            let tokan = await sendTokan(user.email);
                            res.redirect('https://quickify-fh37.onrender.com/profile.html?tokan='+tokan);
                        });
                    }).catch((err)=>{res.status(200).json({status:false,message:'Error',err})})
                } catch (error) {
                    res.status(500).json({status:false,message:'internal server error',error});
                }

        }
        else
        {
            let tokan = await sendTokan(data.email);
            res.redirect('https://quickify-fh37.onrender.com/profile.html?tokan='+tokan);
        }
    });
}

export const getuserdata = async (req,res) => {
    try {
        Quickusers.findOne({email:req.userEmail.email}).then((user)=>{
            res.status(200).json({status:true,message:'user',session:user._id,user});
        });
    } catch (error) {
        res.status(500).json({status:false,message:error});
    }   
}

export const verifyotp = async (req,res) => {
    try {
        let otp = req.otp;
        let email = req.email;
        Quickusers.findOne({email:email}).then((user)=>{
            if(user != "")
            {
              let dbotp = user.otp;  
              if(dbotp != otp)
              {
                  res.status(200).json({status:false,message:"Wrong Otp"});
              } 
              else
              {
                  Quickusers.updateOne({email:email},{$set:{otp:'verify'}}).then((user)=>{
                      res.status(200).json({status:true,message:"Email verify success"});
                  });
              }
            } 

        });
    } catch (error) {
        res.status(500).json({status:false,message:error});
    }
}





