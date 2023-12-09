export class customError extends Error{
    constructor(statuscode,message,key="msg"){
        super(key);
        this.statuscode=statuscode;
        this.message2=message;
    }
}

export function errorHandler(err,req,res,next){
    if(err instanceof customError){
        let send={status:false}
        send[err.message]=err.message2;
        res.status(err.statuscode).send(send);
    }
    else{
        res.status(500).send({status:false,msg:"something wrong with the server"});
    }
    console.log(err);

}