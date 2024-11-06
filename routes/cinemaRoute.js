const express = require("express");
const router = express.Router();

const { addCity } = require("../controllers/City");
const { addCinema } = require("../controllers/Cinema");
const { auth, isAdmin, isSuperAdmin } = require("../middlewares/auth");

router.post("/addCity", auth, isSuperAdmin, addCity);
router.post("/addCinema", auth, isAdmin, addCinema);

module.exports = router;
