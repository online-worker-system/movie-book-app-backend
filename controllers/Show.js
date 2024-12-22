const MovieShow = require("../models/MovieShow");
const Screen = require("../models/Screen");
const Movie = require("../models/Movie");
const Cinema = require("../models/Cinema");
const ShowSeat = require("../models/ShowSeat");

exports.addShow = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { movieId, cinemaId, showStart, showEnd, timing, screenId } =
      req.body;

    const movie = await Movie.findById(movieId);
    const cinema = await Cinema.findById(cinemaId);
    const screen = await Screen.findById(screenId);

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
        (
          (inputShowStart >= valueShowStart && inputShowStart <= valueShowEnd) || // Input start is within an existing show's range
          (inputShowEnd >= valueShowStart && inputShowEnd <= valueShowEnd) ||    // Input end is within an existing show's range
          (inputShowStart <= valueShowStart && inputShowEnd >= valueShowEnd)    // Input range completely overlaps an existing show
        )
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
      adminId,
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

    if (!findScreen) {
      return res.status(404).json({
        success: false,
        message: "Screen is not found regarding to show",
      });
    }

    let newSeatArray = [];
    for (const value of findScreen.seats) {
      const newSeat = await ShowSeat.create({
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
      newSeatArray,
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

exports.getUnliveShows = async (req, res) => {
  try {
    const adminId = req.user.id;

    const findShows = await MovieShow.find({
      adminId: adminId,
      isLive: false,
    }).populate("cinemaId").populate("movieId");

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

exports.reserveSeats = async (req, res, io) => {
  try {
    const { seatIds } = req.body;

    // Check if all seats are available
    const availableSeats = await ShowSeat.find({
      _id: { $in: seatIds },
      status: "Available",
    });

    if (availableSeats.length !== seatIds.length) {
      return res.status(400).json({
        success: false,
        message: "Some seats are already reserved or unavailable.",
      });
    }

    // Reserve the seats
    const result = await ShowSeat.updateMany(
      { _id: { $in: seatIds }, status: "Available" },
      { $set: { status: "Reserved", reservedAt: new Date() } }
    );
    // console.log("reserved res: ", result);

    if (result.modifiedCount === 0) {
      return res.status(400).json({
        success: false,
        message: "Seats could not be reserved.",
      });
    }

    // Schedule to revert the reserved status after 5 minutes
    setTimeout(async () => {
      try {
        // Find the reserved seats that haven't been booked yet (within the last 5 minutes)
        const expiryTime = new Date(Date.now() - 1 * 60 * 1000);

        // Check if any of the reserved seats are still reserved after 5 minutes
        const seatsToRevert = await ShowSeat.find({
          _id: { $in: seatIds },
          status: "Reserved",
          reservedAt: { $lte: expiryTime },
        });
        console.log("seatsToRevert: ", seatsToRevert);

        // If there are seats to revert, change their status to Available
        if (seatsToRevert.length > 0) {
          const revertIds = seatsToRevert.map((seat) => seat._id);
          // Update only those seats that are still reserved
          await ShowSeat.updateMany(
            {
              _id: { $in: revertIds },
              status: "Reserved",
            },
            { $set: { status: "Available", reservedAt: null } }
          );
          console.log(`Reverted seats ${seatIds} to Available`);
          io.emit("seatsToRevert", revertIds);
        }
      } catch (error) {
        console.error("Error reverting reserved seats:", error.message);
      }
    }, 1 * 60 * 1000); // 5 minutes in milliseconds

    // Emit event to notify clients about the updated seats
    io.emit("reservedSeats", seatIds);

    res.status(200).json({
      success: true,
      message:
        "Seats reserved successfully. They will be reverted if not booked within 5 minutes.",
    });
  } catch (error) {
    console.error("Error reserving seats:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while reserving seats.",
    });
  }
};

exports.bookSeats = async (req, res, io) => {
  try {
    // fetching seat ids
    const { seatIds } = req.body;

    // Mark the seats as Booked
    const result = await ShowSeat.updateMany(
      { _id: { $in: seatIds }, status: "Reserved" },
      { $set: { status: "Booked", reservedAt: null } }
    );
    console.log("book res: ", result);

    if (result.modifiedCount === 0) {
      return res.status(400).json({
        success: false,
        message: "Seats are not reserved or already booked.",
      });
    }

    // Emit event to notify clients about the updated seats
    io.emit("seatsUpdated", seatIds);

    res.status(200).json({
      success: true,
      message: "Seats booked successfully.",
    });
  } catch (error) {
    console.error("Error booking seats:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while booking seats.",
    });
  }
};
