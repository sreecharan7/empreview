import {customError} from "../../backend/src/middlewares/error.middleware.js"

export class viewController{
    home=async (req,res,next)=>{
        try{
            res.render("home");
        }
        catch(err){
            throw new customError(400,"something went wromng whille loading the home page");
        }
    }
}