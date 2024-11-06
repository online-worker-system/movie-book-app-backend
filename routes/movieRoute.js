const express = require("express");
const router = express.Router();

const { getMovieDetails, addMovie, updateMovie, deleteMovie } = require("../controllers/Movie");
const { auth, isSuperAdmin } = require("../middlewares/auth");

router.get("/getMovieDetails", auth, isSuperAdmin, getMovieDetails);
router.post("/addMovie", auth, isSuperAdmin, addMovie);
router.post("/updateMovie", auth, isSuperAdmin, updateMovie);
router.post("/deleteMovie", auth, isSuperAdmin, deleteMovie);

module.exports = router;
