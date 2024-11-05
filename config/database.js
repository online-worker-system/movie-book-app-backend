const mongoose=require('mongoose');

require("dotenv").config();

exports.dbconnect= ()=>{
    mongoose.connect(process.env.DATABASE_URL)
    .then(()=>{console.log("DB Connected Successfully")})
    .catch((error)=>{
        console.log("DB Connection Failed");
        console.log(error);
        process.exit(1);
    })
};