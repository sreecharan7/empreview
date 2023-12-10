import { requestRepository } from "../rolesAndRequest/request.repository.js";
import { companyRepository } from "../admin/comany.repository.js";
import { rolesRepository } from "../rolesAndRequest/roles.repository.js";
import { customError } from "../../middlewares/error.middleware.js";
import { userRepository } from "./user.repository.js";
import bycrpt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv";

dotenv.config();

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
                if (typeof req.body[key] === 'string') {req.body[key]=req.body[key].trim();}
            }
            const {email,password,name,about}=req.body;
            let {photo,banner}=req.files;
            let photoPath,bannerpath,photoOriginalName,bannerOriginalName;
            if(photo){photoPath=photo[0].path.replace(/^public\\/, '');;photoOriginalName=photo[0].originalname;}
            if(banner){bannerpath=banner[0].path.replace(/^public\\/, '');;bannerOriginalName=banner[0].originalname;}
            await this.userRepository.addUser(email,password,name,about,photoPath,bannerpath,photoOriginalName,bannerOriginalName);
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
            if (typeof req.body[key] === 'string') {req.body[key]=req.body[key].trim();}
        }
        const {companyName,role, companyId}=req.body;
        const {userId}=req.body;
        if(role==="admin"){
            let company=await this.companyRepository.add(companyName,userId);
            let admin=await this.rolesRepository.addNewRole(role,userId,company._id,companyName);
            company.adminId.push(admin._id);
            company.save();
            res.status(201).send({status:true,msg:"created organisation sucessfully, you are the admin"});
        }
        else if(role==="employee"){
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
        else{
            throw new customError(400,"please check the role properly");
        }
        }catch(err){
            next(err);
            console.log(err);
        }
    }
    login=async (req,res,next)=>{
        try{
        let {email,password}=req.body;
        if(!email||!password){
            throw new customError(400,"please provide the information about email or password");
        }
        email=email.trim();
        password=String(password);
        password=password.trim();
        const user=await this.userRepository.findUserByEmail(email);
        if(!user){
            throw new customError(400,"user doesnot exist, check the email");
        }
        if(!await bycrpt.compare(password,user.password)){
            throw new customError(400,"password was wrong");
        }
        //what ever you do login sucessfull;
        var token=jwt.sign({user:user._id,connectionId:user.connectionId}, process.env.jwt, { expiresIn: 60 * 60 });
        res.cookie(process.env.cookieNameUserCredientails,token,{maxAge:1000*60*60})
        res.status(200).send({status:true,msg:"login sucessfull"});
        }
        catch(err){
            next(err);
            console.log(err);
        }
    }
    logoutFromAllDevices=async (req,res,next)=>{
        try{
            const {userId,connectionId}=req.userData;
            await this.userRepository.changeConnectionId(userId,connectionId);
            res.cookie(process.env.cookieNameUserCredientails,'',{expires:new Date(0)});
            res.json({status:true,msg:"logout from all device sucessfull"});
        }catch(err){
            next(err);
        }
    }
}