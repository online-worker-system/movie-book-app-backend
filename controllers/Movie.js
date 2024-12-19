const Movie = require("../models/Movie");
const MovieShow = require("../models/MovieShow");
const { uploadFileToCloudinary } = require("../utils/fileUploader");

exports.getAllMovies = async (req, res) => {
  try {
    // fetch all movies
    const movies = await Movie.find();

    // return response
    return res.status(200).json({
      success: true,
      data: movies,
      message: "All Movies fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Unable to fetch All Movies, please try again",
    });
  }
};

exports.getMovieDetails = async (req, res) => {
  try {
    // fetch course details
    const { movieId } = req.body;

    // validation
    const movieDetails = await Movie.findById(movieId);
    if (!movieDetails) {
      return res.status(404).json({
        success: false,
        message: `Could not find movie with id: ${movieId}`,
      });
    }

    // return response
    return res.status(200).json({
      success: true,
      data: movieDetails,
      message: "Movie Details fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Unable to fetch Movie Details, please try again",
    });
  }
};

exports.getMovieCinema = async (req, res) => {
  try {
    // fetch course details
    const { movieId } = req.body;

    // Find the MovieShow document that matches the movieId and isLive is true
    const uniqueCinemas = await MovieShow.find({
      movieId: movieId,
      isLive: true,
    })
      .populate({
        path: "movieId",
        model: "Movie",
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
      });

    if (!uniqueCinemas || uniqueCinemas.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No live movie show found for this movie.",
      });
    }

    const tempData = uniqueCinemas.map((show) => {
      return {
        movieDetails: show.movieId,
        isLive: show.isLive,
        cinemas: {
          showStart: show.showStart,
          showEnd: show.showEnd,
          timing: show.timing,
          cinemaId: show.cinemaId._id,
          cinemaName: show.cinemaId.cinemaName,
          screens: show.cinemaId.screens,
          pincode: show.cinemaId.pincode,
          city: show.cinemaId.cityId.cityName,
          adminDetailes: show.cinemaId.adminDetailes,
          showScreenId: show.screenId,
          showSeats: show.showSeats,
        },
      };
    });

    const arr = [];
    for (const key of tempData) {
      arr.push(key.cinemas);
    }

    const finalData = {
      movieDetails: tempData[0].movieDetails,
      isLive: tempData[0].isLive,
      cinemas: arr,
    };

    // return response
    return res.status(200).json({
      success: true,
      data: finalData,
      message: "MovieShow and cinema details fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Unable to fetch Movie Show, please try again",
    });
  }
};

exports.addMovie = async (req, res) => {
  try {
    // fetch data
    const {
      movieName,
      releaseDate,
      summary,
      genres,
      cast,
      crew,
      supportingLanguages,
      thumbnail,
      banner,
    } = req.body;

    // get thumbnail image
    // const thumbnail = req.files.thumbnailImage;
    // const banner = req.files.thumbnailImage;

    // validation
    if (
      !movieName ||
      !releaseDate ||
      !summary ||
      !genres ||
      !cast ||
      !crew ||
      !supportingLanguages ||
      !thumbnail ||
      !banner
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter all the details",
      });
    }

    // // upload image to cloudinary
    // const thumbnailUpload = await uploadFileToCloudinary(
    //   thumbnail,
    //   process.env.FOLDER_IMAGE
    // );

    // create an entry for new course
    const newMovie = await Movie.create({
      movieName,
      releaseDate,
      summary,
      genres,
      cast,
      crew,
      supportingLanguages,
      thumbnail,
      banner,
    });

    return res.status(200).json({
      success: true,
      data: newMovie,
      message: "Movie Added Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Unable to Add Movie, please try again",
    });
  }
};

exports.updateMovie = async (req, res) => {
  try {
    // fetch data
    const { movieId } = req.body;
    const updates = req.body;

    // validation
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    // // If Thumbnail Image is found, update it
    // if (req.files) {
    //   const thumbnail = req.files.thumbnailImage;
    //   const thumbnailImage = await uploadFileToCloudinary(
    //     thumbnail,
    //     process.env.FOLDER_IMAGE
    //   );
    //   movie.thumbnail = thumbnailImage.secure_url;
    // }

    // Update only the fields that are present in the request body
    for (const key in updates) {
      movie[key] = updates[key];
    }
    await movie.save();

    return res.status(200).json({
      success: true,
      data: movie,
      message: "Movie Updated Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Unable to Update Movie, please try again",
    });
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    // fetch data
    const { movieId } = req.body;

    // delete the movie
    const movie = await Movie.findByIdAndDelete(movieId);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    // return response
    return res.status(200).json({
      success: true,
      message: "Movie deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Unable to Delete Movie, please try again",
    });
  }
};
