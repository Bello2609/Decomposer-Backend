const nodemailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");
const config = require("../config");
const ejs = require("ejs");
const path = require("path");


module.exports = sendVerify;