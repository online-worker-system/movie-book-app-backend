const express = require("express");
const router = express.Router();

<<<<<<< HEAD
const { getAllMovies, getMovieDetails, addMovie, updateMovie, deleteMovie,getMovieCinema } = require("../controllers/Movie");
const { auth, isSuperAdmin } = require("../middlewares/auth");

router.get("/getAllMovies", auth, isSuperAdmin, getAllMovies);
router.post("/getMovieDetails", auth, isSuperAdmin, getMovieDetails);
router.post("/addMovie", auth, isSuperAdmin, addMovie);
router.post("/updateMovie", auth, isSuperAdmin, updateMovie);
router.post("/deleteMovie", auth, isSuperAdmin, deleteMovie);
router.post("/getMovieCinema", auth, getMovieCinema);

module.exports = router;
=======
const { getAllMovies, getMovieDetails, getMovieCinema, addMovie, updateMovie, deleteMovie } = require("../controllers/Movie");
const { auth, isSuperAdmin } = require("../middlewares/auth");

router.get("/getAllMovies", getAllMovies);
router.post("/getMovieDetails", getMovieDetails);
router.post("/getMovieCinema", getMovieCinema);
router.post("/addMovie", auth, isSuperAdmin, addMovie);
router.put("/updateMovie", auth, isSuperAdmin, updateMovie);
router.delete("/deleteMovie", auth, isSuperAdmin, deleteMovie);

module.exports = router;
>>>>>>> 01ca7154739ae783c28cbe5cc3cf3b32cca9710e
