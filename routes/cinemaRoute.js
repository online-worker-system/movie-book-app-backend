const express = require("express");
const router = express.Router();

const { addCity } = require("../controllers/City");
const {
  addCinema,
  updateScreen,
  findCinemaDetailes,
} = require("../controllers/Cinema");
const { auth, isAdmin, isSuperAdmin } = require("../middlewares/auth");

router.post("/addCity", auth, isSuperAdmin, addCity);
router.post("/addCinema", auth, isAdmin, addCinema);
router.post("/updateScreen", auth, isAdmin, updateScreen);
router.get("/getCinemaDetailes", auth, isAdmin, findCinemaDetailes);

module.exports = router;
