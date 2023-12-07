import { requestRepository } from "../rolesAndRequest/request.repository.js";
import { companyRepository } from "../admin/comany.repository.js";
import { rolesRepository } from "../rolesAndRequest/roles.repository.js";
import { customError } from "../../middlewares/error.middleware.js";
import { userRepository } from "./user.repository.js";
import bycrpt from "bcrypt"

export class userController {
    constructor(){
        this.requestRepository=new requestRepository();
        this.companyRepository=new companyRepository();
        this.rolesRepository=new rolesRepository();
        this.userRepository=new userRepository();
    }
    addNewUser=async (req,res,next)=>{
        try{
            //triming for the all elements for the req.body
            for(const key in req.body){
                req.body[key]=req.body[key].trim();
            }
            const {email,password,name,about,photo,banner}=req.body;
            await this.userRepository.addUser(email,password,name,about,photo,banner);
            res.status(201).send({status:true,msg:"user created sucessfully"});
        }catch(err){
            next(err);
            console.log(err);
        }

    }
    addNewRole=async (req,res,next)=>{
        try{
        //triming for the all elements for the req.body
        for(const key in req.body){
           req.body[key]=req.body[key].trim();
        }
        const {companyName,role, companyId}=req.body;
        const {userId}=req.body;
        if(role==="admin"){
            let company=await this.companyRepository.add(companyName);
            let admin=await this.rolesRepository.addNewRole(role,userId,company._id,companyName);
            company.adminId=admin._id;
            company.save();
            res.status(201).send({status:true,msg:"created organisation sucessfully, you are the admin"});
        }
        else{
            const company=await this.companyRepository.getCompanyByShortComapyId(companyId);
            if(!company){throw new customError(400,"comapny has not found")}
            if(await this.rolesRepository.findEmployeeUsingUserIdInCompany(userId,company._id)){
                throw new customError(400,"your are aldready in the organisation");
            }
            if(await this.requestRepository.findRequestUsingUserIdInCompany(userId,company._id)){
                throw new customError(400,"your request is aldready recived to that organisation, please wait admin to accept for that organisation");
            }
            //create the request in this process
            await this.requestRepository.addRequest(userId,company._id,company.companyName);
            res.status(201).send({status:true,msg:"request to be in the organisation is sucessfully made"});
        }
        }catch(err){
            next(err);
            console.log(err);
        }
    }
    login=async (req,res,next)=>{
        try{
        let {email,password}=req.body;
        email=email.trim();
        password=password.trim();
        const user=await this.userRepository.findUserByEmail(email);
        if(!user){
            throw new customError(400,"user doesnot exist");
        }
        if(!await bycrpt.compare(password,user.password)){
            throw new customError(400,"password was wrong");
        }
        //what ever you do login sucessfull;
        res.status(200).send({status:true,msg:"login sucessfull"});
        }
        catch(err){
            next(err);
            console.log(err);
        }
    }
}