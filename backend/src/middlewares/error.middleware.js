export class customError extends Error{
    constructor(statuscode,message,key="msg"){
        super(message);
        this.statuscode=statuscode;
        this.key=key;
    }
}

export function errorHandler(err,req,res,next){
    if(err instanceof customError){
        let send={status:false}
        send[err.key]=err.message;
        res.status(err.statuscode).send(send);
    }
    else{
        res.status(500).send({status:false,msg:"something wrong with the server"});
    }
    console.log(err);

}