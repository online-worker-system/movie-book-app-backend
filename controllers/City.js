const City=require("../models/City");

exports.addCity= async(req,res) => {
    try{
        const {cityName}=req.body;

        const findCity=await City.findOne({cityName});

        if(findCity)
        {
            return res.status(401).json({
                success:false,
                message:"City Already Exist"
            })
        }

        
        const changeCity=cityName.toLowerCase();
        const newCity = await City.create({
            cityName:changeCity
        });
        

        return res.status(200).json({
            success:true,
            message:"City Added Successfully"
        })

    }catch(error)
    {
        console.log("Problem while Adding City :",error);
        return res.status(500).json({
            success:false,
            message:"Error while create a City",
            error:error
        })
    }
};