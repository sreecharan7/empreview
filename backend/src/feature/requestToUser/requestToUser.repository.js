import {requestToUserSchema} from "./requestToUser.schema.js";
import { customError } from "../../middlewares/error.middleware.js";
import {ObjectId} from "mongodb";
import mongoose  from "mongoose";

const requestToUserModel=mongoose.model("requestToUser",requestToUserSchema);

export class requestToUserRepository{
    addRequest=async (companyId,userId,note,adminId)=>{
        try{
            if(await this.findRequestUsingCompanyIdAndUserIdCount(companyId,userId)){
                throw new customError(400,"the request to that person aldready exist");
            }
            else{
                const a=await requestToUserModel.create({companyId,userId,note,adminId});
                return a;
            }
        }
        catch(err){
            if (err instanceof customError){
                throw new customError(400,err.message);
            }else{
                throw new customError(400,"something went wrong with when adding the request to user");
            }
        }
    };
    findRequestUsingCompanyIdAndUserIdCount=async (companyId,userId)=>{
        try{
            const r=await requestToUserModel.countDocuments({companyId,userId});
            return !!r;
        }
        catch(err){
            throw new customError(400,"something went wrong with when checking the request to user");
        }
    }
    companyDetailsToUser=async(companyId,userId)=>{
        try{
            const r=await requestToUserModel.aggregate([
                {
                    "$match":{
                        "companyId":new ObjectId(companyId),
                        "userId":new ObjectId(userId)
                    }
                },
                {
                    "$lookup":{
                        from:"companies",
                        localField: 'companyId',
                        foreignField: '_id',
                        as: 'Data',
                    }
                },
                {
                    "$project":{
                        "companyName":"$Data.companyName",
                        "about":"$Data.about",
                        "photoPath":"$Data.photoPath",
                        "noOfEmployee":"$Data.noOfEmployee",
                        "note":"$note"
                    }
                }
                
            ]);
            return r;
        }
        catch(err){
            throw new customError(400,"something went wrong with when checking the request to user");
        }
    }

    addRequest2=async (companyId,userId,note,adminId)=>{
        try{
            userId=new ObjectId(userId);
            companyId=new ObjectId(companyId);
            console.log(companyId);
           const result=await requestToUserModel.aggregate([
                {
                  $facet: {
                    "requestTouser": [
                        {
                            "$group":{
                                _id:null,
                                uniqueCombinations:{
                                    "$addToSet":{companyId,userId}
                                },
                                count1:{"$sum":1}
                            }
                        }
                    ],
                    "roles": [
                      {
                        $lookup: {
                          from: "roles",
                          let:{companyId},
                          pipeline: [
                            {
                                "$match": {
                                    companyId:"$companyId"
                                }
                            }
                          ],
                          as: "matchedRequests"
                        }
                      }
                    ]
                  }
                },
                {
                  $project: {
                    rolesCount:"$matchedRequests"
                  }
                }
              ]);
        return result;
              
        }
        catch(err){
            console.log(err);
            throw new customError(400,"something went wrong with when adding the request to user");
        }
    };
}