const Cinema = require("../models/Cinema");
const Movie = require("../models/Movie");
const Screen = require("../models/Screen");
const City = require("../models/City");
const Seat = require("../models/Seat");
const MovieShow = require("../models/MovieShow");

exports.addCinema = async (req, res) => {
  try {
    // fetch All Data
    const { cinemaName, pincode, cityId } = req.body;

    if (!cinemaName || !pincode || !cityId) {
      return res.status(400).json({
        success: false,
        message: "Please enter all the fields",
      });
    }

    const findCity = await City.findById(cityId);
    if (!findCity) {
      return res.status(404).json({
        success: false,
        message: "City ID is not valid",
      });
    }

    const adminDetailes = req.user.id;
    const newCinema = await Cinema.create({
      cinemaName,
      pincode,
      cityId,
      adminDetailes,
    });

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
      success: true,
      data: newCinema,
      message: "Cinema Added successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "while adding cinema some issue",
    });
  }
};

exports.findCinemaDetailes = async (req, res) => {
  try {
    const adminId = req.user.id;

    const findCinema = await Cinema.find({
      adminDetailes: adminId,
    }).populate("cityId");

    if (!findCinema) {
      return res.status(404).json({
        success: false,
        message: "Cinema not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: findCinema,
      message: "Cinema details fetched",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Error while finding Cinema",
    });
  }
};

exports.updateScreen = async (req, res) => {
  try {
    const { regular, vip, bolcony, screenId } = req.body;

    const screen = await Screen.findById(screenId);
    if (!screen) {
      return res.status(404).json({
        success: false,
        message: "Screen not found",
      });
    }

    const seatIds = [];

    // Create seats for 'regular' category and add their IDs to seatIds
    for (let i = 0; i < regular.seat; i++) {
      const newSeat = await Seat.create({
        seatType: regular.name,
        seatNumber: i + 1,
        seatPrice: regular.price,
      });
      seatIds.push(newSeat._id);
    }

    // Create seats for 'bolcony' category and add their IDs to seatIds
    for (let i = 0; i < bolcony.seat; i++) {
      const newSeat = await Seat.create({
        seatType: bolcony.name,
        seatNumber: i + 1,
        seatPrice: bolcony.price,
      });
      seatIds.push(newSeat._id);
    }

    // Create seats for 'vip' category and add their IDs to seatIds
    for (let i = 0; i < vip.seat; i++) {
      const newSeat = await Seat.create({
        seatType: vip.name,
        seatNumber: i + 1,
        seatPrice: vip.price,
      });
      seatIds.push(newSeat._id);
    }

    // Update the screen with all the seat IDs in one database call
    await Screen.findByIdAndUpdate(
      screenId,
      { $push: { seats: { $each: seatIds } } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Screen updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Error while updating screen",
    });
  }
};

exports.getShowCinema = async (req, res) => {
  try {
    // fetch course details
    const { movieId, cinemaId } = req.body;

    const movie = await Movie.findById(movieId);
    const cinema = await Cinema.findById(cinemaId);

    if (!movie || !cinema) {
      return res.status(404).json({
        success: false,
        message: "MovieId or CinemaId not found!",
      });
    }

    // Find the MovieShow document that matches the movieId and isLive is true
    const uniqueCinemas = await MovieShow.find({
      movieId: movieId,
      cinemaId: cinemaId,
      isLive: true,
    })
      .populate({
        path: "cinemaId",
        model: "Cinema",
        populate: {
          path: "cityId",
          model: "City",
        },
      })
      .populate({
        path: "showSeats",
        model: "ShowSeat",
        select: "seatId price status",
        populate: {
          path: "seatId",
          model: "Seat",
        },
      });

    if (!uniqueCinemas || uniqueCinemas.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No live movie show found for this movie.",
      });
    }

    // return response
    return res.status(200).json({
      success: true,
      data: uniqueCinemas,
      message: "Show Cinema details fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Unable to fetch Show Cinema, please try again",
    });
  }
};
