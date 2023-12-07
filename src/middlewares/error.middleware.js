export class customError extends Error{
    constructor(statuscode,message){
        super(message);
        this.statuscode=statuscode;
    }
}

export function errorHandler(err,req,res,next){
    if(err instanceof customError){
        res.status(err.statuscode).send({status:false,msg:err.message});
    }
    else{
        res.status(500).send({status:false,msg:"something wrong with the server"});
        console.log(err);
    }
}