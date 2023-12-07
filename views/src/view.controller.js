import {customError} from "../../src/middlewares/error.middleware.js"

export class viewController{
    home=async (req,res,next)=>{
        try{
            
        }
        catch(err){
            throw new customError(400,"something went wromng whille loading the home page");
        }
    }
}