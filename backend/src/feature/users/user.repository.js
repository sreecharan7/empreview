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
}