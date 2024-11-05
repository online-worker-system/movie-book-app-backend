const jwt= require("jsonwebtoken");
require("dotenv").config();
const user=require("../models/User");


//auth

exports.auth = async(req,res,next) => {
    try{
        //extract token
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer","");

        if(!token)
        {
            return res.satus(401).json({
                success:false,
                message:"Token is missing"
            })
        }

        try{
            const decode=  jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        }
        catch(error)
        {
            return res.satus(401).json({
                success:false,
                message:'token is invalid'
            })
        }
        next();

    }catch(error)
    {
        return res.satus(500).json({
            success:false,
            message:"somthing went wrong while validating token"
        })

    }
};

//isViewer

exports.isViewer =  async(req,res,next) => {
    try{
        
        if(req.user.accountType !== "Viewer")
        {
            return res.satus(401).json({
                success:false,
                message:"This is a protected route for Viewer"
            })
        }
        next();

    }catch(error)
    {
        return res.satus().json({
            success:false,
            message:"User Role cannot be verified, please try later"
        })
    }
};

//isAdmin

exports.isAdmin =  async(req,res,next) => {
    try{
        
        if(req.user.accountType !== "Admin")
        {
            return res.satus(401).json({
                success:false,
                message:"This is a protected route for Viewer"
            })
        }
        next();

    }catch(error)
    {
        return res.satus().json({
            success:false,
            message:"User Role cannot be verified, please try later"
        })
    }
};