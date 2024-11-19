const express=require("express");
const User = require("../models/User");
const Booking = require("../models/Booking");


exports.bookShow = async(req,res) =>{
    try{

        const{showId,movieId,cinemaId,screenId,seatsBook} = req.body();
        console.log(req.body);
        


    }catch(error)
    {
        console.log("Somthing went wrong while booking show");
        return res.status(500).json({
            success:false,
            message:"Somthing went wrong while book show",
            error:error
        })
    }
}