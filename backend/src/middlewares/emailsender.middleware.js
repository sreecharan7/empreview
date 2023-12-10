import nodemailer from 'nodemailer';
import dotenv from "dotenv";

dotenv.config();

export const mailer=async (req,res,next)=>{
    try {
        const {email}=req.body;
        const senderEmailer=process.env.email;
        const senderPass=process.env.emailPass;
        const otp=Math.floor(100000 + Math.random() * 900000);
        req.body.otp=otp;
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: senderEmailer,
                pass: senderPass
            }
        });
        const mailOptions = {
            from: senderEmailer,
            to: email,
            subject: 'OTP for login',
            text: `your otp is ${otp}`
        };
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
                throw error;
            } else {
                console.log('Email sent: ' + info.response);
                res.status(200).json({message:"otp sent successfully, it will expire by 5 mintues"});
            }
        });
        next();
    } catch (error) {
        next(error);
    }

}