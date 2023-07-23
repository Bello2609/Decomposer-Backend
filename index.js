const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require('express-session');
require("./passport");
require("dotenv").config();

//routes
const routes = require("./src/api/routes");
const app = express();
app.use(cors());
app.set("view engine", "ejs");
app.use(morgan(":method :url :status :user-agent - :response-time ms"));
app.use(bodyParser.json());
app.use(passport.initialize());
//jwt middleware
// app.use((req, res, next)=>{
//   let token = req.headers.authorization;
//   token = token.split(" ")[1];
//   if(token){
//     jwt.verify(token, config.SECRET_JWT, (err, decoded)=>{
//       req.user_id = decoded._id;
//     })
//   }
// })
//routes
app.use("/api/v1", routes);
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
  }));
  //successRedirect: `https://decomposer.vercel.app/user-profile`
app.get("/google",passport.authenticate("google",{scope: ["profile","email"]}));
app.get('/google/callback',
  passport.authenticate('google', { successRedirect: `http://localhost:3000/user-profile`, failureRedirect:'http://localhost:3000/login'})
)
// Base route
app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    route: "Base Route",
    timestamp: Date.now(),
  });
});
// Undefined route
app.use("*", (req, res) => {
  return res.status(404).json({
    success: false,
    message: "Undefined Route",
  });
});
module.exports = app;
