const express = require("express");
const router = express.Router();

const { addShow, doLiveShow, getUnliveShows } = require("../controllers/Show");
const { auth, isAdmin } = require("../middlewares/auth");

router.post("/addShow", auth, isAdmin, addShow);
router.post("/liveYourShow", auth, isAdmin, doLiveShow);
router.get("/getUnliveShows", auth, isAdmin, getUnliveShows);

module.exports = router;
