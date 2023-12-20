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
            let {companyName,about,roleId}=req.body;
            let {userId,companyId,role}=req.userData;

            if(!isValidObjectId(roleId)){
                throw new customError(400,"give the correct roleid");
            }
            if(!companyName&&!about){
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
}