import mongoose  from "mongoose";
import { rolesSchema } from "./roles.schema.js";
import { customError } from "../../middlewares/error.middleware.js";
import {ObjectId} from "mongodb";

const requestModel=mongoose.model("request",rolesSchema);


export class requestRepository{
    addRequest=async (userId,companyId,companyName,note)=>{
        try{
        let newRequest=await requestModel.create({role:"employee",userId,companyId,companyName,note});
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
    findRequestUsingUserIdInCompanyReturnData=async (userId,companyId)=>{
        try{
            let request=await requestModel.findOne({userId,companyId});
            return request;
        }
        catch(err){
            throw new customError(400,"something went wrong while searching for user");
        }
    }
    dataOfUserRequests=async (userId)=>{
        try{
            const roles=await requestModel.find({userId},{userId:0,"__v":0}).sort({ time: -1 });
            return roles;
        }
        catch(err){
            if (err instanceof customError){
                throw new customError(400,err.message);
            }else{
                throw new customError(400,"something went wrong while computing the roles")
            }
        }
    }
    getAllRequestsRelatedToCompanyID=async (companyId)=>{
        try{
            const requests= await requestModel.aggregate([
                {
                    "$match":{
                        "companyId":new ObjectId(companyId)
                    }
                },
                {
                "$lookup": {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'Data',
                    }
                },
                {
                    "$unwind":"$Data"
                },
                {
                    "$project":{
                        "name":"$Data.name",
                        "about":"$Data.about",
                        "photo":"$Data.photoPath",
                        "note":"$note"
                    }
                }
            ]);
            return requests;
        }
        catch(err){
            throw new customError(400,"something went wrong while computing the requests")
        }
    }
    getElementByIdAndDelete=async (requestId)=>{
        try{
            const request=await requestModel.findByIdAndDelete(requestId);
            return request;
        }catch(err){
            throw new customError(400,"something went wrong while computing the id");
        }
    }
    deleteRequest=async (requestId)=>{
        try{
            const request=await requestModel.deleteOne({_id:requestId});
            return request;
        }catch(err){
            throw new customError(400,"something went wrong while computing the id");
        }
    }
    deleteRequestByCompanyId=async (companyId)=>{
        try{
            await requestModel.deleteMany({companyId});
        }
        catch(err){
            throw new customError(400,"something went wrong while computing the id");
        }
    }
}