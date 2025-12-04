import mongoose from "mongoose";
let customuser = mongoose.Schema({
 sid : {
    type:String,
    required :true
 },
 rid : {
    type:String,
    required :true
 },
 rusername : {
    type:String,
    required :true
 },
 rpic : {
    type:String,
    required :true
 },
 rstatus : {
    type:String,
    required :true
 }

});

export let qcustomUserAdd = mongoose.model('qcustomuser',customuser);