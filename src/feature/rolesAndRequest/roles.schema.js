import mongoose from "mongoose";


export const rolesSchema=new mongoose.Schema({
    role:{type:"String",enum:["admin","employee","both"],require:true},
    companyId:{type:mongoose.Schema.Types.ObjectId,ref:"company",index:true},
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"users",index:true},
    companyName:{type:"String",required:true},
    time:{type:"Date",required:true,default:Date.now()}
});

rolesSchema.index({userId:1,companyid:1},{unique:true});