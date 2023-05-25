const nodemailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");
const config = require("../config");
const ejs = require("ejs");
const path = require("path");


const forgetEmail = (name, emailTo, token)=>{
    const transporter = nodemailer.createTransport(sendGridTransport({
        auth: {
            api_key: config.TWILLOP_EMAIL_API
        }
    }));
    ejs.renderFile(path.join(__dirname, "/views/emialTemplate/forgetPassword.ejs"), { name, emailTo, token }, (err, data)=>{
        if(err){
            return res.status(400).json({
                data: {
                    message: err
                }
            })
        }else{
            const options = {
                from: config.FROM,
                to: emailTo,
                subject: "Your password reset link",
                html: data
            }
            transporter.sendMail(options, (err, info)=>{
                if(err){
                    return res.status(500).json({
                        data: {
                          message: err
                        }
                      })
                }else{
                    return res.status(200).json({
                        data: {
                          message: info.response
                        }
                      })
                }
            })
        }
    })
}
// this will send a verification link to the user email
const sendVerify = (name, emailTo, token)=>{
    const transporter = nodemailer.createTransport(sendGridTransport({
        host: 'smtp.sendgrid.net',
        port: 587,
        auth: {
            api_key: config.TWILLO_EMAIL_API
        }
    }));
    ejs.renderFile(path.join(__dirname, "views/emailTemplate/verifyUser.ejs"), {name, emailTo, token}, async(err, data)=>{
        if(err){
            return  err.message
        }else{
            const option = {
                from: config.FROM,
                to: emailTo,
                subject: "Account Verification",
                html: data
            }
            transporter.sendMail(option, (err, info)=>{
                if(err){
                    // return err.message
                    console.log(err.message)
                }
                // return info.response
                console.log(info.response)
            })
        }
    });
}

module.exports = {
    forgetEmail,
    sendVerify
};