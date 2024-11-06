const Movie = require("../models/Movie");

exports.getMovieDetails = async (req, res) => {
  try {
    // fetch course details
    const { movieId } = req.body;

    // validation
    const movieDetails = await Movie.findById(movieId);
    if (!movieDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find movie with id: ${movieId}`,
      });
    }

    // return response
    return res.status(200).json({
      success: true,
      data: courseDetails,
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

exports.addMovie = async (req, res) => {
  try {
    // fetch data
    const {
      movieName,
      releaseDate,
      summary,
      genres,
      castMembers,
      supportingLanguages,
    } = req.body;

    // get thumbnail and userId
    const thumbnail = req.files.thumbnailImage;

    // validation
    if (
      !movieName ||
      !releaseDate ||
      !summary ||
      !genres ||
      !castMembers ||
      !supportingLanguages ||
      !thumbnail
    ) {
      return res.status(402).json({
        success: false,
        message: "Please enter all the details",
      });
    }

    // upload image to cloudinary
    const thumbnailUpload = await uploadFileToCloudinary(
      thumbnail,
      process.env.FOLDER_IMAGE
    );

    // create an entry for new course
    const newMovie = await Movie.create({
      movieName,
      releaseDate,
      summary,
      genres,
      castMembers,
      supportingLanguages,
      thumbnail: thumbnailUpload.secure_url,
    });
    console.log("newMovie: ", newMovie);

    return res.status(200).json({
      success: true,
      data: newMovie,
      message: "Movie Added Successfully",
    });
  } catch (error) {
    console.log("Problem while Adding Movie :", error);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Unable to Add Movie, please try againe",
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

    // If Thumbnail Image is found, update it
    if (req.files) {
      const thumbnail = req.files.thumbnailImage;
      const thumbnailImage = await uploadFileToCloudinary(
        thumbnail,
        process.env.FOLDER_IMAGE
      );
      movie.thumbnail = thumbnailImage.secure_url;
    }

    // Update only the fields that are present in the request body
    for (const key in updates) {
      movie[key] = updates[key];
    }
    await movie.save();

    // updated course details
    const updatedMovie = await Movie.findById(movieId);
    console.log("updatedMovie: ", updatedMovie);

    return res.status(200).json({
      success: true,
      data: updatedMovie,
      message: "Movie Updated Successfully",
    });
  } catch (error) {
    console.log("Problem while Updating Movie :", error);
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

    // validation
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    // Delete the movie
    await Movie.findByIdAndDelete(movieId);

    // return response
    return res.status(200).json({
      success: true,
      message: "Movie deleted successfully",
    });
  } catch (error) {
    console.log("Problem while Deleting Movie :", error);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Unable to Delete Movie, please try again",
    });
  }
};
