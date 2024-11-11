const express = require("express");
const router = express.Router();

const { addShow, doLiveShow } = require("../controllers/Show");
const { auth, isAdmin } = require("../middlewares/auth");

router.post("/addShow", auth, isAdmin, addShow);
router.post("/liveYourShow", auth, isAdmin, doLiveShow);

module.exports = router;
