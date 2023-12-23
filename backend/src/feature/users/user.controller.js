import { customError } from "../../middlewares/error.middleware.js";
import { userRepository } from "./user.repository.js";
import bycrpt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv";

dotenv.config();

export class userController {
    constructor(){
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
            if(photo){photoPath="\\"+photo[0].path.replace(/^public\\/, '');;photoOriginalName=photo[0].originalname;}
            if(banner){bannerpath="\\"+banner[0].path.replace(/^public\\/, '');;bannerOriginalName=banner[0].originalname;}
            await this.userRepository.addUser(email,password,name,about,photoPath,bannerpath,photoOriginalName,bannerOriginalName);
            res.status(201).send({status:true,msg:"user created sucessfully"});
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
        var token=jwt.sign({user:user._id,connectionId:user.connectionId}, process.env.jwt);
        res.cookie(process.env.cookieNameUserCredientails,token,{maxAge: parseInt(process.env.expoireOfCookieUserCredientails)});
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
    logout=async (req,res,next)=>{
        try{
            res.cookie(process.env.cookieNameUserCredientails,'',{expires:new Date(0)});
            res.json({status:true,msg:"logout from this device sucessfull"});
        }catch(err){
            next(err);
        }
    }
}