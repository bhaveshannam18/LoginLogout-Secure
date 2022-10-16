const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes/user-routes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors({credentials:true,origin:"http://localhost:3000"}));
app.use(express.json());
app.use(cookieParser());

app.use("/api",router);


mongoose.connect(`mongodb+srv://bhaveshannam:${process.env.MONGO_PASSWORD}@cluster0.qsymhgo.mongodb.net/LoginLogoutDB?retryWrites=true&w=majority`)
.then(()=>{
    app.listen(8000,(req,res,next)=>{
        console.log("DB Connected Server listening on port 8000");
    });    
})
.catch((err)=>console.log(err));
