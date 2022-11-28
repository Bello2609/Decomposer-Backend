const express = require("express");


const app = express();

app.listen(9000, ()=>{
    console.log("the server is running at port 9000");
})