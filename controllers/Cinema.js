const User=require("../models/User");
const Cinema=require("../models/Cinema");
const Screen=require("../models/Screen");
const City=require("../models/City");
const Seat=require("../models/Seat");

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
        if (newCinema) {
            const newScreen = await Screen.create({
              cinemaId: newCinema._id,
            });
          
            // Update cinema's screens array with new screen ID
            await Cinema.findByIdAndUpdate(
              newCinema._id,
              { $push: { screens: newScreen._id } },
              { new: true }
            );
        }

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




exports.findCinemaDetailes = async (req,res) => {
  try{
     
    const adminId=req.user.id;
   
    console.log(adminId)
    const findCinema=await Cinema.find({
      adminDetailes:adminId
    });
    
    if(findCinema)
    {
      return res.status(200).json({
        success:true,
        message:"Cinema deatiles feched",
        cinema:findCinema
      })
    }
  }catch(error)
  {
    console.log("Error while finding Cinema :",error);
    return res.status(500).json({
      success:false,
      message:"Error while finding Cinema",
      error:error
    })
  }
}



exports.updateScreen = async (req, res) => {
    try {
      const { regular, vip, bolcony, screenId } = req.body;
      const seatIds = [];
  
      // Create seats for 'regular' category and add their IDs to seatIds
      for (let i = 0; i < regular.seat; i++) {
        const newSeat = await Seat.create({
          seatType: regular.name,
          seatNumber: i + 1,
        });
        seatIds.push(newSeat._id);
      }
  
      // Create seats for 'vip' category and add their IDs to seatIds
      for (let i = 0; i < vip.seat; i++) {
        const newSeat = await Seat.create({
          seatType: vip.name,
          seatNumber: i + 1,
        });
        seatIds.push(newSeat._id);
      }
  
      // Create seats for 'bolcony' category and add their IDs to seatIds
      for (let i = 0; i < bolcony.seat; i++) {
        const newSeat = await Seat.create({
          seatType: bolcony.name,
          seatNumber: i + 1,
        });
        seatIds.push(newSeat._id);
      }
  
      // Update the screen with all the seat IDs in one database call
      await Screen.findByIdAndUpdate(
        screenId,
        { $push: { seats: { $each: seatIds } } },
        { new: true }
      );
  
      res.status(200).json({
        success: true,
        message: "Screen updated successfully",
      });
    } catch (error) {
      console.log("Error while updating screen", error);
      return res.status(500).json({
        success: false,
        message: "Error while updating screen",
        error: error,
      });
    }
  };
  