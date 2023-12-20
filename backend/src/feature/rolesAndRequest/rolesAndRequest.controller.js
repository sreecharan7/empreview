import { customError } from "../../middlewares/error.middleware.js";
import { requestRepository } from "./request.repository.js";
import { rolesRepository } from "./roles.repository.js";
import { companyRepository } from "../company/company.repository.js";
export class rolesAndRequestController{
    constructor(){
        this.requestRepository=new requestRepository();
        this.rolesRepository=new rolesRepository();
        this.companyRepository=new companyRepository();
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

}