import mongoose from "mongoose"
import { userSchema } from "./user.schema.js"
import { customError } from "../../middlewares/error.middleware.js";

const userModel=mongoose.model("users",userSchema);

export class userRepository{
    addUser=async (email,password,name,about,photoPath,bannerPath,photoOriginalName,bannerOriginalName)=>{
        try{
            const newUser=await userModel.create({email,password,name,about,photoPath,bannerPath,photoOriginalName,bannerOriginalName});
            await newUser.save();
            return newUser;
        }
        catch(err){
            if(err instanceof mongoose.Error.ValidationError){
                let userSendErrors={};
                for(const filed in err.errors){
                    if (err.errors.hasOwnProperty(filed)){
                        userSendErrors[filed]=err.errors[filed].message;
                    }
                }
                throw new customError(400,userSendErrors);
            }
            else if(err.code===11000){
                throw new customError(400,"the email is aldeary exist,please choose another","email");
            }
            else{
                throw new customError(400,"something went wrong while creating the user");
            }
        }
    }
    findUserByEmail=async (email)=>{
        try{
            const user=await userModel.findOne({email});
            return user;
        }
        catch(err){
            throw new customError(400,"something went wrong while picking up the user");
        }
    }
    confirmUserIdUsingConnectinId=async (userId,connectionId)=>{
        try{
            const user=await userModel.findById(userId);
            if(!user){
                throw new customError(400,"given the wrong credentials");
            }
            if(user.connectionId==connectionId){
                return true;
            }
            else{
                return false;
            }
        }
        catch(err){
            if (err instanceof customError){
                throw new customError(400,err.message);
            }else{
                throw new customError(400,"something went wrong while picking up the user")
            }
        }
    }
    changeConnectionId=async (userId)=>{
        try{
            const user=await userModel.findById(userId);
            if(!user){
                throw new customError(400,"given the wrong credentials");
            }
            let generatedRandomNumber = Math.floor(Math.random() * 100000000);
            while(user.connectionId==generatedRandomNumber){
                generatedRandomNumber = Math.floor(Math.random() * 100000000);
            }
            user.connectionId=generatedRandomNumber;
            user.save();
        }catch(err){
            if (err instanceof customError){
                throw new customError(400,err.message);
            }else{
                throw new customError(400,"something went wrong while doing logout");
            }
        }
    }
    ToogleEmailVerify =async (email,emailVerified)=>{
        try{
            const user=await userModel.findOne({email:email});
            if(!user){
                throw new customError(400,"email is not found, please go for signin")
            }
            user.verified=emailVerified;
            user.save();
        }catch(err){
            console.log(err);
            if (err instanceof customError){
                throw new customError(400,err.message);
            }else{
                throw new customError(400,"something went wrong with email");
            }
        }
    }
    resetPassword=async (email,password)=>{
        try{
            const user=await userModel.findOne({email:email});
            if(!user){
                throw new customError(400,{status:true,msg:"email is not found, please go for signin"})
            }
            user.verified=true;
            user.password=password;
            let generatedRandomNumber = Math.floor(Math.random() * 100000000);
            while(user.connectionId==generatedRandomNumber){
                generatedRandomNumber = Math.floor(Math.random() * 100000000);
            }
            user.connectionId=generatedRandomNumber;
            user.save();
        }catch(err){
            if (err instanceof customError){
                throw new customError(400,err.message);
            }else{
                throw new customError(400,"something went wrong while changing password");
            }
        }
    }
}