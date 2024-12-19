const mongoose = require("mongoose");

const Genre = ["Action", "Adventure", "Comedy", "Drama", "Family", "Horror", "Romantic", "Sci-Fi", "Sports", "Thriller"];
const Language = ["English", "Hindi", "Kannada", "Telugu", "Tamil"];

const crewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  profession: {
    type: String,
    required: true,
  },
});

const movieSchema = new mongoose.Schema({
  movieName: {
    type: String,
    required: true,
  },
  releaseDate: { type: Date, required: true },
  summary: {
    type: String,
    required: true,
  },
  genres: [
    {
      type: String,
      enum: Genre,
      required: true,
    },
  ],
  cast: [
    {
      type: String,
      required: true,
    },
  ],
  crew: [
    {
      type: crewSchema,
      required: true,
    },
  ],
  supportingLanguages: [
    {
      type: String,
      enum: Language,
      required: true,
    },
  ],
  thumbnail: {
    type: String,
    required: true,
  },
  banner: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Movie", movieSchema);
