import mongoose from 'mongoose';

let rusers = mongoose.Schema({
    createrid :{
        type:String,
        required:true
    },
    roompic:{
        type:String,
        required:true
    },
    roomname:{
        type:String,
        required:true
    },
    roomlimit:{
        type:String,
        required:true
    },
    roomtype:{
        type:String,
        required:true
    },
    roompassword:{
        type:String,
        required:true,
    },
    roompassword:{
        type:String,
        required:true,
    },
    roomstartorclose:{
        type:String,
        required:true,
    },
    roomstatus:{
        type:String,
        required:true, //busy / availlble
    }
});

export let QroomUsers = mongoose.model("quickroomusers",rusers);
