const MovieShow = require("../models/MovieShow");
const Screen = require("../models/Screen");
const Seat = require("../models/Seat");
const showSeatSchema = require("../models/ShowSeat");
const { assign } = require("nodemailer/lib/shared");

exports.addShow = async (req, res) => {
  try {
    const { showStart, showEnd, movieId, cinemaId, screenId } = req.body;

    const findScreen = await MovieShow.find({ screenId: screenId });
    console.log("findScreen: ", findScreen);

    if (findScreen.length === 0) {
      const newShow = await MovieShow.create({
        showStart,
        showEnd,
        movieId,
        isLive: false,
        cinemaId,
        screenId,
      });

      return res.status(200).json({
        success: true,
        data: newShow,
        message: "New Show added successfully",
      });
    }

    let isExist = false;
    findScreen.forEach((value) => {
      const valueShowStart = new Date(value.showStart);
      const inputShowStart = new Date(showStart);
      if (valueShowStart.getTime() === inputShowStart.getTime()) {
        isExist = true;
      }
    });

    if (isExist) {
      return res.status(402).json({
        success: false,
        message: "Already one show at the same time",
      });
    }

    const newShow = await MovieShow.create({
      showStart,
      showEnd,
      movieId,
      isLive: false,
      cinemaId,
      screenId,
    });

    return res.status(200).json({
      success: true,
      show: newShow,
      message: "New Show added successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Somthing went wrong while adding show",
    });
  }
};

exports.doLiveShow = async (req, res) => {
  try {
    const { showId } = req.body;

    const findShow = await MovieShow.findById(showId);

    if (!findShow || findShow.isLive) {
      return res.status(404).json({
        success: false,
        message: "Show not found please enter correct id",
      });
    }

    await MovieShow.findByIdAndUpdate(
      findShow._id,
      { isLive: true },
      { new: true }
    );

    const findScreen = await Screen.findById(findShow.screenId);

    if (!findScreen) {
      return res.status(404).json({
        success: false,
        message: "Screen is not found regarding to show",
      });
    }

    let newSeatArray = [];
    for (const value of findScreen.seats) {
      const newSeat = await showSeatSchema.create({
        seatId: value,
        showId: showId,
        price: 200,
        status: "FREE",
      });
      newSeatArray.push(newSeat._id);
    }
    console.log("newseat: ", newSeatArray);
    const updatedshow = await MovieShow.findByIdAndUpdate(
      findShow._id,
      { showSeats: newSeatArray },
      { new: true }
    );
    console.log("sjow: ", updatedshow);

    console.log("finshsow: ", findShow);

    return res.status(200).json({
      success: true,
      message: "Your show is live now",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Somthing went wrong while live show",
    });
  }
};
