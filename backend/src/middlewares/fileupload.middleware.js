import multer from "multer";
import path from "path"
const storage=multer.diskStorage({
    destination:function (req,file,cb){
        //dynamic storage
        let ds='public'
        if(req.fileStorage){
            ds=req.fileStorage;
        }
        else if(file.fieldname==="photo"){
            ds=ds+"/images/photos"
        }
        else if(file.fieldname=="banner"){
            ds=ds+"/images/banners"
        }
        else{
            ds=ds+"/others"
        }
        cb(null,ds);
    },
    filename:function(req,file,cb){
        cb(null,file.fieldname+"-"+Date.now()+"-"+path.extname(file.originalname));
    }
})

const upload=multer({storage:storage});

export default upload;