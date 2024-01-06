import mongoose from "mongoose";
import { rolesSchema } from "./roles.schema.js";
import { customError } from "../../middlewares/error.middleware.js";
import {ObjectId} from "mongodb";

const rolesModel=mongoose.model("roles",rolesSchema);

export class rolesRepository{
    addNewRole=async (role,userId,companyId,companyName)=>{
        try{
            let newRole;
            if(role==="admin"){
                newRole=await rolesModel.create({role,userId, companyId,companyName});
                await newRole.save();
                
            }
            else{
                newRole=await rolesModel.create({role:"employee",userId,companyId,companyName});
            }
            return newRole;
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
                throw new customError(400,"something went wrong will creating the employee to organisation or admin to orginisation");
            }
        }
    }
    findEmployeeUsingUserIdInCompany=async (userId,companyId)=>{
        try{
            let role=await rolesModel.findOne({userId,companyId});
            return role;
        }
        catch(err){
            throw new customError(400,"something went wrong while searching for user");
        }
    }
    dataOfUserRoles=async (userId)=>{
        try{
            const roles=await rolesModel.find({userId},{userId:0,"__v":0}).sort({ time: -1 });
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
    checkUserIdToAdminId=async (userId,rolesId)=>{
        try{
            const role=await rolesModel.findOne({userId,_id:rolesId});
            if(role){
                if(role.role=="admin"||role.role=="both"){
                    return role;
                }
                else{
                    return null;
                }
            }
            else{
                return null;
            }
        }
        catch(err){
            throw new customError(400,"something went wrong while computing");
        }
    }
    
    findRoleUsingUserIdInCompany=async (userId,companyId)=>{
        try{
            let count=await rolesModel.countDocuments({userId,companyId});
            return count;
        }
        catch(err){
            throw new customError(400,"something went wrong while searching for user");
        }
    }
    changeCompanyNameToCompanyId=async(companyName,companyId)=>{
        try{
            await rolesModel.updateMany({companyId},{$set:{companyName}});
        }
        catch(err){
            throw new customError(400,"something went wrong while changing the name");
        }
    }
    changeRequestToRole=async (request)=>{
        try{
            await this.addNewRole("employee",request.userId,request.companyId,request.companyName);
            await increaseCount(request.companyId);
        }catch(err){
            throw new customError(400,"something went wrong changing the role");
        }
    }
    dataOfEmployees=async (companyId)=>{
        try{
            const employees= await rolesModel.aggregate([
                {
                    "$match":{
                        "companyId":new ObjectId(companyId),
                        "role":"employee"
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
                    }
                }
            ]);
            return employees;
        }
        catch(err){
            console.log(err);
            throw new customError(400,"something went wrong while computing the employees")
        }
    }
    getTheDataOfEmployee=async (roleId)=>{
        try{
            const employee=await rolesModel.aggregate([
                {
                    "$match":{
                        "_id":new ObjectId(roleId)
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
                            "banner":"$Data.bannerPath",
                            "companyId":"$companyId",
                            "companyName":"$companyName",
                            "role":"$role",
                        }
                    }
            ]);
            return employee;
        }
        catch(err){
            console.log(err);
            throw new customError(400,"something went wrong while computing the employees")
        }
    }
    changeAdminToEmployee=async (roleId)=>{
        try{
            const role=await rolesModel.findOne({_id:roleId});
            if(!role||role.role=="admin"){
                await rolesModel.updateOne({_id:roleId},{$set:{role:"both"}});
                increaseCount(role.companyId);
                return true;
            }
            else{
                return false;
            }
        }
        catch(err){
            throw new customError(400,"something went wrong while changing the role");
        }
    }
    deleteRoleByCompanyId=async (companyId)=>{
        try{
            await rolesModel.deleteMany({companyId});
        }
        catch(err){
            throw new customError(400,"something went wrong while deleting the role");
        }
    }
}

import {companyRepository} from "../company/company.repository.js"
const companyR=new companyRepository();
async function increaseCount(companyId){
    await companyR.addOrRemoveEmployee(companyId,1,"+")
}