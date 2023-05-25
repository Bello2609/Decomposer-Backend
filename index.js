const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const passport = require("passport");
require("./passport");

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
