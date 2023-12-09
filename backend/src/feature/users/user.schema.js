import mongoose from "mongoose";
import bcrupt from "bcrypt";

export const userSchema=mongoose.Schema({
    email:{type:"String",required:true,match:[/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,'Please enter a valid email'],index:true,unique:true},
    password:{type:"String",required:true},
    name:{type:"String",required:true,index:true},
    about:{type:"String",required:true},
    photoPath:{type:"String",required:true,default:"website/default-photo.svg"},
    bannerPath:{type:"String",required:true,default:"website/default-photo.svg"},
    photoOriginalName:{type:"String",required:true,default:"default-photo.svg"},
    bannerOriginalName:{type:"String",required:true,default:"default-photo.svg"},
    connectionId:{type:"Number",required:true,default:0},
    time:{type:"Date",required:true,default:Date.now()},
})

userSchema.pre("save",async function (next){
    if(this.isNew){
        this.password=await bcrupt.hash(this.password,10);
        const generatedRandomNumber = Math.floor(Math.random() * 100000000);
        this.connectionId=generatedRandomNumber;
    }
    next();
})