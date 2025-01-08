const Cinema = require("../models/Cinema");
const MovieShow = require("../models/MovieShow");
const Booking = require("../models/Booking");
const City = require("../models/City");
const User = require("../models/User");

exports.getAdminRevenueDetails = async (req, res) => {
  try {
    const {
      userId,
      startDate = "2024-11-01",
      endDate = "2024-12-27",
    } = req.body;

    const adminDetails = await User.findById(userId).select(
      "-password -booking"
    );
    if (!adminDetails) {
      return res.status(404).json({
        success: false,
        message: `Could not find admin with id: ${userId}`,
      });
    }

    const cinemas = await Cinema.find({ adminDetailes: userId }).populate(
      "screens"
    );

    const revenueDetails = await Promise.all(
      cinemas.map(async (cinema) => {
        const shows = await MovieShow.find({
          cinemaId: cinema._id,
          showStart: { $gte: new Date(startDate), $lte: new Date(endDate) },
        });

        const movieRevenue = {};
        for (const show of shows) {
          const bookings = await Booking.find({
            showId: show._id,
            status: "BOOKED",
          });

          bookings.forEach((booking) => {
            if (!movieRevenue[show.movieId]) {
              movieRevenue[show.movieId] = 0;
            }
            movieRevenue[show.movieId] += booking.totalAmount;
          });
        }

        const totalRevenue = Object.values(movieRevenue).reduce(
          (acc, curr) => acc + curr,
          0
        );

        return {
          cinemaId: cinema._id,
          cinemaName: cinema.cinemaName,
          totalRevenue,
        };
      })
    );

    const finalData = {
      adminDetails,
      cinemas: revenueDetails,
    };

    return res.status(200).json({
      success: true,
      data: finalData,
      message: "Admin-Revenue-Details Fetched Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "error while fetching admin-revenue-details",
    });
  }
};

exports.getRevenueDetailsByCity = async (req, res) => {
  try {
    const { startDate = "2024-11-01", endDate = "2024-12-27" } = req.body;

    const cities = await City.find();

    const revenueDetails = await Promise.all(
      cities.map(async (city) => {
        const cinemas = await Cinema.find({ cityId: city._id }).populate(
          "screens"
        );

        const cityRevenue = await cinemas.reduce(async (accPromise, cinema) => {
          const acc = await accPromise;
          const shows = await MovieShow.find({
            cinemaId: cinema._id,
            showStart: { $gte: new Date(startDate), $lte: new Date(endDate) },
          });

          const cinemaRevenue = await shows.reduce(
            async (showAccPromise, show) => {
              const showAcc = await showAccPromise;
              const bookings = await Booking.find({
                showId: show._id,
                status: "BOOKED",
              });

              const showRevenue = bookings.reduce(
                (bookingAcc, booking) => bookingAcc + booking.totalAmount,
                0
              );

              return showAcc + showRevenue;
            },
            Promise.resolve(0)
          );

          return acc + cinemaRevenue;
        }, Promise.resolve(0));

        return {
          cityId: city._id,
          cityName: city.cityName,
          cityRevenue,
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: revenueDetails,
      message: "SuperAdmin-Revenue-Details Fetched Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Error while fetching superadmin-revenue-details",
    });
  }
};

exports.getRevenueByCityId = async (req, res) => {
  try {
    const {
      cityId,
      startDate = "2024-11-01",
      endDate = "2024-12-27",
    } = req.body;

    const cityData = await City.findById(cityId);
    if (!cityData) {
      return res.status(404).json({
        success: false,
        message: `Could not find city with id: ${cityId}`,
      });
    }

    const cinemas = await Cinema.find({ cityId }).populate("screens");

    const cinemaDetails = await Promise.all(
      cinemas.map(async (cinema) => {
        const shows = await MovieShow.find({
          cinemaId: cinema._id,
          showStart: { $gte: new Date(startDate), $lte: new Date(endDate) },
        });

        const movieRevenue = {};
        for (const show of shows) {
          const bookings = await Booking.find({
            showId: show._id,
            status: "BOOKED",
          });

          bookings.forEach((booking) => {
            if (!movieRevenue[show.movieId]) {
              movieRevenue[show.movieId] = 0;
            }
            movieRevenue[show.movieId] += booking.totalAmount;
          });
        }

        const totalRevenue = Object.values(movieRevenue).reduce(
          (acc, curr) => acc + curr,
          0
        );

        const adminDetails = await User.findById(cinema.adminDetailes).select(
          "-password -booking"
        );

        return {
          cinemaId: cinema._id,
          cinemaName: cinema.cinemaName,
          totalRevenue,
          adminDetails,
        };
      })
    );

    const cityRevenue = cinemaDetails.reduce(
      (acc, curr) => acc + curr.totalRevenue,
      0
    );

    const cityRevenueDetails = {
      cityId,
      cityName: cityData?.cityName,
      cityRevenue,
      cinemas: cinemaDetails,
    };

    return res.status(200).json({
      success: true,
      data: cityRevenueDetails,
      message: "City-Revenue-Details Fetched Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Error while fetching city-revenue-details",
    });
  }
};

exports.getAdminDetails = async (req, res) => {
  try {
    const admins = await User.find({ accountType: "Admin" }).select(
      "-password"
    );
    if (!admins) {
      return res.status(404).json({
        success: false,
        message: "No admin account found",
      });
    }

    return res.status(200).json({
      success: true,
      data: admins,
      message: "Admins Fetched Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Error while fetching admin details",
    });
  }
};

exports.getAdminRevenueByCity = async (req, res) => {
  try {
    const { startDate = "2024-11-01", endDate = "2024-12-27" } = req.body;
    const userId = req.user.id;

    const cities = await City.find();

    const revenueDetails = await Promise.all(
      cities.map(async (city) => {
        const cinemas = await Cinema.find({
          cityId: city._id,
          adminDetailes: userId,
        }).populate("screens");

        const cityRevenue = await cinemas.reduce(async (accPromise, cinema) => {
          const acc = await accPromise;
          const shows = await MovieShow.find({
            cinemaId: cinema._id,
            showStart: { $gte: new Date(startDate), $lte: new Date(endDate) },
          });

          const cinemaRevenue = await shows.reduce(
            async (showAccPromise, show) => {
              const showAcc = await showAccPromise;
              const bookings = await Booking.find({
                showId: show._id,
                status: "BOOKED",
              });

              const showRevenue = bookings.reduce(
                (bookingAcc, booking) => bookingAcc + booking.totalAmount,
                0
              );

              return showAcc + showRevenue;
            },
            Promise.resolve(0)
          );

          return acc + cinemaRevenue;
        }, Promise.resolve(0));

        return {
          cityId: city._id,
          cityName: city.cityName,
          cityRevenue,
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: revenueDetails,
      message: "Admin-Cities-Revenue-Details Fetched Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Error while fetching admin-cities-revenue-details",
    });
  }
};

exports.getAdminRevenueByCityId = async (req, res) => {
  try {
    const {
      cityId,
      startDate = "2024-11-01",
      endDate = "2024-12-27",
    } = req.body;
    const userId = req.user.id;

    const cityData = await City.findById(cityId);
    if (!cityData) {
      return res.status(404).json({
        success: false,
        message: `Could not find city with id: ${cityId}`,
      });
    }

    const cinemas = await Cinema.find({
      cityId,
      adminDetailes: userId,
    }).populate("screens");

    const cinemaDetails = await Promise.all(
      cinemas.map(async (cinema) => {
        const shows = await MovieShow.find({
          cinemaId: cinema._id,
          showStart: { $gte: new Date(startDate), $lte: new Date(endDate) },
        });

        const movieRevenue = {};
        for (const show of shows) {
          const bookings = await Booking.find({
            showId: show._id,
            status: "BOOKED",
          });

          bookings.forEach((booking) => {
            if (!movieRevenue[show.movieId]) {
              movieRevenue[show.movieId] = 0;
            }
            movieRevenue[show.movieId] += booking.totalAmount;
          });
        }

        const totalRevenue = Object.values(movieRevenue).reduce(
          (acc, curr) => acc + curr,
          0
        );

        return {
          cinemaId: cinema._id,
          cinemaName: cinema.cinemaName,
          totalRevenue,
        };
      })
    );

    const cityRevenue = cinemaDetails.reduce(
      (acc, curr) => acc + curr.totalRevenue,
      0
    );

    const cityRevenueDetails = {
      cityId,
      cityName: cityData?.cityName,
      cityRevenue,
      cinemas: cinemaDetails,
    };

    return res.status(200).json({
      success: true,
      data: cityRevenueDetails,
      message: "Admin-City-Revenue-Details Fetched Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Error while fetching admin-city-revenue-details",
    });
  }
};
