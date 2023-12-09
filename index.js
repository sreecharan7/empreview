import express from "express"
import {connect} from "./backend/src/database/config.js"
import bodyParser from "body-parser";
import { errorHandler } from "./backend/src/middlewares/error.middleware.js";
import ejsLayout from "express-ejs-layouts";
import path from "path";
import view from "./frontend/src/view.router.js"
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import backend from "./backend/backendRouter.js";

const app=express();
dotenv.config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());

app.use(ejsLayout);
app.set('view engine','ejs');
app.set('views',path.resolve("frontend","views"));

app.use(express.static("public"));

app.use("/api",backend);
app.use("/",view);

app.use(errorHandler);

app.listen(process.env.port,()=>{
    console.log("server is started at the",process.env.port);
    connect();
})