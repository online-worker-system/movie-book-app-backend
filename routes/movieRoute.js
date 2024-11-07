const express = require("express");
const router = express.Router();

const { getAllMovies, getMovieDetails, addMovie, updateMovie, deleteMovie } = require("../controllers/Movie");
const { auth, isSuperAdmin } = require("../middlewares/auth");

router.get("/getAllMovies", auth, isSuperAdmin, getAllMovies);
router.post("/getMovieDetails", auth, isSuperAdmin, getMovieDetails);
router.post("/addMovie", auth, isSuperAdmin, addMovie);
router.put("/updateMovie", auth, isSuperAdmin, updateMovie);
router.delete("/deleteMovie", auth, isSuperAdmin, deleteMovie);

module.exports = router;
