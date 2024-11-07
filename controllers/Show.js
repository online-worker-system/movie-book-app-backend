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



exports.doLiveShow = async (req, res) => {
  try {
    const { showId } = req.body;

    const findShow = await MovieShow.findById(showId);

    if (!findShow || findShow.isLive) {
      return res.status(404).json({
        success: false,
        message: "Show not found or already live. Please enter a correct ID.",
      });
    }

    await MovieShow.findByIdAndUpdate(findShow._id, { isLive: true }, { new: true });

    const findScreen = await Screen.findById(findShow.screenId);

    if (!findScreen) {
      return res.status(404).json({
        success: false,
        message: "Screen not found for the specified show.",
      });
    }

    const newSeatArray = [];
    for (const value of findScreen.seats) {
      const newSeat = await showSeatSchema.create({
        seatId: value,
        showId: showId,
        price: 200,
        status: "FREE",
      });
      console.log(newSeat);
      newSeatArray.push(newSeat._id);
    }

    console.log(newSeatArray);
   
    await MovieShow.findByIdAndUpdate(findShow._id, { showSeats: newSeatArray }, { new: true });

    console.log(findShow);

    return res.status(200).json({
      success: true,
      message: "Your show is live now.",
    });

  } catch (error) {
    console.log("Something went wrong while making the show live:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while making the show live.",
      error: error.message,
    });
  }
};
