import mongoose  from "mongoose";
import { rolesSchema } from "./roles.schema.js";
import { customError } from "../../middlewares/error.middleware.js";

const requestModel=mongoose.model("request",rolesSchema);


export class requestRepository{
    addRequest=async (userId,companyId,companyName)=>{
        try{
        let newRequest=await requestModel.create({role:"employee",userId,companyId,companyName});
        await newRequest.save();
        return newRequest;
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
            else{
                throw new customError(400,"something went wrong will creating the requset to organisation");
            }
        }
    }

    findRequestUsingUserIdInCompany=async (userId,companyId)=>{
        try{
            let count=await requestModel.countDocuments({userId,companyId});
            return count;
        }
        catch(err){
            throw new customError(400,"something went wrong while searching for user");
        }
    }
}