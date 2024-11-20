const MovieShow = require("../models/MovieShow");
const Screen = require("../models/Screen");
const Movie = require("../models/Movie");
const Cinema = require("../models/Cinema");
const ShowSeatSchema = require("../models/ShowSeat");

exports.addShow = async (req, res) => {
  try {
    const { movieId, cinemaId, showStart, showEnd, timing, screenId } =
      req.body;

    const movie = await Movie.findById(movieId);
    const cinema = await Cinema.findById(cinemaId);
    const screen = await Screen.findById(screenId);

    const adminId=req.user.id;
    console.log(adminId)
    if (!movie || !cinema || !screen) {
      return res.status(404).json({
        success: false,
        message: "Please enter valid movieId or cinemaId or screenId",
      });
    }

    const findScreen = await MovieShow.find({ screenId: screenId });

    if (findScreen.length === 0) {
      const newShow = await MovieShow.create({
        movieId,
        cinemaId,
        showStart,
        showEnd,
        adminId,
        isLive: false,
        timing,
        screenId,
      });

      return res.status(200).json({
        success: true,
        data: newShow,
        message: "New Show added successfully",
      });
    }

    let isExist = false;
    for (const value of findScreen) {
      const valueShowStart = new Date(value.showStart);
      const inputShowStart = new Date(showStart);
      const valueShowEnd = new Date(value.showEnd);
      const inputShowEnd = new Date(showEnd);
      const valueShowTiming = value.timing;

      if (
        valueShowTiming === timing &&
        (valueShowStart.getTime() === inputShowStart.getTime() ||
          valueShowEnd.getTime() === inputShowEnd.getTime())
      ) {
        isExist = true;
      }

      if (isExist) {
        return res.status(400).json({
          success: false,
          message: "Already one show at the same time",
        });
      }
    }

    const newShow = await MovieShow.create({
      movieId,
      cinemaId,
      showStart,
      showEnd,
      isLive: false,
      timing,
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
        message:
          "Show not found please enter correct id or show is already live.",
      });
    }

    await MovieShow.findByIdAndUpdate(
      findShow._id,
      { isLive: true },
      { new: true }
    );

    const findScreen = await Screen.findById(findShow.screenId);

    console.log("findScreen:",findScreen)
    if (!findScreen) {
      return res.status(404).json({
        success: false,
        message: "Screen is not found regarding to show",
      });
    }

    let newSeatArray = [];
    for (const value of findScreen.seats) {
      const newSeat = await ShowSeatSchema.create({
        seatId: value,
        showId: showId,
        status: "Available",
      });
      newSeatArray.push(newSeat._id);
    }

    const updatedshow = await MovieShow.findByIdAndUpdate(
      findShow._id,
      { showSeats: newSeatArray },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Your show is live now",
      newSeatArray
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Somthing went wrong while live show",
    });
  }
};

exports.getUnliveShows = async (req, res) => {
  try {
    const adminId = req.user.id;

    console.log("HIii",adminId)
    const findShows = await MovieShow.find({
      adminId: adminId,
      isLive: false,
    });

    console.log(findShows)

    if (!findShows || findShows.isLive) {
      return res.status(404).json({
        success: false,
        message: "Shows not found or shows are already live.",
      });
    }

    return res.status(200).json({
      success: true,
      data: findShows,
      message: "Shows fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Somthing went wrong while getting unlive shows",
    });
  }
};
