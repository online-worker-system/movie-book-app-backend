const express=require('express');
const app=express();
require("dotenv").config();



const userRoutes= require("./routes/userRoute");
const database= require("./config/database");
const cookieParser=require("cookie-parser");
const PORT=process.env.PORT || 4000;

database.dbconnect();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));




app.use("/api/v1/auth",userRoutes);

app.get("/",(req,res)=>{
    return res.status(200).json({
        success:true,
        message:"Your server is up and running"
    })
});

app.listen(PORT,()=>{
    console.log(`Server is started :${PORT}`);
})