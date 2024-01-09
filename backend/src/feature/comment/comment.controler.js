import { commentRepository } from "./comment.repository";
import { comment } from "./comment.schema";
import {companyRepository} from "../company/company.repository.js";

const isValidObjectId = (id) => {
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;  
    return objectIdPattern.test(id);
};

export class commentController{
    constructor(){
        this.commentRepository =new commentRepository();
        this.companyRepository=new companyRepository();
    }
    addComment=async (req,res,next)=>{
        try{
            const {comment,rating,toWhomId}=req.body;
            const {userId,companyId,rolesId}=req.userData;
            if(!comment||!rating||!toWhomId||!isValidObjectId(toWhomId)){
                throw new customError(400,"give the proper details");
            }
            

        }
        catch(err){
            next(err);
        }
    }

}