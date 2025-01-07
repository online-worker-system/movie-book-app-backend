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

        const details = Object.keys(movieRevenue).map((movieId) => ({
          movieId,
          revenue: movieRevenue[movieId],
        }));

        const totalRevenue = details.reduce(
          (acc, curr) => acc + curr.revenue,
          0
        );

        return {
          cinemaId: cinema._id,
          cinemaName: cinema.cinemaName,
          totalRevenue,
          details,
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: revenueDetails,
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

            const adminDetails = await User.findById(cinema.adminDetailes);

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

        return {
          cityId: city._id,
          cityName: city.cityName,
          cityRevenue,
          cinemas: cinemaDetails,
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

        const adminDetails = await User.findById(cinema.adminDetailes);

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
