export class customError extends Error{
    constructor(statuscode,message,key="msg"){
        super(key);
        this.statuscode=statuscode;
        this.message2=message;
    }
}