const express=require('express');
const app=express();


const mongoose=require('mongoose');

mongoose.connect('mongodb+srv://udaymalakar:uday2004@cluster0.evo6mxf.mongodb.net/BackendAdmin')
.then(()=>{
    console.log("db connected");
})
.catch((error)=>{
    console.log(error);
})
app.listen(3000,()=>{
    console.log("server is started");
})