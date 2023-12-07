import express from "express"
import {connect} from "./backend/src/database/config.js"
import user from "./backend/src/feature/users/user.router.js";
import bodyParser from "body-parser";
import { errorHandler } from "./backend/src/middlewares/error.middleware.js";
import ejsLayout from "express-ejs-layouts";
import path from "path";
import view from "./frontend/src/view.router.js"

const app=express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(ejsLayout);
app.set('view engine','ejs');
app.set('views',path.resolve("frontend","views"));



app.use("/api/user",user);
app.use("/",view);

app.use(errorHandler);

app.listen(3000,()=>{
    console.log("server is started at the 3000");
    connect();
})