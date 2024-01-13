import { customError } from "../../middlewares/error.middleware.js";
import { requestRepository } from "./request.repository.js";
import { rolesRepository } from "./roles.repository.js";
import { companyRepository } from "../company/company.repository.js";
import { commentRepository } from "../comment/comment.repository.js";

import jwt from "jsonwebtoken";

const isValidObjectId = (id) => {
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;  
    return objectIdPattern.test(id);
};


export class rolesAndRequestController{
    constructor(){
        this.requestRepository=new requestRepository();
        this.rolesRepository=new rolesRepository();
        this.companyRepository=new companyRepository();
        this.commentRepository=new commentRepository();
    }
    addNewRole=async (req,res,next)=>{
        try{
        //triming for the all elements for the req.body
        for(const key in req.body){
            if (typeof req.body[key] === 'string') {req.body[key]=req.body[key].trim();}
        }
        const {companyName,role, companyId,about,note}=req.body;
        const {userId}=req.userData;
        if(role==="admin"){
            let company=await this.companyRepository.add(companyName,userId,about);
            let admin=await this.rolesRepository.addNewRole(role,userId,company._id,companyName);
            company.adminId.push(admin._id);
            company.save();
            res.status(201).send({status:true,msg:"created organisation sucessfully, you are the admin"});
        }
        else if(role==="employee"){
            const company=await this.companyRepository.getCompanyByShortComapyId(companyId);
            if(!company){throw new customError(400,"organisation has not found")}
            if(await this.rolesRepository.findEmployeeUsingUserIdInCompany(userId,company._id)){
                throw new customError(400,"your are aldready in the organisation");
            }
            if(await this.requestRepository.findRequestUsingUserIdInCompany(userId,company._id)){
                throw new customError(400,"your request is aldready recived to that organisation, please wait admin to accept for that organisation");
            }
            //create the request in this process
            await this.requestRepository.addRequest(userId,company._id,company.companyName,note);
            res.status(201).send({status:true,msg:"request to be in the organisation is sucessfully made"});
        }
        else{
            throw new customError(400,"please check the role properly");
        }
        }catch(err){
            next(err);
            console.log(err);
        }
    }

    dataOfUserRoles=async (req,res,next)=>{
        try{
            const roles=await this.rolesRepository.dataOfUserRoles(req.userData.userId);
            res.json({status:true,roles:roles});
        }
        catch(err){
            next(err);
        }
    }
    dataOfUserRequests=async (req,res,next)=>{
        try{
            const roles=await this.requestRepository.dataOfUserRequests(req.userData.userId);
            res.json({status:true,roles:roles});
        }
        catch(err){
            next(err);
        }
    }
    dataOfRequestsToCompany=async (req,res,next)=>{
        try{
            const companyId=req.userData.companyId;
            const role=req.userData.role;
            //should handle when the admin is removed when he is logined
            if(!companyId&&!(role=="admin"||role=="both")){
                throw new customError(400,"please provide the companyId, or you are no the admin");
            }
            const request=await this.requestRepository.getAllRequestsRelatedToCompanyID(companyId);
            res.json({request});
        }
        catch(err){
            next(err);
        }
    }
    changeRequestToRole=async (req,res,next)=>{
        try{
            const requestId=req.body.requestId;
            const companyId=req.userData.companyId;
            const role=req.userData.role;
            //should handle when the admin is removed the another admin when he is logined
            if(!companyId&&!(role=="admin"||role=="both")){
                throw new customError(400,"please provide the companyId, or you are no the admin");
            }
            if(!requestId){
                throw  new customError(400,"please provide the requestId");
            }
            const request=await this.requestRepository.getElementByIdAndDelete(requestId);
            await this.rolesRepository.changeRequestToRole(request);
            res.json({status:true,msg:"sucessfuly cahnged request to role"});
        }catch(err){
            next(err);
        }
    }
    revertRequest=async (req,res,next)=>{
        try{
            const requestId=req.body.requestId;
            const companyId=req.userData.companyId;
            const role=req.userData.role;
            //should handle when the admin is removed the another admin when he is logined
            if(!companyId&&!(role=="admin"||role=="both")){
                throw new customError(400,"please provide the companyId, or you are no the admin");
            }
            if(!requestId){
                throw  new customError(400,"please provide the requestId");
            }
            await this.requestRepository.deleteRequest(requestId);
            res.json({status:true,msg:"sucessfuly, remove the request"});
            
        }catch(err){
            next(err);
        }
    }
    dataOfEmployees=async (req,res,next)=>{
        try{
            const companyId=req.userData.companyId;
            const role=req.userData.role;
            //should handle when the admin is removed when he is logined
            if(!companyId&&!(role=="admin"||role=="both")){
                throw new customError(400,"please provide the companyId, or you are no the admin");
            }
            const employees=await this.rolesRepository.dataOfEmployees(companyId);
            res.json({status:true,data:employees});
        }
        catch(err){
            next(err);
        }
    }
    changeAdminToEmployee=async (req,res,next)=>{
        try{
            const companyId=req.userData.companyId;
            const role=req.userData.role;
            const roleId=req.userData.roleId;
            //should handle when the admin is removed when he is logined
            if(!companyId&&!(role=="admin")&&!roleId){
                throw new customError(400,"please provide the companyId, or you are no the admin");
            }
        
            if(await this.rolesRepository.changeAdminToEmployee(roleId)){
                req.userData.cookieData["role"]="both";
                var token=jwt.sign(req.userData.cookieData, process.env.jwt);
                res.cookie(process.env.cookieNameUserCredientails,token,{maxAge: parseInt(process.env.expoireOfCookieUserCredientails)});
                res.json({status:true,msg:"sucessfuly changed admin to employee"});
            }
            else{
                throw new customError(400,"you may be aldready employee and admin , or roleid is in correct");
            }
        }catch(err){
            next(err);
        }
    }
    getAllowedCommentUserDetails=async (req,res,next)=>{
        try{
            const companyId=req.userData.companyId;
            const role=req.userData.role;
            const roleId=req.userData.roleId;
            let data;
            if(!companyId&&!(role=="employee"||role=="both")){
                throw new customError(400,"please change the role to employee to get the details");
            }
            let b=await this.companyRepository.getCompanyOptions(companyId);
            b=b["EachOtherComments"];
            if(b){
                data=await this.rolesRepository.getDetaisOfEmployeesOfCommentersUsingCompanyId(companyId,roleId);
            }
            else{
                data=await this.rolesRepository.getDetaisOfEmployeesOfCommenters(roleId);
            }
            res.json({status:true,data:data});
        }
        catch(err){
            next(err);
        }
    }
    changeRole=async (req,res,next)=>{
        try{
            const companyId=req.userData.companyId;
            const role=req.userData.role;
            const roleId=req.userData.roleId;
            const newRole=req.body["role"];
            const roledIDC=req.body["roleId"];
            //should handle when the admin is removed when he is logined
            if(!companyId&&!(role=="admin"||role=="both")&&!(newRole=="employee"||newRole=="both")){
                throw new customError(400,"please provide the companyId, or you are no the admin");
            }
            if(!newRole||!roledIDC){
                throw new customError(400,"please provide the newRole and newRoleId");
            }
            const roleC=await this.rolesRepository.changeRole(roledIDC,newRole,companyId);
            if(roleC){
                res.json({status:true,msg:"sucessfuly changed role"});
            }else{
                throw new customError(400,"please check the newRoleId or login details");
            }
        }
        catch(err){
            next(err);
        }
    }
    deleteRole=async (req,res,next)=>{
        try{
            const companyId=req.userData.companyId;
            const role=req.userData.role;
            const roledIDC=req.body["roleId"];
            //should handle when the admin is removed when he is logined
            if(!companyId&&!(role=="admin"||role=="both")){
                throw new customError(400,"please provide the companyId, or you are no the admin");
            }
            if(!roledIDC||!isValidObjectId(roledIDC)){
                throw new customError(400,"please provide the RoleId");
            }
            const roleC=await this.rolesRepository.deleteRole(roledIDC,companyId);
            if(roleC){
                await this.commentRepository.deleteAllCommentsOfUser(roledIDC);
                res.json({status:true,msg:"sucessfuly deleted role"});
            }else{
                throw new customError(400,"please check the newRoleId or login details");
            }
        }
        catch(err){
            next(err);
        }
    }
}