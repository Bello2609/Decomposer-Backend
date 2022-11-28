const express = require("express");
const app = express();
const morgan = require("morgan");

//routes
const authRouter = require("./routes/auth");

app.use(morgan("logger"));
//routes
app.use("api/v1", authRouter);

app.listen(9000, ()=>{
    console.log("the server is running at port 9000");
})