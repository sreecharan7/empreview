import express from "express"
import { viewController } from "./view.controller.js";

const app=express.Router();

const  viewC=new viewController();

app.get("/",(req,res,next)=>{viewC.home(req,res,next)});

export default app;