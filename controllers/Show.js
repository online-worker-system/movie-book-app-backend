const { assign } = require("nodemailer/lib/shared");
const MovieShow = require("../models/MovieShow");
const Screen = require("../models/Screen");
const Seat = require("../models/Seat");
const showSeatSchema=require("../models/ShowSeat");
exports.addShow = async (req, res) => {
  try {
    const { showStart, showEnd, movieId, screenId } = req.body;

    const findScreen = await MovieShow.find({ screenId: screenId });

    console.log(findScreen);

    if (findScreen.length === 0) {
      const newShow = await MovieShow.create({
        showStart,
        showEnd,
        movieId,
        isLive:false,
        screenId,
      });

      return res.status(200).json({
        success: true,
        message: "New Show added successfully",
        show: newShow,
      });
    } 



       let isExist=false;
      findScreen.forEach((value) => {
        const valueShowStart = new Date(value.showStart);
        const inputShowStart = new Date(showStart);
        if (valueShowStart.getTime() === inputShowStart.getTime()) {
          isExist=true;
        }
      });

      if(isExist)
      {
        return res.status(402).json({
            success: false,
            message: "Already one show at the same time",
          });
      }
    

    const newShow = await MovieShow.create({
        showStart,
        showEnd,
        movieId,
        isLive:false,
        screenId,
      });



      return res.status(200).json({
        success: true,
        message: "New Show added successfully",
        show: newShow,
      });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
        success:false,
        message:"Somthing went wrong while adding show",
        error:error
    })
  }
};



exports.doLiveShow = async (req,res) => {
    try{

        const {showId} = req.body;

        const findShow = await MovieShow.findById(showId);

        if(!findShow || findShow.isLive)
        {
            return res.status(404).json({
                success:false,
                message:"Show not found please enter correct id"
            })
        }

        await MovieShow.findByIdAndUpdate(
            findShow._id,
            { isLive:true} ,
            { new: true }
          );


          const findScreen= await Screen.findById(findShow.screenId);

          if(!findScreen)
          {
            return res.status(404).json({
                success:false,
                message:"Screen is not found regarding to show"
            })
          }

          const newSeatArray=[];
          findScreen.seats.forEach(async (value)=>{
               const newSeat= await showSeatSchema.create({
                seatId:value,
                showId:showId,
                price:200,
                status:"FREE"
               })

               newSeatArray.push(newSeat._id);

          })

          await MovieShow.findByIdAndUpdate(
            findShow._id,
            { showSeats:newSeatArray} ,
            { new: true }
          );


          return res.status(200).json({
            success:true,
            message:"Your show is live now"
          })

    }catch(error)
    {
        console.log("somthing went wrong while live show: ",error);
        return res.status(500).json({
            success:false,
            message:"Somthing went wrong while live show",
            error:error
        })
    }
}