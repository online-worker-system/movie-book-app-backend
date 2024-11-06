const User=require("../models/User");
const Cinema=require("../models/Cinema");
const Screen=require("../models/Screen");
const City=require("../models/City");



exports.addCinema = async(req,res) =>{
    try{

        //fetch All Data

        const {cinemaName,pincode,cityId}=req.body;

        if(!cinemaName || !pincode || !cityId)
        {
            return res.status(402).json({
                success:false,
                message:"Please enter all the fields"
            })
        }

        const findCity=await City.findById(cityId);

        if(!findCity)
        {
            return res.status(404).json({
                success:false,
                message:"City ID is not valid"
            })
        }

        const adminDetailes=req.user.id;

        console.log("admindetailes:",adminDetailes)
        //token mai se userid ko admin deftailes mai dalna hai

        const newCinema= await Cinema.create({
            cinemaName,
            pincode,
            cityId:findCity._id,
            adminDetailes
        })


        return res.status(200).json({
            success:true,
            message:"Cinema Added successfully",
            cinema:newCinema
        })
        
    }catch(error)
    {
        console.log("Cinema Add nhi kar pa rha hu ",error);
        return res.status(500).json({
            success:false,
            message:"while adding cinema some issue",
            error:error
        })
    }
};