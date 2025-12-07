import mongoose from 'mongoose';

let qusers = mongoose.Schema({
    profilepic:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    mobilenumber:{
        type:String,
        required:true,
        unique:true
    },
    otp:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
    }
});

export let Quickusers = mongoose.model("quickusers",qusers);
