const nodemailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");
const config = require("../config");
const ejs = require("ejs");


const sendEmail = (name, emailTo, token)=>{
    const transporter = nodemailer.createTransport(sendGridTransport({
        auth: {
            api_key: config.TWILLOP_EMAIL_API
        }
    }));
    ejs.renderFile(__dirname + "../views/emialTemplate/forgetPassword.ejs", { name, emailTo, token }, (err, data)=>{
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

module.exports = {
    sendEmail
};