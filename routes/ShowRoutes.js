const express = require("express");
const router = express.Router();

const {addShow,doLiveShow} =require("../controllers/Show");
const {auth,isAdmin} = require("../middlewares/auth");
// router.get("/getAllMovies", auth, isSuperAdmin, getAllMovies);
// router.post("/getMovieDetails", auth, isSuperAdmin, getMovieDetails);
router.post("/addShow", auth, isAdmin, addShow);
router.post("/liveYourShow",auth,isAdmin,doLiveShow);
// router.post("/updateMovie", auth, isSuperAdmin, updateMovie);
// router.post("/deleteMovie", auth, isSuperAdmin, deleteMovie);

module.exports = router;