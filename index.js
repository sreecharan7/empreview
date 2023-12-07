import express from "express"
import {connect} from "./src/database/config.js"
import user from "./src/feature/users/user.router.js";
import bodyParser from "body-parser";
import { errorHandler } from "./src/middlewares/error.middleware.js";
import ejsLayout from "express-ejs-layouts";
import path from "path";

const app=express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// app.use(ejsLayout);
// app.use("view engine","ejs");
// app.use("views",path.resolve("views","ejs"));



app.use("/api/uesr",user);


app.use(errorHandler);

app.listen(3000,()=>{
    console.log("server is started at the 3000");
    connect();
})