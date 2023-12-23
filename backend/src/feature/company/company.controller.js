import { customError } from "../../middlewares/error.middleware.js";
import { companyRepository } from "./company.repository.js";
import {rolesRepository} from "../rolesAndRequest/roles.repository.js"

const isValidObjectId = (id) => {
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;  
    return objectIdPattern.test(id);
};


export class companyController{
    constructor(){
        this.companyRepository=new companyRepository();
        this.rolesRepository=new rolesRepository();
    }
    getCompanyDetails=async (req,res,next)=>{
        try{
            const companyId=req.body["companyId"];
            if(!companyId){throw new customError(400,"Must provide the companyId");}
            //check whether the userid macthes with the cpompany id
            const company=await this.companyRepository.getTheDataUsingCompanyId(companyId);
            res.json(company);
        }
        catch(err){
            next(err);
        }
    }
    UpdateCompanyDetails=async (req,res,next)=>{
        try{
            //triming for the all elements for the req.body
            for(const key in req.body){
                if (typeof req.body[key] === 'string') {req.body[key]=req.body[key].trim();}
            }
            let {companyName,about}=req.body;
            let {userId,companyId,role,roleId}=req.userData;

            if(!isValidObjectId(roleId)){
                throw new customError(400,"give the correct roleid");
            }
            if(!companyName&&!about&&companyName==''&&about==''){
                throw new customError(400,"give some proper details company name or about");
            }
            //check the userId macthes with rolesId
            if(!(companyId&&role&&(role=="admin"||role=="both"))){
                const roleG=await this.rolesRepository.checkUserIdToAdminId(userId,roleId);
                if(!roleG){
                    throw new customError(400,"check the roleid or you are not the admin");
                }
                companyId=roleG.companyId;
                role=roleG.role;
            }

            //check the name exists are not
            
            let nameChange=await this.companyRepository.updateTheDetailsOfTheCompany(companyId,roleId,companyName,about);
            
            res.json({status:true,msg:"successfully changed the details"});

            if(nameChange){
                //change the company name in roles also
                await this.rolesRepository.changeCompanyNameToCompanyId(companyName,companyId);
            }
        }
        catch(err){
            next(err);
        }
    }
    updateThePhotoOfCompany=async (req,res,next)=>{
        try{
            let photo=req.file;
            let {companyId,role,roleId}=req.userData;
            if(!photo){
                throw new customError(400,"please upload the image");
            }
            if(!(companyId&&roleId&&role&&(role=="admin"||role=="both"))){
                throw new customError(400,"check the roleid or you are not the admin");                
            }
            let photoPath="\\"+photo.path.replace(/^public\\/, '');
            let photoName=photo.originalname;
            await this.companyRepository.updateTheCompanyPhoto(companyId,roleId,photoPath,photoName);
            res.json({status:true,msg:"successfully changed the photo"});
        }catch(err){
            next(err);
        }
    }
    resetTheShortCompanyId=async(req,res,next)=>{
        try{
            let {companyId,roleId}=req.userData;
            const shortCompanyId= await this.companyRepository.resetTheShortCompanyId(companyId,roleId);
            res.json({status:true,msg:"successfully reset the company id",companyId:shortCompanyId});
        }catch(err){
            next(err);
        }
    }
}